import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel supplies its public production hostname at build time. Only the
// validated origin is used, so no other environment values reach the client.
const hostname = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const origin =
  hostname && /^[a-z0-9.-]+(?::\d+)?$/i.test(hostname)
    ? `https://${hostname}`
    : undefined;

export default defineConfig({
  plugins: [
    react(),
    {
      name: "public-sharing-metadata",
      transformIndexHtml(html) {
        if (!origin) return html;
        return {
          html: html.replaceAll(
            'content="/social.png"',
            `content="${origin}/social.png"`,
          ),
          tags: [
            {
              tag: "link",
              attrs: { rel: "canonical", href: `${origin}/` },
              injectTo: "head",
            },
            {
              tag: "meta",
              attrs: { property: "og:url", content: `${origin}/` },
              injectTo: "head",
            },
          ],
        };
      },
    },
  ],
});
