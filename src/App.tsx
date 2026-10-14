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
import {
  Alternative,
  ShoppingRow,
  ClosetRows,
  RetailLink,
  StatusSelect,
} from "./ShoppingPieces";
import {
  money,
  priceLabel,
  readChecklist,
  checklistKey,
  extras,
  statusLabels,
  type Checklist,
  type PieceStatus,
} from "./shopping";
export default function App() {
  const [conceptIndex, setConceptIndex] = useState(() => {
    const id = new URLSearchParams(location.search).get("concept");
    return Math.max(
      0,
      data.concepts.findIndex((c) => c.id === id),
    );
  });
  const [memberIndex, setMemberIndex] = useState(() =>
    Math.max(
      0,
      data.family.indexOf(
        new URLSearchParams(location.search).get("member") || "",
      ),
    ),
  );
  const [shopOpen, setShopOpen] = useState(false);
  const [planFilter, setPlanFilter] = useState("all");
  const [colorIndex, setColorIndex] = useState(0);
  const [compareMember, setCompareMember] = useState(0);
  const [filter, setFilter] = useState("All");
  const [checklist, setChecklist] = useState<Checklist>(readChecklist);
  const checked = data.shopping
    .filter((p) => checklist[p.id] && checklist[p.id] !== "need")
    .map((p) => p.id);
  const [notice, setNotice] = useState("");
  const [resetBackup, setResetBackup] = useState<Checklist | null>(null);
  const [storageError, setStorageError] = useState(false);
  const concept = data.concepts[conceptIndex],
    member = concept.members[memberIndex];
  const saveChecklist = (next: Checklist) => {
    setChecklist(next);
    try {
      localStorage.setItem(checklistKey, JSON.stringify(next));
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
  const setStatus = (id: string, status: PieceStatus) => {
    saveChecklist({ ...checklist, [id]: status });
    setResetBackup(null);
  };
  const chooseMember = (i: number) => {
    setMemberIndex(i);
    const url = new URL(location.href);
    url.searchParams.set("member", data.family[i]);
    history.replaceState(null, "", url);
  };
  const matchingPlan = (id: string) =>
    planFilter === "all" || (checklist[id] || "need") === planFilter;
  const copy = async () => {
    const text = `${concept.title}\n\n${concept.members.map((m) => `${m.name}: ${m.outfit}. ${m.shoes}. ${m.accessories}.`).join("\n\n")}\n\nHERITAGE SHOPPING CHECKLIST\n${data.shopping.map((p) => `${statusLabels[checklist[p.id] || "need"]} — ${p.member}: ${p.item}, ${p.color} — ${p.store} — ${money(p.referencePriceUsd)} (${priceLabel(p)})\n${p.url}`).join("\n\n")}\n\nCLOSET & OPTIONAL FINISHING TOUCHES\n${extras.map((p) => `${statusLabels[checklist[p.id] || "need"]} — ${p.member}: ${p.item}${p.optional ? " (optional)" : ""}`).join("\n")}`;
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
          Wear Family<span>PHOTO OUTFIT SELECTION</span>
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
              Five wardrobe stories for the moments
              <br className="desktop-break" /> you’ll want to keep.
            </p>
            <a className="button button-dark" href="#lookbook">
              Explore the looks <span aria-hidden="true">↗</span>
            </a>
            <div className="hero-footnote">
              <span>05 CONCEPTS</span>
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
          <span className="note-number">01—05</span>
        </div>
        <section id="lookbook" className={`lookbook theme-${concept.id}`}>
          <div className="section-top">
            <span className="eyebrow">01 / THE LOOKBOOK</span>
            <span className="small">Five ways to tell your story</span>
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
              <p className="concept-deck">{concept.deck}</p>
            </div>
            <p className="intro-text">{concept.intro}</p>
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
                onClick={() => chooseMember(i)}
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
              <button
                className="text-button outfit-shop-toggle"
                aria-expanded={shopOpen}
                aria-controls="outfit-shopping"
                onClick={() => setShopOpen(!shopOpen)}
              >
                {shopOpen ? "Close outfit shopping" : "Shop this outfit"}
              </button>
            </div>
          </div>
          <section
            id="outfit-shopping"
            className="outfit-shopping"
            hidden={!shopOpen}
            aria-label={`Shop ${member.name} outfit`}
          >
            <div className="outfit-shop-heading">
              <h3>{member.name}’s pieces</h3>
              <span>{concept.title}</span>
            </div>
            {conceptIndex === 0 ? (
              <>
                <p className="shopping-helper">
                  Shop each piece below. Illustrations show the styling idea;
                  retailer pages show the actual garment. Links open in a new
                  tab.
                </p>
                {data.shopping
                  .filter((p) => p.member === member.name)
                  .map((p) => (
                    <ShoppingRow
                      key={p.id}
                      product={p}
                      checklist={checklist}
                      onStatus={setStatus}
                      illustration
                    />
                  ))}
                <details className="closet-disclosure">
                  <summary>
                    Finish the look · closet pieces & optional accessories
                  </summary>
                  <ClosetRows
                    member={member.name}
                    checklist={checklist}
                    onStatus={setStatus}
                  />
                </details>
                <p className="shopping-helper">
                  Lower-cost route: keep the defining colors and use similar
                  pieces you already own. Mark them “Already own” to remove
                  their estimate.
                </p>
                <a className="text-link" href="#outfit-checklist">
                  Review the whole family’s checklist ↗
                </a>
              </>
            ) : (
              <>
                <p>
                  {member.outfit}. {member.shoes}.
                </p>
                <p className="shopping-helper">
                  This is a styling concept, with no verified retailer selection
                  yet. Start with matching pieces from your closet. The shopping
                  list below is specifically for Hill Country Heritage.
                </p>
                <button
                  className="text-button"
                  onClick={() => chooseConcept(0)}
                >
                  Shop {member.name.toLowerCase()}’s Heritage outfit
                </button>
              </>
            )}
            {storageError && (
              <p className="shopping-helper" role="status">
                Your browser could not save this checklist. Changes last only
                for this visit.
              </p>
            )}
          </section>
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
                  {i >= 3 ? (
                    <MemberPortrait
                      key={`${i}-${compareMember}`}
                      memberIndex={compareMember}
                      conceptIndex={i}
                      name={data.family[compareMember]}
                    />
                  ) : (
                    <Outfit
                      member={c.members[compareMember]}
                      index={compareMember}
                    />
                  )}
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
                    chooseMember(compareMember);
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
                setResetBackup(checklist);
                saveChecklist({});
                setNotice("Checklist reset.");
              }}
              disabled={!Object.values(checklist).some((s) => s !== "need")}
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
                  saveChecklist(resetBackup);
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
                    <RetailLink product={p} className="product-image-link">
                      <Garment kind={p.kind} color={p.illustrationColor} />
                      <span className="image-shop-label">
                        View at {p.store} <span aria-hidden="true">↗</span>
                      </span>
                    </RetailLink>
                    {p.buyFirst && <span className="priority">BUY FIRST</span>}
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
                  <RetailLink product={p} />
                  <StatusSelect
                    id={p.id}
                    name={`${p.member}, ${p.item}`}
                    status={checklist[p.id] || "need"}
                    onStatus={setStatus}
                  />
                  {p.shoppingCaution && (
                    <p className="shopping-caution">{p.shoppingCaution}</p>
                  )}
                  <Alternative product={p} />
                  <p className="rationale">{p.stylistRationale}</p>
                  <span
                    className={`price-status ${p.priceVerified ? "observed" : ""}`}
                  >
                    {priceLabel(p)}
                  </span>
                  <details className="product-verification">
                    <summary>Verification details</summary>
                    <p>{p.verificationNote} Checked October 14, 2026.</p>
                  </details>
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
          <section
            id="outfit-checklist"
            className="outfit-checklist"
            aria-label="Family outfit checklist"
          >
            <div className="checklist-heading">
              <h3>The outfit plan</h3>
              <label>
                Show{" "}
                <select
                  aria-label="Show"
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value="all">All items</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="shopping-helper">
              Hill Country Heritage · 12 clothing selections, six footwear
              checks and optional accessories. Status changes stay in sync
              everywhere.
            </p>
            {data.family.map((name) => {
              const products = data.shopping.filter(
                (p) => p.member === name && matchingPlan(p.id),
              );
              const hasExtras = extras.some(
                (p) => p.member === name && matchingPlan(p.id),
              );
              if (!products.length && !hasExtras) return null;
              return (
                <section
                  className="member-checklist"
                  aria-label={`${name} checklist`}
                  key={name}
                >
                  <h4>{name}</h4>
                  {products.map((p) => (
                    <ShoppingRow
                      key={p.id}
                      product={p}
                      checklist={checklist}
                      onStatus={setStatus}
                    />
                  ))}
                  <ClosetRows
                    member={name}
                    checklist={checklist}
                    onStatus={setStatus}
                    filter={planFilter}
                  />
                </section>
              );
            })}
            {![...data.shopping, ...extras].some((p) => matchingPlan(p.id)) && (
              <p className="checklist-empty" role="status">
                No items in this status. Choose “All items” to see the full
                plan.
              </p>
            )}
            <p className="storage-note">
              {storageError
                ? "Your browser could not save this checklist. It will last only for this visit."
                : "Saved in this browser. Already-owned and purchased clothing is excluded from the remaining estimate."}
            </p>
          </section>
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
                All 12 Heritage clothing references.{" "}
                {data.shopping.filter((p) => p.priceVerified).length} observed
                prices; {data.shopping.filter((p) => !p.priceVerified).length}{" "}
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
            <h3>Heritage closet & optional finishing touches</h3>
            {extras.map((p) => (
              <p key={p.id}>
                {statusLabels[checklist[p.id] || "need"]} — {p.member}: {p.item}
                {p.optional ? " (optional)" : ""}
              </p>
            ))}
            <h3>Heritage shopping checklist</h3>
            {data.shopping.map((p) => (
              <p key={p.id}>
                {statusLabels[checklist[p.id] || "need"]} — {p.member} —{" "}
                {p.item}, {p.color} — {money(p.referencePriceUsd)} (
                {p.priceVerified ? "observed" : "estimate"}) — {p.store} —{" "}
                {p.url}
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
          Wear Family<span>PHOTO OUTFIT SELECTION</span>
        </a>
        <span>A WARDROBE FOR THE MEMORY.</span>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}
