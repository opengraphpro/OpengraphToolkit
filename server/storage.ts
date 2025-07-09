import {
  urlAnalyses,
  generatedTags,
  type UrlAnalysis,
  type InsertUrlAnalysis,
  type GeneratedTags,
  type InsertGeneratedTags,
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
  private urlAnalysesMap = new Map<number, UrlAnalysis>();
  private generatedTagsMap = new Map<number, GeneratedTags>();
  private nextUrlAnalysisId = 1;
  private nextGeneratedTagsId = 1;
  generatedTags: any;

  async createUrlAnalysis(data: InsertUrlAnalysis): Promise<UrlAnalysis> {
    const analysis: UrlAnalysis = {
      id: this.nextUrlAnalysisId++,
      url: data.url,
      title: data.title ?? null,
      description: data.description ?? null,
      openGraphTags: data.openGraphTags ?? {},
      twitterTags: data.twitterTags ?? {},
      jsonLd: data.jsonLd ?? [],
      aiSuggestions: data.aiSuggestions ?? [],
      createdAt: new Date(),
    };

    this.urlAnalysesMap.set(analysis.id, analysis);
    return analysis;
  }

  async getUrlAnalysis(id: number): Promise<UrlAnalysis | undefined> {
    return this.urlAnalysesMap.get(id);
  }

  async getUrlAnalysisByUrl(url: string): Promise<UrlAnalysis | undefined> {
    return [...this.urlAnalysesMap.values()].find((item) => item.url === url);
  }

  async createGeneratedTags(data: InsertGeneratedTags): Promise<GeneratedTags> {
    const tag: GeneratedTags = {
      id: this.nextGeneratedTagsId++,
      title: data.title,
      description: data.description,
      url: data.url,
      type: data.type,
      image: data.image ?? null,
      siteName: data.siteName ?? null,
      generatedCode: data.generatedCode ?? null,
      createdAt: new Date(),
      locale: null,
      imageAlt: null
    };

    this.generatedTagsMap.set(tag.id, tag);
    return tag;
  }

  async getGeneratedTags(id: number): Promise<GeneratedTags | undefined> {
    return this.generatedTagsMap.get(id);
  }

  async getRecentGeneratedTags(limit: number): Promise<GeneratedTags[]> {
    return [...this.generatedTags.values()] // ✅ This converts MapIterator to array
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
      .slice(0, limit);
  }

}

export const storage = new MemStorage();
