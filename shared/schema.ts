import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientId: text("patient_id").notNull(),
  patientAge: integer("patient_age").notNull(),
  sessionId: text("session_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  userRole: text("user_role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const eegData = pgTable("eeg_data", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  value: integer("value").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});

export const insertEegDataSchema = createInsertSchema(eegData).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertEegData = z.infer<typeof insertEegDataSchema>;
export type EegData = typeof eegData.$inferSelect;
