import puppeteer from 'puppeteer';

export class PuppeteerService {
  private browser: puppeteer.Browser | null = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080'
        ]
      });
    }
    return this.browser;
  }

  async analyzePage(url: string): Promise<{
    title: string;
    description: string;
    content: string;
    openGraphTags: Record<string, string>;
    twitterTags: Record<string, string>;
    jsonLd: any[];
  }> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const result = await page.evaluate(() => {
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
        const content = document.body.innerText || '';
        
        return {
          title,
          description,
          content: content.substring(0, 5000), // Limit content for AI analysis
          openGraphTags: ogTags,
          twitterTags: twitterTags,
          jsonLd
        };
      });

      return result;
    } finally {
      await page.close();
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const puppeteerService = new PuppeteerService();
