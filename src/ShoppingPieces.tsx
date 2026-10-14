import type { ReactNode } from "react";
import data from "../content/wardrobe.json";
import { Garment } from "./Garment";
import {
  type Product,
  type Checklist,
  type PieceStatus,
  statusLabels,
  money,
  priceLabel,
  extras,
} from "./shopping";
export function RetailLink({
  product: p,
  children,
  className = "product-link",
}: {
  product: Product;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${p.product} at ${p.store} (opens in new tab)`}
    >
      {children || (
        <>
          View at {p.store} <span aria-hidden="true">↗</span>
        </>
      )}
    </a>
  );
}
export function StatusSelect({
  id,
  name,
  status,
  onStatus,
}: {
  id: string;
  name: string;
  status: PieceStatus;
  onStatus: (id: string, status: PieceStatus) => void;
}) {
  return (
    <label className="piece-status">
      <span className="sr-only">Status: {name}</span>
      <select
        aria-label={`Status: ${name}`}
        value={status}
        onChange={(e) => onStatus(id, e.target.value as PieceStatus)}
      >
        {(
          [
            "need",
            "owned",
            "purchased",
            ...(status === "ready" ? ["ready"] : []),
          ] as PieceStatus[]
        ).map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
    </label>
  );
}
export function ShoppingRow({
  product: p,
  checklist,
  onStatus,
  illustration = false,
}: {
  product: Product;
  checklist: Checklist;
  onStatus: (id: string, status: PieceStatus) => void;
  illustration?: boolean;
}) {
  return (
    <div
      className={`shopping-row ${illustration ? "with-illustration" : ""}`}
      data-piece={p.id}
    >
      {illustration && (
        <RetailLink product={p} className="piece-thumbnail">
          <Garment kind={p.kind} color={p.illustrationColor} />
          <span aria-hidden="true">↗</span>
        </RetailLink>
      )}
      <div className="piece-description">
        <strong>{p.item}</strong>
        <span>
          {p.color} · {p.store}
        </span>
        {p.shoppingCaution && (
          <span className="shopping-caution">{p.shoppingCaution}</span>
        )}
        <Alternative product={p} />
      </div>
      <div className="piece-price">
        <strong>{money(p.referencePriceUsd)}</strong>
        <small>{priceLabel(p)}</small>
      </div>
      <div className="piece-actions">
        <RetailLink product={p} />
        <StatusSelect
          id={p.id}
          name={`${p.member}, ${p.item}`}
          status={checklist[p.id] || "need"}
          onStatus={onStatus}
        />
      </div>
    </div>
  );
}
export function ClosetRows({
  member,
  checklist,
  onStatus,
  filter = "all",
}: {
  member: string;
  checklist: Checklist;
  onStatus: (id: string, status: PieceStatus) => void;
  filter?: string;
}) {
  return (
    <>
      {extras
        .filter(
          (p) =>
            p.member === member &&
            (filter === "all" || (checklist[p.id] || "need") === filter),
        )
        .map((p) => (
          <div className="closet-row" key={p.id}>
            <div>
              <strong>{p.item}</strong>
              <span>
                {p.optional ? "Optional finishing touch" : "Footwear"} · Start
                in your closet
              </span>
              <small>
                No retailer selected; extra purchases are outside the clothing
                estimate.
              </small>
            </div>
            <StatusSelect
              id={p.id}
              name={`${p.member}, ${p.item}`}
              status={checklist[p.id] || "need"}
              onStatus={onStatus}
            />
          </div>
        ))}
    </>
  );
}

export function Alternative({ product }: { product: Product }) {
  const alternative = data.alternatives.find((p) => p.forPiece === product.id);
  if (!alternative) return null;
  return (
    <details className="alternative">
      <summary>Optional lower-cost alternative</summary>
      <p>
        <strong>{alternative.product}</strong>
        <br />
        {alternative.color} · {alternative.store} ·{" "}
        {money(alternative.priceUsd)}
        <br />
        <small>Observed Oct 14, 2026</small>
      </p>
      <p>{alternative.note}</p>
      <a
        className="product-link"
        href={alternative.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View alternative ${alternative.product} at ${alternative.store} (opens in new tab)`}
      >
        View at {alternative.store} <span aria-hidden="true">↗</span>
      </a>
      <small>
        Instead of this piece, not an extra purchase. Plan totals use the
        primary selection.
      </small>
    </details>
  );
}
