import { useState } from "react";

export const showVisualizations = true;
export const privatePreview =
  import.meta.env.DEV && import.meta.env.MODE === "private";

/** Only approved, metadata-free generated copies are published. Originals remain local. */
export function FamilyScene({ id, title }: { id: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (!showVisualizations) return null;
  return (
    <figure className="family-scene">
      {failed ? (
        <div className="scene-unavailable" role="status">
          <p>The visualization isn’t available.</p>
          <p>
            The complete outfit board is below. Reload to try the family
            visualization again.
          </p>
        </div>
      ) : (
        <a
          href={`/images/wardrobe/${id}.webp`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open full ${title} visualization in a new tab`}
        >
          <img
            src={`/images/wardrobe/${id}.webp`}
            srcSet={`/images/wardrobe/${id}-small.webp 768w, /images/wardrobe/${id}.webp 1536w`}
            sizes="(max-width: 700px) 100vw, 78vw"
            width="1536"
            height="1024"
            alt={`AI-generated wardrobe visualization of the six family members wearing ${title}.`}
            fetchPriority="high"
            onError={() => setFailed(true)}
          />
        </a>
      )}
      <figcaption>
        <strong>AI-generated wardrobe visualization</strong>
        <span>
          Approximate styling and likeness; not an exact fit preview. Open the
          image to inspect.
        </span>
      </figcaption>
    </figure>
  );
}

export function MemberPortrait({
  memberIndex,
  conceptIndex,
  name,
}: {
  memberIndex: number;
  conceptIndex: number;
  name: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!showVisualizations || failed)
    return (
      <span className="portrait-unavailable">Styling preview unavailable</span>
    );
  return (
    <span className="member-portrait">
      <img
        src={`/images/wardrobe/member-${memberIndex}-small.webp`}
        alt={`AI-generated ${name} outfit visualization`}
        loading="lazy"
        width="768"
        height={memberIndex === 1 ? 549 : 512}
        style={{ transform: `translateX(-${(conceptIndex * 100) / 3}%)` }}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function MemberStudy({
  memberIndex,
  name,
}: {
  memberIndex: number;
  name: string;
}) {
  if (!showVisualizations) return null;
  return (
    <details className="member-study">
      <summary>Compare all three looks for {name.toLowerCase()}</summary>
      <a
        href={`/images/wardrobe/member-${memberIndex}.webp`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full three-look study for ${name} in a new tab`}
      >
        <img
          src={`/images/wardrobe/member-${memberIndex}.webp`}
          alt={`AI-generated three-look study for ${name}: Heritage left, Organic center, Editorial right.`}
          loading="lazy"
          width={memberIndex === 1 ? 1484 : 1536}
          height={memberIndex === 1 ? 1060 : 1024}
        />
      </a>
      <div className="study-labels">
        <span>Hill Country Heritage</span>
        <span>Texas Organic</span>
        <span>Austin Editorial</span>
      </div>
      <p>
        AI-generated wardrobe visualizations. Approximate likeness, proportions
        and styling; not retailer photography or exact garment fit.
      </p>
    </details>
  );
}
