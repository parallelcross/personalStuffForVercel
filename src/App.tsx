import { useState } from "react";
import {
  FamilyScene,
  MemberPortrait,
  MemberStudy,
  privatePreview,
  showVisualizations,
} from "./FamilyScene";
import data from "../content/wardrobe.json";
import { Garment, Outfit } from "./Garment";
const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
const descriptions = [
  "A little heritage. A little wild.",
  "Softly spoken, naturally together.",
  "Clean lines. Quiet confidence.",
];
const intros = [
  "Deep wine, worn-in navy, and the warmth of a Texas autumn. A considered mix of texture and tone that lets every personality belong.",
  "Sun-faded clay, washed linen, and sage. An easy, tactile wardrobe with room to move and the landscape woven into every shade.",
  "Ink, ecru, and sculptural silhouettes. A more architectural take on the family portrait, with warm leather keeping it grounded.",
];
const storageKey = "field-family-checklist-v1";
function readChecked(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (id): id is string =>
            typeof id === "string" && data.shopping.some((p) => p.id === id),
        )
      : [];
  } catch {
    return [];
  }
}
export default function App() {
  const [conceptIndex, setConceptIndex] = useState(() => {
    const id = new URLSearchParams(location.search).get("concept");
    return Math.max(
      0,
      data.concepts.findIndex((c) => c.id === id),
    );
  });
  const [memberIndex, setMemberIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [compareMember, setCompareMember] = useState(0);
  const [filter, setFilter] = useState("All");
  const [checked, setChecked] = useState<string[]>(readChecked);
  const [notice, setNotice] = useState("");
  const [resetBackup, setResetBackup] = useState<string[] | null>(null);
  const [storageError, setStorageError] = useState(false);
  const concept = data.concepts[conceptIndex],
    member = concept.members[memberIndex];
  const saveChecked = (next: string[]) => {
    setChecked(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(true);
    }
  };
  const total = data.shopping.reduce((s, p) => s + p.referencePriceUsd, 0);
  const remaining = data.shopping
    .filter((p) => !checked.includes(p.id))
    .reduce((s, p) => s + p.referencePriceUsd, 0);
  const chooseConcept = (i: number) => {
    setConceptIndex(i);
    const url = new URL(location.href);
    url.searchParams.set("concept", data.concepts[i].id);
    history.replaceState(null, "", url);
    setColorIndex(0);
  };
  const toggle = (id: string) =>
    saveChecked(
      checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id],
    );
  const copy = async () => {
    const text = `${concept.title}\n\n${concept.members.map((m) => `${m.name}: ${m.outfit}. ${m.shoes}. ${m.accessories}.`).join("\n\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Outfit list copied.");
    } catch {
      setNotice(
        "Clipboard unavailable. Use Print plan to save your outfit list.",
      );
    }
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="masthead">
        <a className="wordmark" href="#">
          field <i>&</i> family<span>THE WARDROBE JOURNAL</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#lookbook">The looks</a>
          <a href="#compare">Compare</a>
          <a href="#shop">
            Shopping list <span className="nav-count">{checked.length}/12</span>
          </a>
        </nav>
        <span className="edition">FALL EDITION · No. 01</span>
      </header>
      <main
        id="main"
        className={showVisualizations ? "visual-studio" : "public-studio"}
      >
        {privatePreview && (
          <p className="private-banner">
            Local design review · Approved visualizations are public.{" "}
            <a href="/__private/prototypes">Compare design studies</a>
          </p>
        )}
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              THE FALL PORTRAIT EDIT / TEXAS HILL COUNTRY
            </span>
            <h1>
              Six personalities.
              <br />
              One beautiful
              <br />
              <em>frame.</em>
            </h1>
            <p>
              Thoughtfully coordinated. Never too matched.
              <br />
              Three wardrobe stories for the moments
              <br className="desktop-break" /> you’ll want to keep.
            </p>
            <a className="button button-dark" href="#lookbook">
              Explore the looks <span aria-hidden="true">↗</span>
            </a>
            <div className="hero-footnote">
              <span>03 CONCEPTS</span>
              <span>06 INDIVIDUALS</span>
              <span>ONE FAMILY</span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="Illustrated heritage wardrobe mood board"
          >
            <span className="art-corner">A STUDY IN AUTUMN</span>
            <div className="art-paper paper-one">
              <Garment kind="jacket" color="#263247" />
              <span>01 / THE ANCHOR</span>
            </div>
            <div className="art-paper paper-two">
              <Garment kind="dress" color="#793b49" />
              <span>02 / THE MOVEMENT</span>
            </div>
            <div className="art-swatch-strip">
              {data.concepts[0].palette.map((p) => (
                <span key={p.hex} style={{ background: p.hex }} />
              ))}
            </div>
            <div className="art-knit">
              <Garment kind="polo" color="#65705a" />
            </div>
            <span className="art-script">
              a season
              <br />
              to remember
            </span>
            <span className="art-caption">
              ORIGINAL GARMENT STUDIES · NOT PRODUCT PHOTOGRAPHY
            </span>
          </div>
        </section>
        <div className="editor-note">
          <span className="eyebrow">THE ART OF TOGETHER</span>
          <p>
            Shared colors. Different textures.
            <br />
            <em>Everyone still feels like themselves.</em>
          </p>
          <span className="note-number">01—03</span>
        </div>
        <section id="lookbook" className={`lookbook theme-${concept.id}`}>
          <div className="section-top">
            <span className="eyebrow">01 / THE LOOKBOOK</span>
            <span className="small">Three ways to tell your story</span>
          </div>
          <div className="concept-switch" aria-label="Wardrobe concept">
            {data.concepts.map((c, i) => (
              <button
                key={c.id}
                aria-pressed={i === conceptIndex}
                onClick={() => chooseConcept(i)}
              >
                <span className="concept-no">0{i + 1}</span>
                <span>
                  {c.title}
                  {i === 0 && <small>THE RECOMMENDED LOOK</small>}
                </span>
                <span className="concept-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>
          <div className="concept-intro" key={concept.id}>
            <div>
              <span className="eyebrow">
                {concept.label} / {concept.tagline}
              </span>
              {showVisualizations ? (
                <h1>{concept.title}</h1>
              ) : (
                <h2>{concept.title}</h2>
              )}
              <p className="concept-deck">{descriptions[conceptIndex]}</p>
            </div>
            <p className="intro-text">{intros[conceptIndex]}</p>
          </div>
          <div className="scene-spread">
            <FamilyScene
              key={concept.id}
              id={concept.id}
              title={concept.title}
            />
            <div className="palette-area">
              <div
                className="palette"
                aria-label={`${concept.title} color palette`}
              >
                {concept.palette.map((p, i) => (
                  <button
                    key={p.hex}
                    aria-label={`${p.name}, ${p.hex}`}
                    aria-pressed={colorIndex === i}
                    onClick={() => setColorIndex(i)}
                  >
                    <span className="swatch" style={{ background: p.hex }}>
                      {colorIndex === i && <span className="swatch-dot" />}
                    </span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
              <p className="palette-note" aria-live="polite">
                <span>THE PALETTE</span> {concept.palette[colorIndex].name}{" "}
                <span className="hex">{concept.palette[colorIndex].hex}</span>
                <small>Tap a shade to explore</small>
              </p>
            </div>
          </div>
          <div className="board-heading" id="outfits">
            <h3>The outfit plan.</h3>
            <span>
              SELECT AN OUTFIT FOR THE DETAILS <span aria-hidden="true">↓</span>
            </span>
          </div>
          <div className="outfit-board">
            {concept.members.map((m, i) => (
              <button
                key={m.name}
                className={`outfit-choice ${memberIndex === i ? "selected" : ""}`}
                onClick={() => setMemberIndex(i)}
                aria-pressed={memberIndex === i}
                aria-label={`View ${m.name} outfit`}
              >
                <span className="outfit-index">0{i + 1}</span>
                {showVisualizations ? (
                  <MemberPortrait
                    memberIndex={i}
                    conceptIndex={conceptIndex}
                    name={m.name}
                  />
                ) : (
                  <Outfit member={m} index={i} />
                )}
                <span className="outfit-name">
                  {m.name}
                  <span aria-hidden="true">
                    {memberIndex === i ? "−" : "+"}
                  </span>
                </span>
                <span className="outfit-texture">{m.texture}</span>
              </button>
            ))}
          </div>
          <p className="illustration-note">
            {showVisualizations
              ? "AI-generated individual styling studies; likeness, proportions and garment details are approximate."
              : "Illustrated styling concepts; silhouettes and colors are approximate."}
          </p>
          <div className="outfit-detail" aria-live="polite">
            <div>
              <span className="eyebrow">THE DETAILS / 0{memberIndex + 1}</span>
              <h3>{member.name}</h3>
              <div className="detail-colors">
                <span style={{ background: member.topColor }} />
                <span style={{ background: member.bottomColor }} />
              </div>
            </div>
            <div>
              <span className="eyebrow">THE OUTFIT</span>
              <p>{member.outfit}</p>
            </div>
            <div>
              <span className="eyebrow">THE FINISHING TOUCHES</span>
              <p>
                {member.shoes}
                <br />
                <span className="muted">
                  {member.accessories === "None"
                    ? "Keep accessories minimal."
                    : member.accessories}
                </span>
              </p>
            </div>
            <div>
              <span className="eyebrow">TEXTURE STORY</span>
              <p>{member.texture}</p>
              {conceptIndex === 0 ? (
                <a
                  className="text-link"
                  href="#shop"
                  onClick={() => setFilter(member.name)}
                >
                  Shop {member.name.toLowerCase()}’s pieces ↗
                </a>
              ) : (
                <span className="small">
                  Style from your closet; retailer selections are curated for
                  Heritage.
                </span>
              )}
            </div>
          </div>
          <MemberStudy
            key={memberIndex}
            memberIndex={memberIndex}
            name={member.name}
          />
          <div className="styling-notes">
            <div>
              <span className="eyebrow">WHY IT WORKS</span>
              <p>{concept.why}</p>
            </div>
            <div>
              <span className="eyebrow">PICTURE IT HERE</span>
              <p>{concept.location}.</p>
            </div>
            <div>
              <span className="eyebrow">THE MATERIAL MIX</span>
              <p>{concept.textures.join(" · ")}</p>
            </div>
          </div>
        </section>
        <section className="recommendation">
          <div className="recommendation-seal" aria-hidden="true">
            F<span>&</span>F
          </div>
          <div>
            <span className="eyebrow">OUR CONSIDERED CHOICE</span>
            <h2>Heritage, with heart.</h2>
            <p>
              Hill Country Heritage brings the strongest balance to a group of
              six. Navy and wine anchor the parents; the children carry lighter
              tones and earthy accents through the frame.
            </p>
            <p className="rec-small">
              One denim bottom. A rhythm of rich and light. Texture that catches
              the golden-hour glow. Coordinated, without losing anyone’s
              individuality.
            </p>
            <a
              href="#lookbook"
              className="text-link"
              onClick={() => chooseConcept(0)}
            >
              Return to the recommended look ↗
            </a>
          </div>
          <div className="rec-palette">
            {data.concepts[0].palette.slice(0, 4).map((p) => (
              <span key={p.hex} style={{ background: p.hex }} />
            ))}
          </div>
        </section>
        <section id="compare" className="compare section-pad">
          <div className="section-top">
            <span className="eyebrow">02 / FIND YOUR FEELING</span>
            <label className="compare-select">
              Compare outfits for{" "}
              <select
                value={compareMember}
                onChange={(e) => setCompareMember(Number(e.target.value))}
              >
                {data.family.map((n, i) => (
                  <option key={n} value={i}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <h2>
            Same family.
            <br />
            <em>A different point of view.</em>
          </h2>
          <div className="comparison-grid">
            {data.concepts.map((c, i) => (
              <article className={`comparison theme-${c.id}`} key={c.id}>
                <div className="compare-art">
                  <Outfit
                    member={c.members[compareMember]}
                    index={compareMember}
                  />
                  <span className="compare-number">0{i + 1}</span>
                </div>
                <div className="compare-palette">
                  {c.palette.map((p) => (
                    <span
                      key={p.hex}
                      style={{ background: p.hex }}
                      title={p.name}
                    />
                  ))}
                </div>
                <span className="eyebrow">{c.label}</span>
                <h3>{c.title}</h3>
                <p>{c.members[compareMember].outfit}.</p>
                <a
                  href="#lookbook"
                  className="text-link"
                  onClick={() => {
                    chooseConcept(i);
                    setMemberIndex(compareMember);
                  }}
                >
                  Explore this story ↗
                </a>
              </article>
            ))}
          </div>
        </section>
        <section id="shop" className="shop section-pad">
          <div className="section-top">
            <span className="eyebrow">03 / THE SHOPPING EDIT</span>
            <span className="small">HILL COUNTRY HERITAGE</span>
          </div>
          <div className="shop-heading">
            <div>
              <h2>
                Fewer guesses.
                <br />
                <em>Better pieces.</em>
              </h2>
              <p>
                Twelve considered starting points for the recommended look.
                <br />
                Check off what you’ve bought—or already have.
              </p>
            </div>
            <div className="budget" aria-live="polite">
              <span className="eyebrow">REMAINING CLOTHING ESTIMATE</span>
              <strong>{money(remaining)}</strong>
              <span>
                {checked.length} of 12 pieces ready · {money(total)} full plan
              </span>
              <progress
                value={checked.length}
                max={12}
                aria-label="Shopping checklist completion"
              />
              <small>Before tax, shipping, shoes & accessories</small>
            </div>
          </div>
          <details className="verification">
            <summary>
              About prices, availability & illustrations{" "}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{data.priceDisclaimer}</p>
            <p>
              Research date: October 14, 2026. “Price observed” means the
              retailer page supplied that price, not that every size is
              available. Each item includes its verification limits. All garment
              imagery is original illustration; no retailer photography is
              reproduced.
            </p>
          </details>
          <div className="shop-toolbar">
            <div className="shop-filters" aria-label="Filter shopping list">
              {["All", "Buy first", ...data.family].map((n) => (
                <button
                  key={n}
                  aria-pressed={filter === n}
                  onClick={() => setFilter(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              className="text-button"
              onClick={() => {
                setResetBackup(checked);
                saveChecked([]);
                setNotice("Checklist reset.");
              }}
              disabled={checked.length === 0}
            >
              Reset checklist
            </button>
          </div>
          {resetBackup && (
            <p className="reset-undo">
              Checklist cleared.{" "}
              <button
                className="text-button"
                onClick={() => {
                  saveChecked(resetBackup);
                  setResetBackup(null);
                  setNotice("Checklist restored.");
                }}
              >
                Undo reset
              </button>
            </p>
          )}
          <div className="shopping-grid">
            {data.shopping
              .filter(
                (p) =>
                  filter === "All" ||
                  p.member === filter ||
                  (filter === "Buy first" && p.buyFirst),
              )
              .map((p) => (
                <article
                  className={`product ${checked.includes(p.id) ? "is-ready" : ""}`}
                  key={p.id}
                >
                  <div className="product-image">
                    <span className="product-person">{p.member}</span>
                    <Garment kind={p.kind} color={p.illustrationColor} />
                    {p.buyFirst && <span className="priority">BUY FIRST</span>}
                    <label className="check-control">
                      <input
                        type="checkbox"
                        aria-label={`Ready: ${p.member}, ${p.item}`}
                        checked={checked.includes(p.id)}
                        onChange={() => toggle(p.id)}
                      />
                      <span>
                        {checked.includes(p.id) ? "Ready" : "Mark ready"}
                        <span className="sr-only">
                          : {p.member}, {p.item}
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="product-title">
                    <span className="eyebrow">{p.store}</span>
                    <span>{money(p.referencePriceUsd)}</span>
                  </div>
                  <h3>{p.item}</h3>
                  <p className="product-name">{p.product}</p>
                  <p className="product-color">
                    <span style={{ background: p.illustrationColor }} />
                    {p.color}
                  </p>
                  <p className="rationale">{p.stylistRationale}</p>
                  <span
                    className={`price-status ${p.priceVerified ? "observed" : ""}`}
                  >
                    {p.priceVerified
                      ? "Price observed · Oct 14, 2026"
                      : "Reference estimate · confirm price"}
                  </span>
                  <details className="product-verification">
                    <summary>Verification details</summary>
                    <p>{p.verificationNote} Checked October 14, 2026.</p>
                  </details>
                  <a
                    className="product-link"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${p.product} at ${p.store} (opens in new tab)`}
                  >
                    {p.linkStatus === "search-only"
                      ? "Check retailer listing"
                      : "View at " + p.store}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
          </div>
          <p className="storage-note">
            {storageError
              ? "Your browser could not save this checklist. It will last only for this visit."
              : "Your checklist stays in this browser. No account, no tracking."}
          </p>
        </section>
        <section id="plan" className="plan section-pad">
          <div className="section-top">
            <span className="eyebrow">04 / BEFORE THE CAMERA</span>
            <div className="plan-actions">
              <button className="text-button" onClick={copy}>
                Copy outfit list ↗
              </button>
              <button className="text-button" onClick={() => window.print()}>
                Print plan ↗
              </button>
            </div>
          </div>
          <h2>
            A little preparation.
            <br />
            <em>A lot more presence.</em>
          </h2>
          <div className="plan-columns">
            <article>
              <span className="plan-number">01</span>
              <h3>Buy the anchors first.</h3>
              <p>
                The wine dress and navy jacket set the tone. Then the cream
                blouse, denim skirt, green sweater polo, and brick Henley. Match
                the remaining pieces to these in daylight.
              </p>
              <span className="small">PRIORITIZE FIT, THEN COLOR</span>
            </article>
            <article>
              <span className="plan-number">02</span>
              <h3>Start in your closets.</h3>
              <p>
                Brown and cognac shoes. Clean off-white sneakers. Simple belts
                and gold earrings. Stone or olive trousers that already fit.
                Every piece you own brings the estimate down.
              </p>
              <span className="small">LESS TO BUY, MORE TO WEAR AGAIN</span>
            </article>
            <article>
              <span className="plan-number">03</span>
              <h3>Let the setting do its part.</h3>
              <p>
                Golden grass, pale limestone, and mature oaks. Aim for golden
                hour. Lay everything together before the session, steam the
                layers, and choose shoes you can walk in.
              </p>
              <span className="small">TEXTURE OVER LOGOS. EASE OVER FUSS.</span>
            </article>
          </div>
          <div className="cost-options">
            <h3>Total estimated cost</h3>
            <div>
              <strong>{money(total)}</strong>
              <p>
                All 12 Heritage clothing references. Three observed prices; nine
                estimates.
              </p>
            </div>
            <div>
              <strong>
                {money(
                  data.shopping
                    .filter((p) => p.buyFirst)
                    .reduce((sum, p) => sum + p.referencePriceUsd, 0),
                )}
              </strong>
              <p>
                Buy only the six defining pieces. Assumes the other six clothing
                pieces, shoes and accessories come from your closets. No
                replacement purchases included.
              </p>
            </div>
            <p>
              Planning totals in USD, reviewed October 14, 2026. Tax and
              shipping excluded. Confirm every size, color and price with the
              retailer.
            </p>
          </div>
          <div className="print-outfits">
            <h3>{concept.title} · The outfit plan</h3>
            {concept.members.map((m) => (
              <p key={m.name}>
                <strong>{m.name}:</strong> {m.outfit}. {m.shoes}.{" "}
                {m.accessories}.
              </p>
            ))}
            <h3>Heritage shopping checklist</h3>
            {data.shopping.map((p) => (
              <p key={p.id}>
                {checked.includes(p.id) ? "☑" : "☐"} {p.member} — {p.item},{" "}
                {p.color} — {money(p.referencePriceUsd)} (
                {p.priceVerified ? "observed" : "estimate"})
              </p>
            ))}
          </div>
          <p className="notice" role="status">
            {notice}
          </p>
        </section>
      </main>
      <footer>
        <a href="#" className="wordmark">
          field <i>&</i> family
        </a>
        <span>A WARDROBE FOR THE MEMORY.</span>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}
