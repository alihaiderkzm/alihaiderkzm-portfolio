/**
 * build-projects.mjs
 *
 * Runs at Netlify BUILD time (not in the browser). It fetches the same
 * "projects" table your site already reads client-side, then writes the
 * resulting project cards straight into index.html between two markers:
 *
 *   <!--SSR_PROJECTS_START--> ... <!--SSR_PROJECTS_END-->
 *
 * Why: Googlebot sees the HTML as delivered by Netlify. Your projects
 * currently only appear after client-side JS calls Supabase, so a crawler
 * that doesn't wait for that fetch sees an empty grid. This script bakes
 * the current projects into the HTML at build time, so there is always
 * real content in the initial response. The existing js/projects.js still
 * runs in the browser afterwards and can update the grid live (e.g. right
 * after you add a project in the admin panel, before the next deploy).
 *
 * Requires Node 18+ (uses the built-in fetch). Netlify's build image has
 * this by default.
 */

import { readFile, writeFile } from "node:fs/promises";

const SUPABASE_URL = "https://blsedknkchudwqfsoazm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsc2Vka25rY2h1ZHdxZnNvYXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzA1ODgsImV4cCI6MjA5OTUwNjU4OH0.k3vTYpU4sRsLgrrcis2OEd_TtGkuEOo7jIh2JGOqBaQ";

const INDEX_PATH = new URL("../index.html", import.meta.url);

const START = "<!--SSR_PROJECTS_START-->";
const END = "<!--SSR_PROJECTS_END-->";

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function iconSvg(category) {
  if (category === "minecraft") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
  }
  if (category === "python") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>';
}

function cardHtml(p) {
  const hasLink = p.link && p.link !== "#";
  const media = p.image
    ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">`
    : `<div class="pcard-icon">${iconSvg(p.category)}</div>`;

  return `
    <a class="pcard reveal" href="${hasLink ? escapeHtml(p.link) : "#"}" ${hasLink ? 'target="_blank" rel="noopener"' : 'onclick="return false;"'
    }>
      <div class="pcard-media">${media}</div>
      <div class="pcard-body">
        <span class="pcard-tag">${escapeHtml(p.tag || "Project")}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description || "")}</p>
      </div>
    </a>`;
}

async function fetchProjects() {
  const url = `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    console.warn(`[build-projects] Supabase fetch failed: ${res.status} ${res.statusText}`);
    return [];
  }

  return res.json();
}

async function main() {
  const html = await readFile(INDEX_PATH, "utf8");

  const startIdx = html.indexOf(START);
  const endIdx = html.indexOf(END);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(
      `[build-projects] Markers ${START} / ${END} not found in index.html — skipping SSR injection. ` +
      `Add them inside <div class="projectsGrid" id="projectsGrid">...</div>.`
    );
    return;
  }

  const projects = await fetchProjects();
  console.log(`[build-projects] Fetched ${projects.length} project(s) from Supabase.`);

  const injected = projects.length
    ? projects.map(cardHtml).join("\n")
    : "";

  const before = html.slice(0, startIdx + START.length);
  const after = html.slice(endIdx);
  const newHtml = `${before}\n${injected}\n${after}`;

  await writeFile(INDEX_PATH, newHtml, "utf8");
  console.log("[build-projects] index.html updated with static project cards.");
}

main().catch((err) => {
  // Never fail the whole Netlify build just because this enhancement broke —
  // the site still works fine client-side without it.
  console.error("[build-projects] Non-fatal error, continuing build:", err);
});
