import OpenAI from "openai";
import { AISuggestion } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export class OpenAIService {
  async analyzeSEOTags(data: {
    url: string;
    title?: string;
    description?: string;
    content: string;
    openGraphTags: Record<string, string>;
    twitterTags: Record<string, string>;
  }): Promise<AISuggestion[]> {
    try {
      const prompt = `
        Analyze the following webpage data for SEO and social media optimization:
        
        URL: ${data.url}
        Title: ${data.title || 'Missing'}
        Description: ${data.description || 'Missing'}
        OpenGraph Tags: ${JSON.stringify(data.openGraphTags)}
        Twitter Tags: ${JSON.stringify(data.twitterTags)}
        Content Preview: ${data.content.substring(0, 1000)}
        
        Please provide SEO optimization suggestions in JSON format with the following structure:
        {
          "suggestions": [
            {
              "type": "optimization" | "improvement",
              "level": "success" | "warning" | "error",
              "message": "description of the issue or success",
              "suggestion": "specific improvement recommendation (optional)"
            }
          ]
        }
        
        Focus on:
        - Title length and optimization (50-60 characters ideal)
        - Description length and engagement (150-160 characters ideal)
        - OpenGraph image presence and dimensions
        - Twitter card completeness
        - Content relevance and structure
        - Missing essential tags
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO and social media optimization analyst. Provide actionable, specific recommendations for improving webpage metadata and social media presence."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      return [{
        type: 'error',
        level: 'error',
        message: 'Failed to analyze content with AI. Please try again.',
      }];
    }
  }

  async generateImprovedTags(data: {
    url: string;
    title?: string;
    description?: string;
    content: string;
    type: string;
  }): Promise<{
    improvedTitle?: string;
    improvedDescription?: string;
    suggestedKeywords?: string[];
  }> {
    try {
      const prompt = `
        Based on the following webpage data, suggest improved SEO-optimized title and description:
        
        URL: ${data.url}
        Current Title: ${data.title || 'Missing'}
        Current Description: ${data.description || 'Missing'}
        Content Type: ${data.type}
        Content Preview: ${data.content.substring(0, 1500)}
        
        Please provide improvements in JSON format:
        {
          "improvedTitle": "SEO-optimized title (50-60 characters)",
          "improvedDescription": "Engaging meta description (150-160 characters)",
          "suggestedKeywords": ["keyword1", "keyword2", "keyword3"]
        }
        
        Make the title compelling and include relevant keywords.
        Make the description engaging with a call-to-action.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO copywriter. Create compelling, keyword-rich titles and descriptions that improve click-through rates and search rankings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('OpenAI content generation error:', error);
      return {};
    }
  }
}

export const openAIService = new OpenAIService();
