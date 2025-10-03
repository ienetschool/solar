import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { WebSocketServer, WebSocket } from "ws";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatClient {
  ws: WebSocket;
  userId: string;
  username: string;
  isAgent: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      const systemMessage = {
        role: "system",
        content: `You are a helpful AI assistant for SolarTech, a professional solar energy company. You help customers with:
        
- Information about residential and commercial solar installations
- Solar panel products and energy storage solutions
- Pricing and financing options (federal tax credits up to 30%, various payment plans available)
- Installation process and timeline (typically 4-8 weeks from consultation to activation)
- Maintenance and warranty information (25-year panel warranty, 10-year battery warranty)
- Energy savings calculations and environmental benefits
- Technical specifications and system requirements

Key company details:
- 15+ years of experience
- 5,000+ successful installations
- 50MW total capacity installed
- Residential solar starting at $15,000
- Commercial solutions with custom pricing
- Energy storage starting at $8,500
- Maintenance plans from $299/year

Be professional, knowledgeable, and helpful. Encourage users to schedule a free consultation or get a personalized quote for detailed information specific to their needs.`,
      };

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      });

      const assistantMessage = completion.choices[0].message.content;

      res.json({ message: assistantMessage });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({
        message: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team at (555) 123-4567.",
      });
    }
  });

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, ChatClient>();

  wss.on('connection', (ws) => {
    let clientId: string | null = null;

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'join') {
          clientId = message.userId;
          clients.set(clientId, {
            ws,
            userId: message.userId,
            username: message.username,
            isAgent: message.isAgent || false,
          });

          if (message.isAgent) {
            // Notify all customers that an agent joined
            clients.forEach((client) => {
              if (!client.isAgent && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({
                  type: 'agent_joined',
                  agentName: message.username,
                }));
              }
            });
          }
        } else if (message.type === 'message') {
          const sender = clients.get(message.userId);
          
          // Broadcast message to all connected clients
          clients.forEach((client) => {
            if (client.ws.readyState === WebSocket.OPEN && client.userId !== message.userId) {
              client.ws.send(JSON.stringify({
                type: 'message',
                content: message.content,
                sender: sender?.username || 'Unknown',
                isAgent: sender?.isAgent || false,
                timestamp: new Date().toISOString(),
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (clientId) {
        clients.delete(clientId);
      }
    });
  });

  return httpServer;
}
