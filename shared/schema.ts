import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  preferences: text("preferences").array().default([]),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  category: text("category").notNull(),
  source: text("source").notNull(),
  author: text("author"),
  publishedAt: text("published_at").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
});

export const savedArticles = pgTable("saved_articles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  preferences: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export const insertSavedArticleSchema = createInsertSchema(savedArticles).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type SavedArticle = typeof savedArticles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertSavedArticle = z.infer<typeof insertSavedArticleSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
