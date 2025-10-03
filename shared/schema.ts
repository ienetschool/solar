import { sql, relations } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, boolean, json, int } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: text("role", { enum: ['user', 'admin', 'support'] }).default('user'),
  notificationPreferences: json("notification_preferences").$type<Record<string, any>>(),
  fcmTokens: json("fcm_tokens").$type<string[]>(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tickets = mysqlTable("tickets", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ['open', 'in_progress', 'resolved', 'closed'] }).default('open'),
  priority: text("priority", { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  category: varchar("category", { length: 255 }).notNull(),
  userId: int("user_id").notNull().references(() => users.id),
  assignedToId: int("assigned_to_id").references(() => users.id),
  referenceNumber: varchar("reference_number", { length: 50 }),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  lastUpdated: timestamp("last_updated"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatMessages = mysqlTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  ticketId: varchar("ticket_id", { length: 36 }).references(() => tickets.id),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  message: text("message").notNull(),
  isAgent: boolean("is_agent").notNull().default(false),
  files: json("files").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ['ticket_update', 'chat_message', 'system_alert', 'faq_update', 'mention'] }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  metadata: json("metadata").$type<Record<string, any>>(),
  priority: text("priority", { enum: ['low', 'medium', 'high', 'urgent'] }),
  status: text("status", { enum: ['unread', 'read', 'archived'] }).default('unread'),
  channels: json("channels").$type<string[]>(),
  deliveryStatus: json("delivery_status").$type<Record<string, any>>(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ticketHistory = mysqlTable("ticket_history", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  ticketId: varchar("ticket_id", { length: 36 }).notNull().references(() => tickets.id),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  action: text("action").notNull(),
  details: json("details").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const callbackRequests = mysqlTable("callback_requests", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  preferredTime: text("preferred_time").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  files: json("files").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  contactedAt: timestamp("contacted_at"),
});

export const liveChatSessions = mysqlTable("live_chat_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  status: text("status").notNull().default("active"),
  assignedTo: varchar("assigned_to", { length: 36 }).references(() => users.id),
  page: text("page"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const liveChatMessages = mysqlTable("live_chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar("session_id", { length: 36 }).notNull().references(() => liveChatSessions.id),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  message: text("message").notNull(),
  isAgent: boolean("is_agent").notNull().default(false),
  files: json("files").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fileUploads = mysqlTable("file_uploads", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: text("size").notNull(),
  url: text("url").notNull(),
  uploadedBy: varchar("uploaded_by", { length: 36 }).notNull().references(() => users.id),
  relatedType: text("related_type"),
  relatedId: varchar("related_id", { length: 36 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agentTransfers = mysqlTable("agent_transfers", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  ticketId: varchar("ticket_id", { length: 36 }).references(() => tickets.id),
  chatSessionId: varchar("chat_session_id", { length: 36 }).references(() => liveChatSessions.id),
  fromAgent: varchar("from_agent", { length: 36 }).references(() => users.id),
  toAgent: varchar("to_agent", { length: 36 }).notNull().references(() => users.id),
  reason: text("reason"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

export const pages = mysqlTable("pages", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  schemaMarkup: json("schema_markup").$type<Record<string, any>>(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const pageSections = mysqlTable("page_sections", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  pageId: varchar("page_id", { length: 36 }).notNull().references(() => pages.id),
  type: text("type").notNull(),
  title: text("title"),
  content: text("content"),
  imageUrl: text("image_url"),
  order: int("order").notNull().default(0),
  data: json("data").$type<Record<string, any>>(),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const faqs = mysqlTable("faqs", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  page: text("page"),
  order: int("order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const supportForms = mysqlTable("support_forms", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  page: text("page"),
  status: text("status").notNull().default("new"),
  assignedTo: varchar("assigned_to", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
  assignedTickets: many(tickets),
  chatMessages: many(chatMessages),
  notifications: many(notifications),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
  assignedAgent: one(users, {
    fields: [tickets.assignedTo],
    references: [users.id],
  }),
  chatMessages: many(chatMessages),
  history: many(ticketHistory),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  ticket: one(tickets, {
    fields: [chatMessages.ticketId],
    references: [tickets.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const ticketHistoryRelations = relations(ticketHistory, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketHistory.ticketId],
    references: [tickets.id],
  }),
  user: one(users, {
    fields: [ticketHistory.userId],
    references: [users.id],
  }),
}));

export const liveChatSessionsRelations = relations(liveChatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [liveChatSessions.userId],
    references: [users.id],
  }),
  assignedAgent: one(users, {
    fields: [liveChatSessions.assignedTo],
    references: [users.id],
  }),
  messages: many(liveChatMessages),
  transfers: many(agentTransfers),
}));

export const liveChatMessagesRelations = relations(liveChatMessages, ({ one }) => ({
  session: one(liveChatSessions, {
    fields: [liveChatMessages.sessionId],
    references: [liveChatSessions.id],
  }),
  user: one(users, {
    fields: [liveChatMessages.userId],
    references: [users.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  uploader: one(users, {
    fields: [fileUploads.uploadedBy],
    references: [users.id],
  }),
}));

export const agentTransfersRelations = relations(agentTransfers, ({ one }) => ({
  ticket: one(tickets, {
    fields: [agentTransfers.ticketId],
    references: [tickets.id],
  }),
  chatSession: one(liveChatSessions, {
    fields: [agentTransfers.chatSessionId],
    references: [liveChatSessions.id],
  }),
  from: one(users, {
    fields: [agentTransfers.fromAgent],
    references: [users.id],
  }),
  to: one(users, {
    fields: [agentTransfers.toAgent],
    references: [users.id],
  }),
}));

export const pagesRelations = relations(pages, ({ many }) => ({
  sections: many(pageSections),
}));

export const pageSectionsRelations = relations(pageSections, ({ one }) => ({
  page: one(pages, {
    fields: [pageSections.pageId],
    references: [pages.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertTicketHistorySchema = createInsertSchema(ticketHistory).omit({
  id: true,
  createdAt: true,
});

export const insertCallbackRequestSchema = createInsertSchema(callbackRequests).omit({
  id: true,
  createdAt: true,
  contactedAt: true,
});

export const insertLiveChatSessionSchema = createInsertSchema(liveChatSessions).omit({
  id: true,
  createdAt: true,
  closedAt: true,
});

export const insertLiveChatMessageSchema = createInsertSchema(liveChatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({
  id: true,
  createdAt: true,
});

export const insertAgentTransferSchema = createInsertSchema(agentTransfers).omit({
  id: true,
  createdAt: true,
  acceptedAt: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageSectionSchema = createInsertSchema(pageSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportFormSchema = createInsertSchema(supportForms).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertTicketHistory = z.infer<typeof insertTicketHistorySchema>;
export type TicketHistory = typeof ticketHistory.$inferSelect;

export type InsertCallbackRequest = z.infer<typeof insertCallbackRequestSchema>;
export type CallbackRequest = typeof callbackRequests.$inferSelect;

export type InsertLiveChatSession = z.infer<typeof insertLiveChatSessionSchema>;
export type LiveChatSession = typeof liveChatSessions.$inferSelect;

export type InsertLiveChatMessage = z.infer<typeof insertLiveChatMessageSchema>;
export type LiveChatMessage = typeof liveChatMessages.$inferSelect;

export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
export type FileUpload = typeof fileUploads.$inferSelect;

export type InsertAgentTransfer = z.infer<typeof insertAgentTransferSchema>;
export type AgentTransfer = typeof agentTransfers.$inferSelect;

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

export type InsertPageSection = z.infer<typeof insertPageSectionSchema>;
export type PageSection = typeof pageSections.$inferSelect;

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

export type InsertSupportForm = z.infer<typeof insertSupportFormSchema>;
export type SupportForm = typeof supportForms.$inferSelect;
