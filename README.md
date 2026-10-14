# Field & Family

An editorial family wardrobe lookbook built with React, TypeScript and Vite. Three distinct concepts, six outfits per concept, original SVG garment studies, interactive palettes and comparison, and a browser-local shopping checklist for the recommended **Hill Country Heritage** look.

## Develop

Use Node.js 22.12+ (Node 22 LTS recommended).

```sh
npm install
npm run dev
```

The local site opens at the URL printed by Vite. No backend, account, API key, analytics, or paid service is needed. Fonts are bundled locally. Navigation uses section anchors, so no client-side routing rewrite is required.

## Validate

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

Browser tests use a local Google Chrome installation. With the dev server running in another terminal:

```sh
npm run test:e2e
```

For the production preview on port 4173:

```sh
TEST_BASE_URL=http://127.0.0.1:4173 npm run test:e2e
```

Tests cover all 18 outfits, concept and swatch selection, comparison, shopping filters, checkbox persistence, calculated budgets, reset, storage failure, keyboard access, reduced motion, print content, missing local assets and axe WCAG A/AA checks. Viewports: desktop 1440, tablet 820, mobile 390, plus a 320px overflow check. These browser emulations do not replace checking Safari and Android on real phones. Test screenshots and reports are ignored by Git.

`node scripts/capture.mjs` captures visual review images in `.qa/` and regenerates the original social-sharing PNG while the dev server is running. Create `.qa/` first if needed. Format source with `npm run format`.

## Content and shopping verification

`content/wardrobe.json` is the public editorial source of truth. It contains all concepts, palettes, individual outfits, garment illustration properties, shopping URLs, reference prices, verification dates and notes. Preserve unique shopping IDs when editing to retain checklist state. The checklist stores IDs only in localStorage, never transmits them, and remains usable if storage is unavailable. Reset clears the list. Checking an item means bought **or already owned**, not actual spending; the remaining figure is a planning estimate.

Research date: **October 14, 2026**. The 12 listed clothing references total **$587.78**, before tax, delivery, shoes and accessories. Prices and inventory can change. Only the Quince navy chore jacket ($62), H&M textured polo ($44.99), and Quince wine silk dress ($79.90) had prices and requested colors observed in retrieved merchant pages. Other prices remain the original reference estimates. Most pages were retrieved; the corduroys and Henley had merchant search evidence only. Each record and visible item explains its limits. The Oxford page showed a different color. Abercrombie redirected the blouse to a regional store. No item claims verified size availability.

`verifiedLive` intentionally stays false: page observations are not a live inventory feed. `priceVerified` and `lastVerifiedAt` identify the three price observations; `lastCheckedAt` records the research attempt for every item. After new research, update both fields and the accompanying note. Product links serve as primary-source references. No affiliate tracking is added. No unconfirmed lower-cost alternatives are presented as real products; closet substitutions reduce the estimate instead.

All garment artwork is original stylized SVG, not product photography or an exact depiction of fit. Merchant image reuse rights were not established, so no merchant imagery is copied or hotlinked. Cormorant Garamond and Manrope are distributed through Fontsource under their included open font licenses; see `THIRD_PARTY_NOTICES.md`.

## Privacy

No family photographs, names, children's ages, location bookings, or private reference materials are published. Public roles are Dad, Mom, Eldest son, Daughter, Middle son and Youngest son. Never import `.local-reference/` or an HTML file containing embedded family imagery. The original prompt remains local and ignored. Publication of any family photograph requires explicit approval and metadata removal. Keep `.env*`, credentials, `.codex/`, `.agents/`, `.vercel/`, browser reports and local reference files out of Git.

## Deploy through Vercel's GitHub integration

1. Sign into Vercel and choose **Add New → Project**.
2. Import **parallelcross/personalStuffForVercel** and select production branch **main**.
3. Set **Framework Preset: Vite** and **Root Directory: `.`**.
4. Use **Install Command: `npm install`**, **Build Command: `npm run build`**, and **Output Directory: `dist`**.
5. Use Node.js **22.x**. No environment variables are required.
6. Click **Deploy**. Vercel will build the repository root. Later pushes to main will deploy automatically through the integration.
7. Open the deployed URL and check navigation, all three concepts, the checklist and print plan.
8. Vercel's `VERCEL_PROJECT_PRODUCTION_URL` system variable automatically supplies absolute social-image URLs, canonical metadata and `og:url` during the build. Keep **Automatically expose System Environment Variables** enabled. If you later add a custom domain, redeploy to refresh this metadata. Local builds retain relative image URLs without guessing a public domain. See [Vercel's system-variable documentation](https://vercel.com/docs/environment-variables/system-environment-variables).

`vercel.json` declares the requested build settings and basic security headers. This is a static, anchor-navigated site. Unknown routes correctly return 404 rather than masking missing assets with HTML. No Vercel CLI production deployment is part of this workflow.
