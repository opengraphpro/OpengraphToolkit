import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// DATABASE TABLES
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
  locale: text("locale"),
  imageAlt: text("image_alt"),
  createdAt: timestamp("created_at").defaultNow(),
});

// INSERT SCHEMAS
export const insertUrlAnalysisSchema = createInsertSchema(urlAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertGeneratedTagsSchema = createInsertSchema(generatedTags).omit({
  id: true,
  createdAt: true,
});

// INFERRED TYPES
export type InsertUrlAnalysis = z.infer<typeof insertUrlAnalysisSchema>;
export type UrlAnalysis = typeof urlAnalyses.$inferSelect;
export type InsertGeneratedTags = z.infer<typeof insertGeneratedTagsSchema>;
export type GeneratedTags = typeof generatedTags.$inferSelect;

// API REQUEST TYPES
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

// METADATA INTERFACES
export interface OpenGraphTags {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  imageAlt?: string;
  audio?: string;
  video?: string;
  determiner?: string;
}

export interface TwitterTags {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  site?: string;
  creator?: string;
}

export interface JsonLdSchema {
  type: 'Organization' | 'WebSite';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  searchActionUrl?: string;
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
  jsonLd: JsonLdSchema[];
  aiSuggestions: AISuggestion[];
}
