import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("private studio: five concepts, responsive imagery, privacy boundaries and recovery", async ({
  page,
  request,
}, info) => {
  test.setTimeout(90000);
  for (const [name, width, height] of [
    ["wide", 1680, 1050],
    ["laptop", 1366, 900],
    ["tablet", 820, 1180],
    ["mobile", 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    for (const [id, title] of [
      ["heritage", "Hill Country Heritage"],
      ["organic", "Texas Organic"],
      ["editorial", "Austin Editorial"],
      ["ember", "Hill Country Ember"],
      ["plaid", "Plaid & Copper"],
    ]) {
      await page.goto(`/?concept=${id}`);
      await expect(page.locator(".concept-intro h1")).toHaveText(title);
      await expect(page.locator(".family-scene img")).toBeVisible();
      await expect
        .poll(() =>
          page
            .locator(".family-scene img")
            .evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await expect(page.locator(".outfit-choice")).toHaveCount(6);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.failureSummary),
        })),
      ).toEqual([]);
      await page.screenshot({ path: `.qa/redesign/${name}-${id}.png` });
      if (name === "laptop") {
        for (let i = 0; i < 6; i++) {
          await page.locator(".outfit-choice").nth(i).click();
          await page.locator(".member-study summary").click();
          await expect(page.locator(".member-study img").first()).toBeVisible();
          await expect
            .poll(() =>
              page
                .locator(".member-study img")
                .first()
                .evaluate(
                  (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
                ),
            )
            .toBe(true);
        }
        await page
          .locator(".outfit-board")
          .screenshot({ path: `.qa/redesign/board-${id}.png` });
      }

      if (name === "mobile" && id === "heritage")
        await page.screenshot({
          path: ".qa/redesign/mobile-full.png",
          fullPage: true,
        });
    }
  }
  if (process.env.PRIVATE_REVIEW) {
    expect(
      (await request.get("/.local-reference/family-manifest.json")).status(),
    ).toBe(403);
    expect(
      (await request.get("/__private/family-manifest.json")).status(),
    ).toBe(404);
    expect(
      (
        await request.get("/__private/heritage.webp", {
          headers: { Host: "untrusted.example" },
        })
      ).status(),
    ).toBeGreaterThanOrEqual(400);
    const asset = await request.get("/__private/heritage.webp");
    expect(asset.headers()["cache-control"]).toBe("no-store");
  }
  await page.route("**/images/wardrobe/*.webp", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.getByText("The visualization isn’t available."),
  ).toBeVisible();
  await expect(page.locator(".outfit-choice")).toHaveCount(6);
  void info;
});
