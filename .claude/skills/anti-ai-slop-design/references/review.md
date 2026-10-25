# Reviewing a Design Before You Call It Done

The person who made a design is the worst judge of it. You see what you meant to make, and you've stopped noticing the clipped label because you know what it says. This file is a method for catching what you've gone blind to: score the work against a rubric, look at it the way a user will, run the checks on other platforms, and report honestly.

Review after the stress test (`stress-test.md`) and after the app-specific work (`apps.md`) if the product is an app.

## Review with fresh eyes when you can

If your tools let you start a second agent or a clean session, hand it the screenshots and the rubric, and ask it to score without being told your reasoning. It judges pixels. You judge intentions.

- **Use the same reviewer for every round.** A new reviewer brings new taste, undoes the last reviewer's requests, and the scores never settle.
- **Wait for the review before you edit.** Mechanical bugs (a clipped label, a broken link) can be fixed before round one. Design changes wait for the scores.
- **Give the reviewer the context it needs:** what the product is, who uses it and what they do, the direction you chose (the concept sentence, the accent, the fonts), and which defaults you refused on purpose, so it doesn't ask for them back.
- **Without a second agent,** do it yourself in a cold state: take the screenshots, close the code, and score only what you can see. Write each score before you look at the next screenshot.

## The rubric

Score each category from 1 to 5. Write one sentence of evidence for every score, pointing at something visible ("the order list wraps to three lines at 390px"). A score without evidence is a mood.

The scale:

- **1 Broken.** Visible defects a user would notice at once.
- **2 Weak.** It works but looks generic or unfinished.
- **3 Acceptable.** Nothing wrong, nothing memorable. You would send it to a client with a shrug.
- **4 Good.** Deliberate and clean. You'd ship this and be happy to have your name on it.
- **5 Excellent.** A designer would screenshot it to show someone.

Be sparing with 5. If you gave it a 5 and can't name the specific thing that earns it, it's a 4.

### The categories

**1. Product fit.** Cover the logo. Could you tell what the product is, who it's for and what kind of place it is? A 1 is a template with the name swapped in. A 3 is a competent page for the category. A 5 is a screen that couldn't belong to a competitor.

**2. Distance from the defaults.** Compare against the faces of generated design described in `SKILL.md`. How many of their features does it share? A 1 matches three or more. A 3 matches two or leans on the overcorrected look (off-white, huge type, numbered labels, no images). A 5 matches at most one and the match is a decision with a reason.

**3. What the first screen does.** On a phone and on a laptop, in the first viewport, can you see what the product is, evidence that it works, and the main action? For an app: is the main task visible without scrolling? A 1 is a slogan and two buttons over empty space. A 3 has the pieces but one is below the fold. A 5 has all of them and a squint test (blur your eyes) lands on the right element.

**4. Type.** Is there a clear hierarchy? Do the faces have a reason to be there? Are line lengths comfortable (roughly 45 to 75 characters for reading text), numbers aligned in tables, and display sizes tightened? A 1 is one weight and one size throughout. A 3 is a pleasant default pairing with a workable scale. A 5 has real contrast in scale and weight, and the typography carries the personality.

**5. Colour.** Can you name the palette in a sentence and say what each colour does? Does one accent have one job? Do all text and controls pass contrast (4.5:1 for body text, 3:1 for large text and UI parts)? Is dark mode designed, or deliberately left out? A 1 is arbitrary hues, a washed-out accent or inverted dark mode. A 5 is a palette you could describe from memory with a clear role for each colour.

**6. Imagery and substance.** Does the page show anything that is specific to this product: real photos, the product itself working, an illustration style, data? Or is it text on a flat background? Stock photos and placeholder boxes score 1 or 2. A 5 has one consistent visual language that couldn't be swapped for another company's.

**7. Layout and rhythm.** Does each section answer a question the visitor has? Are related things close and unrelated things far? Are there too many boxes, or too many identical blocks in a row? A 1 is the template sequence with uniform gaps. A 5 has varied pacing, tight groups, generous breaks, and no containers that exist only for decoration.

**8. Craft.** The small things. No clipped or wrapping text in buttons. Icons from one set with one stroke weight. Aligned edges. Matching radii. Real content instead of placeholders. Considered hover, focus, disabled and empty states. One misaligned element is a 3. A pattern of them is a 2.

**9. Responsiveness.** Is the phone layout designed or just stacked? Does 768px hold up? Does a 1920px monitor leave a lonely column? A 1 is horizontal scrolling at 390px. A 3 works at standard sizes with awkward in-between widths. A 5 is designed at each break and nothing is stranded.

**10. Robustness across devices.** Do the checks in the cross-platform checklist below pass? A 1 has failures on Windows at 125% scaling or in High Contrast. A 5 has been checked across all of them, with remaining gaps listed honestly.

**11. One memorable thing.** Is there a single interaction, image or detail you would describe to a friend? A 1 is nothing. A 2 is a generic fade-in on scroll. A 5 is a moment that comes from the product's own idea. If the design is for a serious tool, this may be quiet (a clean keyboard flow counts).

**12. The screenshot test.** Would a designer post it? Would anyone remember it tomorrow? This is a gut score. Give it last and don't let it average away a real defect.

For a redesign, add a thirteenth line: **Fidelity.** Every feature, label and piece of content from the original should still be there and be easier to find. A 5 means nothing was lost. A 2 means items are missing. A redesign that drops features is a failure whatever it looks like.

For an app, replace category 3 with the question above and treat the states from `apps.md` as part of Craft: missing an empty or error state caps Craft at 3.

## Rounds, and when to stop

Run at least two rounds. The first round finds what's wrong. The second proves the fixes landed and didn't break anything else. A one-round review is a first draft with a signature on it.

**Each round:**

1. Render the screenshots (below).
2. Score all categories with evidence.
3. Name the five changes with the biggest lift on the weakest scores, each concrete enough to act on: which section, which element, what value.
4. Make the changes. If you decline a suggestion, write down why in one line. Decline anything that would bring back a default you refused, undo an earlier change from the same review, or create a layout failure such as clipped text.
5. Re-render and rescore. Note which changes landed.

**Stop when:**

- No category is below 3, and at least two-thirds are at 4 or above, and
- the platform checks have no failures.

**If two rounds in a row show no score change,** make a single structural move (swap the first screen, the layout grid or the image approach) and run one more round. If that doesn't move anything, stop.

**After you're done,** fix the concrete defects the reviewer still named, once. Check each one by eye and list them in the report as "fixed post-review, not rescored". Then stop, with no further round for them.

**Budget:** three rounds is plenty for most pages and four is the ceiling. After that, report the real scores. A true 3 is worth more to the person you're handing it to than an inflated 4, because they can plan around it.

Quiet space is not a defect. One generous empty area on a page can be a decision. Don't fill every gap because someone said it looked empty.

## How to look at screenshots

Take screenshots at every size you claim to support, and look at each one at full size. A downscaled full-page image hides clipped text, thin borders and small contrast problems. Judge sizes and spacing from slices, not from a thumbnail.

**Sizes to capture:**

| Size | Why |
|---|---|
| 390 x 844 | A typical phone |
| 320 wide | The narrowest phones, and the reflow test |
| 768 x 1024 | Tablet portrait, where layouts often break awkwardly |
| 1280 x 720 | A laptop at 150% scaling |
| 1440 x 900 | A common laptop and desktop |
| 1920 x 1080 | Wide screens |

**What to look at:**

- **The first viewport** at phone and desktop. Cover the top 600px and see what's visible. This is what most visitors will ever see.
- **The full page,** sliced into screen-height pieces. Scroll through it as a user would. Look for rhythm: does a long run of identical sections lull you to sleep?
- **Every state:** hover, focus, open menus, dialogs, empty, error, loading.
- **Dark mode,** if you offer it. Look for invisible borders, logos that vanish, pure-white text glare on near-black, and images that are too bright.
- **With the worst-case data on.**
- **Blurred.** Squint, or apply a blur to the screenshot. The thing that should dominate should still dominate.
- **Greyscale.** If hierarchy disappears, you were relying on colour alone.

Keep the screenshots and name them by round and size (`r1-390.png`, `r2-1440-dark.png`). The history is the evidence for what improved.

## Cross-platform checklist

Designs often get checked on a single MacBook in a single browser. A large share of real visitors use something else: Windows laptops, Android phones, Firefox, older iPhones, assistive settings. Go through this list and mark each item pass, fail or not tested.

### Windows display scaling

- At 125% scaling, a 1920x1080 screen gives a viewport of about 1536x864 CSS pixels. At 150%, about 1280x720. These are two of the most common desktop sizes in the world. Check both, not just 1440 and 1920.
- The first screen should still show the headline and the main action when the browser's own toolbars take up 120px or more.
- On fractional device pixel ratios, borders that land on half a pixel and thin icon strokes turn blurry. Stick to whole-pixel hairlines (1px, not 0.5px) and icons with whole-number stroke widths.

### Windows fonts

- `system-ui` resolves to Segoe UI on Windows, which has different widths from San Francisco on Mac. Text that fits on one Mac line may wrap to two on Windows.
- Fonts that exist only on Apple platforms (`-apple-system`, `BlinkMacSystemFont`, `ui-rounded`, `ui-serif`, `ui-monospace`, Helvetica Neue, SF Mono) don't exist on Windows or Linux. A stack that depends on them falls to whatever comes next.
- Load your chosen fonts as web fonts, with a fallback adjusted to the same metrics (`size-adjust`, `ascent-override`) so nothing jumps when they load.
- Check that the naira sign and any diacritics render in the loaded font, not in a mismatched fallback.

### Windows scrollbars

- Windows and many Linux setups show classic scrollbars that take 15 to 17px of width. macOS overlays hide them.
- `width: 100vw` includes the scrollbar, so it causes sideways scrolling on those systems. Use `100%`, or add `overflow-x: clip` on a parent.
- A page that grows tall enough to scroll can shift sideways when the scrollbar appears. Add `scrollbar-gutter: stable` on `html`.
- For a dark design, add `color-scheme: dark` to bring scrollbars and form controls into line.

### High Contrast (forced colours)

- Windows contrast themes replace your colours with the system's and strip background images and shadows.
- Every control needs a visible border or outline, even if it's transparent in normal mode (`border: 1px solid transparent` becomes visible in forced colours).
- Don't carry meaning in a background colour or an icon drawn as a CSS background. Use real text, inline SVG with `currentColor`, and `@media (forced-colors: active)` to patch the leftovers.
- Test it: Chrome and Edge DevTools can emulate `forced-colors: active` in the Rendering panel.

### Linux fonts

- Linux defaults vary by distro: DejaVu Sans, Ubuntu, Cantarell, Liberation. DejaVu Sans is considerably wider than San Francisco and Segoe UI. Tight designs break there.
- Helvetica and Arial map to Liberation Sans, which has similar widths but different shapes.
- The fix is the same as on Windows: load real web fonts, keep a metric-matched fallback, and don't leave labels sized to the pixel.

### Android

- Roboto is the system font, with its own widths. Test on a mid-range phone as well as a flagship, since heavy blur and large shadows cost more there.
- Tap targets of at least 44px, with space between neighbours. Raise the system font size to 130% and check that layouts grow instead of clipping.
- The browser toolbar hides and shows as you scroll, so use `dvh` or `svh` instead of `100vh`.

### Safari and iPhone

- `100vh` includes the area behind the toolbar. Use `svh`, `dvh` or `lvh` on purpose.
- Inputs with a font size under 16px make iOS zoom the page on focus. Keep form fields at 16px or more.
- Check safe areas (`env(safe-area-inset-*)`) for notches and the home indicator on fixed bars.
- `position: sticky` inside an `overflow` container, date and select controls, and some newer CSS features may behave differently. Older iPhones stay in use for years; check the versions you need to support.
- Hover effects stick after a tap. Wrap them in `@media (hover: hover)`.

### Firefox

- Check `:has()` heavy layouts, `backdrop-filter` performance and appearance, scroll-driven animations (feature-detect with `@supports`), and the styling of form controls.
- Firefox scrollbars use `scrollbar-width` and `scrollbar-color` rather than the WebKit pseudo-elements. Provide both if you restyle them.
- Edge is Chromium. It behaves like Chrome, and it is the default browser on every Windows PC, so a lot of people use it without choosing to.

### 320px reflow

- At 320 CSS pixels wide, the page should reflow into one column with no horizontal scroll, except for content that truly needs two dimensions (a data table, a map).
- Do the same at 400% zoom on a 1280px window (it creates the same 320px viewport).
- No text is clipped, no controls overlap, and nothing needs a pinch to read.

### Reduced motion

- Turn on "Reduce motion" at the OS level, or emulate `prefers-reduced-motion: reduce` in DevTools.
- Motion-heavy effects (parallax, auto-playing animation, large slides) should stop or become simple fades. Don't leave content hidden waiting for an animation that never runs.
- Avoid autoplaying video with sound, and give anything that moves for more than five seconds a way to pause it.

### Translated text that grows

- Run the interface with strings padded by 40% (German, Finnish, Dutch and French commonly run 30 to 40% longer than English).
- Look for buttons and tabs that clip, nav bars that wrap, and badges that break. Use wrapping or deliberate truncation. Never fixed-width labels.
- Check right-to-left if you plan to serve Arabic, Hebrew or Urdu readers: `dir="rtl"`, logical CSS properties, flipped icons where the direction matters (arrows, back chevrons) and not flipped where it doesn't (play buttons, clocks).

### Keyboard and screen reader basics

- Tab through the page. Focus is visible at every stop, in a sensible order, and there are no traps.
- Every icon-only button has an accessible name.
- Headings follow a logical order, and form fields have labels.
- Shortcut hints show Ctrl on Windows and Linux and Cmd on Mac.

## What you can't verify without real devices

Emulators and screenshots can't tell you everything. State in the report which of these you didn't test and why it might matter:

- **Real font rendering** on Windows (ClearType) and on Android. Emulation shows widths, not how the letterforms look.
- **Touch behaviour:** latency, scroll momentum, accidental taps, and how the on-screen keyboard covers fields.
- **Performance** on a low-end phone or an older laptop, and on a slow network. Throttle the CPU and network in DevTools as a proxy, and say so.
- **Screen readers.** Automated checks catch missing labels. Hearing the page read by VoiceOver, TalkBack or NVDA is the real test.
- **Real browsers' version differences,** especially older iOS Safari.
- **Print and email rendering,** if the product produces either.
- **Actual user comprehension.** Five minutes watching someone use it will tell you more than any score.

If a device matters to the audience (for example, a Lagos business whose customers are mostly on mid-range Android phones over mobile data), say what you'd test on first.

## Final report template

Finish with a report the owner can read in two minutes. Plain words, honest scores.

```
## Review summary

**Product:** <name, one line on what it does>
**Direction:** <concept sentence, accent, fonts>
**Rounds run:** <number> (reviewer: <fresh agent / self>)

### Scores (final round)

| Category | R1 | R2 | R3 | Evidence (final round) |
|---|---|---|---|---|
| Product fit | | | | |
| Distance from the defaults | | | | |
| First screen | | | | |
| Type | | | | |
| Colour | | | | |
| Imagery and substance | | | | |
| Layout and rhythm | | | | |
| Craft | | | | |
| Responsiveness | | | | |
| Robustness across devices | | | | |
| One memorable thing | | | | |
| Screenshot test | | | | |
| Fidelity (redesigns) | | | | |

### What changed
<five to eight bullets, biggest first>

### Declined suggestions
<each with a one-line reason>

### Stress test
<what broke with the worst-case data, what was fixed, what's still open>

### Platform checks
<pass / fail / not tested, for each item in the checklist>

### Not verified
<what needs real devices or users, and why it matters here>

### Fixed after the last round, not rescored
<list, or "none">

### Still open
<anything left, with the recommended next step>
```

Keep the lowest scores in the summary line, not buried. If the work stopped at a 3 in one category, say which one and why, so the owner can decide whether it matters before launch.
