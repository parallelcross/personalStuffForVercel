import data from "../content/wardrobe.json";
export type Product = (typeof data.shopping)[number];
export type PieceStatus = "need" | "owned" | "purchased" | "ready";
export type Checklist = Record<string, PieceStatus>;
export const statusLabels: Record<PieceStatus, string> = {
  need: "Need to buy",
  owned: "Already own",
  purchased: "Purchased",
  ready: "Ready (saved earlier)",
};
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
export const checklistKey = "wear-family-checklist-v2";
export const extras = data.concepts[0].members.flatMap((m, i) => [
  { id: `shoes-${i}`, member: m.name, item: m.shoes, optional: false },
  ...(m.accessories === "None"
    ? []
    : [
        {
          id: `accessories-${i}`,
          member: m.name,
          item: m.accessories,
          optional: true,
        },
      ]),
]);
const validIds = new Set([...data.shopping, ...extras].map((p) => p.id));
export function readChecklist(): Checklist {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(checklistKey) || "null",
    );
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      return Object.fromEntries(
        Object.entries(saved).filter(
          ([id, status]) =>
            validIds.has(id) &&
            ["need", "owned", "purchased", "ready"].includes(status),
        ),
      );
    }
    // Preserve old ready checks without guessing whether they were owned or bought.
    const legacy: unknown = JSON.parse(
      localStorage.getItem("field-family-checklist-v1") || "[]",
    );
    return Array.isArray(legacy)
      ? Object.fromEntries(
          legacy
            .filter((id) => typeof id === "string" && validIds.has(id))
            .map((id) => [id, "ready"]),
        )
      : {};
  } catch {
    return {};
  }
}
export function priceLabel(p: Product) {
  return p.priceVerified && p.lastVerifiedAt
    ? `Observed ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(p.lastVerifiedAt))}`
    : "Estimate · confirm price";
}
