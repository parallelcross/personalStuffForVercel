import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
mkdirSync(".qa", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(process.env.TEST_BASE_URL || "http://127.0.0.1:5173");
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `.qa/${name}-hero.png` });
  await page
    .locator("#lookbook")
    .screenshot({ path: `.qa/${name}-lookbook.png` });
  await page.locator("#shop").screenshot({ path: `.qa/${name}-shop.png` });
}
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(
  `<html><head><style>body{margin:0;background:#f4f0e7;color:#28352e;padding:65px 80px;font-family:Georgia}small{font:14px sans-serif;letter-spacing:4px}h1{font-size:85px;font-weight:normal;line-height:1.05;margin:45px 0 20px;letter-spacing:-3px}i{color:#793b49}p{font:18px sans-serif;margin-top:25px}.palette{display:flex;width:480px;height:50px;margin-top:40px}.palette span{flex:1}aside{position:absolute;right:90px;top:230px;font-size:110px;border:1px solid #b0ad99;border-radius:50%;width:200px;height:200px;text-align:center;line-height:200px}</style></head><body><small>FIELD & FAMILY / THE FALL WARDROBE EDIT</small><h1>Six personalities.<br/>One beautiful <i>frame.</i></h1><p>Three wardrobe stories. One family.</p><div class="palette">${["#263247", "#f0e5d4", "#65705a", "#793b49", "#9a5945", "#40586a", "#b99873"].map((c) => `<span style="background:${c}"></span>`).join("")}</div><aside><i>f</i></aside></body></html>`,
);
await page.screenshot({ path: "public/social.png" });
await browser.close();
