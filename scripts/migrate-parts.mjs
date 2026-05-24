#!/usr/bin/env node
/* eslint-disable no-console */
//
// migrate-parts.mjs
// -----------------
// One-shot migrator that pulls every part from the legacy site
// (https://www.rebarmachineservice.com/) and rewrites
// `src/mocks/parts.ts` with the fresh dataset.
//
//   1. Hits the legacy `ajax.php` endpoint to enumerate every
//      (machine type / model / keyword) triple.
//   2. Hits `tableConstructor.php?kwID=N` for each keyword and parses the
//      returned HTML with cheerio to pull (image src, part number, name,
//      description) for every part.
//   3. Downloads each image into `public/parts/{Folder}/{filename}` so the
//      new site is self-contained (no runtime dependency on the old domain).
//      Existing files are skipped, so the script is idempotent on re-run.
//   4. Re-emits `src/mocks/parts.ts` with the new partCategories +
//      parts arrays, dropping `shearlines-barprep` and `spiral-straightener`
//      and collapsing the old single-spiral-model into `spiral-machine`.
//
// Usage:  npm run migrate-parts
//

import { mkdir, writeFile, access, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import * as cheerio from "cheerio";
import he from "he";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");
const PUBLIC_PARTS = join(PROJECT_ROOT, "public", "parts");
const MOCK_FILE    = join(PROJECT_ROOT, "src", "mocks", "parts.ts");
const OLD_BASE     = "https://www.rebarmachineservice.com";

// pmodID -> { partsTypeId on new site, id prefix used for PartItem.id }
const PMOD_MAP = {
  "1":  { partsTypeId: "bender-11",            idPrefix: "b11"    },
  "2":  { partsTypeId: "bender-14",            idPrefix: "b14"    },
  "3":  { partsTypeId: "bender-18",            idPrefix: "b18"    },
  "6":  { partsTypeId: "bender-stirrupmaster", idPrefix: "stm"    },
  "7":  { partsTypeId: "radius-bender",        idPrefix: "rb"     },
  "8":  { partsTypeId: "radius-ultra",         idPrefix: "urb"    },
  "11": { partsTypeId: "shears-mini",          idPrefix: "sm"     },
  "12": { partsTypeId: "shears-411",           idPrefix: "s411"   },
  "13": { partsTypeId: "shears-611",           idPrefix: "s611"   },
  "14": { partsTypeId: "shears-hd611",         idPrefix: "shd611" },
  "15": { partsTypeId: "shearlines-mini",      idPrefix: "shlm"   },
  "16": { partsTypeId: "shearlines-standard",  idPrefix: "shl"    },
  "10": { partsTypeId: "spiral-machine",       idPrefix: "sp"     },
};

// Order partsTypeIds appear in the new site's UI / mock file
const TYPE_ORDER = [
  "bender-11", "bender-14", "bender-18", "bender-stirrupmaster",
  "radius-bender", "radius-ultra",
  "shears-mini", "shears-411", "shears-611", "shears-hd611",
  "shearlines-mini", "shearlines-standard",
  "spiral-machine",
];

// Keyword IDs that are the model-wide "{model} parts" catch-alls. We
// import them LAST so that any part that was already pulled in under a
// specific subcategory (Electrical, Drivetrain, ...) gets skipped — only
// the *orphan* parts that exist solely in the catch-all keyword end up
// importing under a generic "{Model} Parts" category. This avoids
// silently dropping the ~30-150 parts per model whose only categorisation
// on the old site was the catch-all keyword.
const CATCHALL_KW = new Set([2, 11, 20, 69, 95, 104, 165, 176, 186, 196, 240, 294]);

const SMALL_WORDS = new Set([
  "and", "or", "the", "of", "for", "on", "in", "to", "a", "an", "with", "by",
]);

function titleCase(s) {
  return s.split(/\s+/).map((tok, i) => {
    if (!tok) return tok;
    const stripped = tok.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (/^\d+$/.test(stripped)) return tok;            // 411, 611, 11, 14, 18
    if (/^hd\d+$/.test(stripped)) return tok.toUpperCase(); // HD611
    if (i > 0 && SMALL_WORDS.has(stripped)) return tok.toLowerCase();
    return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
  }).join(" ");
}

// Map an old-site keyword onto a clean category name for the new site.
// For benders + stirrupmaster we drop the model prefix (matching the
// existing site convention: "Drivetrain Parts" instead of "11 Bender Drivetrain Parts").
// Radius / shears / shearlines / spiral keep their full prefix because the
// keywords are otherwise too generic to disambiguate (e.g. just "Rolls").
function prettyCategory(keyword, partsTypeId) {
  let kw = keyword.trim();
  if (partsTypeId === "bender-11") kw = kw.replace(/^11 bender\s+/i, "");
  if (partsTypeId === "bender-14") kw = kw.replace(/^14 bender\s+/i, "");
  if (partsTypeId === "bender-18") kw = kw.replace(/^18 bender\s+/i, "");
  if (partsTypeId === "bender-stirrupmaster") kw = kw.replace(/^stirrupmaster\s+/i, "");
  return titleCase(kw);
}

// Catch-all keywords (the bare "{model} parts" rows) are imported under a
// readable "{Model} Parts" category — we *don't* strip prefixes here, so
// bender-11 catch-all becomes "11 Bender Parts" rather than the unhelpful
// bare "Parts" you'd get from prettyCategory().
function prettyCatchAllCategory(keyword) {
  return titleCase(keyword.trim());
}

// Display label for the orphan-bucket category we attach catch-all-only
// parts to. Reads naturally regardless of partsTypeId.
const CATCHALL_LABELS = {
  "bender-11":            "11 Bender Parts",
  "bender-14":            "14 Bender Parts",
  "bender-18":            "18 Bender Parts",
  "bender-stirrupmaster": "Stirrupmaster Parts",
  "radius-bender":        "Radius Bender Parts",
  "radius-ultra":         "Ultra Radius Bender Parts",
  "shears-mini":          "Mini Shear Parts",
  "shears-411":           "411 Shear Parts",
  "shears-611":           "611 Shear Parts",
  "shears-hd611":         "HD611 Shear Parts",
  "shearlines-mini":      "Mini Shearline Parts",
  "shearlines-standard":  "Shearline Parts",
  "spiral-machine":       "Spiral Bender Parts",
};

async function postAjax(payload) {
  const body = new URLSearchParams(payload).toString();
  const res = await fetch(`${OLD_BASE}/ajax.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`ajax.php ${res.status} for ${body}`);
  return res.json();
}

async function fetchTable(kwID) {
  const res = await fetch(`${OLD_BASE}/tableConstructor.php?kwID=${kwID}`);
  if (!res.ok) throw new Error(`tableConstructor.php ${res.status} for kwID=${kwID}`);
  return res.text();
}

// Decode the legacy site's broken-but-consistent encoding. The old PHP
// template sometimes emits `&quot` (no semicolon) instead of `&quot;`, so
// we normalise that before letting `he` decode the rest.
function decodeLegacy(s) {
  if (!s) return "";
  return he.decode(s.replace(/&quot(?!;)/g, '"'));
}

function parseTable(html) {
  const $ = cheerio.load(html);
  const rows = [];

  $('div.row[id="resTable"]').each((_, row) => {
    const $row = $(row);

    // Header row has a `.tblhd1` div — skip it.
    if ($row.find(".tblhd1").length > 0) return;

    const $img = $row.find("a > img.img-thumbnail").first();
    if ($img.length === 0) return;

    const imgSrc = $img.attr("src");
    const altRaw = $img.attr("alt") || "";

    // The alt attribute occasionally contains HTML (`<br>`, multi-line
    // content). Split by <br> and treat the first non-empty line as the
    // part name; any extra lines spill into the description.
    const altLines = altRaw
      .replace(/<br\s*\/?>/gi, "\n")
      .split("\n")
      .map(l => decodeLegacy(l.replace(/<[^>]+>/g, "")).trim())
      .filter(Boolean);
    const name = altLines[0] || "";
    const altExtra = altLines.slice(1).join(" ").replace(/\s+/g, " ").trim();

    const partTxts = $row.find('div[id="partTxt"]');
    if (partTxts.length === 0) return;

    const partNumber = decodeLegacy($(partTxts[0]).text()).trim();

    // Description: the LAST partTxt holds the multi-line description with
    // `<br/>` separators. The first line is usually the part name repeated;
    // strip it.
    const descHtml = partTxts.length > 1
      ? ($(partTxts[partTxts.length - 1]).html() || "")
      : "";

    const lines = descHtml
      .replace(/<br\s*\/?>/gi, "\n")
      .split("\n")
      .map(l => decodeLegacy(l.replace(/<[^>]+>/g, "")).trim())
      .filter(Boolean);

    let descLines = lines;
    if (lines[0]) {
      const a = lines[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
      const b = name.replace(/[^a-z0-9]/gi, "").toLowerCase();
      if (a === b) descLines = lines.slice(1);
    }
    let description = descLines.join(" ").replace(/\s+/g, " ").trim();
    if (altExtra) description = description ? `${altExtra}. ${description}` : altExtra;

    if (!partNumber || !imgSrc || !name) return;
    rows.push({ partNumber, name, description, imgSrc });
  });

  return rows;
}

const downloadStats = { ok: 0, skipped: 0, failed: 0 };

const PLACEHOLDER_NAME = "_missing.svg";
const PLACEHOLDER_URL = `/parts/${PLACEHOLDER_NAME}`;

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

// Make sure /public/parts/_missing.svg exists for parts whose source
// image 404s (some legacy SKUs reference `.png` URLs that simply aren't
// on the server, in either casing).
async function ensurePlaceholder() {
  const file = join(PUBLIC_PARTS, PLACEHOLDER_NAME);
  if (await exists(file)) return;
  await mkdir(PUBLIC_PARTS, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="#f4f3ef"/>
  <rect x="20" y="20" width="160" height="160" fill="none" stroke="#d6d3cc" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="100" y="100" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#9a948a" letter-spacing="2">NO IMAGE</text>
  <text x="100" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#9a948a">Contact us for a current photo</text>
</svg>
`;
  await writeFile(file, svg, "utf8");
}

// Download an image and return its repo-relative public path
// (e.g. "/parts/Bender/01-025.jpg"). Idempotent — already-present files
// are not refetched. On 404 we return the shared placeholder URL so the
// catalog renders cleanly instead of showing a broken image.
async function downloadImage(srcUrl) {
  // srcUrl looks like "images/Parts/Bender/01-025.jpg" — turn it into a
  // local public path of "/parts/Bender/01-025.jpg".
  const m = srcUrl.match(/images\/Parts\/([^/]+)\/(.+)$/i);
  if (!m) {
    console.warn(`  ! unexpected image src shape: ${srcUrl}`);
    return PLACEHOLDER_URL;
  }
  const folder = m[1];
  const filename = m[2];
  const localPath = join(PUBLIC_PARTS, folder, filename);
  const publicUrl = `/parts/${folder}/${filename}`;

  if (await exists(localPath)) {
    const s = await stat(localPath);
    if (s.size > 0) {
      downloadStats.skipped++;
      return publicUrl;
    }
  }

  const fullUrl = srcUrl.startsWith("http") ? srcUrl : `${OLD_BASE}/${srcUrl}`;
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      // Some old listings have a `.png` URL whose real file is `.jpg`
      // (or vice-versa). Try the other extension before giving up.
      const altUrl = fullUrl.replace(/\.png$/i, ".jpg").replace(/\.jpg$/i, ".png") !== fullUrl
        ? (fullUrl.toLowerCase().endsWith(".png") ? fullUrl.slice(0, -4) + ".jpg" : fullUrl.slice(0, -4) + ".png")
        : null;
      if (altUrl) {
        const alt = await fetch(altUrl);
        if (alt.ok) {
          await mkdir(dirname(localPath), { recursive: true });
          await writeFile(localPath, Buffer.from(await alt.arrayBuffer()));
          downloadStats.ok++;
          return publicUrl;
        }
      }
      console.warn(`  ! ${res.status} ${fullUrl}`);
      downloadStats.failed++;
      return PLACEHOLDER_URL;
    }
    await mkdir(dirname(localPath), { recursive: true });
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(localPath, buf);
    downloadStats.ok++;
    return publicUrl;
  } catch (e) {
    console.warn(`  ! download error ${fullUrl}: ${e.message}`);
    downloadStats.failed++;
    return PLACEHOLDER_URL;
  }
}

// Stable JSON-string with backslash-escaped quotes/backslashes.
function tsString(v) {
  return JSON.stringify(v);
}

function emitMockTs({ categoriesByType, allParts }) {
  const partCategoriesBlock = TYPE_ORDER
    .filter(t => categoriesByType.has(t) && categoriesByType.get(t).length > 0)
    .map(t => {
      const lines = categoriesByType.get(t)
        .map(c => `    ${tsString(c)},`).join("\n");
      return `  ${tsString(t)}: [\n${lines}\n  ],`;
    })
    .join("\n");

  // Order parts: by partsTypeId, then category (in the order they were seen),
  // then natural-numeric partNumber order.
  const typeRank = (t) => {
    const i = TYPE_ORDER.indexOf(t);
    return i === -1 ? 999 : i;
  };
  const catRank = (t, c) => {
    const arr = categoriesByType.get(t) || [];
    const i = arr.indexOf(c);
    return i === -1 ? 999 : i;
  };

  allParts.sort((a, b) =>
    (typeRank(a.partsTypeId) - typeRank(b.partsTypeId))
    || (catRank(a.partsTypeId, a.category) - catRank(b.partsTypeId, b.category))
    || a.partNumber.localeCompare(b.partNumber, undefined, { numeric: true, sensitivity: "base" })
  );

  // Group parts with comment headers per (partsTypeId, category)
  const lines = [];
  let lastType = null;
  let lastCat = null;
  for (const p of allParts) {
    if (p.partsTypeId !== lastType) {
      if (lastType !== null) lines.push("");
      lines.push(`  // ${p.partsTypeId}`);
      lastType = p.partsTypeId;
      lastCat = null;
    }
    if (p.category !== lastCat) {
      lines.push(`  //   ${p.category}`);
      lastCat = p.category;
    }
    const fields = [
      `id: ${tsString(p.id)}`,
      `name: ${tsString(p.name)}`,
      `partNumber: ${tsString(p.partNumber)}`,
      `partsTypeId: ${tsString(p.partsTypeId)}`,
      `category: ${tsString(p.category)}`,
      `image: ${tsString(p.image)}`,
    ];
    if (p.description) fields.push(`description: ${tsString(p.description)}`);
    lines.push(`  { ${fields.join(", ")} },`);
  }

  return `export interface PartCategory {
  id: string;
  name: string;
  machineType: string;
  partsType: string;
}

export interface MachineTypeOption {
  id: string;
  label: string;
}

export interface PartsTypeOption {
  id: string;
  label: string;
  machineTypeId: string;
}

export const machineTypeOptions: MachineTypeOption[] = [
  { id: "bender", label: "Bender" },
  { id: "radius", label: "Radius" },
  { id: "shears", label: "Shears" },
  { id: "shearlines", label: "Shearlines" },
  { id: "spiral", label: "Spiral" },
];

export const partsTypeOptions: PartsTypeOption[] = [
  // Bender
  { id: "bender-11", label: "11 Bender", machineTypeId: "bender" },
  { id: "bender-14", label: "14 Bender", machineTypeId: "bender" },
  { id: "bender-18", label: "18 Bender", machineTypeId: "bender" },
  { id: "bender-stirrupmaster", label: "Stirrupmaster", machineTypeId: "bender" },
  // Radius
  { id: "radius-bender", label: "Radius Bender", machineTypeId: "radius" },
  { id: "radius-ultra", label: "Ultra Radius Bender", machineTypeId: "radius" },
  // Shears
  { id: "shears-mini", label: "Mini Shear", machineTypeId: "shears" },
  { id: "shears-411", label: "411 Shear", machineTypeId: "shears" },
  { id: "shears-611", label: "611 Shear", machineTypeId: "shears" },
  { id: "shears-hd611", label: "HD611 Shear", machineTypeId: "shears" },
  // Shearlines
  { id: "shearlines-mini", label: "Mini Shearline", machineTypeId: "shearlines" },
  { id: "shearlines-standard", label: "Shearline", machineTypeId: "shearlines" },
  // Spiral
  { id: "spiral-machine", label: "Spiral Machine", machineTypeId: "spiral" },
];

export interface PartItem {
  id: string;
  name: string;
  partNumber: string;
  partsTypeId: string;
  category: string;
  image: string;
  description?: string;
}

export const partCategories: Record<string, string[]> = {
${partCategoriesBlock}
};

export const parts: PartItem[] = [
${lines.join("\n")}
];
`;
}

async function main() {
  const startedAt = Date.now();

  console.log("[1/3] Enumerating taxonomy from old API...");
  const ptypes = await postAjax({ tag: "pCategory" });

  const tasks = [];
  const catchAllTasks = [];
  for (const pt of ptypes) {
    const pmods = await postAjax({ tag: "pModel", ptypeID: pt.ptypeID });
    for (const pm of pmods) {
      const map = PMOD_MAP[pm.pmodID];
      if (!map) {
        console.log(`  - SKIP unmapped pmodID=${pm.pmodID} (${pm.pmodName})`);
        continue;
      }
      const keywords = await postAjax({ tag: "pType", pmodID: pm.pmodID });
      for (const kw of keywords) {
        const kwID = parseInt(kw.kwID, 10);
        if (CATCHALL_KW.has(kwID)) {
          catchAllTasks.push({
            partsTypeId: map.partsTypeId,
            idPrefix: map.idPrefix,
            kwID: kw.kwID,
            rawKeyword: kw.keyword,
            category: CATCHALL_LABELS[map.partsTypeId] || prettyCatchAllCategory(kw.keyword),
            isCatchAll: true,
          });
        } else {
          tasks.push({
            partsTypeId: map.partsTypeId,
            idPrefix: map.idPrefix,
            kwID: kw.kwID,
            rawKeyword: kw.keyword,
            category: prettyCategory(kw.keyword, map.partsTypeId),
            isCatchAll: false,
          });
        }
      }
    }
  }
  console.log(`  -> ${tasks.length} specific + ${catchAllTasks.length} catch-all (model x category) tasks queued`);

  console.log("[2/3] Fetching parts and downloading images...");
  await ensurePlaceholder();
  const categoriesByType = new Map();
  const counters = new Map();
  const allParts = [];
  // Tracks every partNumber already imported for a given partsTypeId, so the
  // catch-all pass below can skip parts that were already pulled in under a
  // specific keyword.
  const seenByType = new Map();

  // Process specific keywords first, then catch-alls so we can correctly
  // identify orphan parts that only exist under the catch-all keyword.
  const orderedTasks = [...tasks, ...catchAllTasks];

  for (const task of orderedTasks) {
    process.stdout.write(`  ${task.partsTypeId} / ${task.category} (kwID=${task.kwID}${task.isCatchAll ? ", catch-all" : ""})...`);
    let html;
    try {
      html = await fetchTable(task.kwID);
    } catch (e) {
      console.log(` ! ${e.message}`);
      continue;
    }
    const rows = parseTable(html);

    if (!seenByType.has(task.partsTypeId)) seenByType.set(task.partsTypeId, new Set());
    const typeSeen = seenByType.get(task.partsTypeId);

    // For specific keywords we dedupe within the single category (the
    // legacy site sometimes lists the same part twice in one keyword).
    // For the catch-all pass we additionally skip anything that was
    // already imported anywhere under this partsTypeId — those parts are
    // already categorised, and we only want the orphans.
    const localSeen = new Set();
    let added = 0;
    for (const row of rows) {
      if (task.isCatchAll) {
        if (typeSeen.has(row.partNumber)) continue;
      } else {
        if (localSeen.has(row.partNumber)) continue;
        localSeen.add(row.partNumber);
      }

      // Lazily register the category so empty / fully-deduped catch-all
      // buckets don't leak into partCategories.
      if (added === 0) {
        if (!categoriesByType.has(task.partsTypeId)) categoriesByType.set(task.partsTypeId, []);
        const cats = categoriesByType.get(task.partsTypeId);
        if (!cats.includes(task.category)) cats.push(task.category);
      }

      const localImage = await downloadImage(row.imgSrc);
      const counterKey = task.partsTypeId;
      const next = (counters.get(counterKey) || 0) + 1;
      counters.set(counterKey, next);
      const id = `${task.idPrefix}-${String(next).padStart(3, "0")}`;

      allParts.push({
        id,
        name: row.name,
        partNumber: row.partNumber,
        partsTypeId: task.partsTypeId,
        category: task.category,
        image: localImage || row.imgSrc,
        description: row.description || undefined,
      });
      typeSeen.add(row.partNumber);
      added++;
    }
    console.log(` ${rows.length} rows -> ${added} added${task.isCatchAll && rows.length > added ? ` (${rows.length - added} already categorised)` : ""}`);
  }

  console.log(`  -> ${allParts.length} parts collected`);
  console.log(`  -> images: ${downloadStats.ok} downloaded, ${downloadStats.skipped} cached, ${downloadStats.failed} failed`);

  console.log(`[3/3] Writing ${MOCK_FILE}...`);
  const ts = emitMockTs({ categoriesByType, allParts });
  await writeFile(MOCK_FILE, ts, "utf8");

  console.log(`Done in ${((Date.now() - startedAt) / 1000).toFixed(1)}s.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
