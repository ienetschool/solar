import { 
  type User, 
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type ChatMessage,
  type InsertChatMessage,
  type Notification,
  type InsertNotification,
  type TicketHistory,
  type InsertTicketHistory,
  type CallbackRequest,
  type InsertCallbackRequest,
  type LiveChatSession,
  type InsertLiveChatSession,
  type LiveChatMessage,
  type InsertLiveChatMessage,
  type FileUpload,
  type InsertFileUpload,
  type AgentTransfer,
  type InsertAgentTransfer,
  type Page,
  type InsertPage,
  type PageSection,
  type InsertPageSection,
  type Faq,
  type InsertFaq,
  type SupportForm,
  type InsertSupportForm,
  users,
  tickets,
  chatMessages,
  notifications,
  ticketHistory,
  callbackRequests,
  liveChatSessions,
  liveChatMessages,
  fileUploads,
  agentTransfers,
  pages,
  pageSections,
  faqs,
  supportForms,
} from "@shared/schema";
import { getDB } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Storage interface for all CRUD operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;

  // Ticket methods
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketsByUser(userId: number): Promise<Ticket[]>;
  getAllTickets(): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: number, status: string, resolvedAt?: Date): Promise<Ticket | undefined>;
  updateTicketAssignment(id: number, assignedTo: number | null): Promise<Ticket | undefined>;
  updateTicket(id: number, updates: Partial<InsertTicket>): Promise<Ticket | undefined>;

  // Chat message methods
  getChatMessagesByTicket(ticketId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Notification methods
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;

  // Ticket history methods
  getTicketHistory(ticketId: number): Promise<TicketHistory[]>;
  createTicketHistory(history: InsertTicketHistory): Promise<TicketHistory>;

  // Callback request methods
  getCallbackRequests(): Promise<CallbackRequest[]>;
  getCallbackRequest(id: string): Promise<CallbackRequest | undefined>;
  createCallbackRequest(request: InsertCallbackRequest): Promise<CallbackRequest>;
  updateCallbackStatus(id: string, status: string, contactedAt?: Date): Promise<CallbackRequest | undefined>;

  // Live chat session methods
  getLiveChatSession(id: string): Promise<LiveChatSession | undefined>;
  getAllLiveChatSessions(): Promise<LiveChatSession[]>;
  getActiveLiveChatSessions(): Promise<LiveChatSession[]>;
  getLiveChatSessionsByStatus(status: string): Promise<LiveChatSession[]>;
  getLiveChatSessionsByAgent(agentId: string): Promise<LiveChatSession[]>;
  getLiveChatSessionsByAgentAndStatus(agentId: string, status: string): Promise<LiveChatSession[]>;
  createLiveChatSession(session: InsertLiveChatSession): Promise<LiveChatSession>;
  updateLiveChatSessionStatus(id: string, status: string, closedAt?: Date): Promise<LiveChatSession | undefined>;
  assignLiveChatToAgent(id: string, agentId: string): Promise<LiveChatSession | undefined>;

  // Live chat message methods
  getLiveChatMessages(sessionId: string): Promise<LiveChatMessage[]>;
  createLiveChatMessage(message: InsertLiveChatMessage): Promise<LiveChatMessage>;

  // File upload methods
  getFileUpload(id: string): Promise<FileUpload | undefined>;
  getFileUploadsByRelated(relatedType: string, relatedId: string): Promise<FileUpload[]>;
  createFileUpload(file: InsertFileUpload): Promise<FileUpload>;
  deleteFileUpload(id: string): Promise<void>;

  // Agent transfer methods
  getAgentTransfer(id: string): Promise<AgentTransfer | undefined>;
  getPendingTransfersByAgent(agentId: string): Promise<AgentTransfer[]>;
  createAgentTransfer(transfer: InsertAgentTransfer): Promise<AgentTransfer>;
  acceptAgentTransfer(id: string): Promise<AgentTransfer | undefined>;

  // Page management methods
  getPage(slug: string): Promise<Page | undefined>;
  getAllPages(): Promise<Page[]>;
  getPublishedPages(): Promise<Page[]>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, updates: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<void>;

  // Page section methods
  getPageSections(pageId: string): Promise<PageSection[]>;
  createPageSection(section: InsertPageSection): Promise<PageSection>;
  updatePageSection(id: string, updates: Partial<InsertPageSection>): Promise<PageSection | undefined>;
  deletePageSection(id: string): Promise<void>;

  // FAQ methods
  getFaq(id: string): Promise<Faq | undefined>;
  getAllFaqs(): Promise<Faq[]>;
  getFaqsByCategory(category: string): Promise<Faq[]>;
  getFaqsByPage(page: string): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, updates: Partial<InsertFaq>): Promise<Faq | undefined>;
  deleteFaq(id: string): Promise<void>;

  // Support form methods
  getSupportForm(id: string): Promise<SupportForm | undefined>;
  getAllSupportForms(): Promise<SupportForm[]>;
  getSupportFormsByStatus(status: string): Promise<SupportForm[]>;
  createSupportForm(form: InsertSupportForm): Promise<SupportForm>;
  updateSupportFormStatus(id: string, status: string, respondedAt?: Date): Promise<SupportForm | undefined>;
  assignSupportForm(id: string, agentId: string): Promise<SupportForm | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDB();
    const result = await db.insert(users).values(insertUser as any);
    const [user] = await db.select().from(users).where(eq(users.id, result[0].insertId));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getDB();
    return db.select().from(users);
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const db = await getDB();
    await db
      .update(users)
      .set({ role: role as any })
      .where(eq(users.id, id));
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  // Ticket methods
  async getTicket(id: number): Promise<Ticket | undefined> {
    const db = await getDB();
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    const db = await getDB();
    return db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
  }

  async getAllTickets(): Promise<Ticket[]> {
    const db = await getDB();
    return db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const db = await getDB();
    const result = await db.insert(tickets).values(ticket as any);
    const [newTicket] = await db.select().from(tickets).where(eq(tickets.id, result[0].insertId));
    return newTicket;
  }

  async updateTicketStatus(id: number, status: string, resolvedAt?: Date): Promise<Ticket | undefined> {
    const db = await getDB();
    await db
      .update(tickets)
      .set({ status: status as any, updatedAt: new Date(), resolvedAt })
      .where(eq(tickets.id, id));
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async updateTicketAssignment(id: number, assignedTo: number | null): Promise<Ticket | undefined> {
    const db = await getDB();
    await db
      .update(tickets)
      .set({ assignedToId: assignedTo, updatedAt: new Date() })
      .where(eq(tickets.id, id));
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async updateTicket(id: number, updates: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const db = await getDB();
    await db
      .update(tickets)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(tickets.id, id));
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  // Chat message methods
  async getChatMessagesByTicket(ticketId: number): Promise<ChatMessage[]> {
    const db = await getDB();
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.ticketId, ticketId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const db = await getDB();
    await db.insert(chatMessages).values(message as any);
    const [newMessage] = await db.select().from(chatMessages).where(eq(chatMessages.userId, message.userId)).orderBy(desc(chatMessages.createdAt)).limit(1);
    return newMessage;
  }

  // Notification methods
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    const db = await getDB();
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    const db = await getDB();
    const results = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.status, 'unread')));
    return results.length;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const db = await getDB();
    const result = await db.insert(notifications).values(notification as any);
    const [newNotification] = await db.select().from(notifications).where(eq(notifications.id, result[0].insertId));
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const db = await getDB();
    await db
      .update(notifications)
      .set({ status: 'read' })
      .where(eq(notifications.id, id));
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || undefined;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const db = await getDB();
    await db
      .update(notifications)
      .set({ status: 'read' })
      .where(eq(notifications.userId, userId));
  }

  // Ticket history methods
  async getTicketHistory(ticketId: number): Promise<TicketHistory[]> {
    const db = await getDB();
    return db
      .select()
      .from(ticketHistory)
      .where(eq(ticketHistory.ticketId, ticketId))
      .orderBy(ticketHistory.createdAt);
  }

  async createTicketHistory(history: InsertTicketHistory): Promise<TicketHistory> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(ticketHistory).values({ ...history, id } as any);
    const [newHistory] = await db.select().from(ticketHistory).where(eq(ticketHistory.id, id));
    return newHistory;
  }

  // Callback request methods
  async getCallbackRequests(): Promise<CallbackRequest[]> {
    const db = await getDB();
    return db.select().from(callbackRequests).orderBy(desc(callbackRequests.createdAt));
  }

  async getCallbackRequest(id: string): Promise<CallbackRequest | undefined> {
    const db = await getDB();
    const [request] = await db.select().from(callbackRequests).where(eq(callbackRequests.id, id));
    return request || undefined;
  }

  async createCallbackRequest(request: InsertCallbackRequest): Promise<CallbackRequest> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(callbackRequests).values({ ...request, id } as any);
    const [newRequest] = await db.select().from(callbackRequests).where(eq(callbackRequests.id, id));
    return newRequest;
  }

  async updateCallbackStatus(id: string, status: string, contactedAt?: Date): Promise<CallbackRequest | undefined> {
    const db = await getDB();
    await db
      .update(callbackRequests)
      .set({ status, contactedAt })
      .where(eq(callbackRequests.id, id));
    const [request] = await db.select().from(callbackRequests).where(eq(callbackRequests.id, id));
    return request || undefined;
  }

  // Live chat session methods
  async getLiveChatSession(id: string): Promise<LiveChatSession | undefined> {
    const db = await getDB();
    const [session] = await db.select().from(liveChatSessions).where(eq(liveChatSessions.id, id));
    return session || undefined;
  }

  async getAllLiveChatSessions(): Promise<LiveChatSession[]> {
    const db = await getDB();
    return db.select().from(liveChatSessions).orderBy(desc(liveChatSessions.createdAt));
  }

  async getActiveLiveChatSessions(): Promise<LiveChatSession[]> {
    const db = await getDB();
    return db.select().from(liveChatSessions).where(eq(liveChatSessions.status, "active")).orderBy(desc(liveChatSessions.createdAt));
  }

  async getLiveChatSessionsByStatus(status: string): Promise<LiveChatSession[]> {
    const db = await getDB();
    return db.select().from(liveChatSessions).where(eq(liveChatSessions.status, status)).orderBy(desc(liveChatSessions.createdAt));
  }

  async getLiveChatSessionsByAgent(agentId: string): Promise<LiveChatSession[]> {
    const db = await getDB();
    return db.select().from(liveChatSessions).where(eq(liveChatSessions.assignedTo, agentId)).orderBy(desc(liveChatSessions.createdAt));
  }

  async getLiveChatSessionsByAgentAndStatus(agentId: string, status: string): Promise<LiveChatSession[]> {
    const db = await getDB();
    return db
      .select()
      .from(liveChatSessions)
      .where(and(eq(liveChatSessions.assignedTo, agentId), eq(liveChatSessions.status, status)))
      .orderBy(desc(liveChatSessions.createdAt));
  }

  async createLiveChatSession(session: InsertLiveChatSession): Promise<LiveChatSession> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(liveChatSessions).values({ ...session, id } as any);
    const [newSession] = await db.select().from(liveChatSessions).where(eq(liveChatSessions.id, id));
    return newSession;
  }

  async updateLiveChatSessionStatus(id: string, status: string, closedAt?: Date): Promise<LiveChatSession | undefined> {
    const db = await getDB();
    await db
      .update(liveChatSessions)
      .set({ status, closedAt })
      .where(eq(liveChatSessions.id, id));
    const [session] = await db.select().from(liveChatSessions).where(eq(liveChatSessions.id, id));
    return session || undefined;
  }

  async assignLiveChatToAgent(id: string, agentId: string): Promise<LiveChatSession | undefined> {
    const db = await getDB();
    await db
      .update(liveChatSessions)
      .set({ assignedTo: agentId })
      .where(eq(liveChatSessions.id, id));
    const [session] = await db.select().from(liveChatSessions).where(eq(liveChatSessions.id, id));
    return session || undefined;
  }

  // Live chat message methods
  async getLiveChatMessages(sessionId: string): Promise<LiveChatMessage[]> {
    const db = await getDB();
    return db
      .select()
      .from(liveChatMessages)
      .where(eq(liveChatMessages.sessionId, sessionId))
      .orderBy(liveChatMessages.createdAt);
  }

  async createLiveChatMessage(message: InsertLiveChatMessage): Promise<LiveChatMessage> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(liveChatMessages).values({ ...message, id } as any);
    const [newMessage] = await db.select().from(liveChatMessages).where(eq(liveChatMessages.id, id));
    return newMessage;
  }

  // File upload methods
  async getFileUpload(id: string): Promise<FileUpload | undefined> {
    const db = await getDB();
    const [file] = await db.select().from(fileUploads).where(eq(fileUploads.id, id));
    return file || undefined;
  }

  async getFileUploadsByRelated(relatedType: string, relatedId: string): Promise<FileUpload[]> {
    const db = await getDB();
    return db
      .select()
      .from(fileUploads)
      .where(and(eq(fileUploads.relatedType, relatedType), eq(fileUploads.relatedId, relatedId)));
  }

  async createFileUpload(file: InsertFileUpload): Promise<FileUpload> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(fileUploads).values({ ...file, id } as any);
    const [newFile] = await db.select().from(fileUploads).where(eq(fileUploads.id, id));
    return newFile;
  }

  async deleteFileUpload(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(fileUploads).where(eq(fileUploads.id, id));
  }

  // Agent transfer methods
  async getAgentTransfer(id: string): Promise<AgentTransfer | undefined> {
    const db = await getDB();
    const [transfer] = await db.select().from(agentTransfers).where(eq(agentTransfers.id, id));
    return transfer || undefined;
  }

  async getPendingTransfersByAgent(agentId: string): Promise<AgentTransfer[]> {
    const db = await getDB();
    return db
      .select()
      .from(agentTransfers)
      .where(and(eq(agentTransfers.toAgent, agentId), eq(agentTransfers.status, "pending")))
      .orderBy(desc(agentTransfers.createdAt));
  }

  async createAgentTransfer(transfer: InsertAgentTransfer): Promise<AgentTransfer> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(agentTransfers).values({ ...transfer, id } as any);
    const [newTransfer] = await db.select().from(agentTransfers).where(eq(agentTransfers.id, id));
    return newTransfer;
  }

  async acceptAgentTransfer(id: string): Promise<AgentTransfer | undefined> {
    const db = await getDB();
    await db
      .update(agentTransfers)
      .set({ status: "accepted", acceptedAt: new Date() })
      .where(eq(agentTransfers.id, id));
    const [transfer] = await db.select().from(agentTransfers).where(eq(agentTransfers.id, id));
    return transfer || undefined;
  }

  // Page management methods
  async getPage(slug: string): Promise<Page | undefined> {
    const db = await getDB();
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page || undefined;
  }

  async getAllPages(): Promise<Page[]> {
    const db = await getDB();
    return db.select().from(pages).orderBy(pages.title);
  }

  async getPublishedPages(): Promise<Page[]> {
    const db = await getDB();
    return db.select().from(pages).where(eq(pages.isPublished, true)).orderBy(pages.title);
  }

  async createPage(page: InsertPage): Promise<Page> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(pages).values({ ...page, id } as any);
    const [newPage] = await db.select().from(pages).where(eq(pages.id, id));
    return newPage;
  }

  async updatePage(id: string, updates: Partial<InsertPage>): Promise<Page | undefined> {
    const db = await getDB();
    await db
      .update(pages)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(pages.id, id));
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || undefined;
  }

  async deletePage(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Page section methods
  async getPageSections(pageId: string): Promise<PageSection[]> {
    const db = await getDB();
    return db
      .select()
      .from(pageSections)
      .where(eq(pageSections.pageId, pageId))
      .orderBy(pageSections.order);
  }

  async createPageSection(section: InsertPageSection): Promise<PageSection> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(pageSections).values({ ...section, id } as any);
    const [newSection] = await db.select().from(pageSections).where(eq(pageSections.id, id));
    return newSection;
  }

  async updatePageSection(id: string, updates: Partial<InsertPageSection>): Promise<PageSection | undefined> {
    const db = await getDB();
    await db
      .update(pageSections)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(pageSections.id, id));
    const [section] = await db.select().from(pageSections).where(eq(pageSections.id, id));
    return section || undefined;
  }

  async deletePageSection(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(pageSections).where(eq(pageSections.id, id));
  }

  // FAQ methods
  async getFaq(id: string): Promise<Faq | undefined> {
    const db = await getDB();
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq || undefined;
  }

  async getAllFaqs(): Promise<Faq[]> {
    const db = await getDB();
    return db.select().from(faqs).where(eq(faqs.isPublished, true)).orderBy(faqs.category, faqs.order);
  }

  async getFaqsByCategory(category: string): Promise<Faq[]> {
    const db = await getDB();
    return db
      .select()
      .from(faqs)
      .where(and(eq(faqs.category, category), eq(faqs.isPublished, true)))
      .orderBy(faqs.order);
  }

  async getFaqsByPage(page: string): Promise<Faq[]> {
    const db = await getDB();
    return db
      .select()
      .from(faqs)
      .where(and(eq(faqs.page, page), eq(faqs.isPublished, true)))
      .orderBy(faqs.order);
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(faqs).values({ ...faq, id } as any);
    const [newFaq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return newFaq;
  }

  async updateFaq(id: string, updates: Partial<InsertFaq>): Promise<Faq | undefined> {
    const db = await getDB();
    await db
      .update(faqs)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(faqs.id, id));
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq || undefined;
  }

  async deleteFaq(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(faqs).where(eq(faqs.id, id));
  }

  // Support form methods
  async getSupportForm(id: string): Promise<SupportForm | undefined> {
    const db = await getDB();
    const [form] = await db.select().from(supportForms).where(eq(supportForms.id, id));
    return form || undefined;
  }

  async getAllSupportForms(): Promise<SupportForm[]> {
    const db = await getDB();
    return db.select().from(supportForms).orderBy(desc(supportForms.createdAt));
  }

  async getSupportFormsByStatus(status: string): Promise<SupportForm[]> {
    const db = await getDB();
    return db
      .select()
      .from(supportForms)
      .where(eq(supportForms.status, status))
      .orderBy(desc(supportForms.createdAt));
  }

  async createSupportForm(form: InsertSupportForm): Promise<SupportForm> {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.insert(supportForms).values({ ...form, id } as any);
    const [newForm] = await db.select().from(supportForms).where(eq(supportForms.id, id));
    return newForm;
  }

  async updateSupportFormStatus(id: string, status: string, respondedAt?: Date): Promise<SupportForm | undefined> {
    const db = await getDB();
    await db
      .update(supportForms)
      .set({ status, respondedAt })
      .where(eq(supportForms.id, id));
    const [form] = await db.select().from(supportForms).where(eq(supportForms.id, id));
    return form || undefined;
  }

  async assignSupportForm(id: string, agentId: string): Promise<SupportForm | undefined> {
    const db = await getDB();
    await db
      .update(supportForms)
      .set({ assignedTo: agentId })
      .where(eq(supportForms.id, id));
    const [form] = await db.select().from(supportForms).where(eq(supportForms.id, id));
    return form || undefined;
  }
}

export const storage = new DatabaseStorage();
