import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
const forbidden = [
  "__private/",
  ".local-reference/",
  "IMG_6684",
  "IMG_8681",
  "IMG_7758",
  "IMG_8234",
  "IMG_7107",
  "IMG_7983",
  "IMG_8146",
];
const manifest = JSON.parse(
  await readFile("content/published-assets.json", "utf8"),
);
const approved = new Map(
  manifest.files.map((file) => [file.path, file.sha256]),
);
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    const name = relative("dist", path);
    if (/\.(png|jpe?g|webp|gif|avif)$/i.test(name) && name !== "social.png") {
      const hash = createHash("sha256")
        .update(await readFile(path))
        .digest("hex");
      if (approved.get(name) !== hash)
        throw new Error(`Unapproved public raster image: ${name}`);
    }
    if (/\.(html|js|css|json|svg)$/i.test(name)) {
      const text = await readFile(path, "utf8");
      for (const value of forbidden)
        if (text.includes(value))
          throw new Error(`Private reference in ${name}`);
    }
  }
}
await walk("dist");
for (const [name, hash] of approved) {
  if (
    createHash("sha256")
      .update(await readFile(join("dist", name)))
      .digest("hex") !== hash
  )
    throw new Error(`Missing or changed approved asset: ${name}`);
}
console.log(
  "Public build contains no private routes, reference filenames or unapproved raster images.",
);
