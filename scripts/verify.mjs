import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:3456";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const sections = ["#top", "#work", "#products", "#systems", "#about", "#contact"];
for (const sel of sections) {
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  }, sel);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `scripts/v_${sel.replace("#", "")}.png` });
}

const docHeight = await page.evaluate(() => document.body.scrollHeight);
console.log("docHeight", docHeight);
console.log("errors", errors.length ? errors.slice(0, 10) : "none");
await browser.close();
