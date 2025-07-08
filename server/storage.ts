import { 
  urlAnalyses, 
  generatedTags, 
  type UrlAnalysis, 
  type InsertUrlAnalysis, 
  type GeneratedTags, 
  type InsertGeneratedTags 
} from "@shared/schema";

export interface IStorage {
  // URL Analysis methods
  createUrlAnalysis(analysis: InsertUrlAnalysis): Promise<UrlAnalysis>;
  getUrlAnalysis(id: number): Promise<UrlAnalysis | undefined>;
  getUrlAnalysisByUrl(url: string): Promise<UrlAnalysis | undefined>;
  
  // Generated Tags methods
  createGeneratedTags(tags: InsertGeneratedTags): Promise<GeneratedTags>;
  getGeneratedTags(id: number): Promise<GeneratedTags | undefined>;
  getRecentGeneratedTags(limit: number): Promise<GeneratedTags[]>;
}

export class MemStorage implements IStorage {
  private urlAnalyses: Map<number, UrlAnalysis>;
  private generatedTags: Map<number, GeneratedTags>;
  private currentUrlAnalysisId: number;
  private currentGeneratedTagsId: number;

  constructor() {
    this.urlAnalyses = new Map();
    this.generatedTags = new Map();
    this.currentUrlAnalysisId = 1;
    this.currentGeneratedTagsId = 1;
  }

  async createUrlAnalysis(insertAnalysis: InsertUrlAnalysis): Promise<UrlAnalysis> {
    const id = this.currentUrlAnalysisId++;
    const analysis: UrlAnalysis = {
      ...insertAnalysis,
      id,
      title: insertAnalysis.title || null,
      description: insertAnalysis.description || null,
      openGraphTags: insertAnalysis.openGraphTags || {},
      twitterTags: insertAnalysis.twitterTags || {},
      jsonLd: insertAnalysis.jsonLd || [],
      aiSuggestions: insertAnalysis.aiSuggestions || [],
      createdAt: new Date(),
    };
    this.urlAnalyses.set(id, analysis);
    return analysis;
  }

  async getUrlAnalysis(id: number): Promise<UrlAnalysis | undefined> {
    return this.urlAnalyses.get(id);
  }

  async getUrlAnalysisByUrl(url: string): Promise<UrlAnalysis | undefined> {
    return Array.from(this.urlAnalyses.values()).find(
      (analysis) => analysis.url === url
    );
  }

  async createGeneratedTags(insertTags: InsertGeneratedTags): Promise<GeneratedTags> {
    const id = this.currentGeneratedTagsId++;
    const tags: GeneratedTags = {
      ...insertTags,
      id,
      image: insertTags.image || null,
      siteName: insertTags.siteName || null,
      generatedCode: insertTags.generatedCode || null,
      createdAt: new Date(),
    };
    this.generatedTags.set(id, tags);
    return tags;
  }

  async getGeneratedTags(id: number): Promise<GeneratedTags | undefined> {
    return this.generatedTags.get(id);
  }

  async getRecentGeneratedTags(limit: number): Promise<GeneratedTags[]> {
    const tags = Array.from(this.generatedTags.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
    return tags;
  }
}

export const storage = new MemStorage();
