# Giving a Web App a Native Feel on Phones

A page feels like a website on a phone because of a handful of small platform behaviours, not because of its design. Buttons stay highlighted after a tap, the layout is cut off by the browser bar, the page zooms when you focus a field, content slides under the notch. Each fix is a line or two of CSS or a meta tag. Together they separate a page that sits in a browser from one that feels installed.

Each section below gives the symptom, the fix and the reason.

## Ground Rules

- **Test on a real phone.** Most of these bugs do not appear in desktop browser device emulation. See the last section.
- **Ask the browser what it can do.** Use media queries such as `(hover: hover)`, `(pointer: coarse)` and `env()`, not user-agent strings or screen widths. Laptops have touchscreens, tablets have trackpads and phones accept mice.
- **Leave zoom enabled.** Setting `user-scalable=no` or `maximum-scale=1` blocks anyone who has to enlarge the text. Find what triggers the unwanted zoom and fix that.
- **Use CSS before JavaScript.** If you're writing a touch-detection hook, a media query probably does the job.
- **Apply a fix where its reason applies.** Blocking text selection is right on a button and wrong on an order number.

## Starter Block

Put this in before building components.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf9f6">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121212">
<meta name="color-scheme" content="light dark">
```

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
}
input, select, textarea { font-size: 16px; }
button, [role="button"], a { touch-action: manipulation; }
```

Replace the two colours with your page's top-of-screen colours. Add `overscroll-behavior` and `user-select` rules from the sections below if the page is an app rather than a document.

## Tap Behaviour

### Hover states that stick on touch

**Symptom.** You tap a card or button and it stays enlarged, recoloured or underlined until you tap somewhere else.

**Fix.** Wrap every hover style in a capability query:

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-2px); box-shadow: var(--shadow-raised); }
}
```

`hover: hover` says the main input can hover. `pointer: fine` says it is precise, which screens out styluses and a few devices that claim hover but behave like touch. Tailwind v4's `hover:` variant already compiles to the hover query. In Tailwind v3, turn on the `hoverOnlyWhenSupported` future flag.

**Why it matters.** Touch screens have no hover, so browsers fake one on the first tap and never release it. The result looks like a bug in your code. Give touch users feedback through `:active` instead, which works for every input type.

### The tap highlight flash

**Symptom.** A grey or blue translucent rectangle flashes over anything you tap.

**Fix.**

```css
html { -webkit-tap-highlight-color: transparent; }
```

Then give every tappable element its own `:active` style, because you have just removed the only press feedback the browser was providing.

**Why it matters.** The flash is the most recognisable sign of a web page on a phone, and it clashes with the press state you designed.

### Laggy taps

**Symptom.** The app responds a beat late. Nothing is slow in the profiler, but it feels sticky.

**Fix.** Two separate causes, two separate fixes.

First, certain browsers pause briefly after a tap in case a double-tap zoom is starting. You can tell them an element will never need that delay:

```css
button, a, [role="button"], summary, label { touch-action: manipulation; }
```

Second, show feedback when the finger lands, not when it lifts. A `click` event fires on release, so a style tied to it appears late.

```css
.btn { transition: transform 120ms ease-out, background-color 120ms ease-out; }
.btn:active { transform: scale(0.97); }
```

If you need JavaScript, listen for `pointerdown`. Keep press feedback between 100 and 160 ms.

**Why it matters.** Native buttons respond the moment your finger touches them. A response on release feels like lag even when it is instant.

## Screen and Viewport

### 100vh is taller than the screen

**Symptom.** A full-height section spills below the fold on load, and a button pinned to the bottom is hidden behind the browser's address bar or toolbar.

**Fix.** Use the newer viewport units.

```css
.app-shell { height: 100vh; height: 100dvh; }   /* tracks the visible area */
.first-screen { min-height: 100vh; min-height: 100svh; } /* the smallest the viewport gets */
```

- `dvh` (dynamic) follows the browser bars as they show and hide. Right for an app shell, a drawer or anything that must fit exactly.
- `svh` (small) assumes the bars are showing. Nothing is ever cut off, and nothing resizes while scrolling. Right for a landing-page first screen.
- `lvh` (large) is what `vh` already means on phones. Rarely what you want.

The first `height: 100vh` line is a fallback for old browsers; keep it only if you support them.

**Why it matters.** `vh` was defined as the viewport with the bars hidden. On load they are visible, so `100vh` is always too tall by the height of the bar. `dvh` can cause layout shifts on content that is mid-scroll, which is why heroes use `svh`.

### Safe areas and the notch

**Symptom.** A fixed header sits under the status bar or notch, or a bottom tab bar collides with the home indicator.

**Fix.** Two steps. First, let the page draw edge to edge via `viewport-fit=cover` in the viewport meta tag (see the starter block). Second, pad the fixed elements back inside the safe area:

```css
.top-bar { padding-top: env(safe-area-inset-top, 0px); }
.tab-bar { padding-bottom: env(safe-area-inset-bottom, 0px); }
.sheet   { padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
```

In landscape the left and right insets matter too.

**Why it matters.** Without `viewport-fit=cover` every `env()` inset is zero, so the padding does nothing. The browser instead letterboxes your page, leaving coloured bars at the edges. Elements that stick to the screen edge (headers, tab bars, sheets, toasts) are the ones that need padding; ordinary page content is already inside the safe area.

### Status bar and theme-color

**Symptom.** The top bar of the phone is white on a dark page, or dark on a light one, or the brand colour does not match the header.

**Fix.** Give each colour scheme its own value, set to the colour at the very top of your page, usually the header background and not the brand colour:

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf9f6">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121212">
```

If the app lets people choose a theme with a toggle rather than following the OS, update the tag's `content` from script when they switch. In Next.js, export `viewport` with a `themeColor` array. For installed apps, the manifest's `theme_color` and `background_color` and the `apple-mobile-web-app-status-bar-style` tag make the same decision.

**Why it matters.** The status bar is the first strip of the screen people see. When it matches the page the interface feels like one object; when it does not, the browser is visible.

## Gestures and Scrolling

### Input zoom and the 16px rule

**Symptom.** Tapping a text field makes the page zoom in on iOS, and it stays zoomed after you leave the field.

**Fix.** Set form controls to at least 16px.

```css
input, select, textarea { font-size: 16px; }
```

If you want smaller inputs on desktop, apply the larger size only on touch:

```css
@media (pointer: coarse) { input, select, textarea { font-size: 16px; } }
```

Pick the matching on-screen keyboard too. Amount fields take `inputmode="decimal"`, code fields take `inputmode="numeric"`, `type="email"` and `type="tel"` where they fit, `autocapitalize="none"` and `autocorrect="off"` for usernames, and `enterkeyhint` (`send`, `search`, `done`) to label the return key with its action.

**Why it matters.** iOS zooms into any field with text under 16px. People reach for `maximum-scale=1` to stop it, which breaks zoom for everyone. The font size is the actual fix.

### Pull-to-refresh and overscroll

**Symptom.** Dragging down inside the app reloads the page, or the whole page bounces when a chat list or sheet reaches its end.

**Fix.**

```css
html, body { overscroll-behavior: none; }        /* an app shell */
.scroll-area { overflow-y: auto; overscroll-behavior: contain; }
```

`none` removes pull-to-refresh and the bounce for the page. `contain` on inner scrollers keeps their own end bounce but stops the scroll from passing to the page behind. Skip the root rule for a normal reading page where pull-to-refresh is welcome.

Do not block this with a `touchmove` handler that calls `preventDefault()`. It stops scrolling altogether and forces the browser to wait on your code for every touch.

**Why it matters.** In an app, the browser's idea of what a pull means competes with yours. A bottom sheet that the user drags down must not also reload the page.

### Long-press selection

**Symptom.** Holding a finger on a button, tab or chip selects its label, or shows a callout menu.

**Fix.** Turn selection off on controls only.

```css
button, [role="button"], [role="tab"], .chip, .drag-handle {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
```

Never apply this to `body`. People copy addresses, error messages, order numbers and reference codes.

**Why it matters.** Native controls are not text. Selecting a button's label signals a web page. Selecting content, though, is a feature people rely on.

### Carousels and scroll-snap

**Symptom.** Swiping sideways on a carousel moves the page up and down, or jitters.

**Fix.** If the carousel is built from native scrolling, use scroll-snap and let the browser handle it:

```css
.track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; }
.track > * { flex: 0 0 85%; scroll-snap-align: start; }
```

If the carousel is a custom gesture, tell the browser which directions it keeps:

```css
.custom-carousel { touch-action: pan-y; }   /* browser keeps vertical, your code takes horizontal */
.slider-thumb    { touch-action: none; }    /* your code owns every direction */
.sheet-handle    { touch-action: pan-x; }   /* your code takes vertical */
```

The value names what the browser may still do, not what your code does. Use `none` only on small surfaces, or people cannot scroll past them. Peeking the next slide (85% width above) tells people it scrolls.

**Why it matters.** The browser cannot tell whether a diagonal swipe is for the page or the carousel. Native scroll-snap uses the platform's own momentum, which beats a hand-written spring.

## Layout and Installing

### Bottom sheets and thumb zones

**Symptom.** Primary actions sit at the top of the screen, out of reach, and modals appear as small centred boxes.

**Fix.**

- Put the main action and the main navigation in the bottom third, where a thumb rests. Keep rarely used controls near the top.
- Replace centred modals with bottom sheets on narrow screens: anchored to the bottom, rounded on top, with a visible handle, dismissed by dragging down or tapping outside.
- Give the sheet's content its own scroll with `overscroll-behavior: contain`, and pad it with the bottom safe-area inset.
- Make touch targets at least 44px, with space between neighbours.
- When the keyboard opens, keep the focused field and its submit button visible. `interactive-widget=resizes-content` in the viewport meta makes Android Chrome shrink the layout the way iOS does.

**Why it matters.** Phones are used one-handed. A layout built for a mouse puts the most-used controls where the thumb cannot reach.

### PWA basics

**Symptom.** People add the app to their home screen and get a bookmark with a browser bar.

**Fix.** An installable web app needs:

- A `manifest.webmanifest` with `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, `background_color` and icons at 192 and 512 px (plus a maskable one).
- `<link rel="manifest" href="/manifest.webmanifest">` and an `apple-touch-icon` link in the page head.
- HTTPS.
- A service worker only if you need offline support or caching; an app can be installable without one on many platforms, and a careless service worker causes stale-page bugs.
- `apple-mobile-web-app-capable` and a status-bar style tag for iOS home-screen behaviour.

Test it installed. Standalone mode changes the viewport, safe areas and status bar compared with the browser.

**Why it matters.** Installed, the app opens without browser chrome and gets its own icon and splash colour, which is much of what "native" means to the user.

## Testing on a Real Phone

**Symptom.** Everything works in the desktop browser and feels wrong on the phone.

**Fix.** Test on hardware.

1. Run the dev server so it listens on the local network (for example `--host 0.0.0.0`) and open it on the phone via the computer's LAN address, with both on the same Wi-Fi.
2. Inspect remotely: on iPhone, Safari's Develop menu lists the connected device; on Android, open `chrome://inspect` on the desktop.
3. Use a phone that is a few years old as well as a new one, since older devices show performance problems.
4. Walk through with the keyboard open, in landscape once, and installed to the home screen if that is a target.
5. If you cannot reach a phone, say which fixes you verified from code and which need confirming on a device.

**Why it matters.** Emulation cannot reproduce sticky hover, tap delay, tap highlights, address-bar height changes, overscroll, safe areas or the software keyboard. Those are exactly the behaviours above.

## Never Ship

- `user-scalable=no` or `maximum-scale=1`.
- `:hover` rules outside the hover media query.
- `100vh` on an app shell; `100dvh` on a landing hero.
- Press feedback only on `click`.
- `touchmove` handlers with `preventDefault()` to stop overscroll.
- `user-select: none` on `body`.
- `touch-action: none` on something people need to scroll past.
- Using `env(safe-area-inset-*)` in CSS while `viewport-fit=cover` is missing.
- A single `theme-color` for both colour schemes.
- Device detection by user-agent string.
- A claim that mobile works, based only on emulation.
