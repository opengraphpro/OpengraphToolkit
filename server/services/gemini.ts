import { GoogleGenerativeAI } from "@google/generative-ai";
import { AISuggestion } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class GeminiService {
  async analyzeSEOTags(data: {
    url: string;
    title?: string;
    description?: string;
    content: string;
    openGraphTags: Record<string, string>;
    twitterTags: Record<string, string>;
  }): Promise<AISuggestion[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Analyze the following webpage data for SEO and social media optimization:
        
        URL: ${data.url}
        Title: ${data.title || 'Missing'}
        Description: ${data.description || 'Missing'}
        OpenGraph Tags: ${JSON.stringify(data.openGraphTags)}
        Twitter Tags: ${JSON.stringify(data.twitterTags)}
        Content Preview: ${data.content.substring(0, 1000)}
        
        Respond ONLY with valid JSON in this exact format:
        {
          "suggestions": [
            {
              "type": "optimization",
              "level": "warning",
              "message": "Your optimization suggestion here"
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const parsed = JSON.parse(text);
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          return parsed.suggestions;
        }
        // If suggestions array is missing, try to extract from different format
        if (parsed.analysis && Array.isArray(parsed.analysis)) {
          return parsed.analysis.map((item: any) => ({
            type: item.type || 'optimization',
            level: item.level || 'warning',
            message: item.message || item.text || 'AI analysis completed',
            suggestion: item.suggestion
          }));
        }
        // Return parsed content as single suggestion if it's a string
        return [{
          type: 'optimization',
          level: 'success',
          message: typeof parsed === 'string' ? parsed : 'AI analysis completed successfully'
        }];
      } catch (parseError) {
        // If JSON parsing fails, try to parse as partial JSON
        const cleanText = text.replace(/```json|```/g, '').trim();
        if (cleanText.includes('"suggestions"')) {
          // Try to extract suggestions from partial JSON
          const match = cleanText.match(/"suggestions":\s*\[([^\]]+)\]/);
          if (match) {
            try {
              const suggestionsText = '[' + match[1] + ']';
              const suggestions = JSON.parse(suggestionsText);
              return suggestions.map((s: any) => ({
                type: s.type || 'optimization',
                level: s.level || 'success',
                message: s.message || 'AI analysis completed'
              }));
            } catch (e) {
              // Continue to fallback
            }
          }
        }
        
        if (cleanText.length > 0) {
          return [{
            type: 'optimization',
            level: 'success',
            message: cleanText.substring(0, 200) + (cleanText.length > 200 ? '...' : '')
          }];
        }
        return [{
          type: 'optimization',
          level: 'warning',
          message: 'AI analysis completed but response format was unexpected',
        }];
      }
    } catch (error) {
      console.error('Gemini analysis error:', error);
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {};
      }
    } catch (error) {
      console.error('Gemini content generation error:', error);
      return {};
    }
  }
}

export const geminiService = new GeminiService();