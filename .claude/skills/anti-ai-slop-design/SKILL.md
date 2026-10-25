---
name: anti-ai-slop-design
description: Designs or redesigns a web page or web app (a single HTML file, or a React / Next.js project) so it looks and feels made by a person instead of generated. Covers direction, type, colour, layout, real content, UI components, motion, mobile feel, polish, worst-case data and review. Use when building a page or app that should look designed, or when an existing product needs a visual pass before it ships, gets pitched, or goes on stage. Activates on "design," "redesign," "beautify," "de-slop," "make this look less AI," "kill the AI look," "this looks like every other AI site," "make it look designed," "make it feel premium," "polish the UI," "add animation," "make it feel native on mobile," or any request to improve how a product looks or feels without changing what it does.
---

# Anti-AI-Slop Design Directive

Makes a web product look and feel like a person designed it on purpose. Every design or redesign under this skill follows these rules. This is the visual sibling to anti-ai-slop-writing: same author, same refusal to accept the default output.

## How This Skill Is Organised

This file holds the rules and the workflow. The detail lives in `references/`, and you read each file only when a step needs it:

| File | Read it when |
|---|---|
| [references/slop.md](references/slop.md) | Before you start, and again at review. The full catalogue of default looks and the tells to remove |
| [references/direction.md](references/direction.md) | Choosing the concept, type, colour, layout, imagery and copy. Also for redesign specifics and stack notes |
| [references/components.md](references/components.md) | Choosing UI components and libraries, and rebuilding them on the project's own tokens |
| [references/apps.md](references/apps.md) | The product is a web app (a tool people use), not a marketing page |
| [references/motion.md](references/motion.md) | Adding or reviewing any animation |
| [references/mobile.md](references/mobile.md) | Anything people will use on a phone, which is almost everything |
| [references/polish.md](references/polish.md) | The finishing pass: buttons, states, forms, depth, type details, dark mode |
| [references/stress-test.md](references/stress-test.md) | Before calling it done: feed it worst-case data and fix what breaks |
| [references/review.md](references/review.md) | Scoring the result, deciding when to stop, cross-platform checks, the final report |

And one script: `scripts/check.mjs` takes phone and desktop screenshots and scans the page for mechanical problems (see "Check It on Screen").

## What This Skill Does

It works in two modes.

- **Redesign:** the product exists and works. It needs to stop looking generated. Keep every feature, change how it looks and feels.
- **Design while building:** the product is being built now. Make the design decisions first, so the first version isn't the generated default.

In both modes, never add or remove features unless the owner asks. The job is the look, the feel and the content, not the product's behaviour.

## The Core Idea: Slop Is the Average

Generated design isn't ugly. It's average: each choice sits at whatever value turns up most often. Any one of those choices is fine. Pile them up and you get a product with no owner, one that could swap logos with its nearest competitor and nobody would notice. People spot it in a second.

Doing the opposite of the AI doesn't fix it, because the opposite quickly becomes a template too. What fixes it is **deciding**: work out what this particular product is, and let that drive every colour, font, layout and image.

## The Slop Has Moved

The loud 2023 look (purple gradients, glowing blobs, "supercharge" copy) is now so mocked that good models avoid it unprompted. Today's defaults are quieter and more tasteful, which is exactly why they get through. Four to recognise on sight (more in references/slop.md):

- **The tasteful marketing page:** warm off-white background, a serif headline with one word italicised in an earthy accent, a small "New" pill above it, a black pill button beside an outlined one, a floating product card with a soft shadow, a row of four big numbers, and small spaced-out monospace labels above every section.
- **The launch page:** dark background, centred headline fading into violet, a glow behind it, a tilted screenshot, a strip of grey client logos, a row of three feature boxes each topped with a small icon on a coloured tile, and a closing "get started" band.
- **The light dashboard:** wide sidebar, search bar with a bell and a "+ New" button, then a row of metric cards with tiny charts and "+20%" badges, white rounded boxes on grey, pastel status pills in many colours.
- **The dark dev tool:** the same skeleton on near-black, grey text too faint to read, filter tabs with counts, rows of monospace text with green toggles and tag pills.

If the product shares more than three features with any of these, it isn't done.

**The overcorrection** is the trap people fall into after learning the list above: off-white, oversized type, numbered mono labels, a fake technical detail such as a ticking clock, one rust accent and no imagery at all. It's become a template of its own. Avoid it the same way: decide from the product.

## Decide From the Product, Not From the Default

Before writing any CSS, write these down in the chat or in a short `DIRECTION.md`. references/direction.md has the detail.

1. **The category default you're refusing.** What do the top competitors in this space have in common: layout, palette, fonts? What's the colour everyone in this category reaches for? Name it so you can steer clear.
2. **A concept sentence:** "[Product] is a [thing]", where the thing comes from outside the web: a shop, an object, a place, something printed, a game. "This booking app is a well-run front desk." "This waitlist is a hand-painted shop sign." Every later choice should trace back to it.
3. **What makes the first screen worth looking at:** a real photo, an illustration, a bold shape or colour field, the product working, or real data. Large text on a plain background doesn't count.
4. **Tokens, each with a reason:** one accent colour, at most two font families, a type scale, a spacing unit, a corner-radius rule.
5. **For a new design, sketch more than one direction.** Try two or three takes on the first screen only, compare them side by side, and pick the one that's most this product. Write one line on why the others lost.

## Structure

**Sites and landing pages:**
- The first screen does three jobs, on a phone as well as desktop: shows evidence, says plainly what this is, and offers the one action you want.
- Plan sections around what a visitor wants to know, in the order they'd wonder it. Four to six sections is usually plenty, far fewer than the standard template's dozen.
- Demonstrate features instead of describing them in boxes: a working list, a before and after, a small live demo. A plain text list beats a grid of icon cards.
- One concrete number inside a sentence persuades. A row of rounded-up stats gets skipped.
- Only real customers and real quotes. Until you have some, leave that section out.
- Show the number of plans the business really has. If there's one price, put it near the top.
- Finish on something useful (price, contact, opening hours) with the action attached.

**Web apps** (more in references/apps.md):
- Work out what someone opens the app to do right now, and give that task the screen. Totals and stats shrink to one quiet line.
- One surface. Separate areas with space and thin dividers. Boxes are for things that float: dialogs, popovers, sheets.
- One accent for whatever needs attention. Show status with words and shape, not a rainbow of pills.
- Pick the layout from the work: a top bar for a few sections, a sidebar only for many, a split view for queues.

## Content First

Write the real words and data before laying anything out: headlines, labels, buttons, prices, names, numbers. Use data that looks lived-in: uneven, specific, slightly messy ("3 orders due Friday, one running late"). Never "Lorem ipsum", "John Doe" or "Acme". The content shapes the layout. If anti-ai-slop-writing is available, run the copy through it.

## Banned Patterns: Never Do These

The full list with fixes is in references/slop.md. The ones to catch every time:

- **Colour:** purple-to-blue gradients, blurred glow shapes, gradient text, several accents fighting, neon glows, faint grey text on dark.
- **Type:** one system font for everything at one weight; mono or all-caps labels over every section; the italic accent word used by reflex.
- **Layout:** everything centred in one column; three matching icon cards in a row; a coloured stripe down every card; a pill above the headline; numbered steps for content that isn't a sequence; rows of unverifiable stats.
- **Surfaces:** frosted glass on everything; one radius on every element; shadows on things that don't float.
- **Content:** fake-precise numbers, placeholder names, marketing clichés (seamless, elevate, unleash, next-gen, all-in-one), punchy two-part slogan headlines by reflex.

Any of these can be right when a specific decision calls for it. They're banned as defaults.

## Emoji to Icons: The Hard Rule

Remove every decorative emoji from the interface: headings, buttons, nav, lists, empty states. Emoji in a UI reads as unfinished and marks a product as AI-built faster than almost anything else. No sparkles for "AI" either.

Use a real icon set. Lucide is the default (MIT, maintained, easy to add).

- **React / Next.js:** install `lucide-react` and import icons by name (`import { CheckCircle } from "lucide-react"`). Give icon-only buttons an `aria-label`.
- **Single HTML file, CDN:** add `<script src="https://unpkg.com/lucide@latest"></script>`, use `<i data-lucide="check-circle"></i>`, then call `lucide.createIcons()`.
- **Single HTML file, inline SVG:** paste the icon's SVG from lucide.dev. It works with no network, which matters when the venue wifi drops mid-pitch. Pick one method per file.
- **No icon at all** when it doesn't make the meaning clearer than the word beside it. Skip the tired metaphors too (a rocket for launch, a lightbulb for ideas).

## Components, Motion, Mobile and Polish

These four are where a product starts to feel designed instead of assembled. Each has its own reference file. The short rules:

- **Components** (references/components.md): borrow ideas from good component libraries, then rebuild them on the project's own tokens instead of pasting them in as they are. Use one or two distinctive components per screen, where they earn their place.
- **Motion** (references/motion.md): animate only when it helps someone follow what changed. Animate `transform` and `opacity`, keep UI motion short (roughly 150–300ms) with ease-out curves, make it interruptible, give the product one signature moment at most, and always respect `prefers-reduced-motion`.
- **Mobile** (references/mobile.md): design the phone layout rather than stacking the desktop one. Use 16px+ inputs so iOS doesn't zoom, `dvh` instead of `100vh`, safe-area padding, hover only on devices that hover, 44px tap targets, and check it on a real phone.
- **Polish** (references/polish.md): press feedback on buttons, visible focus rings, shadows only on floating things, a radius family, tabular numbers, designed empty, loading and error states, careful dark mode.

## Fundamentals

The detail is in references/direction.md and references/polish.md. The minimum:

- **Type:** two families at most, each chosen for a reason. Tight line-height on headings (about 1.1–1.2), 1.5–1.6 on body text, a consistent type scale. Use `next/font` in Next.js, or a Google Fonts `<link>` in a single file.
- **Spacing:** one base unit (8px works) and multiples of it everywhere. Group with space before reaching for boxes.
- **Colour:** off-black and off-white, never pure `#000` / `#fff` for big surfaces, plus one accent with one job. Take colour from the concept, never from the category cliché, and never default to purple.
- **Contrast:** WCAG AA. That's 4.5:1 for body text and 3:1 for large text, including text over images.
- **Whitespace:** give the most important thing the most room.

## Keep It Usable

A prettier product that stops working has failed. Before calling it finished:

- Every interactive element keeps a visible focus state, and touch targets are at least 44px.
- Contrast passes AA for every changed pair, in every colour mode the product has.
- No sideways scroll at 320px wide, and no text that needs zooming.
- Content is visible without JavaScript. Motion is an extra, and respects reduced motion.
- Loading, empty and error states that existed before still exist after.
- Dark mode, if there is one, gets the same care as light.
- If you could only check on one machine, say so in the report.

## Check It on Screen

Look at the result at phone width and desktop width before every review round.

**With the script** (works locally, and in cloud sessions where a browser can be installed):

```bash
npm i -D playwright && npx playwright install chromium
node .claude/skills/anti-ai-slop-design/scripts/check.mjs http://localhost:3000 --out shots
```

It saves first-screen and full-page screenshots at 390px and 1440px (add `--dark` for dark mode, `--widths 320,768,1280` for more sizes). It flags sideways scroll, small tap targets, buttons with no name, images without alt text, emoji, gradient text, too many fonts and clipped text. It can also open a local HTML file directly. It exits with an error if anything fails. **Open every screenshot yourself.** The scan finds mechanics, and your eye judges design.

**Without it** (the browser won't install, or there's no dev server): review the code against references/slop.md and references/review.md, and ask the owner to open the live link on their phone and send a screenshot.

## The Workflow

1. **Read the whole thing.** For a single file: markup, styles and scripts. For a project: pages, components, global styles, Tailwind or theme config. Understand what it does before touching how it looks.
2. **Write the keep list** (redesigns): every page, section, feature, form, real piece of copy, real photo, logo and brand colour that has to survive. Everything on it must still be there at the end.
3. **List the slop present,** pointing at specific elements, and say which default look(s) it matches (references/slop.md).
4. **Decide the direction** (above, and references/direction.md). Commit to one and apply it everywhere.
5. **Write or tidy the content** before the layout.
6. **Strip the emoji** and swap in the chosen icon method, or cut the icon.
7. **Build or rewrite the styles:** tokens first, then the first screen, then the rest, then states and dark mode. Bring in references/components.md, references/motion.md, references/mobile.md and, for apps, references/apps.md as you reach those parts.
8. **Polish pass** with references/polish.md.
9. **Stress-test** with references/stress-test.md: long names, empty lists, huge numbers, Yoruba diacritics, naira amounts, slow loads. Fix what breaks.
10. **Check that everything still works.** Every button, form and feature from the original behaves as before.
11. **Review in rounds** with references/review.md: check it on screen, score it, fix the weakest areas, repeat. At least two rounds, at most four.
12. **Deliver:** for a single file, the complete revised file, not a diff. For a project, changes in place or as a pull request.
13. **Report in plain language:** the default you refused, the concept sentence, what changed and why, the keep list ticked off, what you couldn't verify, and any decisions left to the owner (a new name or logo, removing a section, pricing changes). Never make those silently.

## Final Self-Check

1. More than three features in common with any default look? Keep going.
2. Slipped into the overcorrection? Keep going.
3. Does the first screen show evidence, say what it is and offer the one action, on a phone too?
4. Any purple gradient, glow or gradient text left? Remove it.
5. Any emoji left in the interface? Replace or cut it.
6. More than two font families, or fonts with no reason behind them? Fix it.
7. Matching icon cards, a stat strip, or a pill over the headline? Break the pattern.
8. Boxes inside boxes, or one radius everywhere? Use space and a radius family.
9. Any text failing AA contrast? Fix it first.
10. Does it survive worst-case data and a 320px screen?
11. Does every animation have a purpose, and stop under reduced motion?
12. Is everything on the keep list still there and working?
13. Hide the logo. Could this belong to any other company in its category? If so, it isn't done.
