import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_QUOTATIONS_DIR = path.join(__dirname, '..', 'uploads', 'quotations');

// Ensure uploads/quotations directory exists
if (!fs.existsSync(UPLOADS_QUOTATIONS_DIR)) {
  fs.mkdirSync(UPLOADS_QUOTATIONS_DIR, { recursive: true });
}

/**
 * Finds available Chrome or Edge browser executable on the host system
 */
function getBrowserExecutable() {
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  for (const p of candidatePaths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Generates an exact A4 PDF directly from the rendered React quotation preview page.
 * Follows all steps:
 * 1. Load the existing quotation page.
 * 2. Wait for React/data rendering to finish.
 * 3. Wait for all images to load.
 * 4. Wait for fonts to load.
 * 5. Confirm the actual quotation container exists (#quotation-print-area).
 * 6. Ensure the generated quotation data is present.
 * 7. Capture/print that exact rendered quotation.
 */
export async function generateQuotationPdf(quotation, force = false) {
  const cleanId = String(quotation.quotationNo || quotation.id || 'QT-001').trim().toUpperCase();
  const fileName = `quotation-${cleanId}.pdf`;
  const filePath = path.join(UPLOADS_QUOTATIONS_DIR, fileName);

  if (!force && fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 1000) {
      return filePath;
    }
  }

  const browserPath = getBrowserExecutable();
  if (!browserPath) {
    throw new Error('Chrome or Edge browser executable not found on server host for PDF generation.');
  }

  let browser;
  try {
    const port = process.env.CLIENT_PORT || 3000;
    const targetUrl = `http://localhost:${port}/quotation/${encodeURIComponent(cleanId)}`;

    browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    // 1. Load the existing quotation page
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 20000 });

    // 2. Wait for React/data rendering to finish and confirm quotation container exists
    await page.waitForSelector('#quotation-print-area', { timeout: 15000 });

    // 3. Wait until all fonts have loaded
    await page.evaluateHandle('document.fonts.ready');

    // 4. Wait until all images in the document finish loading
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(imgs.map(i => {
        if (i.complete) return Promise.resolve();
        return new Promise(res => {
          i.onload = res;
          i.onerror = res;
        });
      }));
    });

    // 5. Ensure quotation content is present inside container
    const isReady = await page.evaluate(() => {
      const container = document.querySelector('#quotation-print-area');
      return Boolean(container && container.innerText && container.innerText.includes('Quotation'));
    });

    if (!isReady) {
      await page.waitForFunction(
        () => {
          const c = document.querySelector('#quotation-print-area');
          return c && c.innerText && c.innerText.length > 50;
        },
        { timeout: 10000 }
      );
    }

    // 6. Cleanly apply print formatting to capture only the exact rendered quotation
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 0;
        }
        body, html {
          background: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .print\\:hidden {
          display: none !important;
        }
        .fixed.inset-0 {
          position: static !important;
          background: #ffffff !important;
          padding: 20px !important;
          min-height: auto !important;
        }
        #quotation-print-area {
          margin: 0 auto !important;
          box-shadow: none !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 16px !important;
          max-width: 794px !important;
          background: #ffffff !important;
        }
      `
    });

    // Small delay to allow any layout reflow
    await new Promise(resolve => setTimeout(resolve, 300));

    // 7. Capture exact A4 PDF with background graphics
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    await browser.close();
    browser = null;

    fs.writeFileSync(filePath, pdfBuffer);
    console.log(`[Puppeteer PDF Generated]: ${filePath} (${pdfBuffer.length} bytes)`);
    return filePath;
  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    console.error('[Puppeteer PDF Generation Error]:', err.message);
    throw err;
  }
}
