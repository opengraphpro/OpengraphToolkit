import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlAnalyzerService } from "./services/urlAnalyzer";
import { puppeteerService } from './services/puppeteer';

import { geminiService } from "./services/gemini";
import { 
  urlAnalysisRequestSchema, 
  tagGeneratorRequestSchema,
  insertUrlAnalysisSchema,
  insertGeneratedTagsSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze URL endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = urlAnalysisRequestSchema.parse(req.body);
      
      // Check if we have recent analysis for this URL
      const existingAnalysis = await storage.getUrlAnalysisByUrl(url);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (existingAnalysis && existingAnalysis.createdAt && existingAnalysis.createdAt > oneHourAgo) {
        return res.json(existingAnalysis);
      }
      
      // Perform new analysis
      const result = await urlAnalyzerService.analyzeUrl(url);
      
      // Store in database
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
      console.error('Analysis error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze URL" 
      });
    }
  });

  // Generate tags endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const data = tagGeneratorRequestSchema.parse(req.body);
      
      // Generate HTML tags
      const generatedCode = urlAnalyzerService.generateTags(data);
      
      // Store generated tags
      const tags = await storage.createGeneratedTags({
        ...data,
        generatedCode,
      });
      
      res.json(tags);
    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate tags" 
      });
    }
  });

  // Get AI suggestions for improvement
  app.post("/api/improve", async (req, res) => {
    try {
      const { url, title, description, content, type } = req.body;
      
      const improvements = await geminiService.generateImprovedTags({
        url,
        title,
        description,
        content,
        type,
      });
      
      res.json(improvements);
    } catch (error) {
      console.error('Improvement error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate improvements" 
      });
    }
  });

  // Get recent generated tags
  app.get("/api/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentTags = await storage.getRecentGeneratedTags(limit);
      res.json(recentTags);
    } catch (error) {
      console.error('Recent tags error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get recent tags" 
      });
    }
  });

  // Validate tags endpoint
  app.post("/api/validate", async (req, res) => {
    try {
      const { tags } = req.body;
      
      // Basic validation logic
      const validations = {
        title: {
          present: !!tags.title,
          length: tags.title?.length || 0,
          optimal: tags.title?.length >= 30 && tags.title?.length <= 60
        },
        description: {
          present: !!tags.description,
          length: tags.description?.length || 0,
          optimal: tags.description?.length >= 120 && tags.description?.length <= 160
        },
        image: {
          present: !!tags.image,
          valid: tags.image ? /^https?:\/\//.test(tags.image) : false
        },
        url: {
          present: !!tags.url,
          valid: tags.url ? /^https?:\/\//.test(tags.url) : false
        }
      };
      
      res.json(validations);
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to validate tags" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
