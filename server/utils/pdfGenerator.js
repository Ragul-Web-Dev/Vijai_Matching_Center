import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_QUOTATIONS_DIR = path.join(__dirname, '..', 'uploads', 'quotations');
const LOGO_PATH = path.join(__dirname, '..', '..', 'client', 'public', 'logo.png');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_QUOTATIONS_DIR)) {
  fs.mkdirSync(UPLOADS_QUOTATIONS_DIR, { recursive: true });
}

/**
 * Escape text for PDF text strings in parentheses (...)
 */
function escapePdfText(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' '); // Keep standard printable ASCII
}

/**
 * Formats date into readable string (e.g. 19 Sep 2026)
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch (e) {}
  return String(dateStr);
}

/**
 * Finds available Chrome/Edge browser executable for 100% exact React quotation preview rendering
 */
function getBrowserExecutable() {
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
  ];
  for (const p of candidatePaths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Decodes PNG image (RGBA) to compressed RGB stream and Alpha Mask stream for PDF XObjects
 */
function parsePngForPdf(pngPath) {
  if (!fs.existsSync(pngPath)) return null;
  try {
    const pngBuf = fs.readFileSync(pngPath);
    let offset = 8;
    const idats = [];
    let w = 0, h = 0;
    while (offset < pngBuf.length) {
      const len = pngBuf.readUInt32BE(offset);
      const type = pngBuf.toString('ascii', offset + 4, offset + 8);
      if (type === 'IHDR') {
        w = pngBuf.readUInt32BE(offset + 8);
        h = pngBuf.readUInt32BE(offset + 12);
      } else if (type === 'IDAT') {
        idats.push(pngBuf.subarray(offset + 8, offset + 8 + len));
      }
      offset += 12 + len;
    }
    if (!idats.length || !w || !h) return null;

    const raw = zlib.inflateSync(Buffer.concat(idats));
    const bpp = 4;
    const rowBytes = w * bpp;
    const rgb = Buffer.alloc(w * h * 3);
    const alpha = Buffer.alloc(w * h);

    const prevRow = Buffer.alloc(rowBytes);
    const curRow = Buffer.alloc(rowBytes);

    let rawOff = 0, rgbOff = 0, alphaOff = 0;

    for (let y = 0; y < h; y++) {
      const filter = raw[rawOff++];
      for (let x = 0; x < rowBytes; x++) {
        let val = raw[rawOff++];
        const left = x >= bpp ? curRow[x - bpp] : 0;
        const up = prevRow[x];
        const upLeft = x >= bpp ? prevRow[x - bpp] : 0;

        if (filter === 1) val = (val + left) & 0xff;
        else if (filter === 2) val = (val + up) & 0xff;
        else if (filter === 3) val = (val + Math.floor((left + up) / 2)) & 0xff;
        else if (filter === 4) {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          let predictor = upLeft;
          if (pa <= pb && pa <= pc) predictor = left;
          else if (pb <= pc) predictor = up;
          val = (val + predictor) & 0xff;
        }
        curRow[x] = val;
      }
      for (let x = 0; x < w; x++) {
        rgb[rgbOff++] = curRow[x * 4];
        rgb[rgbOff++] = curRow[x * 4 + 1];
        rgb[rgbOff++] = curRow[x * 4 + 2];
        alpha[alphaOff++] = curRow[x * 4 + 3];
      }
      curRow.copy(prevRow);
    }

    return {
      width: w,
      height: h,
      rgbCompressed: zlib.deflateSync(rgb),
      alphaCompressed: zlib.deflateSync(alpha)
    };
  } catch (err) {
    console.error('[PNG Parse Error]:', err.message);
    return null;
  }
}

import puppeteer from 'puppeteer-core';

/**
 * Generates an exact A4 PDF document directly from the rendered React quotation component.
 */
export async function generateQuotationPdf(quotation, force = false) {
  const cleanId = String(quotation.quotationNo || quotation.id || 'QT-001').trim().toUpperCase();
  const fileName = `quotation-${cleanId}.pdf`;
  const filePath = path.join(UPLOADS_QUOTATIONS_DIR, fileName);

  if (!force && fs.existsSync(filePath)) {
    return filePath;
  }

  // Render 100% exact PDF directly from the React quotation preview page via Puppeteer
  const browserPath = getBrowserExecutable();
  if (browserPath) {
    let browser;
    try {
      const port = process.env.CLIENT_PORT || 3000;
      const targetUrl = `http://localhost:${port}/quotation/${encodeURIComponent(cleanId)}`;

      browser = await puppeteer.launch({
        executablePath: browserPath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
      await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 15000 });

      // 1. Confirm the quotation container exists
      await page.waitForSelector('#quotation-print-area', { timeout: 10000 });

      // 2. Wait until all web fonts finish loading
      await page.evaluateHandle('document.fonts.ready');

      // 3. Hide non-printable navigation bars so only the quotation sheet is captured
      await page.evaluate(() => {
        const navBar = document.querySelector('.print\\:hidden');
        if (navBar) navBar.style.display = 'none';
        const backdrop = document.querySelector('.backdrop-blur-md');
        if (backdrop) {
          backdrop.style.position = 'static';
          backdrop.style.background = 'white';
          backdrop.style.padding = '0';
        }
      });

      // 4. Generate A4 PDF with exact background graphics
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15px', right: '15px', bottom: '15px', left: '15px' }
      });

      await browser.close();
      fs.writeFileSync(filePath, pdfBuffer);
      return filePath;
    } catch (browserErr) {
      if (browser) {
        try { await browser.close(); } catch (e) {}
      }
      console.warn('[Puppeteer PDF Generation Notice]:', browserErr.message);
    }
  }

  const qNo = cleanId;
  const qDate = formatDate(quotation.quotationDate || new Date().toISOString().split('T')[0]);
  const validDate = formatDate(quotation.validTillDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const custName = escapePdfText(quotation.customer?.name || 'Valued Customer');
  const custPhone = escapePdfText(quotation.customer?.phone || 'Not provided');
  const custAddress = escapePdfText(quotation.customer?.address || 'Tamil Nadu, India');
  const items = quotation.items || [];
  const subtotal = Number(quotation.subtotal || 0).toLocaleString('en-IN');
  const cgst = Math.round(Number(quotation.cgst || 0));
  const sgst = Math.round(Number(quotation.sgst || 0));
  const grandTotal = Number(quotation.grandTotal || 0).toLocaleString('en-IN');
  const hasSeal = Boolean(quotation.hasSeal);
  const statusStr = String(quotation.status || 'DRAFT').toUpperCase();
  const statusLabel = (statusStr === 'APPROVED' || statusStr === 'SENT') ? statusStr : 'DRAFT';

  const logoData = parsePngForPdf(LOGO_PATH);

  let stream = '';

  // 1. FAINT WATERMARK BACKGROUND
  stream += `q\n`;
  stream += `0.906 -0.423 0.423 0.906 80 440 cm\n`;
  stream += `BT\n`;
  stream += `/F2 42 Tf\n`;
  stream += `0.94 0.94 0.96 rg\n`; // Faint light gray
  stream += `0 0 Td\n`;
  stream += `(VIJAI EMBROIDERY) Tj\n`;
  stream += `ET\n`;
  stream += `Q\n`;

  // 2. TOP HEADER (Title, Status Badge, Meta Details, Logo)
  // Left: Title "Quotation"
  stream += `BT\n`;
  stream += `/F2 26 Tf\n`;
  stream += `0.01 0.02 0.09 rg\n`; // Slate 950
  stream += `40 780 Td\n`;
  stream += `(Quotation) Tj\n`;
  stream += `ET\n`;

  // Status Badge Pill next to Title
  if (statusLabel === 'APPROVED' || statusLabel === 'SENT') {
    stream += `0.82 0.98 0.9 rg\n`; // Light green fill (#D1FAE5)
    stream += `0.43 0.9 0.72 RG\n`; // Green border (#6EE7B7)
    stream += `1 w\n`;
    stream += `175 780 65 15 re B\n`;

    stream += `BT\n`;
    stream += `/F2 8 Tf\n`;
    stream += `0.02 0.37 0.27 rg\n`; // Dark green text (#065F46)
    stream += `182 784 Td\n`;
    stream += `(${statusLabel === 'SENT' ? 'SENT' : 'APPROVED'}) Tj\n`;
    stream += `ET\n`;
  } else {
    stream += `0.99 0.95 0.78 rg\n`; // Light amber fill (#FEF3C7)
    stream += `0.98 0.82 0.47 RG\n`;
    stream += `1 w\n`;
    stream += `175 780 50 15 re B\n`;

    stream += `BT\n`;
    stream += `/F2 8 Tf\n`;
    stream += `0.57 0.25 0.05 rg\n`; // Dark amber text (#92400E)
    stream += `184 784 Td\n`;
    stream += `(DRAFT) Tj\n`;
    stream += `ET\n`;
  }

  // Header Metadata Lines
  stream += `BT\n`;
  stream += `/F1 9 Tf\n`;
  stream += `0.39 0.45 0.55 rg\n`; // Slate 500
  stream += `40 758 Td\n`;
  stream += `(Quotation No: ) Tj\n`;
  stream += `/F2 9 Tf\n`;
  stream += `0.06 0.09 0.16 rg\n`; // Slate 900
  stream += `( #${escapePdfText(qNo)}) Tj\n`;
  stream += `ET\n`;

  stream += `BT\n`;
  stream += `/F1 9 Tf\n`;
  stream += `0.39 0.45 0.55 rg\n`;
  stream += `40 745 Td\n`;
  stream += `(Date: ) Tj\n`;
  stream += `/F1 9 Tf\n`;
  stream += `0.12 0.16 0.23 rg\n`;
  stream += `( ${escapePdfText(qDate)}) Tj\n`;
  stream += `ET\n`;

  stream += `BT\n`;
  stream += `/F1 9 Tf\n`;
  stream += `0.39 0.45 0.55 rg\n`;
  stream += `40 732 Td\n`;
  stream += `(Valid Till Date: ) Tj\n`;
  stream += `/F1 9 Tf\n`;
  stream += `0.12 0.16 0.23 rg\n`;
  stream += `( ${escapePdfText(validDate)}) Tj\n`;
  stream += `ET\n`;

  // Right Logo Box
  stream += `1 1 1 rg\n`;
  stream += `0.91 0.84 1 RG\n`; // Border #E9D5FF
  stream += `1 w\n`;
  stream += `495 735 60 60 re B\n`;

  if (logoData) {
    stream += `q 52 0 0 52 499 739 cm /ImgLogo Do Q\n`;
  }

  // 3. TWO EQUAL LAVENDER ROUNDED CARDS (Quotation From & Quotation For)
  // Left Card: Quotation From (X: 40, Y: 642, W: 250, H: 74)
  stream += `0.957 0.937 0.996 rg\n`; // #F4EFFE
  stream += `0.867 0.831 0.973 RG\n`; // #DDD4F8
  stream += `1 w\n`;
  stream += `40 642 250 74 re B\n`;

  stream += `0.867 0.831 0.973 RG\n`;
  stream += `40 700 250 0 re S\n`; // Title separator line

  stream += `BT\n`;
  stream += `0.298 0.114 0.584 rg\n`; // Purple #4C1D95
  stream += `/F2 8.5 Tf\n`;
  stream += `50 704 Td\n`;
  stream += `(QUOTATION FROM) Tj\n`;
  stream += `ET\n`;

  stream += `BT\n`;
  stream += `0.01 0.02 0.09 rg\n`;
  stream += `/F2 9.5 Tf\n`;
  stream += `50 687 Td\n`;
  stream += `(Vijay Embroidery Studio) Tj\n`;
  stream += `0.2 0.25 0.33 rg\n`;
  stream += `/F1 8 Tf\n`;
  stream += `0 -12 Td\n`;
  stream += `(131, Nagaramalai Main Road, Salem - 636016) Tj\n`;
  stream += `0 -11 Td\n`;
  stream += `(GSTIN: 33CXUPN4686G1ZS  |  PAN: CXUPN4686G) Tj\n`;
  stream += `0 -10 Td\n`;
  stream += `(Phone: +91 97904 49627) Tj\n`;
  stream += `ET\n`;

  // Right Card: Quotation For (X: 305, Y: 642, W: 250, H: 74)
  stream += `0.957 0.937 0.996 rg\n`;
  stream += `0.867 0.831 0.973 RG\n`;
  stream += `1 w\n`;
  stream += `305 642 250 74 re B\n`;

  stream += `0.867 0.831 0.973 RG\n`;
  stream += `305 700 250 0 re S\n`;

  stream += `BT\n`;
  stream += `0.298 0.114 0.584 rg\n`;
  stream += `/F2 8.5 Tf\n`;
  stream += `315 704 Td\n`;
  stream += `(QUOTATION FOR) Tj\n`;
  stream += `ET\n`;

  stream += `BT\n`;
  stream += `0.01 0.02 0.09 rg\n`;
  stream += `/F2 9.5 Tf\n`;
  stream += `315 687 Td\n`;
  stream += `(${custName}) Tj\n`;
  stream += `0.22 0.12 0.4 rg\n`;
  stream += `/F2 8 Tf\n`;
  stream += `0 -13 Td\n`;
  stream += `(Phone: ) Tj\n`;
  stream += `0.2 0.25 0.33 rg\n`;
  stream += `/F1 8 Tf\n`;
  stream += `35 0 Td\n`;
  stream += `(${custPhone}) Tj\n`;
  stream += `-35 -11 Td\n`;
  stream += `0.22 0.12 0.4 rg\n`;
  stream += `/F2 8 Tf\n`;
  stream += `(Address: ) Tj\n`;
  stream += `0.2 0.25 0.33 rg\n`;
  stream += `/F1 8 Tf\n`;
  stream += `42 0 Td\n`;
  stream += `(${custAddress.substring(0, 36)}) Tj\n`;
  stream += `ET\n`;

  // 4. COUNTRY / PLACE OF SUPPLY BAR (X: 40, Y: 615, W: 515, H: 20)
  stream += `0.973 0.98 0.988 rg\n`; // #F8FAFC
  stream += `0.886 0.91 0.941 RG\n`; // #E2E8F0
  stream += `1 w\n`;
  stream += `40 615 515 20 re B\n`;

  stream += `BT\n`;
  stream += `0.39 0.45 0.55 rg\n`;
  stream += `/F1 8 Tf\n`;
  stream += `50 621 Td\n`;
  stream += `(Country of Supply: ) Tj\n`;
  stream += `0.06 0.09 0.16 rg\n`;
  stream += `/F2 8 Tf\n`;
  stream += `(India) Tj\n`;
  stream += `ET\n`;

  stream += `BT\n`;
  stream += `0.39 0.45 0.55 rg\n`;
  stream += `/F1 8 Tf\n`;
  stream += `380 621 Td\n`;
  stream += `(Place of Supply: ) Tj\n`;
  stream += `0.06 0.09 0.16 rg\n`;
  stream += `/F2 8 Tf\n`;
  stream += `(Tamil Nadu \(33\)) Tj\n`;
  stream += `ET\n`;

  // 5. ITEMS TABLE
  let curY = 588;
  // Header Row (Deep Emerald #022C22 / #064E3B)
  stream += `0.008 0.173 0.133 rg\n`;
  stream += `40 ${curY} 515 22 re f\n`;

  stream += `BT\n`;
  stream += `1 1 1 rg\n`;
  stream += `/F2 8.5 Tf\n`;
  stream += `48 ${curY + 7} Td\n`;
  stream += `(#) Tj\n`;
  stream += `27 0 Td\n`;
  stream += `(SERVICE DESCRIPTION) Tj\n`;
  stream += `240 0 Td\n`;
  stream += `(QTY) Tj\n`;
  stream += `40 0 Td\n`;
  stream += `(RATE (Rs.)) Tj\n`;
  stream += `65 0 Td\n`;
  stream += `(GST) Tj\n`;
  stream += `40 0 Td\n`;
  stream += `(AMOUNT (Rs.)) Tj\n`;
  stream += `ET\n`;

  curY -= 20;

  // Data Rows
  items.forEach((item, idx) => {
    const itemTotal = (Number(item.qty) || 0) * (Number(item.rate) || 0);
    const desc = escapePdfText(item.description || 'Custom Embroidery Work');
    const rowBg = idx % 2 === 0 ? '1 1 1' : '0.973 0.98 0.988';

    stream += `${rowBg} rg\n`;
    stream += `40 ${curY} 515 20 re f\n`;
    stream += `0.886 0.91 0.941 RG\n`;
    stream += `40 ${curY} 515 20 re S\n`;

    stream += `BT\n`;
    stream += `0.39 0.45 0.55 rg\n`;
    stream += `/F1 8 Tf\n`;
    stream += `50 ${curY + 6} Td\n`;
    stream += `(${idx + 1}) Tj\n`;
    stream += `25 0 Td\n`;
    stream += `0.06 0.09 0.16 rg\n`;
    stream += `/F2 8 Tf\n`;
    stream += `(${desc.substring(0, 46)}) Tj\n`;
    stream += `240 0 Td\n`;
    stream += `/F1 8 Tf\n`;
    stream += `(${item.qty}) Tj\n`;
    stream += `40 0 Td\n`;
    stream += `(Rs. ${Number(item.rate || 0).toLocaleString('en-IN')}) Tj\n`;
    stream += `65 0 Td\n`;
    stream += `0.39 0.45 0.55 rg\n`;
    stream += `(${item.gstRate || 0}%) Tj\n`;
    stream += `0.06 0.09 0.16 rg\n`;
    stream += `/F2 8 Tf\n`;
    stream += `40 0 Td\n`;
    stream += `(Rs. ${itemTotal.toLocaleString('en-IN')}) Tj\n`;
    stream += `ET\n`;

    curY -= 20;
  });

  // 6. CALCULATIONS SUMMARY BOX (Right-aligned)
  curY -= 12;
  const hasTax = cgst > 0 || sgst > 0;
  const boxHeight = hasTax ? 62 : 42;
  const boxY = curY - boxHeight;

  stream += `0.973 0.98 0.988 rg\n`; // #F8FAFC
  stream += `0.886 0.91 0.941 RG\n`; // #E2E8F0
  stream += `1 w\n`;
  stream += `355 ${boxY} 200 ${boxHeight} re B\n`;

  let textY = curY - 14;
  stream += `BT\n`;
  stream += `0.28 0.33 0.41 rg\n`;
  stream += `/F1 8.5 Tf\n`;
  stream += `365 ${textY} Td\n`;
  stream += `(Subtotal: ) Tj\n`;
  stream += `/F2 8.5 Tf\n`;
  stream += `0.06 0.09 0.16 rg\n`;
  stream += `110 0 Td\n`;
  stream += `(Rs. ${subtotal}) Tj\n`;
  stream += `ET\n`;

  if (hasTax) {
    textY -= 12;
    stream += `BT\n`;
    stream += `0.39 0.45 0.55 rg\n`;
    stream += `/F1 8 Tf\n`;
    stream += `365 ${textY} Td\n`;
    stream += `(CGST: ) Tj\n`;
    stream += `/F1 8 Tf\n`;
    stream += `110 0 Td\n`;
    stream += `(Rs. ${cgst.toLocaleString('en-IN')}) Tj\n`;
    stream += `ET\n`;

    textY -= 12;
    stream += `BT\n`;
    stream += `0.39 0.45 0.55 rg\n`;
    stream += `/F1 8 Tf\n`;
    stream += `365 ${textY} Td\n`;
    stream += `(SGST: ) Tj\n`;
    stream += `/F1 8 Tf\n`;
    stream += `110 0 Td\n`;
    stream += `(Rs. ${sgst.toLocaleString('en-IN')}) Tj\n`;
    stream += `ET\n`;
  }

  // Emerald Divider inside summary box
  textY -= 4;
  stream += `0.024 0.373 0.275 RG\n`; // #065F46
  stream += `1.5 w\n`;
  stream += `365 ${textY} 180 0 re S\n`;

  textY -= 12;
  stream += `BT\n`;
  stream += `0.008 0.173 0.133 rg\n`;
  stream += `/F2 9.5 Tf\n`;
  stream += `365 ${textY} Td\n`;
  stream += `(Grand Total:) Tj\n`;
  stream += `/F2 10.5 Tf\n`;
  stream += `0.024 0.373 0.275 rg\n`;
  stream += `85 0 Td\n`;
  stream += `(Rs. ${grandTotal}) Tj\n`;
  stream += `ET\n`;

  // 7. TERMS & CONDITIONS (Bottom Left)
  const bottomY = Math.min(curY - 70, 240);
  stream += `BT\n`;
  stream += `0.2 0.25 0.33 rg\n`;
  stream += `/F2 8 Tf\n`;
  stream += `40 ${bottomY} Td\n`;
  stream += `(TERMS & CONDITIONS:) Tj\n`;
  stream += `/F1 7.5 Tf\n`;
  stream += `0.28 0.33 0.41 rg\n`;
  stream += `0 -11 Td\n`;
  stream += `(1. Quotation valid for 15 days from issue date.) Tj\n`;
  stream += `0 -10 Td\n`;
  stream += `(2. 50% advance payment required to commence computerized design digitizing.) Tj\n`;
  stream += `0 -10 Td\n`;
  stream += `(3. Balance payable upon completion prior to doorstep dispatch.) Tj\n`;
  stream += `0 -10 Td\n`;
  stream += `(4. Doorstep delivery available across all Tamil Nadu districts.) Tj\n`;
  stream += `ET\n`;

  // 8. OFFICIAL STUDIO SEAL & AUTHORISED SIGNATORY (Bottom Right)
  if (hasSeal) {
    const sealX = 475;
    const sealY = bottomY - 15;
    stream += `0.216 0.188 0.639 RG\n`; // Indigo #3730A3
    stream += `1.5 w\n`;
    stream += `${sealX} ${sealY} 34 0 360 arc S\n`;
    stream += `0.8 w\n`;
    stream += `${sealX} ${sealY} 30 0 360 arc S\n`;

    stream += `BT\n`;
    stream += `0.216 0.188 0.639 rg\n`;
    stream += `/F2 6 Tf\n`;
    stream += `${sealX - 25} ${sealY + 10} Td\n`;
    stream += `(VIJAY EMBROIDERY) Tj\n`;
    stream += `/F2 6.5 Tf\n`;
    stream += `3 -9 Td\n`;
    stream += `(OFFICIAL SEAL) Tj\n`;
    stream += `/F1 5.5 Tf\n`;
    stream += `2 -8 Td\n`;
    stream += `(SALEM - TN) Tj\n`;
    stream += `ET\n`;
  }

  // Authorised Signatory Line
  const sigY = bottomY - 45;
  stream += `0.58 0.64 0.72 RG\n`; // #94A3B8
  stream += `0.75 w\n`;
  stream += `395 ${sigY} 160 0 re S\n`;

  stream += `BT\n`;
  stream += `0.06 0.09 0.16 rg\n`;
  stream += `/F2 8 Tf\n`;
  stream += `430 ${sigY - 11} Td\n`;
  stream += `(Authorised Signatory) Tj\n`;
  stream += `/F1 7.5 Tf\n`;
  stream += `0.39 0.45 0.55 rg\n`;
  stream += `-20 -10 Td\n`;
  stream += `(Vijay Embroidery Studio - Salem) Tj\n`;
  stream += `ET\n`;

  // Assemble PDF Objects
  const streamLength = Buffer.byteLength(stream, 'utf-8');

  let pdf = `%PDF-1.4\n`;
  const offsets = [];

  // Object 1: Catalog
  offsets.push(pdf.length);
  pdf += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;

  // Object 2: Pages
  offsets.push(pdf.length);
  pdf += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;

  let nextObjId = 7;
  let logoObjHeader = '';
  let maskObjHeader = '';

  if (logoData) {
    const logoObjId = 7;
    const maskObjId = 8;
    nextObjId = 9;

    logoObjHeader = `${logoObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${logoData.width} /Height ${logoData.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /SMask ${maskObjId} 0 R /Length ${logoData.rgbCompressed.length} >>\nstream\n`;
    maskObjHeader = `${maskObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${logoData.width} /Height ${logoData.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${logoData.alphaCompressed.length} >>\nstream\n`;
  }

  // Object 3: Page (A4 size: 595.28 x 841.89)
  offsets.push(pdf.length);
  const xobjResources = logoData ? `/Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /ImgLogo 7 0 R >> >>` : `/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >>`;
  pdf += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R ${xobjResources} >>\nendobj\n`;

  // Object 4: Contents Stream
  offsets.push(pdf.length);
  pdf += `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}endstream\nendobj\n`;

  // Object 5: Font F1 (Helvetica)
  offsets.push(pdf.length);
  pdf += `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  // Object 6: Font F2 (Helvetica-Bold)
  offsets.push(pdf.length);
  pdf += `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;

  if (logoData) {
    // Object 7: Image RGB XObject
    offsets.push(pdf.length);
    pdf += logoObjHeader;
    pdf = Buffer.concat([Buffer.from(pdf, 'binary'), logoData.rgbCompressed, Buffer.from('\nendstream\nendobj\n', 'binary')]).toString('binary');

    // Object 8: Image Alpha Mask XObject
    offsets.push(pdf.length);
    pdf += maskObjHeader;
    pdf = Buffer.concat([Buffer.from(pdf, 'binary'), logoData.alphaCompressed, Buffer.from('\nendstream\nendobj\n', 'binary')]).toString('binary');
  }

  // Xref table
  const startXref = pdf.length;
  const totalObjs = logoData ? 9 : 7;
  pdf += `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  // Trailer
  pdf += `trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  fs.writeFileSync(filePath, Buffer.from(pdf, 'binary'));
  return filePath;
}
