import { pgTable, text, serial, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const urlAnalyses = pgTable("url_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  openGraphTags: jsonb("og_tags"),
  twitterTags: jsonb("twitter_tags"),
  jsonLd: jsonb("json_ld"),
  aiSuggestions: jsonb("ai_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generatedTags = pgTable("generated_tags", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  url: text("url").notNull(),
  siteName: text("site_name"),
  type: text("type").notNull(),
  generatedCode: text("generated_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUrlAnalysisSchema = createInsertSchema(urlAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertGeneratedTagsSchema = createInsertSchema(generatedTags).omit({
  id: true,
  createdAt: true,
});

export type InsertUrlAnalysis = z.infer<typeof insertUrlAnalysisSchema>;
export type UrlAnalysis = typeof urlAnalyses.$inferSelect;
export type InsertGeneratedTags = z.infer<typeof insertGeneratedTagsSchema>;
export type GeneratedTags = typeof generatedTags.$inferSelect;

// API Response Types
export const urlAnalysisRequestSchema = z.object({
  url: z.string().url(),
});

export const tagGeneratorRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional().or(z.literal("")),
  url: z.string().url(),
  siteName: z.string().optional(),
  type: z.enum(["website", "article", "product", "video"]),
});

export type UrlAnalysisRequest = z.infer<typeof urlAnalysisRequestSchema>;
export type TagGeneratorRequest = z.infer<typeof tagGeneratorRequestSchema>;

export interface OpenGraphTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export interface TwitterTags {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  site?: string;
}

export interface AISuggestion {
  type: 'optimization' | 'improvement';
  level: 'success' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

export interface UrlAnalysisResult {
  url: string;
  title?: string;
  description?: string;
  openGraphTags: OpenGraphTags;
  twitterTags: TwitterTags;
  jsonLd: any;
  aiSuggestions: AISuggestion[];
}
