---
name: "Wear Family Photo Outfit Selection"
description: "A deep olive photographic gallery with a pale, practical wardrobe ledger."
colors:
  stage: "#232b26"
  stage-surface: "#2d3830"
  highlight: "#e0e4bf"
  accent: "#3b513f"
  accent-hover: "#26392a"
  wine: "#4c252d"
  attention: "#80412f"
  paper: "#f7f5ee"
  surface: "#eae8df"
  ink: "#252e27"
  muted: "#5c645b"
  control-border: "#797e73"
  line: "#c7cabf"
  inverse: "#f7f5ee"
  inverse-muted: "#c5cec3"
  inverse-border: "#899789"
typography:
  display:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.4rem, 3.5vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.5rem, 4.2vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "1.6rem"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  product-title:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "1.7rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  member-name:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.8vw, 1.7rem)"
    fontWeight: 400
    lineHeight: 1.3
  deck:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  detail:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  control:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  chapter:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.35
  budget:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.75rem, 5vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.03em"
rounded:
  square: "0"
  round: "50%"
spacing:
  compact: "8px"
  small: "12px"
  item: "18px"
  group: "24px"
  wide: "32px"
  spread: "48px"
  gutter: "clamp(20px, 3.4vw, 64px)"
  section: "clamp(56px, 6.5vw, 104px)"
components:
  button-light:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.stage}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 20px"
  button-light-hover:
    backgroundColor: "{colors.inverse}"
    textColor: "{colors.stage}"
  button-dark:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 20px"
  button-dark-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.paper}"
  text-action:
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "8px 0"
  status-select:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "9px 28px 9px 12px"
  concept-navigation:
    textColor: "{colors.inverse-muted}"
    typography: "{typography.chapter}"
    rounded: "{rounded.square}"
    padding: "16px 0"
  concept-navigation-selected:
    textColor: "{colors.inverse}"
  palette-choice:
    rounded: "{rounded.round}"
    size: "27px"
  shopping-filter:
    textColor: "{colors.ink}"
    padding: "10px 0"
    rounded: "{rounded.square}"
  product-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "30px 0"
  disclosure:
    padding: "12px 0"
    rounded: "{rounded.square}"
---

# Design System: Wear Family Photo Outfit Selection

## Overview

**Creative North Star: "The wardrobe gallery"**

The family photograph is the exhibit. Deep olive walls, warm white lettering and high-contrast Bodoni titles create an intimate photographic gallery; restrained Source Sans 3 keeps choosing and shopping clear. The clothing supplies the changing color story while the interface remains consistent across all five wardrobes.

The gallery opens into a rich wine recommendation and pale shopping paper. Open rows, ruled boundaries and square native controls make practical information feel like part of the editorial composition. Complete family framing and honest image captions are essential to that trust.

**Key Characteristics:**

- A dark photographic stage with a pale, open shopping ledger.
- Expressive serif titles paired with clear sans-serif utility text.
- Visible chapter choices, six individual studies and explicit selection states.
- Immediate content changes with brief, purposeful press feedback.

This is the implemented screen system. Normative primitives above come from `src/tokens.css`, `src/typography.css` and the reusable styles in `src/style.css`; font loading comes from `src/main.tsx`. `PRODUCT.md` owns product scope and approval records. The print plan has its own black-on-white point-size treatment.

## Colors

Deep olive creates the gallery atmosphere; pale paper and warm wine establish distinct reading passages without changing the shared controls.

### Primary

- **Gallery olive** (`stage`): page, masthead, family-image surround and footer.
- **Inset olive** (`stage-surface`): expanded outfit shopping, unavailable-image states and chapter hover.
- **Pale citron** (`highlight`): selected underlines, light actions, italic deck and focus on dark surfaces.
- **Evergreen** (`accent`): links, status progress, selected shopping filters and focus on pale surfaces.
- **Deep evergreen** (`accent-hover`): dark-action hover.

### Secondary

- **Portrait wine** (`wine`): the recommendation passage.
- **Clay caution** (`attention`): explicit shopping caveats on pale surfaces; cautions on the olive shopping inset use citron.

### Neutral

- **Warm paper** (`paper`) and **Linen paper** (`surface`): comparison/preparation and shopping fields respectively; warm paper also backs garment illustrations and native selects.
- **Olive ink** (`ink`) and **Secondary ink** (`muted`): primary and supporting copy on pale fields.
- **Control edge** (`control-border`): meaningful form boundaries and product-row rules. **Quiet rule** (`line`): secondary separators and progress tracks.
- **Warm white** (`inverse`), **Sage white** (`inverse-muted`) and **Gallery rule** (`inverse-border`): primary text, supporting text and boundaries on dark surfaces.

**The Clothing Color Rule.** Keep interface colors stable; wardrobe swatches come from structured concept data and do not retheme controls.

Text selection uses citron with gallery-olive text. Focus resolves to citron on dark surfaces and evergreen on pale surfaces. The sidecar's synthesized tonal ramps are preview metadata, not extra interface colors.

## Typography

**Display font:** Bodoni Moda, with Didot, Georgia and serif fallbacks. **Body and utility font:** Source Sans 3, with Arial and sans-serif fallbacks. Locally loaded faces are Bodoni Moda normal 500 and italic 400, plus Source Sans 3 normal 400 and 600. Font synthesis is disabled. Normal Bodoni 500 and Source Sans 3 400 are preloaded.

The pairing gives names and editorial statements a photographic-publication character while controls, descriptions and verification remain direct. Use the frontmatter's exact role values; the scale is purpose-driven rather than a fixed mathematical ratio.

| Role                          | Application                                                                                                                                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `display`                     | Concept heading. At widths ≤1200px it is 2.6rem; at ≤950px it is 3rem; at ≤600px it is 2.5rem with 1.1 line height.                                                                                                                                       |
| `headline`                    | Primary section headings. Recommendation and shopping headings use their larger component treatments; the recommendation uses `clamp(3rem, 5vw, 5.5rem)`, shopping uses `clamp(3rem, 5.5vw, 5.5rem)` with 1.08 line height. Both become 3.5rem at ≤600px. |
| `title`                       | Standard third-level headings and comparison titles. Comparison titles become 1.3rem at ≤600px.                                                                                                                                                           |
| `product-title`               | Open shopping-row names; becomes 1.5rem at ≤600px.                                                                                                                                                                                                        |
| `member-name`                 | Names below the six portraits; becomes 1.3rem at ≤600px. It inherits normal 400 in CSS; the loaded normal display face resolves to 500, without synthesis.                                                                                                |
| `deck`                        | Italic concept statement; becomes 1.125rem at ≤600px. Italic style is carried in the sidecar.                                                                                                                                                             |
| `body`, `detail`, `caption`   | General reading text, product descriptions, image captions and supporting metadata. Context-specific prose uses line heights from 1.5 to 1.65.                                                                                                            |
| `label`, `control`, `chapter` | Actions, native selects and wardrobe chapter navigation. Chapter labels become 0.875rem at ≤600px; select text remains 16px.                                                                                                                              |
| `budget`                      | Remaining estimate, with tabular numerals. Price and count fields also use tabular numerals.                                                                                                                                                              |

Headings use balanced wrapping; paragraphs use pretty wrapping. Standard body copy is 16px/1.6. Long explanation fields are constrained to 65–75ch where space permits. Individual-detail names use 2.5rem, reducing to 2rem at ≤600px. The wordmark is 2rem/1.1 with −0.03em tracking, reducing to 1.7rem on phones. Do not turn the few very small image labels or uppercase preparation footnotes into a general text tier.

## Layout

The shared horizontal gutter and section rhythm are fluid tokens. Main content is centered around a 1560px maximum; at widths ≥1700px the masthead, footer and lower sections align their padding to this width. The gallery uses three unequal columns: a 176px chapter rail, a flexible 3:2 family photograph and a 250px caption column, separated by 28px. At ≤1200px the outer columns become 150px and 225px with 22px gaps.

At ≤950px, five chapter controls span the top, followed by the heading and full photograph; description and palette then share a row. At ≤600px, the five visible chapter controls form three choices over two, followed by heading, photograph, palette, description and action. The photograph always precedes longer explanatory copy.

The six-person board uses six columns, three at ≤950px and two at ≤600px. Portrait windows are 1:2, and open captions remain below each. The five-concept comparison follows a five/three/two-column progression at the same breakpoints. Shopping is an open two-column ledger until ≤600px, when its rows become a single list. Each product retains an illustration beside its text; status actions can stack independently. Detail, checklist and preparation grids collapse by content priority rather than shrinking controls.

At ≤900px, selecting a person focuses the matching detail heading and scrolls instantly only if the detail is outside the viewport; a “Choose another person” link returns to the board. Already-visible detail stays in place. Concept/member state updates retain their URL parameters and checklist selections stay synchronized.

**The Photograph Rule.** Preserve the complete family view at its original 3:2 ratio; individual study crops are separately framed comparisons, not a scale chart.

## Elevation & Depth

This is a flat system. Olive, wine and paper fields, photography and thin rules create depth without cast shadows. The only interface shadow effects are structural: a two-pixel inset selection underline and a one-pixel swatch-dot ring. Garment drawings use internal shading and texture, not elevated product cards.

**The Open Ledger Rule.** Use typography, alignment and rules to organize shopping information; keep each product row open to its surrounding paper field.

## Shapes

Buttons, fields, image windows and editorial rows are square. Round shapes are reserved for wardrobe swatches and color indicators. The gallery swatches are 27px across, becoming 30px on phones; detail swatches are 28px. Selects have explicit one-pixel boundaries. Inline arrow icons are stroked SVGs and rotate to indicate direction.

## Components

### Buttons and links

Filled actions use citron on the gallery stage or evergreen on pale paper. They have a 48px minimum height and the frontmatter's padding. Text actions and shopping links have a 44px minimum height, underlines and open backgrounds. Fine-pointer hover changes a light button to warm white, a dark button to deep evergreen, and text links to a thicker underline.

Filled buttons move down one pixel on pointer press using a 160ms press and 100ms release with `cubic-bezier(0.23, 1, 0.32, 1)`. Other button state changes are immediate. Keyboard focus removes the press transition and transform. Reduced motion disables transitions, animations, pressed transforms and smooth anchor scrolling. Ordinary anchor scrolling is smooth otherwise; programmatic portrait-to-detail movement is always instant. Disabled buttons use 0.55 opacity and a default cursor.

### Inputs / Fields

Native selects use warm paper, olive ink, control-edge borders, square corners and a 44px minimum height. The expanded dark shopping inset instead uses gallery olive, warm white and gallery-rule borders. Every field has an accessible name. Visible focus is a two-pixel outline with a five-pixel offset, using the local dark/pale focus color.

### Navigation

The masthead pairs a Bodoni wordmark with Source Sans text links and a compact shopping count. The edition text disappears at ≤1200px; the navigation becomes a second row at ≤600px. Wardrobe chapters use five visible text controls with optional thumbnails on wide screens. Active chapters carry a persistent citron underline and warm-white text; selected state also uses `aria-pressed`. Concept switching replaces the image and copy immediately, with no crossfade.

### Palette and shopping filters

The seven clothing-color swatches are circular within at least 44px-high buttons. Selection adds an outline and contrasting center dot; accessible names and an adjacent live text label expose color name and hex. Shopping filters are open text controls with a selected evergreen bottom rule and semibold label; keep them separate from the circular palette geometry.

### Portrait choices and detail

Portraits are open image-and-caption buttons with an inset selected underline, directional SVG and `aria-pressed`. The selected detail names the person, wardrobe, clothing, finishing touches and texture, then exposes outfit shopping through an explicit expanded-state button. Detail content updates politely for assistive technology. Preserve the responsive focus and return-link behavior described in Layout.

### Shopping rows and disclosures

Product rows combine an illustration, person/store label, Bodoni name, product/color details, dated price status, retailer action and native checklist select. Rows have a top rule and no enclosing card surface. Do not invent an extra completed-product border: readiness is represented by the select, progress and remaining estimate. Illustrations are explicitly labeled; verification, rationale, alternatives and closet pieces use native disclosures. External shopping links open with `target="_blank"`, `rel="noopener noreferrer"` and accessible new-tab labels.

### Image publication

Only the reviewed generated copies in `content/published-assets.json` may appear in public mode. Generated family images and individual studies carry approximation labels; garment images remain original styling illustrations unless separately authorized retailer photography is supplied. Original photos and design mockups stay local. New imagery requires separate approval, and approved website imagery is public.

## Do's and Don'ts

### Do:

- **Do** preserve five distinct concepts and six individualized outfits per concept while keeping one coherent interface.
- **Do** separate interface tokens from clothing colors and keep complete family images uncropped.
- **Do** use local Bodoni Moda and Source Sans 3, clear headings, readable shopping details and visible focus.
- **Do** keep concept and member changes immediate, selection explicit, and reduced-motion behavior available.
- **Do** retain accurate price-status labels, dated verification limits, accessible external-link names and safe new-tab attributes.
- **Do** label generated studies as approximate AI wardrobe visualizations and garment drawings as styling illustrations.
- **Do** keep original photos and design mockups private; only approved generated copies recorded in `content/published-assets.json` may be public.

### Don't:

- **Don't** use faint dividers as the only boundary of an actionable field or indicate selection with color alone.
- **Don't** add floating card shadows, enclosing product-card chrome or decorative animation to the flat editorial system.
- **Don't** crossfade family images, distort their aspect ratio or suggest that generated imagery proves fit or exact likeness.
- **Don't** fabricate live prices, availability, product imagery or purchase links.
- **Don't** import, embed, hotlink, log, commit or deploy private original photos or reference HTML containing them.
- **Don't** publish new imagery without separate approval; a public website makes approved copies public.
- **Don't** push, create a repository or deploy without explicit instruction and review of what will be public.
