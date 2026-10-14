# Repository instructions for coding agents

This repository is a **family-of-six fall-photo wardrobe lookbook**, intended for GitHub + Vercel. Read `CODEX_PROMPT.md` for the full assignment and `content/wardrobe.json` for the editorial source of truth.

## Non-negotiables
- Preserve three genuinely distinct concepts: Hill Country Heritage (recommended), Texas Organic, Austin Editorial, and six individualized outfits for each.
- Create a compelling, polished, responsive *visual* lookbook and shopping plan, not generic AI-gradient SaaS cards.
- Keep the visual treatment warm, editorial, accessible, fast, and mobile-first. Use structured content/data instead of duplicating prose.
- Never invent live product prices, availability, merchant image URLs, or direct purchase links. Links and prices in `content/wardrobe.json` are **unverified historical references**; verify if browser/network available, otherwise mark as unverified and use sensible placeholders.
- **Privacy:** Original photograph shows minors. Never commit, deploy, hotlink, embed, log, or publish it (nor any reference HTML with base64 photo) by default. `.local-reference/` is gitignored. Only publish an explicitly approved copy after removing metadata, and document that a public website makes the image public.
- Keep secrets, analytics tokens, and tracking out of the static site. No login, back end, or paid API required.
- External shopping links: safe `target="_blank" rel="noopener noreferrer"` and accessible labels.
- Do not run `git push`, create GitHub repos, or deploy to Vercel until the user explicitly asks and has reviewed what will be public.
- `npm run build` must pass. Prefer image dimensions, lazy loading, reduced-motion support, and a visible focus state.
