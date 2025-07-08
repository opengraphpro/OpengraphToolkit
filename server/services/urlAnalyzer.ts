import { puppeteerService } from './puppeteer';
import { openAIService } from './openai';
import { UrlAnalysisResult, OpenGraphTags, TwitterTags, AISuggestion } from '@shared/schema';

export class UrlAnalyzerService {
  async analyzeUrl(url: string): Promise<UrlAnalysisResult> {
    try {
      // Validate URL
      new URL(url);
      
      // Use Puppeteer to analyze the page
      const pageData = await puppeteerService.analyzePage(url);
      
      // Extract OpenGraph tags
      const openGraphTags: OpenGraphTags = {
        title: pageData.openGraphTags['og:title'],
        description: pageData.openGraphTags['og:description'],
        image: pageData.openGraphTags['og:image'],
        url: pageData.openGraphTags['og:url'],
        type: pageData.openGraphTags['og:type'],
        siteName: pageData.openGraphTags['og:site_name'],
      };
      
      // Extract Twitter tags
      const twitterTags: TwitterTags = {
        card: pageData.twitterTags['twitter:card'],
        title: pageData.twitterTags['twitter:title'],
        description: pageData.twitterTags['twitter:description'],
        image: pageData.twitterTags['twitter:image'],
        site: pageData.twitterTags['twitter:site'],
      };
      
      // Get AI suggestions
      const aiSuggestions = await openAIService.analyzeSEOTags({
        url,
        title: pageData.title,
        description: pageData.description,
        content: pageData.content,
        openGraphTags: pageData.openGraphTags,
        twitterTags: pageData.twitterTags,
      });
      
      return {
        url,
        title: pageData.title,
        description: pageData.description,
        openGraphTags,
        twitterTags,
        jsonLd: pageData.jsonLd,
        aiSuggestions,
      };
    } catch (error) {
      console.error('URL analysis error:', error);
      throw new Error(`Failed to analyze URL: ${error.message}`);
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
    const div = { innerHTML: text } as any;
    return div.innerHTML
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export const urlAnalyzerService = new UrlAnalyzerService();
