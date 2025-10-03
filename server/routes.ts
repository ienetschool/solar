import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { WebSocketServer, WebSocket } from "ws";

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

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
      const openaiClient = getOpenAI();

      if (!openaiClient) {
        return res.status(503).json({
          message: "AI chat is currently unavailable. OpenAI API key is not configured. Please contact our support team at (555) 123-4567.",
        });
      }

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

      const completion = await openaiClient.chat.completions.create({
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

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id/role", async (req, res) => {
    try {
      const user = await storage.updateUserRole(req.params.id, req.body.role);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Ticket routes
  app.get("/api/tickets", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const tickets = userId 
        ? await storage.getTicketsByUser(userId)
        : await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Get tickets error:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/:id", async (req, res) => {
    try {
      const ticket = await storage.getTicket(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      console.error("Get ticket error:", error);
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticket = await storage.createTicket(req.body);
      
      // Create notification for admin/agents
      await storage.createNotification({
        userId: req.body.userId,
        title: "New Ticket Created",
        message: `Ticket ${ticket.id}: ${ticket.title}`,
        type: "ticket",
        relatedId: ticket.id,
      });

      res.json(ticket);
    } catch (error) {
      console.error("Create ticket error:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  app.patch("/api/tickets/:id/status", async (req, res) => {
    try {
      const { status, resolvedAt } = req.body;
      const ticket = await storage.updateTicketStatus(
        req.params.id, 
        status, 
        resolvedAt ? new Date(resolvedAt) : undefined
      );
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Create history entry
      await storage.createTicketHistory({
        ticketId: ticket.id,
        userId: req.body.userId || ticket.userId,
        action: `Status changed to ${status}`,
      });

      res.json(ticket);
    } catch (error) {
      console.error("Update ticket status error:", error);
      res.status(500).json({ message: "Failed to update ticket status" });
    }
  });

  app.patch("/api/tickets/:id/assign", async (req, res) => {
    try {
      const ticket = await storage.updateTicketAssignment(req.params.id, req.body.assignedTo);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Create history entry
      if (req.body.assignedTo) {
        await storage.createTicketHistory({
          ticketId: ticket.id,
          userId: req.body.userId || ticket.userId,
          action: `Assigned to ${req.body.assignedTo}`,
        });

        // Notify assigned user
        await storage.createNotification({
          userId: req.body.assignedTo,
          title: "Ticket Assigned",
          message: `You have been assigned to ticket ${ticket.id}`,
          type: "ticket",
          relatedId: ticket.id,
        });
      }

      res.json(ticket);
    } catch (error) {
      console.error("Assign ticket error:", error);
      res.status(500).json({ message: "Failed to assign ticket" });
    }
  });

  app.patch("/api/tickets/:id", async (req, res) => {
    try {
      const ticket = await storage.updateTicket(req.params.id, req.body);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      console.error("Update ticket error:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  // Chat message routes
  app.get("/api/chat-messages/:ticketId", async (req, res) => {
    try {
      const messages = await storage.getChatMessagesByTicket(req.params.ticketId);
      res.json(messages);
    } catch (error) {
      console.error("Get chat messages error:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const message = await storage.createChatMessage(req.body);
      res.json(message);
    } catch (error) {
      console.error("Create chat message error:", error);
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  // Notification routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/:userId/unread-count", async (req, res) => {
    try {
      const count = await storage.getUnreadNotificationCount(req.params.userId);
      res.json({ count });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.json(notification);
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/:userId/read-all", async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.params.userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark all as read error:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Ticket history routes
  app.get("/api/ticket-history/:ticketId", async (req, res) => {
    try {
      const history = await storage.getTicketHistory(req.params.ticketId);
      res.json(history);
    } catch (error) {
      console.error("Get ticket history error:", error);
      res.status(500).json({ message: "Failed to fetch ticket history" });
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
          if (clientId) {
            clients.set(clientId, {
              ws,
              userId: message.userId,
              username: message.username,
              isAgent: message.isAgent || false,
            });
          }

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
