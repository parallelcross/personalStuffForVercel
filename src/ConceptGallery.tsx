import data from "../content/wardrobe.json";
import { FamilyScene } from "./FamilyScene";
import { Arrow } from "./Icons";
export function ConceptGallery({
  conceptIndex,
  colorIndex,
  chooseConcept,
  setColorIndex,
}: {
  conceptIndex: number;
  colorIndex: number;
  chooseConcept: (index: number) => void;
  setColorIndex: (index: number) => void;
}) {
  const concept = data.concepts[conceptIndex];
  return (
    <div className="gallery-stage">
      <nav className="concept-switch" aria-label="Wardrobe concept">
        {data.concepts.map((c, i) => (
          <button
            key={c.id}
            aria-pressed={i === conceptIndex}
            onClick={() => chooseConcept(i)}
          >
            <img
              src={`/images/wardrobe/${c.id}-small.webp`}
              width="90"
              height="72"
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
            />
            <span>
              {c.title}
              {i === 0 && <small>Recommended</small>}
            </span>
          </button>
        ))}
      </nav>
      <FamilyScene key={concept.id} id={concept.id} title={concept.title} />
      <div className="gallery-caption">
        <div className="concept-intro">
          <h1>{concept.title}</h1>
          <p className="concept-deck">{concept.deck}</p>
        </div>
        <p className="concept-description">{concept.intro}</p>
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
              </button>
            ))}
          </div>
          <p className="palette-note" aria-live="polite">
            <span>{concept.palette[colorIndex].name}</span>
            <span className="hex">{concept.palette[colorIndex].hex}</span>
          </p>
        </div>
        <a className="button button-light" href="#outfits">
          See the six outfits <Arrow direction="down" />
        </a>
        <p className="concept-tagline">
          {concept.label} · {concept.tagline}
        </p>
      </div>
    </div>
  );
}
