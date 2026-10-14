import { test, expect } from "@playwright/test";
test("new concepts deep-link, show all six correct portraits and retain honest shopping", async ({
  page,
}) => {
  for (const [id, title, offset] of [
    ["ember", "Hill Country Ember", "0%"],
    ["plaid", "Plaid & Copper", "-50%"],
  ]) {
    await page.goto(`/?concept=${id}&member=Daughter`);
    await expect(page.locator(".concept-intro h1")).toHaveText(title);
    await expect(page.locator(".concept-switch button")).toHaveCount(5);
    await expect(page.locator(".outfit-detail h3")).toHaveText("Daughter");
    for (let i = 0; i < 6; i++) {
      const choice = page.locator(".outfit-choice").nth(i);
      await choice.scrollIntoViewIfNeeded();
      const img = choice.locator("img");
      await expect(img).toHaveAttribute(
        "src",
        `/images/wardrobe/autumn-member-${i}-small.webp`,
      );
      await expect(img).toHaveAttribute(
        "style",
        new RegExp(`translateX\\(${offset.replace("%", "%")}\\)`),
      );
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page
      .getByRole("button", { name: "Shop this outfit", exact: true })
      .click();
    await expect(page.locator("#outfit-shopping")).toContainText(
      "no verified retailer selection yet",
    );
    await expect(
      page.locator('#outfit-shopping a[href^="https:"]'),
    ).toHaveCount(0);
    await page
      .getByText("Compare all five looks for daughter", { exact: true })
      .click();
    const additional = page.locator(".autumn-study img");
    await additional.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        additional.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(page.locator(".comparison")).toHaveCount(5);
  }
});
