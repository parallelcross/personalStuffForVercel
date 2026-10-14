import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import data from "../../content/wardrobe.json" with { type: "json" };

test("shop an outfit, open retailer, track purchases and review the remaining plan", async ({
  page,
  context,
}) => {
  await page.goto("/?concept=heritage");
  await page
    .getByRole("button", { name: "View Dad outfit", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Shop this outfit", exact: true })
    .click();
  const panel = page.getByRole("region", {
    name: "Shop Dad outfit",
    exact: true,
  });
  await expect(panel.locator(".shopping-row")).toHaveCount(3);
  const jacket = panel.locator('[data-piece="piece-1"]');
  await expect(jacket).toContainText("$62.00");
  // Test our outbound navigation deterministically; live merchant research is separate.
  await context.route("https://www.quince.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>Retailer destination reached</h1>",
    }),
  );
  const popupPromise = context.waitForEvent("page");
  await jacket.locator(".piece-thumbnail").click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(data.shopping[0].url);
  await popup.close();
  await jacket.getByRole("combobox").selectOption("purchased");
  await expect(page.locator(".budget strong")).toHaveText("$525.78");
  await expect(
    page.locator(".product").first().getByRole("combobox"),
  ).toHaveValue("purchased");
  await page
    .getByRole("button", { name: "View Mom outfit", exact: true })
    .click();
  const mom = page.getByRole("region", {
    name: "Shop Mom outfit",
    exact: true,
  });
  await expect(mom.locator(".shopping-row")).toHaveCount(1);
  const momPopup = context.waitForEvent("page");
  await mom.locator(".piece-actions a").click();
  const dress = await momPopup;
  await dress.waitForLoadState();
  expect(dress.url()).toBe(data.shopping[3].url);
  await dress.close();
  await mom.getByRole("combobox").first().selectOption("owned");
  await page.reload();
  await expect(page.locator(".outfit-detail h3")).toHaveText("Mom");
  await expect(page.locator(".budget strong")).toHaveText("$445.88");
  const plan = page.getByRole("region", {
    name: "Family outfit checklist",
    exact: true,
  });
  await expect(plan.locator(".member-checklist")).toHaveCount(6);
  await plan.getByLabel("Show", { exact: true }).selectOption("need");
  await expect(plan.locator(".shopping-row")).toHaveCount(10);
  await plan.getByLabel("Show", { exact: true }).selectOption("purchased");
  await expect(plan.locator(".shopping-row")).toHaveCount(1);
  await plan
    .locator(".shopping-row")
    .getByRole("combobox")
    .selectOption("owned");
  await expect(plan.getByRole("status")).toContainText("No items");
  await plan.getByLabel("Show", { exact: true }).selectOption("all");
  await page
    .getByRole("button", { name: "Reset checklist", exact: true })
    .click();
  await page.getByRole("button", { name: "Undo reset", exact: true }).click();
  await expect(plan.locator('[data-piece="piece-1"] select')).toHaveValue(
    "owned",
  );
});

test("all member purchase links, alternative concepts, keyboard, mobile and a11y", async ({
  page,
}) => {
  await page.goto("/?concept=heritage");
  await page
    .getByRole("button", { name: "Shop this outfit", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  for (const name of data.family) {
    await page
      .getByRole("button", { name: `View ${name} outfit`, exact: true })
      .click();
    const panel = page.locator("#outfit-shopping");
    await expect(panel.locator(".shopping-row")).toHaveCount(
      data.shopping.filter((p) => p.member === name).length,
    );
    for (const p of data.shopping.filter((p) => p.member === name)) {
      for (const link of await panel
        .locator(
          `[data-piece="${p.id}"] > .piece-thumbnail, [data-piece="${p.id}"] > .piece-actions a`,
        )
        .all()) {
        await expect(link).toHaveAttribute("href", p.url);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
  }
  for (const concept of ["Texas Organic", "Austin Editorial"]) {
    await page.getByRole("button", { name: concept, exact: true }).click();
    await expect(page.locator("#outfit-shopping")).toContainText(
      "no verified retailer selection yet",
    );
    await expect(
      page.locator('#outfit-shopping a[href^="https:"]'),
    ).toHaveCount(0);
  }
  await page
    .getByRole("button", {
      name: "Shop youngest son’s Heritage outfit",
      exact: true,
    })
    .click();
  await expect(page.locator(".concept-intro h1")).toHaveText(
    "Hill Country Heritage",
  );
  await page.setViewportSize({ width: 320, height: 720 });
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
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Close outfit shopping", exact: true })
    .click();
  await expect(page.locator("#outfit-shopping")).toBeHidden();
});

test("legacy checklist migration, closet tracking and corrupt storage recovery", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "field-family-checklist-v1",
      JSON.stringify(["piece-1", "not-real"]),
    ),
  );
  await page.goto("/");
  await expect(
    page.locator(".product").first().getByRole("combobox"),
  ).toHaveValue("ready");
  const shoe = page
    .locator("#outfit-checklist")
    .getByLabel("Status: Dad, Dark-brown suede chukkas", { exact: true });
  await shoe.selectOption("owned");
  await page.reload();
  await expect(shoe).toHaveValue("owned");
  await expect(page.locator(".budget strong")).toHaveText("$525.78");
  await page.evaluate(() =>
    localStorage.setItem("wear-family-checklist-v2", "{broken"),
  );
  await page.reload();
  await expect(page.locator(".budget strong")).toHaveText("$587.78");
});
