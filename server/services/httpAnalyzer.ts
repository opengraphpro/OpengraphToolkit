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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const title = document.querySelector('title')?.textContent || '';
      const descriptionMeta = document.querySelector('meta[name="description"]');
      const description = descriptionMeta?.getAttribute('content') || '';

      const ogTags: Record<string, string> = {};
      document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (property && content) {
          ogTags[property] = content;
        }
      });

      const twitterTags: Record<string, string> = {};
      document.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
        const name = meta.getAttribute('name');
        const content = meta.getAttribute('content');
        if (name && content) {
          twitterTags[name] = content;
        }
      });

      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd: any[] = [];
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          jsonLd.push(data);
        } catch (e) {}
      });

      const content = document.body?.textContent || '';

      return {
        title,
        description,
        content: content.substring(0, 5000),
        openGraphTags: ogTags,
        twitterTags: twitterTags,
        jsonLd
      };
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof Error) {
        throw new Error(`Failed to fetch and analyze URL: ${error.message}`);
      } else {
        throw new Error(`Failed to fetch and analyze URL: ${String(error)}`);
      }
    }
  }
}

export const httpAnalyzerService = new HttpAnalyzerService();
