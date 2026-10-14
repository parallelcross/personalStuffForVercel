import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const stage = process.env.CAPTURE_STAGE || "after";
const folder = `.qa/shopping-${stage}`;
mkdirSync(folder, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(
    process.env.TEST_BASE_URL || "http://127.0.0.1:5174/?concept=heritage",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${folder}/${name}-top.png` });
  await page
    .getByRole("button", { name: "View Dad outfit", exact: true })
    .click();
  if (stage === "after")
    await page
      .getByRole("button", { name: "Shop this outfit", exact: true })
      .click();
  await page
    .locator(".outfit-detail")
    .evaluate((el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await page.screenshot({ path: `${folder}/${name}-outfit.png` });
  await page
    .locator(".shop-filters")
    .getByRole("button", { name: "Dad", exact: true })
    .click();
  await page
    .locator(".shopping-grid")
    .screenshot({ path: `${folder}/${name}-products.png` });
  await page
    .locator("#plan")
    .screenshot({ path: `${folder}/${name}-plan.png` });
  await page.close();
}
await browser.close();
