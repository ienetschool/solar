import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { intelligentChatbot } from "./ai-service";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

interface ChatClient {
  ws: WebSocket;
  userId: string;
  username: string;
  isAgent: boolean;
  sessionId?: string;
}

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${nanoid()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and common document types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      
      if (!messages || messages.length === 0) {
        return res.status(400).json({
          message: "No messages provided",
        });
      }

      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.role !== "user") {
        return res.status(400).json({
          message: "Last message must be from user",
        });
      }

      const response = intelligentChatbot.findBestMatch(lastMessage.content, context);

      res.json({ message: response });
    } catch (error) {
      console.error("Chat error:", error);
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

  // Callback request routes
  app.get("/api/callbacks", async (req, res) => {
    try {
      const requests = await storage.getCallbackRequests();
      res.json(requests);
    } catch (error) {
      console.error("Get callback requests error:", error);
      res.status(500).json({ message: "Failed to fetch callback requests" });
    }
  });

  app.post("/api/callbacks", async (req, res) => {
    try {
      const request = await storage.createCallbackRequest(req.body);
      res.json(request);
    } catch (error) {
      console.error("Create callback request error:", error);
      res.status(500).json({ message: "Failed to create callback request" });
    }
  });

  app.patch("/api/callbacks/:id", async (req, res) => {
    try {
      const { status, contactedAt } = req.body;
      const request = await storage.updateCallbackStatus(
        req.params.id, 
        status,
        contactedAt ? new Date(contactedAt) : undefined
      );
      if (!request) {
        return res.status(404).json({ message: "Callback request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Update callback request error:", error);
      res.status(500).json({ message: "Failed to update callback request" });
    }
  });

  // FAQ routes
  app.get("/api/faq", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const context = req.query.context as string | undefined;
      
      let faqs;
      if (context) {
        faqs = intelligentChatbot.getFAQsByContext(context);
      } else if (category) {
        faqs = intelligentChatbot.getFAQsByCategory(category);
      } else {
        faqs = intelligentChatbot.getFAQsByCategory();
      }
      
      res.json(faqs);
    } catch (error) {
      console.error("Get FAQs error:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.get("/api/faq/categories", async (req, res) => {
    try {
      const categories = intelligentChatbot.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get FAQ categories error:", error);
      res.status(500).json({ message: "Failed to fetch FAQ categories" });
    }
  });

  // Agent availability check
  app.get("/api/agents/online", async (req, res) => {
    try {
      const agents = await storage.getAllUsers();
      const onlineAgents = agents.filter(user => user.role === "agent" || user.role === "admin");
      res.json({ available: onlineAgents.length > 0, count: onlineAgents.length });
    } catch (error) {
      console.error("Get agent availability error:", error);
      res.status(500).json({ available: false, count: 0 });
    }
  });

  // Page context detection
  app.post("/api/context/detect", async (req, res) => {
    try {
      const { pathname, search } = req.body;
      
      let context: any = {
        page: pathname || "/",
        service: null,
        category: null,
        prefilledData: {}
      };

      if (pathname === "/" || pathname === "/home") {
        context.page = "home";
        context.category = "general";
      } else if (pathname === "/services") {
        context.page = "services";
        context.category = "services";
        context.service = "general";
      } else if (pathname === "/about") {
        context.page = "about";
        context.category = "company";
      } else if (pathname === "/contact") {
        context.page = "contact";
        context.category = "contact";
      } else if (pathname === "/faq") {
        context.page = "faq";
        context.category = "support";
      }

      if (search && search.includes("service=residential")) {
        context.service = "residential";
        context.prefilledData.category = "Residential Installation";
      } else if (search && search.includes("service=commercial")) {
        context.service = "commercial";
        context.prefilledData.category = "Commercial Solutions";
      }

      res.json(context);
    } catch (error) {
      console.error("Context detection error:", error);
      res.status(500).json({ message: "Failed to detect context" });
    }
  });

  // Live chat session routes
  app.get("/api/live-chat/sessions", async (req, res) => {
    try {
      const { status, agentId } = req.query;
      let sessions;
      
      if (agentId && status) {
        sessions = await storage.getLiveChatSessionsByAgentAndStatus(agentId as string, status as string);
      } else if (agentId) {
        sessions = await storage.getLiveChatSessionsByAgent(agentId as string);
      } else if (status) {
        sessions = await storage.getLiveChatSessionsByStatus(status as string);
      } else {
        sessions = await storage.getAllLiveChatSessions();
      }
      
      res.json(sessions);
    } catch (error) {
      console.error("Get live chat sessions error:", error);
      res.status(500).json({ message: "Failed to fetch live chat sessions" });
    }
  });

  app.get("/api/live-chat/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getLiveChatSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Get live chat session error:", error);
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  app.post("/api/live-chat/sessions", async (req, res) => {
    try {
      const session = await storage.createLiveChatSession(req.body);
      res.json(session);
    } catch (error) {
      console.error("Create live chat session error:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.patch("/api/live-chat/sessions/:id/status", async (req, res) => {
    try {
      const { status, closedAt } = req.body;
      const session = await storage.updateLiveChatSessionStatus(req.params.id, status, closedAt);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Update session status error:", error);
      res.status(500).json({ message: "Failed to update session status" });
    }
  });

  app.patch("/api/live-chat/sessions/:id/assign", async (req, res) => {
    try {
      const { agentId } = req.body;
      const session = await storage.assignLiveChatToAgent(req.params.id, agentId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Assign session error:", error);
      res.status(500).json({ message: "Failed to assign session" });
    }
  });

  // Live chat message routes
  app.get("/api/live-chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const messages = await storage.getLiveChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Get live chat messages error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/live-chat/messages", async (req, res) => {
    try {
      const message = await storage.createLiveChatMessage(req.body);
      res.json(message);
    } catch (error) {
      console.error("Create live chat message error:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // File upload routes
  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFileUpload(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      console.error("Get file error:", error);
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  app.get("/api/files", async (req, res) => {
    try {
      const { relatedType, relatedId } = req.query;
      if (!relatedType || !relatedId) {
        return res.status(400).json({ message: "relatedType and relatedId are required" });
      }
      const files = await storage.getFileUploadsByRelated(relatedType as string, relatedId as string);
      res.json(files);
    } catch (error) {
      console.error("Get files error:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/files", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { uploadedBy, relatedType, relatedId } = req.body;
      
      if (!uploadedBy) {
        return res.status(400).json({ message: "uploadedBy is required" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      const file = await storage.createFileUpload({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size.toString(),
        url: fileUrl,
        uploadedBy,
        relatedType: relatedType || null,
        relatedId: relatedId || null,
      });
      
      res.json(file);
    } catch (error) {
      console.error("Create file error:", error);
      res.status(500).json({ message: "Failed to create file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      await storage.deleteFileUpload(req.params.id);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Agent transfer routes
  app.get("/api/transfers/:id", async (req, res) => {
    try {
      const transfer = await storage.getAgentTransfer(req.params.id);
      if (!transfer) {
        return res.status(404).json({ message: "Transfer not found" });
      }
      res.json(transfer);
    } catch (error) {
      console.error("Get transfer error:", error);
      res.status(500).json({ message: "Failed to fetch transfer" });
    }
  });

  app.get("/api/transfers", async (req, res) => {
    try {
      const { agentId } = req.query;
      if (!agentId) {
        return res.status(400).json({ message: "agentId is required" });
      }
      const transfers = await storage.getPendingTransfersByAgent(agentId as string);
      res.json(transfers);
    } catch (error) {
      console.error("Get transfers error:", error);
      res.status(500).json({ message: "Failed to fetch transfers" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const transfer = await storage.createAgentTransfer(req.body);
      res.json(transfer);
    } catch (error) {
      console.error("Create transfer error:", error);
      res.status(500).json({ message: "Failed to create transfer" });
    }
  });

  app.patch("/api/transfers/:id/accept", async (req, res) => {
    try {
      const transfer = await storage.acceptAgentTransfer(req.params.id);
      if (!transfer) {
        return res.status(404).json({ message: "Transfer not found" });
      }
      res.json(transfer);
    } catch (error) {
      console.error("Accept transfer error:", error);
      res.status(500).json({ message: "Failed to accept transfer" });
    }
  });

  // Page management routes
  app.get("/api/pages", async (req, res) => {
    try {
      const { published } = req.query;
      const pages = published === "true" 
        ? await storage.getPublishedPages()
        : await storage.getAllPages();
      res.json(pages);
    } catch (error) {
      console.error("Get pages error:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getPage(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Get page error:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  app.post("/api/pages", async (req, res) => {
    try {
      const page = await storage.createPage(req.body);
      res.json(page);
    } catch (error) {
      console.error("Create page error:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.patch("/api/pages/:id", async (req, res) => {
    try {
      const page = await storage.updatePage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Update page error:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete("/api/pages/:id", async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Delete page error:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Page section routes
  app.get("/api/pages/:pageId/sections", async (req, res) => {
    try {
      const sections = await storage.getPageSections(req.params.pageId);
      res.json(sections);
    } catch (error) {
      console.error("Get page sections error:", error);
      res.status(500).json({ message: "Failed to fetch page sections" });
    }
  });

  app.post("/api/page-sections", async (req, res) => {
    try {
      const section = await storage.createPageSection(req.body);
      res.json(section);
    } catch (error) {
      console.error("Create page section error:", error);
      res.status(500).json({ message: "Failed to create page section" });
    }
  });

  app.patch("/api/page-sections/:id", async (req, res) => {
    try {
      const section = await storage.updatePageSection(req.params.id, req.body);
      if (!section) {
        return res.status(404).json({ message: "Page section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Update page section error:", error);
      res.status(500).json({ message: "Failed to update page section" });
    }
  });

  app.delete("/api/page-sections/:id", async (req, res) => {
    try {
      await storage.deletePageSection(req.params.id);
      res.json({ message: "Page section deleted successfully" });
    } catch (error) {
      console.error("Delete page section error:", error);
      res.status(500).json({ message: "Failed to delete page section" });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const { category, page } = req.query;
      let faqs;
      
      if (category) {
        faqs = await storage.getFaqsByCategory(category as string);
      } else if (page) {
        faqs = await storage.getFaqsByPage(page as string);
      } else {
        faqs = await storage.getAllFaqs();
      }
      
      res.json(faqs);
    } catch (error) {
      console.error("Get FAQs error:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.get("/api/faqs/:id", async (req, res) => {
    try {
      const faq = await storage.getFaq(req.params.id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      console.error("Get FAQ error:", error);
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const faq = await storage.createFaq(req.body);
      res.json(faq);
    } catch (error) {
      console.error("Create FAQ error:", error);
      res.status(500).json({ message: "Failed to create FAQ" });
    }
  });

  app.patch("/api/faqs/:id", async (req, res) => {
    try {
      const faq = await storage.updateFaq(req.params.id, req.body);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      console.error("Update FAQ error:", error);
      res.status(500).json({ message: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      await storage.deleteFaq(req.params.id);
      res.json({ message: "FAQ deleted successfully" });
    } catch (error) {
      console.error("Delete FAQ error:", error);
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  // Support form routes
  app.get("/api/support-forms", async (req, res) => {
    try {
      const { status } = req.query;
      const forms = status
        ? await storage.getSupportFormsByStatus(status as string)
        : await storage.getAllSupportForms();
      res.json(forms);
    } catch (error) {
      console.error("Get support forms error:", error);
      res.status(500).json({ message: "Failed to fetch support forms" });
    }
  });

  app.get("/api/support-forms/:id", async (req, res) => {
    try {
      const form = await storage.getSupportForm(req.params.id);
      if (!form) {
        return res.status(404).json({ message: "Support form not found" });
      }
      res.json(form);
    } catch (error) {
      console.error("Get support form error:", error);
      res.status(500).json({ message: "Failed to fetch support form" });
    }
  });

  app.post("/api/support-forms", async (req, res) => {
    try {
      const form = await storage.createSupportForm(req.body);
      res.json(form);
    } catch (error) {
      console.error("Create support form error:", error);
      res.status(500).json({ message: "Failed to create support form" });
    }
  });

  app.patch("/api/support-forms/:id/status", async (req, res) => {
    try {
      const { status, respondedAt } = req.body;
      const form = await storage.updateSupportFormStatus(req.params.id, status, respondedAt);
      if (!form) {
        return res.status(404).json({ message: "Support form not found" });
      }
      res.json(form);
    } catch (error) {
      console.error("Update support form status error:", error);
      res.status(500).json({ message: "Failed to update support form status" });
    }
  });

  app.patch("/api/support-forms/:id/assign", async (req, res) => {
    try {
      const { agentId } = req.body;
      const form = await storage.assignSupportForm(req.params.id, agentId);
      if (!form) {
        return res.status(404).json({ message: "Support form not found" });
      }
      res.json(form);
    } catch (error) {
      console.error("Assign support form error:", error);
      res.status(500).json({ message: "Failed to assign support form" });
    }
  });

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, ChatClient>();

  // Helper function to broadcast to session participants
  const broadcastToSession = (sessionId: string, message: any, excludeUserId?: string) => {
    clients.forEach((client) => {
      if (
        client.sessionId === sessionId &&
        client.userId !== excludeUserId &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        client.ws.send(JSON.stringify(message));
      }
    });
  };

  // Helper function to notify agents
  const notifyAgents = (message: any) => {
    clients.forEach((client) => {
      if (client.isAgent && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  };

  wss.on('connection', (ws) => {
    let clientId: string | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'join': {
            clientId = message.userId;
            if (clientId) {
              clients.set(clientId, {
                ws,
                userId: message.userId,
                username: message.username,
                isAgent: message.isAgent || false,
                sessionId: message.sessionId,
              });

              // Notify others in the session
              if (message.sessionId) {
                broadcastToSession(message.sessionId, {
                  type: 'user_joined',
                  userId: message.userId,
                  username: message.username,
                  isAgent: message.isAgent || false,
                  timestamp: new Date().toISOString(),
                }, message.userId);
              }

              // If agent joining, notify them of available sessions
              if (message.isAgent) {
                notifyAgents({
                  type: 'agent_online',
                  agentId: message.userId,
                  agentName: message.username,
                });
              }
            }
            break;
          }

          case 'message': {
            const sender = clients.get(message.userId);
            if (!sender) break;

            const chatMessage = {
              type: 'message',
              content: message.content,
              sender: sender.username,
              userId: message.userId,
              isAgent: sender.isAgent,
              sessionId: message.sessionId,
              timestamp: new Date().toISOString(),
              files: message.files || [],
            };

            // Save message to database if sessionId provided
            if (message.sessionId) {
              try {
                await storage.createLiveChatMessage({
                  sessionId: message.sessionId,
                  userId: message.userId,
                  message: message.content,
                  isAgent: sender.isAgent,
                  files: message.files || [],
                });
              } catch (error) {
                console.error('Error saving chat message:', error);
              }

              // Broadcast to session participants
              broadcastToSession(message.sessionId, chatMessage, message.userId);
            } else {
              // Broadcast to all if no session (legacy support)
              clients.forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN && client.userId !== message.userId) {
                  client.ws.send(JSON.stringify(chatMessage));
                }
              });
            }
            break;
          }

          case 'typing': {
            if (message.sessionId) {
              broadcastToSession(message.sessionId, {
                type: 'typing',
                userId: message.userId,
                username: message.username,
                isTyping: message.isTyping,
              }, message.userId);
            }
            break;
          }

          case 'file_shared': {
            if (message.sessionId) {
              broadcastToSession(message.sessionId, {
                type: 'file_shared',
                userId: message.userId,
                username: message.username,
                fileId: message.fileId,
                fileName: message.fileName,
                fileUrl: message.fileUrl,
                timestamp: new Date().toISOString(),
              }, message.userId);
            }
            break;
          }

          case 'agent_transfer': {
            // Notify the target agent
            const targetAgent = Array.from(clients.values()).find(
              c => c.userId === message.toAgentId && c.isAgent
            );
            
            if (targetAgent && targetAgent.ws.readyState === WebSocket.OPEN) {
              targetAgent.ws.send(JSON.stringify({
                type: 'transfer_request',
                sessionId: message.sessionId,
                fromAgent: message.fromAgentName,
                reason: message.reason,
                transferId: message.transferId,
              }));
            }

            // Notify session participants
            if (message.sessionId) {
              broadcastToSession(message.sessionId, {
                type: 'agent_transfer',
                message: `Chat is being transferred to another agent: ${message.reason}`,
                timestamp: new Date().toISOString(),
              });
            }
            break;
          }

          case 'close_session': {
            if (message.sessionId) {
              broadcastToSession(message.sessionId, {
                type: 'session_closed',
                message: 'This chat session has been closed.',
                timestamp: new Date().toISOString(),
              });

              // Update session status in database
              try {
                await storage.updateLiveChatSessionStatus(
                  message.sessionId,
                  'closed',
                  new Date()
                );
              } catch (error) {
                console.error('Error closing session:', error);
              }
            }
            break;
          }

          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (clientId) {
        const client = clients.get(clientId);
        if (client?.sessionId) {
          broadcastToSession(client.sessionId, {
            type: 'user_left',
            userId: clientId,
            username: client.username,
            timestamp: new Date().toISOString(),
          });
        }
        clients.delete(clientId);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
