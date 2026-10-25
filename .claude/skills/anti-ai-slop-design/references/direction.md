# Choosing a Direction

A direction is the small set of decisions that makes every screen of a product feel like it came from the same hand. Without one, each section gets designed from defaults and the whole thing averages out into slop. This file covers how to pick a direction, then how to turn it into type, colour, layout, imagery, copy and code.

Every example value here (a hex code, a font, a width) shows the kind of decision to make. Copy none of them. Two projects that borrow the same values end up looking the same.

## Part 1: Picking the direction

### Step 1. Name the category default

Look at what the top three players in this space have in common: the layout of the first screen, the colour, the typeface, the photographs, the tone of voice. Write it as a short paragraph and keep it where you can see it.

A worked example. The product is a booking page for a Peckham barbershop. The category default is a black page with gold accents, a moody photo of a razor, a script font for the logo, and "Look sharp. Feel sharp." as the headline. Writing that down makes it easier to notice when you are drifting back to it.

Add the category's cliché colour to the same note (navy for banks, sage for wellness). You can still use it when the product earns it, with the reason in the file.

### Step 2. Write the concept sentence

One sentence: "[Product] is a [thing]." The thing comes from outside the web. It might be an object (a tailor's tape measure), a place (a Saturday market stall), a printed item (a bus timetable pinned at a stop), or a pastime (a draughts board). The sentence is a decision-maker. Later, when you wonder whether the button should be square or round, the concept answers.

Some sentences and what they imply:

- "This booking page is a chalkboard outside the shop." Dark slate ground, hand-lettered feel for headings only, price list as the main content, bookings as a simple list of times.
- "This school-fees tracker is a bursar's ledger." Ruled columns, tabular figures everywhere, a paper-white ground, red ink reserved for money owed.

Rules for good sentences:

1. **Avoid adjectives.** "Modern and trustworthy" gives you nothing to build from.
2. **Use something tangible.** If you can picture holding it, you can design from it.
3. **Push past your first idea.** The first object your mind reaches for is the one most people (and most models) reach for. Departure boards, train tickets and till receipts are the usual first guesses. Write that idea down, then take the third.
4. **Make sure the thing fits the work.** If the metaphor makes the real task harder, drop it.

Do not apply the concept as a costume. The chalkboard sentence does not mean a photo of chalk. It means the information is arranged and spoken the way a chalkboard would.

### Step 3. Explore several directions cheaply

One direction is a guess. Make three different ones and compare them on the same footing.

1. Write three concept sentences from three different places. At most one may be quiet paper-and-ink.
2. Build only the first screen of each (the first viewport on a phone and on a laptop). Use real words, real data and plain HTML and CSS in separate files, `explore/a.html`, `b.html`, `c.html`. Spend a short, fixed time on each. The goal is to compare directions, and a finished page would be wasted effort if you choose a different route.
3. Make them differ on purpose. Vary at least the ground (light, dark, a flat colour or an image), the typeface, the main visual (photo, drawing, shape, the product itself, data), the accent hue and the page layout. Two options that share a ground and a typeface are one option.
4. Put them side by side. If you can take screenshots (a headless browser such as Playwright works in cloud sessions, and your own tools may include one), capture each at 390px and 1280px wide and look at all six images in one view. If you cannot, open the three files in separate tabs and compare. Do not judge from the code.
5. Choose. Record the winner, then give one line on each rejected option explaining the loss. Playing it safe is frequently a mistake. Pick the most specific to this product.
6. You may merge ideas, as long as the result keeps one voice. Note what came from where.

If the owner is in the conversation, show the three and your pick before you continue.

### Step 4. Write the tokens

Store the decisions where code can use them. A short `DIRECTION.md` is enough:

```
Default refused: black and gold, razor close-up, script logo
Concept: the chalkboard outside the shop
First-screen image: today's price list, in the shop's own handwriting (photo)
Type: [display face] for headings, because [reason]; [text face] for reading, because [reason]
Colour: ground [..] (slate from the board), ink [..], one accent [..] used for "book now" only
Radius: 2px on controls, none on images
Spacing unit: 8px
Voice: talks like the owner, brief, exact about prices
```

If you cannot fill a line, that decision is still a default.

## Part 2: Type

### Choose a face for its voice

Ask what the concept sounds like when spoken, then find a face that sounds the same. Write the reason in one sentence ("Libre Franklin, because the old newspaper grotesques look like the printed price lists in the shop window"). "Clean and modern" describes any typeface ever released, so it explains nothing. The most common choices (Inter, Poppins, Playfair, Space Grotesk, and others of that kind) are good typefaces, which is why everyone picks them. Use one when you can defend it, such as a dense admin screen that needs very legible small numerals.

A starting set grouped by what they do, all available free from Google Fonts. Check the licence before shipping.

| You want | Consider |
|---|---|
| Plain and sturdy sans for dense work | Source Sans 3, Libre Franklin, Public Sans |
| A sans with some warmth | Karla, Rubik, Nunito Sans |
| A slab with muscle for signs and menus | Bitter, Zilla Slab, Roboto Slab |
| Reading serif for long text | Source Serif 4, Literata, Merriweather |
| A serif with character for headings | Young Serif, DM Serif Display, Bodoni Moda |
| Figures and code | IBM Plex Mono, Space Mono, Source Code Pro |

Test the language before you commit. If the audience writes Yoruba, Igbo, Twi or Vietnamese, confirm the face includes the marks (ẹ, ọ, ṣ, ń, ɔ). Type the actual words into the sample at fonts.google.com. If the face lacks them, the browser quietly swaps in another font for those letters and spoils the rhythm. Noto Sans and Noto Serif cover the widest range.

### Pairing

- One family with several weights is often enough.
- Two families at most for content, and one more only for code or numbers.
- Pair a face with a clear job (headings) with a quiet one (text), in similar proportions so they do not fight.

### A scale you write down

Choose six to eight sizes and name them. Sites can have large, fluid display sizes with `clamp()`. App text stays small and fixed.

```css
:root {
  --text-xs: 0.8125rem;   /* metadata */
  --text-base: 1.0625rem; /* body */
  --text-lg: 1.375rem;
  --text-xl: clamp(1.75rem, 1.2rem + 2vw, 2.5rem);
  --text-xxl: clamp(2.5rem, 1.5rem + 4vw, 4.5rem);
}
```

Rules to keep the scale working:

- Heading sizes should contrast visibly with the body. A heading just 10% larger than body text adds nothing.
- Body line-height is around 1.5 to 1.65; headings 1.05 to 1.2.
- Reading text sits in a column of 45 to 75 characters (`max-width: 65ch`).
- In apps, body is 14 to 15px, nothing meant to be read goes below 12px, and you build hierarchy through weight, colour and placement before reaching for size.
- Tighten letter-spacing a little on large headings, and open it up on small uppercase labels.
- Use `font-variant-numeric: tabular-nums` where figures line up in columns or change in place (prices, timers, tables).
- `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs avoid awkward last lines.

### Fallbacks and loading

Visitors on slow connections, older Android phones and Windows see your fallback first. Write a stack that works on every platform and keeps similar proportions:

```css
--font-text: "Your Face", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "Your Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

Use `font-display: swap`. In Next.js, `next/font` self-hosts the file and adjusts the fallback so nothing jumps. In a single HTML file, a Google Fonts `<link>` works if you add `preconnect` hints and keep to two families and the weights you use. Where reliability matters (a stage demo, patchy connectivity), download the font and serve it from your own folder.

## Part 3: Colour

### Roles, then values

Name colours by the job they do, not their look.

```css
:root {
  color-scheme: light dark;
  --ground: #f7f5f0;      /* page background */
  --ink: #1e1c19;         /* main text */
  --ink-soft: #55514a;    /* secondary text, still 4.5:1 on ground */
  --accent: #b3341b;      /* one job: the main action, or "now" */
  --focus: #1c5fd1;
}
```

- Derive the palette from the concept's world and write the source next to each colour. "Ground: the grey-green of the shop's shutters." If you cannot account for a colour, it is a default.
- Tint your neutrals slightly toward the ground's hue so they sit together. Pure framework greys look pasted in.
- One accent, with one job. If a second hue appears, it has a different job.

### Status

Apps need colours for state, so keep them disciplined.

- Four states at most: good, needs attention, critical, and neutral.
- Pair colour with a word, a shape or a position. Some users cannot tell red from green, and printouts are often black and white.
- Saturation is reserved for items that need action; anything healthy stays in quiet ink.
- Categories (tags, projects, people) are different from states. Use labels or a muted set for them so they do not look like warnings.

### Light and dark

Design the dark theme separately; inverting the light one rarely works.

- The dark ground is a deep tone of your hue, not `#000`, unless the site is image-led.
- Lower the accent's saturation and raise its lightness slightly so it does not glare.
- Raised surfaces become lighter than the ground in dark mode. Shadows barely show.
- Check every text pair again.
- If you ship one mode only, say so and still set `color-scheme` to match so form controls look right.

### Contrast

- 4.5:1 for normal text; 3:1 for large text (24px and up, or bold 18.66px and up), icons, input borders and focus rings.
- Text over photos needs a scrim or a solid band.

## Part 4: Layout

### Page grammars from visitor questions

List what a visitor wants to know, in the order they want to know it. Each question becomes a section. Cut any section you cannot attach to a question. Four to six sections cover most pages.

Some shapes that have worked:

- **The shop counter.** Opens on the range with prices; filters and quick add. For stalls, caterers, bakers.
- **The proof page.** Opens on a result or a piece of work and builds the case with details. For consultants, builders, photographers.
- **The single sheet.** Everything on one screen: who, what, when, where, how to reach us. For a church service, a pop-up, a market stall.
- **The long read.** One argument with headings and a contents list. For a manifesto, a guide, a product that takes explaining.
- **The tool first.** The page opens on something the visitor can try: a calculator, a search, a price estimate.

A sample for a Nairobi tour guide: what will I see, who is taking me, when and how much, what do people say, how do I book (a WhatsApp button and a short form).

### The first screen

It holds three things: evidence (a photo, the product, the price), a plain statement of what this is, and the single action. Check the phone version separately, because stacking the desktop layout often pushes the action below the fold. Leave off the badge, the second button, the fine print and the row of numbers, because none of them helps a visitor decide.

### Grids, widths and space

- Pick a grid and make left edges land on four or five vertical lines.
- Set text to a comfortable measure. Let photos, tables and product shots break wider.
- A spacing scale of six to eight steps (for example 4, 8, 16, 24, 40, 64, 104) kept as tokens.
- Keep related things close and unrelated things far apart. Equal gaps everywhere make nothing group.
- Leave a bigger gap over a heading than under it, and the heading attaches to the content that follows.
- Prefer space, then thin rules, then boxes, in that order. Boxes belong to objects and floating things. Inner radius equals outer radius minus padding.

### Phone first

Over half your visitors may be on a phone, often on mobile data. Design that layout directly.

- Use `100svh` or `100dvh` where you used `100vh`. Avoid `100vw` for widths because it includes the scrollbar on desktop.
- Touch targets at least 44px where you can.
- Nothing should rely on hover.
- Test at 320px: no sideways scroll, no clipped text.

## Part 5: Imagery

### What you can honestly use

In order of preference:

1. **The owner's own photos, screenshots and artwork.** Ask for them first. Phone photos taken in good light beat stock.
2. **The product itself**, built in HTML at full size with real data and real states.
3. **Drawings and shapes** made in code (SVG, CSS) in one consistent hand, with colour fields and patterns drawn from the concept.
4. **Licensed photography**, credited and downloaded into the project, never hotlinked. Check each licence.
5. **Generated images**, only if the owner has agreed, with one art direction written first (light, distance, colour grade, what never appears), and used for atmosphere only.

Never create fake customers, fake staff, fake reviews, fake client logos, or images that present an invented place as a real one. For categories sold by photographs (restaurants, hotels, builders, fashion), ask for real pictures. If there are none yet, design frames that will take them, caption honestly, and let type and colour carry the page for now.

### Details

- Set `width` and `height` (or `aspect-ratio`) on every image to prevent jumps.
- Use `loading="lazy"` below the fold and a preloaded, sized hero.
- Write `alt` text describing the image's content and its purpose on the page. Decoration gets `alt=""`.

### Favicon and social card

Finish the small things people see first. An SVG favicon that reads on light and dark tabs, a 180px apple-touch-icon, a 512px icon for the manifest, and a 1200 by 630 social image built from the same tokens with the real headline. Preview it by sharing the link in a chat.

## Part 6: Copy and voice

Write the words before the layout. Every headline, label, button, price and number should exist in the file before you arrange anything.

- **Specific over generic.** Use the words a regular would use when recommending you to a neighbour. "Hot jollof, collect from the window by 1pm" beats "Delicious food, delivered".
- **Verbs on buttons**: "See the menu", "Book a haircut", "Send the invoice".
- **Believable data.** Prices in the right currency (₦4,350, £18.50), odd times, a realistic mix of states (4 paid, 2 pending, 1 late). Use names and places your audience would recognise.
- **Real testimonials or none.**
- **Errors and empty states** say what happened, what to do next, and never blame the user.
- **Punctuation.** Sentence case, full stops where a sentence ends, plain text with no emoji, and exclamation marks only for genuine excitement (which is rare).
- **Voice line**: write one sentence about how the product talks ("Like a good market trader: warm, quick, honest about the price") and test every string against it. If anti-ai-slop-writing is available, run the page copy through it.

## Part 7: Redesign specifics

Redesigning means replacing a look and keeping the business.

1. **Capture it first.** Screenshots of every key page at phone and laptop width, so you can compare and so nothing gets lost.
2. **Write the keep list.** Pages, features, forms, real photos, the logo, brand colours people recognise, copy that works, legal text. The new version must contain every item.
3. **Harvest real assets.** Pull the logo (SVG if you can), photos, fonts and colours already in use, real copy and real numbers from the existing site or repo. Use them before inventing anything.
4. **Differ from the old look.** The new direction should differ from the current one in several obvious ways (ground, type, main visual, layout), unless the owner asked for a gentle refresh. Say which parts you kept.
5. **Leave these decisions to the owner.** Renaming the business, replacing the logo, restructuring navigation, removing a page, changing how prices are shown, rewriting legal text. List them in your report and wait for approval.
6. **Show before and after.** Two screenshots side by side, desktop and phone.

## Part 8: Stack notes

Read the project before you write anything: `package.json`, the styling approach, existing tokens, fonts, icon set, and how it runs. Do not swap the framework or add dependencies without saying so. With no project, a plain `index.html`, `styles.css`, and an `assets/` folder is enough.

**Plain CSS or a single HTML file.** Put tokens in `:root` as custom properties and have every rule use `var(--...)`. Colours, type sizes, spacing and radii all become tokens.

**Tailwind v4.** Tokens live in CSS under `@theme`, and utilities are generated from them:

```css
@import "tailwindcss";
@theme {
  --color-ground: #f7f5f0;
  --color-ink: #1e1c19;
  --color-accent: #b3341b;
  --font-display: "Your Face", Georgia, serif;
  --radius-control: 2px;
}
```

Then use `bg-ground text-ink font-display`. Avoid the default palette (`slate-500`, `indigo-600`). A colour that is not a token is a default.

**Tailwind v3.** Keep the tokens as CSS variables and map them in `theme.extend.colors` (`ground: "var(--ground)"`).

**shadcn/ui.** The components are files you own, themed by variables in `globals.css` (`--background`, `--foreground`, `--primary`, `--radius`, and the rest). Their defaults are a well-known look, so:

1. Rewrite every variable for light and dark from your tokens.
2. Set `--radius` from your radius rule.
3. Edit component files where the concept needs a different button height, input border or table density.
4. Adjust the icon stroke weight to match your type.

**Next.js.** Load fonts with `next/font/google` or `next/font/local`; they are self-hosted and the fallback is size-adjusted. Use `next/image` with a real `sizes` attribute. Check the installed version's docs before using an API from memory.

**Other stacks.** Tokens go in one global stylesheet. For MUI, Chakra or Mantine, map them into the theme object.

**Build order.** Tokens and fonts, then the core page with real content, then its states (empty, loading, error), dark mode and phone layout, then the other pages. A single page that displays every colour, size and space token is the cheapest review you can do.

**After each CSS change,** confirm it reached the browser. If a style seems to have no effect, delete the dev server's cache folder and restart before you debug the CSS: `.next/` when using Next.js, `node_modules/.vite` when using Vite.

**Quality floor.** Semantic HTML, real buttons and links, a label on every field, visible focus, a `lang` attribute, the viewport meta tag, and content visible without JavaScript.
