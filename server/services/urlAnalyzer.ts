import { puppeteerService } from './puppeteer';
import { httpAnalyzerService } from './httpAnalyzer';
import { geminiService } from './gemini';
import { UrlAnalysisResult, OpenGraphTags, TwitterTags, AISuggestion } from '@shared/schema';

const DEFAULT_IMAGE_URL = 'https://example.com/default.jpg';
const DEFAULT_TITLE = 'Untitled';
const DEFAULT_DESCRIPTION = 'No description available.';
const DEFAULT_OG_TYPE = 'website';
const DEFAULT_OG_LOCALE = 'en_US';
const DEFAULT_TWITTER_CARD = 'summary_large_image';

export class UrlAnalyzerService {
  async analyzeUrl(url: string): Promise<UrlAnalysisResult> {
    try {
      const parsedURL = new URL(url);

      let pageData;
      try {
        pageData = await puppeteerService.analyzePage(url);
      } catch (puppeteerError) {
        if (puppeteerError && typeof puppeteerError === 'object' && 'message' in puppeteerError) {
          console.log('Puppeteer failed, falling back to HTTP analyzer:', (puppeteerError as { message: string }).message);
        } else {
          console.log('Puppeteer failed, falling back to HTTP analyzer:', puppeteerError);
        }
        pageData = await httpAnalyzerService.analyzePage(url);
      }

      const ogTags = pageData.openGraphTags || {};
      const twTags = pageData.twitterTags || {};

      const validOgTypes = ["website", "article", "product", "profile"] as const;
      type OpenGraphType = (typeof validOgTypes)[number];

      const rawType = ogTags["og:type"];
      const safeType: OpenGraphType = validOgTypes.includes(rawType as any)
        ? (rawType as OpenGraphType)
        : "website";

      const openGraphTags: OpenGraphTags = {
        title: ogTags["og:title"] || pageData.title || DEFAULT_TITLE,
        description: ogTags["og:description"] || pageData.description || DEFAULT_DESCRIPTION,
        image: ogTags["og:image"] || DEFAULT_IMAGE_URL,
        url: ogTags["og:url"] || parsedURL.toString(),
        type: safeType,
        siteName: ogTags["og:site_name"] || parsedURL.hostname,
        locale: ogTags["og:locale"] || DEFAULT_OG_LOCALE,
        imageAlt: ogTags["og:image:alt"] || 'Preview image'
      };

      const twitterTags: TwitterTags = {
        card: twTags['twitter:card'] || DEFAULT_TWITTER_CARD,
        title: twTags['twitter:title'] || openGraphTags.title,
        description: twTags['twitter:description'] || openGraphTags.description,
        image: twTags['twitter:image'] || openGraphTags.image,
        site: twTags['twitter:site'] || `@${parsedURL.hostname.replace('www.', '')}`
      };

      const aiSuggestions: AISuggestion[] = await geminiService.analyzeSEOTags({
        url,
        title: pageData.title,
        description: pageData.description,
        content: pageData.content,
        openGraphTags: ogTags,
        twitterTags: twTags,
      });

      return {
        url,
        title: pageData.title || DEFAULT_TITLE,
        description: pageData.description || DEFAULT_DESCRIPTION,
        openGraphTags,
        twitterTags,
        jsonLd: pageData.jsonLd || [],
        aiSuggestions,
      };
    } catch (error) {
      console.error('URL analysis error:', error);
      throw new Error(`Failed to analyze URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateTags(data: {
    title: string;
    description: string;
    image?: string;
    url: string;
    siteName?: string;
    type: string;
  }): string {
    const { title, description, image, url, siteName, type } = data;

    let html = `<!-- OpenGraph Meta Tags -->\n`;
    html += `<meta property="og:title" content="${this.escapeHtml(title)}" />\n`;
    html += `<meta property="og:description" content="${this.escapeHtml(description)}" />\n`;
    if (image) {
      html += `<meta property="og:image" content="${this.escapeHtml(image)}" />\n`;
    }
    html += `<meta property="og:url" content="${this.escapeHtml(url)}" />\n`;
    html += `<meta property="og:type" content="${this.escapeHtml(type)}" />\n`;
    if (siteName) {
      html += `<meta property="og:site_name" content="${this.escapeHtml(siteName)}" />\n`;
    }

    html += `\n<!-- Twitter Card Meta Tags -->\n`;
    html += `<meta name="twitter:card" content="summary_large_image" />\n`;
    html += `<meta name="twitter:title" content="${this.escapeHtml(title)}" />\n`;
    html += `<meta name="twitter:description" content="${this.escapeHtml(description)}" />\n`;
    if (image) {
      html += `<meta name="twitter:image" content="${this.escapeHtml(image)}" />\n`;
    }

    html += `\n<!-- JSON-LD Schema -->\n`;
    html += `<script type="application/ld+json">\n`;
    html += JSON.stringify({
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebSite",
      "name": title,
      "description": description,
      "url": url,
      ...(image && { "image": image }),
      ...(siteName && { "publisher": { "@type": "Organization", "name": siteName } })
    }, null, 2);
    html += `\n</script>`;

    return html;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export const urlAnalyzerService = new UrlAnalyzerService();
