import { Garment } from "./Garment";
import { Alternative, RetailLink, StatusSelect } from "./ShoppingPieces";
import {
  money,
  priceLabel,
  type Checklist,
  type PieceStatus,
  type Product,
} from "./shopping";
import { Arrow } from "./Icons";
export function ProductEntry({
  product: p,
  checklist,
  onStatus,
}: {
  product: Product;
  checklist: Checklist;
  onStatus: (id: string, status: PieceStatus) => void;
}) {
  const ready = checklist[p.id] && checklist[p.id] !== "need";
  return (
    <article className={`product ${ready ? "is-ready" : ""}`}>
      <div className="product-image">
        <RetailLink product={p} className="product-image-link">
          <Garment kind={p.kind} color={p.illustrationColor} />
          <span className="image-shop-label">
            View piece <Arrow direction="external" />
          </span>
        </RetailLink>
        <small>Styling illustration</small>
      </div>
      <div className="product-info">
        <div className="product-title">
          <span>
            {p.member} · {p.store}
          </span>
          {p.buyFirst && <span className="priority">Buy first</span>}
        </div>
        <h3>{p.item}</h3>
        <p className="product-name">{p.product}</p>
        <p className="product-color">
          <span style={{ background: p.illustrationColor }} />
          {p.color}
        </p>
        <div className="product-price">
          <strong>{money(p.referencePriceUsd)}</strong>
          <span className={`price-status ${p.priceVerified ? "observed" : ""}`}>
            {priceLabel(p)}
          </span>
        </div>
        <div className="product-actions">
          <RetailLink product={p} />
          <StatusSelect
            id={p.id}
            name={`${p.member}, ${p.item}`}
            status={checklist[p.id] || "need"}
            onStatus={onStatus}
          />
        </div>
        {p.shoppingCaution && (
          <p className="shopping-caution">{p.shoppingCaution}</p>
        )}
        <Alternative product={p} />
        <details className="product-verification">
          <summary>Why this piece & verification</summary>
          <p className="rationale">{p.stylistRationale}</p>
          <p>{p.verificationNote} Checked October 14, 2026.</p>
        </details>
      </div>
    </article>
  );
}
