# Stress-Testing a Design With Worst-Case Data

A design that only works with the data it was drawn with is a mockup. Demo content gets picked, mostly without anyone noticing, because it looks good: names that fit on one line, every optional field filled, counts that never need a comma. Real customers show up with the other kind of data. Load that data on purpose, look at what breaks, and fix it before anyone else sees it.

Run this pass after the visual redesign and before the review. It finds the problems a screenshot of the happy path hides, and it is the part of "looks designed" that survives contact with real users.

## The posture

Pretend to be the most awkward realistic user the screen will ever meet. Her name is Oluwadamilola Folasade Adebayo-Ogunleye. Her colleague's email address has 60 characters. Her new hire goes by "Bo". Her shop has 1,284 orders this month and, on Sunday morning, none.

Two rules keep this honest:

1. **Plausible data only.** "aaaaaaaaaaaaaaaaaaaaaaaa" proves nothing, and anyone can wave it away. Use names, addresses and amounts a real person could produce, or the actual limit from the database column or validation schema. If there is no limit, write "unbounded" in your notes and test something long but believable.
2. **Go beyond long text.** Long names are the failure everyone expects. The ones that reach production are the one-letter name, the missing photo, the "1 orders" label, the empty list, and the button whose text got translated.

## Step 1: List every value the screen shows

Before inventing bad data, read the component and write down each value it renders: where it comes from, its type, whether it can be missing, and its limit if there is one. Include the easy-to-forget items:

- counts in headers and tab labels
- relative times ("3 min ago")
- badge and status text
- button labels that come from data
- tooltips
- avatars and logos
- the list as a whole (how long it is counts as a value)

Check the limits in the schema, the migrations, the API types and any `maxLength` on the form. Where the form allows 50 characters and the column allows 255, longer values will arrive through an import or the API sooner or later. Note it.

## Step 2: Build the worst-case dataset

Make a second dataset with the same shape as the demo data and swap it in at the same place (the fixture, the mock, the props). Do not fake a break by editing the markup by hand, since that only tests your edit and not the design.

Spread the failures across rows, the way real data does. Row one has the long name, row two the long email, row three the single letter, row four the missing field. The first few rows are what is on screen, so put the worst of it there.

Below is the catalogue to draw from. Each category lists the value, what usually breaks, and the fix. Use example.com, example.org or .test for addresses which keeps the fixture from pointing at a real inbox.

## Catalogue

### Text length

| Value | What usually breaks | Fix |
|---|---|---|
| `Oluwadamilola Folasade Adebayo-Ogunleye` | Wraps to two lines and pushes the row taller; the hyphen becomes a line-break point | Let names wrap (two lines is fine) and top-align the avatar once rows can differ in height |
| `Christopher Alexander Montgomery-Hughes III` | Initials code produces "CI" | Build initials from the first and last real words, drop suffixes, and fall back to an icon |
| `Bo` and `J` | The name column looks empty; a link made of one letter is a tiny tap target | Give the clickable row a minimum height of 44px, not just the text |
| `adaeze.nwosu-okonkwo@lagos-dispatch-partners.example.com` | No spaces means no break points; it shoves the menu button off the row | `overflow-wrap: anywhere` on the email, `min-width: 0` on the column that holds it, `flex-shrink: 0` on the button |
| `https://example.com/shops/mama-tope/orders/2291?tab=notes&filter=unpaid` | Same overflow; end-truncation hides the part that differs | Show the host and path in the middle-truncated form, link the full URL |
| `Wedding-cake-order_FINAL_v7 (customer approved).pdf` | Truncating the end hides the version and the file extension | Truncate in the middle so the start and the extension both survive |
| A 1,500-character pasted note | A card grows to fill the screen; the layout around it collapses | `line-clamp` for previews, a "Show more" control, and a textarea with a sensible max height |
| Twelve tags on one item | A wall of pills | Show three, then "+9", with the rest in a popover |
| Newline inside a single-line field | Doubles the row height, or disappears | Decide: collapse whitespace with `white-space: normal` or keep it with `pre-line`, and test both |

Choose per field, not globally:

- **Wrap** anything the user needs in full to identify the record: names, product titles.
- **Truncate at the end** for secondary text where the start carries the meaning: job role, message preview.
- **Truncate in the middle** where items differ at the end: file names, long emails, IDs.
- **Clamp** (`-webkit-line-clamp: 2` with the standard `line-clamp` alongside) in card previews, which keeps card heights predictable.
- **Never truncate** amounts, dates, quantities or anything people compare. Give them the room they need and let something else yield.

Whenever you truncate, the full value must be reachable: a tooltip that also opens on keyboard focus, or the detail view. A `title` attribute alone does nothing on a phone.

### Missing and empty

| Value | What usually breaks | Fix |
|---|---|---|
| No name, only an email | Heading collapses to nothing | Fall back to the email local part, then to "Unnamed customer" |
| No phone number, no photo, no address | A dash on its own line, or a gap in the grid | Leave the line out when it has no value, or reserve the height deliberately. Don't render a lone "-" |
| Empty string, or three spaces | Zero-height row; a blank title | `trim()` before checking, and treat blank as missing |
| Zero items | A white void with a table header floating above it | A real empty state (see `apps.md`): one sentence and one action |
| Exactly one item | A grid that looks broken with a single card | Check the layout with one, two and three items |
| `null`, `undefined`, `NaN` | The words appear on screen | Guard at the boundary and show a deliberate placeholder |
| Filter or search with no matches | Same void as an empty list | A message that quotes the search term and offers to clear the filter |

### Size and scale

| Value | What usually breaks | Fix |
|---|---|---|
| `0` and `1` | "1 orders", "0 order", a progress bar at 0%, division by zero | `Intl.PluralRules` or separate strings per count; guard every percentage |
| `1284` | Missing separator | `new Intl.NumberFormat(locale).format(n)` |
| `1,284,000` in a badge | Badge stretches the row | Compact notation where precision doesn't matter: `notation: "compact"` |
| `142%`, `-3%` | A progress bar past its end, or a negative width | Clamp the visual to 0-100 and print the real number |
| A value that updates live (`99` to `100`) | Layout jitter every time it ticks | `font-variant-numeric: tabular-nums`, plus a `min-width` in `ch` units |
| 1,000+ rows with no pagination | Slow scrolling and a long render | Paginate or virtualise, and say which in the report |
| Page size and page size + 1 | "Showing 20 of 20" and a blank page 2 | Test both boundaries |
| One item ten times the size of its neighbours | Grid rows stretch to the tallest card | Fix a height or clamp the content; align items to the start |
| The longest realistic label in another language | Buttons and tabs overflow (below) | Size from content using `min-width`; avoid a fixed `width` |

Translated text runs longer. German and Finnish often add 30 to 40% to English, and compound words such as `Benachrichtigungseinstellungen` have no break point at all. For a quick test, wrap every UI string in a helper that pads it with extra characters (a common technique is adding 40% filler and brackets around it) and look for anything that clips.

### Scripts and characters

| Value | What usually breaks | Fix |
|---|---|---|
| `Ọlábísí Àjàyí` | Combining marks and dot-below letters get clipped by tight `line-height` with `overflow: hidden`; some fonts lack the glyphs and fall back to a mismatched face | `line-height` of at least 1.25 on text that can hold diacritics; choose a font that covers Yoruba (check for ọ, ẹ, ṣ and the tone marks); never clip text boxes vertically |
| `Chinedu Ọkọrọ` and `Ìbàdàn` in search | Searching "ibadan" finds nothing | Normalise both sides: `s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()` |
| `فاطمة الزهراء بن عبد الله` | Punctuation and icons jump to the wrong side; list order is wrong in a right-to-left layout | `dir="auto"` on the element showing user text; logical properties (`margin-inline-start`, `padding-inline`) instead of left and right |
| Latin text inside an Arabic sentence, or the reverse | The order of mixed text scrambles | Wrap the user value in `<bdi>` so it keeps its own direction |
| `王秀英` (no spaces) | Initials logic finds one word; the string can wrap anywhere | Initials from the first grapheme; accept that CJK wraps between characters |
| `🦊 Fox` and `👩🏾‍💻 Amaka` | `name[0]` returns half a surrogate pair and shows a replacement character; slicing splits ZWJ emoji | Use `Intl.Segmenter` (granularity `"grapheme"`) to take the first character |
| `Siân ap Gruffydd`, `Seán Ó Súilleabháin` | Lower-case particles break sorting by "last name"; accents break naive search | Sort with `localeCompare(b, locale)`; don't guess surnames |
| `<b>Hot</b> & spicy` or `**bold**` | Raw tags or markdown render, or worse, run | Escape once at the render layer; avoid `dangerouslySetInnerHTML` for user data |
| Thai or Vietnamese stacked marks | Clipped tops and bottoms | Same `line-height` rule as above, plus test in the real font |

Initials are a good canary. If your avatar fallback uses `name.split(" ")[0][0]`, it will fail on at least four of the rows above.

### Odd and messy data

**Dates and timezones**

| Value | What usually breaks | Fix |
|---|---|---|
| "Now" | "0 seconds ago" | Under a minute, say "just now" |
| 12 days, 11 months, 3 years ago | Thresholds in relative-time code | Switch to an absolute date after about a week; use `Intl.RelativeTimeFormat` |
| A future date | "-3 days ago" | Handle the sign: "in 3 days" |
| `1970-01-01` | A zero timestamp appears as a real date | Treat it as missing |
| `2026-01-31T23:30:00Z` | Reads as 31 January in London but 1 February in Lagos (UTC+1), so the same order lands in different months | Format with the user's timezone, and show the timezone on anything time-critical like a delivery slot |
| A booking that crosses midnight or a clock change in the UK | Duration or end time off by an hour | Store UTC, format at the edge, and test the last Sunday of March and October |

**Money**

| Value | What usually breaks | Fix |
|---|---|---|
| `₦1,250,000.50` | Overflows a fixed-width totals column | Right-align, `tabular-nums`, and let the column size to its content |
| `NGN` versus `₦` | Hard-coded "$" prefix, wrong symbol for the shop | `new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`. Remember the symbol may not exist in the fallback font; test it on a Windows machine |
| `-₦4,500` | Sign lost, or red text with no other cue | Include a minus sign and a word ("Refund"), and don't rely on red |
| `0.1 + 0.2` | `0.30000000000000004` | Store amounts in kobo or pence as integers; format at render |
| `1.250,00` (German) vs `1,250.00` | Hard-coded separators are wrong for half the world | Always format through `Intl.NumberFormat` with the right locale |

**Slow and failed loads**

| Value | What usually breaks | Fix |
|---|---|---|
| Avatar URL that returns 404 | Broken-image icon | `onError` swap to the initials fallback; `object-fit: cover` |
| A 4000x200 banner or a 200x4000 photo | Distortion, or a card the height of the page | `aspect-ratio` plus `object-fit: cover` |
| Dark logo on a dark theme | Invisible | Supply a light variant, or put the logo on a neutral plate |
| Image arriving late | Content jumps down when it loads | Reserve space with `width`, `height` or `aspect-ratio` |
| API request that takes 8 seconds | Skeletons that don't match the layout, or a spinner on a blank page | Skeletons shaped like the real rows (see `apps.md`) |
| API request that fails | Raw `TypeError: Cannot read properties of undefined` on screen | A plain-words error with retry, and keep what the user typed |
| Half the fields filled in a list | Misaligned rows | Fixed column positions, even when a cell is empty |
| Every status at once | Badge widths vary and the column looks ragged | Render all values of the enum in one list and set `min-width` |

## Step 3: Check the environment, not just the data

Flip to the worst-case dataset, then change the conditions:

- the width of the component's actual container (a list in a sidebar behaves differently from a full-page list), then 320px, then the widest layout it supports
- browser zoom at 200%, or a raised root font size, because text grows and boxes don't
- dark mode
- `dir="rtl"` on the wrapper, if the product serves Arabic or Hebrew readers
- a touch device: any action that appears only on hover is unreachable, so it needs a visible or long-press alternative
- 2560px wide: lines too long to read, and content stranded on one side

## The "Demo data / Worst case" toggle

Put both datasets behind a small segmented control so you or any reviewer can flip while looking at the screen. Keep it plain: a grey track with a white pill marking the active segment, system font, fixed to the bottom centre. It is chrome, not part of the design under test, and switching should be instant with no animation on the content.

Segments worth having:

- **Demo**: the happy path
- **Worst case**: the mixed dataset above
- **Empty**: zero items
- **One**: one item only, with each count sitting at exactly 1
- **1,000 rows**: the realistic upper bound

Wiring it:

- In a project with a dev server, read a `?data=worst` query parameter at the point where the fixture is chosen. The URL keeps the choice across reloads and lets you share a link to a broken state.
- In a single HTML file, hold both arrays in the script and render from whichever is active.
- Gate it behind the development environment so it never ships. In a single-file deliverable, remove it before the final handoff, or hide it unless the URL contains the parameter.

Keep the worst-case fixture after the fixes. It is the regression test for the next person who edits the screen.

## Reporting what you found

Report first, then fix what is clear-cut, and ask about the rest. Some breaks are design decisions (wrap or truncate this column? show "-" or hide the line?), and those are the owner's call.

For every break, give the field, the value that caused it, what happened, and the fix with its location in the code. Rank by severity:

- **Broken**: content unreadable, an action unreachable, wrong data shown
- **Ugly**: readable but visibly wrong, like a squashed avatar or a badge on two lines
- **Fragile**: fine today, one realistic step from breaking, like a field with no length limit

Example row:

| # | Severity | Field | Value | What happens | Fix |
|---|---|---|---|---|---|
| 1 | Broken | `email` | `adaeze.nwosu-okonkwo@lagos-dispatch-partners.example.com` | Pushes the actions menu off the row at 390px | `min-width: 0` on the text column, `overflow-wrap: anywhere` on the email, `flex-shrink: 0` on the menu (`OrderRow.tsx:41`) |

After the table, add two short sections: **Decisions for you** (breaks that have several valid fixes, each paired with your recommendation) and **What held up** (the worst cases the screen already handled, so nobody touches them).

Then re-run every toggle state after the fixes. Make sure a worst-case fix leaves the demo case intact, and the one-item and empty states are the likeliest to regress.

If you couldn't view the result in a browser, say which findings you saw and which you inferred from the CSS.

## The fix you will reach for most

`min-width: 0` on a flex or grid child solves more overflow bugs than anything else, because flex items refuse to shrink below the width of their content until you allow it. Pair it with `flex-shrink: 0` on avatars, badges and menu buttons, and `font-variant-numeric: tabular-nums` on anything numeric.
