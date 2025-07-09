import puppeteer, { Browser } from 'puppeteer';

export class PuppeteerService {
  private browser: Browser | null = null;

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

        const content = document.body.innerText || '';

        return {
          title,
          description,
          content: content.substring(0, 5000),
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
