import type { Express } from "express";
import { createServer, type Server } from "http";

import { storage } from "./storage";
import { urlAnalyzerService } from "./services/urlAnalyzer";
import { geminiService } from "./services/gemini";

import {
  urlAnalysisRequestSchema,
  tagGeneratorRequestSchema
} from "@shared/schema";

import express from "express";
import { generateTagsFromMetadata } from "./services/generate";

const router = express.Router();

router.post("/api/generate", async (req, res) => {
  try {
    const result = await generateTagsFromMetadata(req.body);
    res.json(result);
  } catch (err: any) {
    console.error("Error generating tags:", err);
    res.status(400).json({ error: err.message || "Failed to generate tags" });
  }
});

export default router;

// Helper for consistent error handling
function handleError(res: any, error: unknown, fallback = "Server Error") {
  console.error(error);
  res.status(500).json({
    message: error instanceof Error ? error.message : fallback,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = urlAnalysisRequestSchema.parse(req.body);
      const recent = await storage.getUrlAnalysisByUrl(url);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

      if (recent?.createdAt && recent.createdAt > hourAgo) {
        return res.json(recent);
      }

      const result = await urlAnalyzerService.analyzeUrl(url);
      const analysis = await storage.createUrlAnalysis({
        url: result.url,
        title: result.title,
        description: result.description,
        openGraphTags: result.openGraphTags,
        twitterTags: result.twitterTags,
        jsonLd: result.jsonLd,
        aiSuggestions: result.aiSuggestions,
      });

      res.json(analysis);
    } catch (error) {
      handleError(res, error, "Failed to analyze URL");
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const data = tagGeneratorRequestSchema.parse(req.body);
      const generatedCode = urlAnalyzerService.generateTags(data);
      const tags = await storage.createGeneratedTags({ ...data, generatedCode });
      res.json(tags);
    } catch (error) {
      handleError(res, error, "Failed to generate tags");
    }
  });

  app.post("/api/improve", async (req, res) => {
    try {
      const { url, title, description, content, type } = req.body;
      const improvements = await geminiService.generateImprovedTags({ url, title, description, content, type });
      res.json(improvements);
    } catch (error) {
      handleError(res, error, "Failed to generate improvements");
    }
  });

  app.get("/api/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recent = await storage.getRecentGeneratedTags(limit);
      res.json(recent);
    } catch (error) {
      handleError(res, error, "Failed to get recent tags");
    }
  });

  app.post("/api/validate", async (req, res) => {
    try {
      const { tags } = req.body;
      const validations = {
        title: {
          present: !!tags.title,
          length: tags.title?.length || 0,
          optimal: tags.title?.length >= 30 && tags.title?.length <= 60,
        },
        description: {
          present: !!tags.description,
          length: tags.description?.length || 0,
          optimal: tags.description?.length >= 120 && tags.description?.length <= 160,
        },
        image: {
          present: !!tags.image,
          valid: /^https?:\/\//.test(tags.image || ""),
        },
        url: {
          present: !!tags.url,
          valid: /^https?:\/\//.test(tags.url || ""),
        },
      };
      res.json(validations);
    } catch (error) {
      handleError(res, error, "Failed to validate tags");
    }
  });

  return createServer(app);
}
