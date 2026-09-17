import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = new URL("../public/shots/", import.meta.url).pathname.replace(/^\//, "");

const only = process.argv.slice(2);
const targets = [
  { name: "gravity", url: "https://www.gravitycomputers.com/" },
  { name: "winratio", url: "https://winratio.vercel.app/" },
  { name: "north", url: "https://northfocus.app/" },
  { name: "shoebox", url: "https://shoebox-six.vercel.app/" },
  { name: "wilco", url: "https://wilco-rho.vercel.app/" }
];

const W = 1440;
const H = 900;

const run = async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2
  });

  for (const t of targets.filter((x) => !only.length || only.includes(x.name))) {
    const page = await ctx.newPage();
    try {
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(2500);
      // dismiss obvious cookie/overlay banners if present
      await page.evaluate(() => {
        const kill = ["[id*=cookie]", "[class*=cookie]", "[class*=consent]", "[id*=consent]"];
        kill.forEach((s) => document.querySelectorAll(s).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.height < 300 && r.bottom > window.innerHeight - 320) el.remove();
        }));
      });
      await page.addStyleTag({ content: "::-webkit-scrollbar{display:none!important}html,body{scrollbar-width:none!important}" });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}${t.name}.png`, clip: { x: 0, y: 0, width: W, height: H } });
      console.log("OK   ", t.name);
    } catch (e) {
      console.log("FAIL ", t.name, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
};

run();
