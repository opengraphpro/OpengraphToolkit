import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export class HttpAnalyzerService {
  async analyzePage(url: string): Promise<{
    title: string;
    description: string;
    content: string;
    openGraphTags: Record<string, string>;
    twitterTags: Record<string, string>;
    jsonLd: any[];
  }> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text() as string;
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Extract title
      const title = document.querySelector('title')?.textContent || '';
      
      // Extract meta description
      const descriptionMeta = document.querySelector('meta[name="description"]');
      const description = descriptionMeta?.getAttribute('content') || '';
      
      // Extract OpenGraph tags
      const ogTags: Record<string, string> = {};
      document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (property && content) {
          ogTags[property] = content;
        }
      });
      
      // Extract Twitter tags
      const twitterTags: Record<string, string> = {};
      document.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
        const name = meta.getAttribute('name');
        const content = meta.getAttribute('content');
        if (name && content) {
          twitterTags[name] = content;
        }
      });
      
      // Extract JSON-LD
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd: any[] = [];
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          jsonLd.push(data);
        } catch (e) {
          // Skip invalid JSON-LD
        }
      });
      
      // Extract page content for AI analysis
      const content = document.body?.textContent || '';
      
      return {
        title,
        description,
        content: content.substring(0, 5000), // Limit content for AI analysis
        openGraphTags: ogTags,
        twitterTags: twitterTags,
        jsonLd
      };
    } catch (error) {
      throw new Error(`Failed to fetch and analyze URL: ${error.message}`);
    }
  }
}

export const httpAnalyzerService = new HttpAnalyzerService();