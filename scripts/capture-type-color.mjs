import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const stage = process.env.CAPTURE_STAGE || "before";
const out = `.qa/type-color/${stage}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, width, height] of [
  ["wide", 1680, 1050],
  ["laptop", 1366, 900],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  await page.goto(
    process.env.TEST_BASE_URL || "http://127.0.0.1:4182/?concept=heritage",
  );
  if (process.env.REPLACE_CSS)
    await page.evaluate(() =>
      document
        .querySelectorAll('link[rel="stylesheet"],style')
        .forEach((el) => el.remove()),
    );
  if (process.env.INJECT_CSS)
    await page.addStyleTag({
      content: readFileSync(process.env.INJECT_CSS, "utf8"),
    });
  await page.evaluate(() => document.fonts.ready);
  await page
    .getByRole("button", { name: "Shop this outfit", exact: true })
    .click();
  await page.locator(".member-study summary").click();
  // Load every lazy image before matching section captures.
  await page.evaluate(async () => {
    for (const im of document.images) im.loading = "eager";
    await Promise.all(
      [...document.images].map((im) => im.decode().catch(() => {})),
    );
  });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: `${out}/${name}-top.png` });
  for (const [part, selector] of [
    ["outfits", ".outfit-board"],
    ["details", ".outfit-detail"],
    ["pieces", "#outfit-shopping"],
    ["study", ".member-study"],
    ["recommendation", ".recommendation"],
    ["compare", "#compare"],
    ["shop", "#shop"],
    ["checklist", "#outfit-checklist"],
    ["plan", "#plan"],
    ["footer", "footer"],
  ]) {
    const loc = page.locator(selector);
    if (await loc.count())
      await loc.screenshot({ path: `${out}/${name}-${part}.png` });
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  const inventory = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter(
        (el) =>
          el.getClientRects().length &&
          [...el.childNodes].some(
            (n) => n.nodeType === 3 && n.textContent.trim(),
          ),
      )
      .map((el) => {
        const c = getComputedStyle(el);
        return {
          tag: el.tagName,
          class: el.className,
          text: el.textContent.trim().slice(0, 100),
          font: c.fontFamily,
          size: c.fontSize,
          weight: c.fontWeight,
          lineHeight: c.lineHeight,
          tracking: c.letterSpacing,
          color: c.color,
          background: c.backgroundColor,
          textTransform: c.textTransform,
        };
      }),
  );
  writeFileSync(
    `${out}/${name}-inventory.json`,
    JSON.stringify(inventory, null, 2),
  );
  const fonts = await page.evaluate(() => ({
    fonts: [...document.fonts].map((f) => ({
      family: f.family,
      weight: f.weight,
      status: f.status,
      style: f.style,
    })),
    requests: performance
      .getEntriesByType("resource")
      .filter((r) => /woff/.test(r.name))
      .map((r) => ({ url: r.name, bytes: r.transferSize })),
  }));
  writeFileSync(`${out}/${name}-fonts.json`, JSON.stringify(fonts, null, 2));
  await page.close();
}
await browser.close();
console.log(`Captured ${stage}`);
