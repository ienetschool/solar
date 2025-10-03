import { sql, relations } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tickets = mysqlTable("tickets", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  category: text("category").notNull(),
  assignedTo: varchar("assigned_to", { length: 36 }).references(() => users.id),
  files: json("files").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
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
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  relatedId: varchar("related_id", { length: 36 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ticketHistory = mysqlTable("ticket_history", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  ticketId: varchar("ticket_id", { length: 36 }).notNull().references(() => tickets.id),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  action: text("action").notNull(),
  details: json("details").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
