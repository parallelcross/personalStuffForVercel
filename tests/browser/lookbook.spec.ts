import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("complete lookbook, interactions, persistence, accessibility and assets", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().includes("127.0.0.1"))
      failed.push(r.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".concept-intro h1")).toHaveText(
    "Hill Country Heritage",
  );
  for (const title of [
    "Hill Country Heritage",
    "Texas Organic",
    "Austin Editorial",
    "Hill Country Ember",
    "Plaid & Copper",
  ]) {
    await page.getByRole("button", { name: new RegExp(title) }).click();
    await expect(page.locator(".concept-intro h1")).toHaveText(title);
    await expect(page.locator(".outfit-choice")).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await page.locator(".outfit-choice").nth(i).click();
      await expect(page.locator(".outfit-detail h3")).toHaveText(
        ["Dad", "Mom", "Eldest son", "Daughter", "Middle son", "Youngest son"][
          i
        ],
      );
      await expect(page.locator(".outfit-detail")).not.toBeEmpty();
    }
    await page.locator(".palette button").nth(3).click();
    await expect(page.locator(".palette button").nth(3)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
  await page.getByRole("button", { name: /Hill Country Heritage/ }).click();
  await page.locator(".outfit-choice").first().click();
  await page.locator(".compare-select select").selectOption("3");
  await expect(page.locator(".comparison")).toHaveCount(5);
  await page.getByRole("button", { name: "Buy first", exact: true }).click();
  await expect(page.locator(".product")).toHaveCount(6);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".product")).toHaveCount(12);
  await expect(page.locator(".budget strong")).toHaveText("$587.78");
  await page
    .locator(".product .piece-status select")
    .first()
    .selectOption("purchased");
  await expect(page.locator(".budget strong")).toHaveText("$525.78");
  await page.reload();
  await expect(
    page.locator(".product .piece-status select").first(),
  ).toHaveValue("purchased");
  await page.getByRole("button", { name: "Mom", exact: true }).click();
  await expect(page.locator(".product")).toHaveCount(1);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("button", { name: "Reset checklist" }).click();
  await expect(page.locator(".budget strong")).toHaveText("$587.78");
  await page.getByRole("button", { name: "Undo reset", exact: true }).click();
  await expect(page.locator(".budget strong")).toHaveText("$525.78");
  await page
    .getByRole("button", { name: "Reset checklist", exact: true })
    .click();
  for (const link of await page.locator(".product-link").all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await page.keyboard.press("Control+Home");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `.qa/${testInfo.project.name}-full.png`,
    fullPage: true,
  });
  await page
    .locator("#lookbook")
    .screenshot({ path: `.qa/${testInfo.project.name}-lookbook.png` });
  await page
    .locator("#shop")
    .screenshot({ path: `.qa/${testInfo.project.name}-shop.png` });
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
test("keyboard navigation, reduced motion, narrow layout and print", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: /Texas Organic/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".concept-intro h1")).toHaveText("Texas Organic");
  expect(
    await page
      .locator(".concept-intro")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.setViewportSize({ width: 320, height: 720 });
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-outfits")).toBeVisible();
  await expect(page.locator(".print-outfits")).toContainText("Texas Organic");
  await expect(page.locator(".print-outfits")).toContainText(
    "Heritage shopping checklist",
  );
});
test("storage failure preserves usable checklist", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage disabled");
    };
  });
  await page.goto("/");
  await page
    .locator(".product .piece-status select")
    .first()
    .selectOption("purchased");
  await expect(page.locator(".budget strong")).toHaveText("$525.78");
  await expect(page.locator("#shop .storage-note")).toContainText(
    "could not save",
  );
});
