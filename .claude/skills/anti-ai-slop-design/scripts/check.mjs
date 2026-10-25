#!/usr/bin/env node
// anti-ai-slop-design: screenshot + quick scan.
// Usage:
//   node check.mjs <url-or-html-file> [--out shots] [--widths 390,1440] [--dark]
// Needs Playwright:  npm i -D playwright  &&  npx playwright install chromium
// If the browser can't be installed (some cloud sandboxes block the download),
// skip this script and review at phone and desktop width by other means.

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
if (!args[0] || args[0].startsWith("--")) {
  console.error("Usage: node check.mjs <url-or-html-file> [--out shots] [--widths 390,1440] [--dark]");
  process.exit(2);
}
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const target = args[0];
const url = /^https?:\/\//.test(target) ? target : pathToFileURL(resolve(target)).href;
const out = opt("out", "shots");
const widths = opt("widths", "390,1440").split(",").map(Number);
const dark = args.includes("--dark");

// Prefer full Playwright; fall back to playwright-core driving the installed Chrome.
let chromium, launchOpts = {};
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    ({ chromium } = await import("playwright-core"));
    launchOpts = { channel: "chrome" };
  } catch {
    console.error("Playwright isn't installed. Run: npm i -D playwright && npx playwright install chromium");
    process.exit(2);
  }
}

mkdirSync(out, { recursive: true });
const browser = await chromium.launch(launchOpts);
const report = [];
let fails = 0;

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: width < 600 ? 844 : 900 },
    colorScheme: dark ? "dark" : "light",
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const tag = `${width}${dark ? "-dark" : ""}`;
  await page.screenshot({ path: `${out}/${tag}-first-screen.png` });
  await page.screenshot({ path: `${out}/${tag}-full.png`, fullPage: true });

  const scan = await page.evaluate((w) => {
    const issues = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > w + 1) issues.push(["FAIL", `Sideways scroll: page is ${doc.scrollWidth}px wide at ${w}px.`]);

    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };

    const small = [...document.querySelectorAll("a, button, [role=button], input, select, textarea")]
      .filter(visible)
      .filter((el) => { const r = el.getBoundingClientRect(); return r.height < 44 || r.width < 44; });
    if (w < 600 && small.length) issues.push(["WARN", `${small.length} tap targets smaller than 44px on a phone.`]);

    const noName = [...document.querySelectorAll("button, a")]
      .filter(visible)
      .filter((el) => !el.textContent.trim() && !el.getAttribute("aria-label") && !el.getAttribute("title"));
    if (noName.length) issues.push(["FAIL", `${noName.length} buttons/links with no accessible name.`]);

    const noAlt = [...document.images].filter((img) => !img.hasAttribute("alt"));
    if (noAlt.length) issues.push(["WARN", `${noAlt.length} images without alt text.`]);

    const emoji = /\p{Extended_Pictographic}/u;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let emojiCount = 0;
    while (walker.nextNode()) if (emoji.test(walker.currentNode.textContent)) emojiCount++;
    if (emojiCount) issues.push(["WARN", `Emoji found in ${emojiCount} text nodes. Use a real icon set.`]);

    const families = new Set();
    let gradientText = 0;
    for (const el of document.querySelectorAll("body *")) {
      if (!visible(el) || !el.childNodes.length) continue;
      const s = getComputedStyle(el);
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
        families.add(s.fontFamily.split(",")[0].replace(/["']/g, "").trim());
      if ((s.backgroundClip === "text" || s.webkitBackgroundClip === "text") && s.backgroundImage.includes("gradient")) gradientText++;
    }
    if (families.size > 3) issues.push(["WARN", `${families.size} font families in use: ${[...families].join(", ")}.`]);
    if (gradientText) issues.push(["WARN", `${gradientText} elements use gradient text.`]);

    const clipped = [...document.querySelectorAll("body *")]
      .filter(visible)
      .filter((el) => {
        const s = getComputedStyle(el);
        return (s.overflow === "hidden" || s.textOverflow === "ellipsis") && el.scrollWidth > el.clientWidth + 1 && el.textContent.trim();
      });
    if (clipped.length) issues.push(["WARN", `${clipped.length} elements clip their text. Check they're meant to.`]);

    return issues;
  }, width);

  report.push(`## ${tag}px`);
  if (!scan.length) report.push("No issues found by the scan. Still look at the screenshots yourself.");
  for (const [level, msg] of scan) {
    if (level === "FAIL") fails++;
    report.push(`- ${level}: ${msg}`);
  }
  report.push("");
  await page.close();
}

await browser.close();
const text = `# Scan of ${target}\n\nScreenshots are in ${out}/. Open every one.\n\n${report.join("\n")}`;
writeFileSync(`${out}/report.md`, text);
console.log(text);
process.exit(fails ? 1 : 0);
