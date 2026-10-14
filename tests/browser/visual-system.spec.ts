import { test, expect } from "@playwright/test";

// Regression coverage for contrast lost when interacting with dark surfaces.
function contrast(a: string, b: string) {
  const luminance = (color: string) => {
    const rgb = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((n) => {
        const v = n / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("recommendation action remains legible on hover and keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const action = page.locator(".recommendation .text-link");
  const surface = await page
    .locator(".recommendation")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await action.hover();
  expect(
    contrast(
      await action.evaluate((el) => getComputedStyle(el).color),
      surface,
    ),
  ).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press("Tab");
  await action.focus();
  const focus = await action.evaluate((el) => ({
    visible: el.matches(":focus-visible"),
    color: getComputedStyle(el).outlineColor,
    width: parseFloat(getComputedStyle(el).outlineWidth),
  }));
  expect(focus.visible).toBe(true);
  expect(focus.width).toBeGreaterThanOrEqual(2);
  expect(contrast(focus.color, surface)).toBeGreaterThanOrEqual(3);
});

test("shopping fields have discernible boundaries on both paper surfaces", async ({
  page,
}) => {
  await page.goto("/");
  for (const selector of [
    ".compare-select select",
    ".product .piece-status select",
    ".checklist-heading select",
  ]) {
    const colors = await page
      .locator(selector)
      .first()
      .evaluate((el) => {
        let parent: Element | null = el.parentElement;
        while (
          parent &&
          getComputedStyle(parent).backgroundColor === "rgba(0, 0, 0, 0)"
        )
          parent = parent.parentElement;
        const style = getComputedStyle(el);
        return {
          border: style.borderBottomColor,
          fill: style.backgroundColor,
          outside: parent
            ? getComputedStyle(parent).backgroundColor
            : "rgb(250, 248, 243)",
        };
      });
    expect(contrast(colors.border, colors.fill)).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.border, colors.outside)).toBeGreaterThanOrEqual(3);
  }
});
