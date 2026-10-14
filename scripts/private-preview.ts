import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

export function privatePreviewPlugin(enabled: boolean): Plugin {
  const files = new Map<string, string>();
  for (const id of ["heritage", "organic", "editorial"]) {
    for (const suffix of ["", "-small"])
      files.set(`${id}${suffix}.webp`, `visualizations/${id}${suffix}.webp`);
  }
  for (let i = 0; i < 6; i++) {
    for (const suffix of ["", "-small"])
      files.set(
        `member-${i}${suffix}.webp`,
        `visualizations/member-${i}${suffix}.webp`,
      );
  }
  files.set("prototypes", "compositions/index.html");
  for (const name of ["spread", "catalog", "board"])
    files.set(`${name}.png`, `compositions/${name}.png`);
  return {
    name: "private-local-review",
    enforce: "pre",
    config() {
      return {
        server: {
          host: "127.0.0.1",
          fs: {
            deny: [
              "**/.env",
              "**/.env.*",
              "**/*.{crt,pem,key}",
              "**/.git/**",
              "**/.local-reference/**",
              "**/.qa/**",
            ],
          },
        },
      };
    },
    resolveId(id) {
      if (id.includes(".local-reference") || id.includes("/__private/"))
        throw new Error("Private assets must not enter the module graph.");
    },
    configureServer(server) {
      if (enabled && server.config.server.host !== "127.0.0.1")
        throw new Error("Private review requires loopback hosting.");
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/__private/")) return next();
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
        const host = req.headers.host?.split(":")[0];
        const file = files.get(
          req.url.slice("/__private/".length).split("?")[0],
        );
        if (
          !enabled ||
          !file ||
          (host !== "127.0.0.1" && host !== "localhost")
        ) {
          res.statusCode = 404;
          res.end();
          return;
        }
        try {
          const bytes = await readFile(resolve(".local-reference", file));
          res.setHeader(
            "Content-Type",
            file.endsWith("html")
              ? "text/html; charset=utf-8"
              : file.endsWith("png")
                ? "image/png"
                : "image/webp",
          );
          res.setHeader("X-Content-Type-Options", "nosniff");
          res.end(bytes);
        } catch {
          res.statusCode = 404;
          res.end();
        }
      });
    },
  };
}
