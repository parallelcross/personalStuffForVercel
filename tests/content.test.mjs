import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const data = JSON.parse(
  readFileSync(new URL("../content/wardrobe.json", import.meta.url)),
);
test("five complete concepts, six outfits and seven valid colors each", () => {
  assert.equal(data.concepts.length, 5);
  for (const c of data.concepts) {
    assert.equal(c.members.length, 6);
    assert.equal(c.palette.length, 7);
    assert.deepEqual(
      c.members.map((m) => m.name),
      data.family,
    );
    for (const m of c.members)
      for (const k of [
        "outfit",
        "shoes",
        "accessories",
        "texture",
        "topColor",
        "bottomColor",
      ])
        assert.ok(m[k]);
    for (const p of c.palette) assert.match(p.hex, /^#[0-9A-Fa-f]{6}$/);
  }
});
test("shopping records have unique IDs, honest verification and safe URLs", () => {
  assert.equal(data.shopping.length, 12);
  assert.equal(new Set(data.shopping.map((p) => p.id)).size, 12);
  for (const p of data.shopping) {
    assert.ok(data.family.includes(p.member));
    assert.ok(p.referencePriceUsd > 0);
    assert.equal(new URL(p.url).protocol, "https:");
    assert.ok(p.verificationNote);
    assert.ok(p.lastCheckedAt);
    assert.equal(p.priceVerified, Boolean(p.lastVerifiedAt));
  }
  assert.equal(
    Math.round(
      data.shopping.reduce((s, p) => s + p.referencePriceUsd, 0) * 100,
    ),
    58778,
  );
});
test("public wardrobe data omits private ages and embedded photographs", () => {
  const text = JSON.stringify(data);
  assert.doesNotMatch(text, /year-old|data:image|base64|token|password/i);
});
test("optional alternatives reference an existing piece and use direct secure retailer URLs", () => {
  for (const alternative of data.alternatives) {
    const original = data.shopping.find((p) => p.id === alternative.forPiece);
    assert.ok(original);
    assert.ok(
      alternative.priceUsd > 0 &&
        alternative.priceUsd < original.referencePriceUsd,
    );
    assert.equal(new URL(alternative.url).protocol, "https:");
    assert.ok(alternative.lastVerifiedAt);
    assert.ok(alternative.note);
  }
});
