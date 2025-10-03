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
  users,
  tickets,
  chatMessages,
  notifications,
  ticketHistory,
} from "@shared/schema";
import { getDB } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Storage interface for all CRUD operations
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;

  // Ticket methods
  getTicket(id: string): Promise<Ticket | undefined>;
  getTicketsByUser(userId: string): Promise<Ticket[]>;
  getAllTickets(): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: string, status: string, resolvedAt?: Date): Promise<Ticket | undefined>;
  updateTicketAssignment(id: string, assignedTo: string | null): Promise<Ticket | undefined>;
  updateTicket(id: string, updates: Partial<InsertTicket>): Promise<Ticket | undefined>;

  // Chat message methods
  getChatMessagesByTicket(ticketId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Notification methods
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // Ticket history methods
  getTicketHistory(ticketId: string): Promise<TicketHistory[]>;
  createTicketHistory(history: InsertTicketHistory): Promise<TicketHistory>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDB();
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getDB();
    return db.select().from(users);
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const db = await getDB();
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Ticket methods
  async getTicket(id: string): Promise<Ticket | undefined> {
    const db = await getDB();
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    const db = await getDB();
    return db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
  }

  async getAllTickets(): Promise<Ticket[]> {
    const db = await getDB();
    return db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const db = await getDB();
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }

  async updateTicketStatus(id: string, status: string, resolvedAt?: Date): Promise<Ticket | undefined> {
    const db = await getDB();
    const [ticket] = await db
      .update(tickets)
      .set({ status, updatedAt: new Date(), resolvedAt })
      .where(eq(tickets.id, id))
      .returning();
    return ticket || undefined;
  }

  async updateTicketAssignment(id: string, assignedTo: string | null): Promise<Ticket | undefined> {
    const db = await getDB();
    const [ticket] = await db
      .update(tickets)
      .set({ assignedTo, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket || undefined;
  }

  async updateTicket(id: string, updates: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const db = await getDB();
    const [ticket] = await db
      .update(tickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket || undefined;
  }

  // Chat message methods
  async getChatMessagesByTicket(ticketId: string): Promise<ChatMessage[]> {
    const db = await getDB();
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.ticketId, ticketId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const db = await getDB();
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Notification methods
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const db = await getDB();
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const db = await getDB();
    const results = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return results.length;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const db = await getDB();
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const db = await getDB();
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification || undefined;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const db = await getDB();
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  // Ticket history methods
  async getTicketHistory(ticketId: string): Promise<TicketHistory[]> {
    const db = await getDB();
    return db
      .select()
      .from(ticketHistory)
      .where(eq(ticketHistory.ticketId, ticketId))
      .orderBy(ticketHistory.createdAt);
  }

  async createTicketHistory(history: InsertTicketHistory): Promise<TicketHistory> {
    const db = await getDB();
    const [newHistory] = await db.insert(ticketHistory).values(history).returning();
    return newHistory;
  }
}

export const storage = new DatabaseStorage();
