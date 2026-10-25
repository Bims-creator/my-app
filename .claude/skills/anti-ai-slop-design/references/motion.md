# Motion

Read this when a redesign touches animation, or when the product has none and needs a little. The aim is a page where movement explains something, and where one moment is worth remembering.

AI-built pages tend to animate everything the same way: every block fades up on scroll, every card lifts on hover, a gradient orb drifts behind the hero. That is the motion version of the average page. People feel it as noise, even when they can't say why. The fix is the same as everywhere else in this skill: decide, per element, whether it moves and what the movement says.

## 1. Purpose: when to animate and when not to

Before writing any animation, finish this sentence: "This moves so the user can see ___." Good endings:

- **That the interface heard them.** A button dips when pressed. A toggle slides.
- **Where something came from or went.** A menu grows out of its button. A deleted row collapses and its neighbours close the gap.
- **That something changed.** A number updates, a tab switches, a saved badge appears.
- **What is happening while they wait.** A skeleton, a progress bar.
- **How a thing works.** A short loop on a marketing page showing the product in use.
- **A small reward at a rare moment.** First sign-in, a finished checkout, an empty inbox.

If you can't finish the sentence, the element stays still.

**Frequency decides how much.** The more often someone sees an animation, the less of it they should get.

- Seen hundreds of times a day (command palette, keyboard shortcuts, tab focus, row hover in a table): no animation, or a colour change under 100ms.
- Seen dozens of times a day (hover, list navigation, toggles): fast and subtle.
- Seen a few times a session (dialogs, drawers, toasts): normal treatment.
- Seen once (onboarding, first success, a landing page hero): this is where you can spend.

Anything triggered from the keyboard should be instant. A shortcut that waits 250ms for a fade feels broken.

**Data stays put.** Numbers, charts and tables the user is reading or acting on shouldn't wander for decoration. Animate their arrival once, then leave them alone.

**Content is visible without motion.** If hiding something until JavaScript reveals it is the only way your animation works, the animation is a liability. A failed script, a screenshot, a print stylesheet or a crawler will show an empty page. Start visible, and add the hidden starting state only once the script has loaded.

## 2. What to animate

Browsers can move two properties cheaply: `transform` (translate, scale, rotate) and `opacity`. They don't force the page to recompute layout or repaint, so the compositor handles them even while JavaScript is busy.

| Use freely | Use with care | Avoid |
|---|---|---|
| `transform`, `opacity` | `clip-path`, `background-color`, `color`, `filter` on small areas | `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`, `box-shadow` on many elements, `border-radius` on large ones |

When you want what an avoided property would give you, there is usually a workaround:

- Grow a panel: scale or clip it, or for an accordion animate `grid-template-rows` from `0fr` to `1fr` (see the recipe below).
- Move something: `translate`, never `top` or `left`.
- Resize a box smoothly after a layout change: Framer Motion's `layout` prop, which measures and then animates with transforms.
- Animate a shadow: put the stronger shadow on a pseudo-element and fade its opacity.
- Change an element's width as a progress bar: `transform: scaleX()` with `transform-origin: left`.

Further rules that save grief:

- **Never start from `scale(0)`.** Real things don't appear from a point. Start at `scale(0.94)` with `opacity: 0`.
- **Set `transform-origin` where the thing came from.** A dropdown opens from its button's edge, a tooltip from the side nearest its target. A centred modal is the exception and stays centred.
- **Name properties.** `transition: transform 180ms, opacity 180ms`, never `transition: all`. `all` animates things you didn't intend, like a colour change when a theme switches.
- **Don't drive many children from one CSS variable on a parent.** Updating it forces every descendant to recalculate. Write `transform` directly on the element that moves.

## 3. Easing, duration and springs

### Easing

An easing curve describes how speed changes over time. Most of what you need comes down to a rule of thumb: motion that responds to the user should start fast.

- **Entering, or reacting to a click:** ease-out. It jumps off the line and settles. A 200ms ease-out feels quicker than a 200ms ease-in because the first frames carry most of the distance.
- **Moving between two places on screen:** ease-in-out.
- **Leaving:** a short ease-out or a mild ease-in. Keep it brief so it doesn't hold up the next thing.
- **Colour and opacity changes on hover:** the plain CSS `ease` is fine.
- **Spinners, progress, marquees:** linear. Constant speed is right when the motion represents something constant.
- **Never ease-in for something the user is waiting for.** The slow start eats the moment they are watching.

The built-in CSS keywords are mild. Define your own curves once, as tokens, and use them everywhere:

```css
:root {
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* entrances, responses */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* things moving on screen */
  --ease-exit:   cubic-bezier(0.4, 0, 1, 1);       /* things leaving */

  --t-fast: 120ms;  /* press, toggle, hover colour */
  --t-base: 200ms;  /* menus, tooltips, tabs */
  --t-slow: 320ms;  /* dialogs, drawers, page changes */
}
```

Five hand-typed curves that almost match each other make a product feel unsure of itself. One or two curves and three durations is enough for a whole app.

### Duration

Rough budgets for UI, desktop:

| What | Time |
|---|---|
| Hover colour change, press, toggle | 100 to 160ms |
| Tooltip, small popover | 120 to 180ms |
| Menu, select, tab change | 150 to 220ms |
| Dialog, toast, drawer | 220 to 360ms |
| Page or view change | 300 to 450ms |
| Landing page hero, one-off reveal | 500 to 900ms |

A few adjustments:

- Cut about a third on phones. Smaller screens mean shorter distances.
- Exits run at roughly two thirds of the entrance time. The user has already decided to leave.
- Longer travel earns slightly longer time, but not proportionally. A drawer crossing the whole screen can take 350ms, not 700.
- Slow where the user is deliberating, fast where the system answers. A "hold to delete" fill can take two seconds with linear timing while the user decides, then snap back in 150ms on release.
- Anything under 100ms reads as instant, which is correct for many things.

### Springs

A spring has no fixed duration. It is a weight on an elastic band, and it settles on its own. Springs suit motion that begins from a drag or a flick, motion the user might reverse halfway, and elements that should feel physical. Because a spring keeps the velocity it had, interrupting it produces a smooth curve instead of a jerk.

Motion (`motion/react`) takes either a duration-and-bounce description or raw physics:

```jsx
// easier to reason about
transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}

// raw physics, more control
transition={{ type: "spring", stiffness: 380, damping: 32, mass: 1 }}
```

Bounce between 0 and 0.2 suits most interfaces. Visible wobble belongs to playful products, drag-to-dismiss and celebrations. A banking dashboard with a wobbling modal looks like a toy.

In plain CSS you can approximate a spring with the `linear()` easing function, which takes a list of sampled points:

```css
:root {
  --spring: linear(0, 0.36 8%, 0.82 20%, 1.03 32%, 1.04 42%, 0.99 60%, 1);
}
.pop { transition: transform 450ms var(--spring); }
```

Store `linear()` values in a custom property and reference them with `var()`. Some CSS build tools mangle a `linear()` written inline inside the `transition` or `animation` shorthand and drop later rules without warning. In a framework project, confirm every CSS edit made it into the built stylesheet.

### Interruptible animations

A user will click twice, hover and leave, open and close in one second. Animations need to cope.

- **CSS transitions retarget.** Change the end value mid-flight and the element heads to the new target from wherever it is now.
- **CSS keyframe animations restart.** Use them for things that play once, not for things that toggle.
- **Springs keep velocity,** so they are the right choice for gestures.
- In Motion, animating to a new value cancels the old animation and carries on from the current value. Prefer `animate` props over hand-sequenced timelines for interactive things.

## 4. Behaviour

### Enter and exit

Elements that appear and disappear need both halves. In React, an exiting component is unmounted at once, so there's nothing left to animate. `AnimatePresence` keeps it mounted until its exit finishes.

```jsx
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence>
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "top left" }}
    />
  )}
</AnimatePresence>
```

In plain CSS, `@starting-style` handles entries without JavaScript, and `transition-behavior: allow-discrete` lets `display` and `overlay` change at the end of an exit (for a `<dialog>` or `[popover]`):

```css
dialog {
  opacity: 1; transform: none;
  transition: opacity 220ms var(--ease-out), transform 220ms var(--ease-out),
              display 220ms allow-discrete, overlay 220ms allow-discrete;
}
dialog:not([open]) { opacity: 0; transform: translateY(8px) scale(0.98); }
@starting-style { dialog[open] { opacity: 0; transform: translateY(8px) scale(0.98); } }
```

Leave the way you arrived. A toast that slid up from the bottom edge leaves down through it. Matching paths make swipe-to-dismiss obvious without a label.

### Choreography and stagger

When several things appear together, they should read as one event with a lead and followers.

- **Pick a lead.** The headline, the new row, the open dialog. It gets the clearest motion. Supporting pieces get a smaller offset and arrive a beat later.
- **One direction.** Everything that enters comes from the same side or origin. Mixed directions look like a mistake.
- **Stagger by 30 to 70ms** between siblings, and cap the total. Past roughly 400ms of accumulated delay the last item feels late. For a list of twenty, stagger the first six or eight and let the rest arrive together.
- **Stagger the first view only.** Items added later enter alone, and filter or sort changes should not replay the cascade.
- **Never block interaction.** If a button is visible, it works, even mid-stagger.

```jsx
const list = { show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

<motion.ul variants={list} initial="hidden" animate="show">
  {rows.map(r => <motion.li key={r.id} variants={item}>{r.name}</motion.li>)}
</motion.ul>
```

### One signature moment

Each product gets one animation people would describe to a friend. It comes from the concept sentence you wrote in your direction notes. It is not a fade-up, a hover lift, a logo marquee, a typing effect or a cursor follower; those fit any product and are the motion equivalent of stock photography.

Some of the register, to show the size of the idea and not to be reused: a ticket-booth app where the confirmed ticket is stamped and perforated as it lands; a tailor's order board where a finished order's thread tightens and snaps; a weather app where the sky colour shifts with the hour at the scrubber's position.

Write the signature down before building it: the trigger, three or four key frames, timing and curve, and what the reduced-motion version looks like. The rest of the product stays quiet so that this one thing is seen. If you can't name it, it's fine for the product to have none; a quiet, well-timed interface beats a loud one.

## 5. Patterns

Each recipe assumes the tokens from section 3.

### Press feedback

```css
.btn { transition: transform var(--t-fast) var(--ease-out); }
.btn:active { transform: scale(0.97); }
```

Scale also shrinks the label and icon, which is what makes it feel pressed. Keep the range 0.95 to 0.98. In Motion: `<motion.button whileTap={{ scale: 0.97 }} />`.

### Hover

Hover doesn't exist on touch screens, and touch browsers fire it falsely on tap. Gate any hover movement:

```css
@media (hover: hover) and (pointer: fine) {
  .card { transition: transform var(--t-base) var(--ease-out); }
  .card:hover { transform: translateY(-2px); }
}
```

Colour or underline changes on links need no gate. Quick in, slightly slower out (100ms in, 160ms out) feels polished. If every card on the page lifts on hover, remove it from all but the ones that are links.

### Menus, popovers and tooltips

Use the enter/exit pattern above with `transform-origin` set to the trigger's edge, 150 to 200ms. For a group of tooltips (an icon toolbar), show the first after a short delay and any neighbour instantly, with no animation, while one is already open.

### Accordion

Animating `height: auto` isn't possible, but animating grid track size is:

```css
.collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--t-base) var(--ease-out); }
.collapse[data-open] { grid-template-rows: 1fr; }
.collapse > div { overflow: hidden; }
```

### Tabs with a sliding indicator

Give the indicator a shared `layoutId` and Motion animates it between tabs:

```jsx
{tabs.map(t => (
  <button key={t.id} onClick={() => setActive(t.id)} className="tab">
    {t.label}
    {active === t.id && (
      <motion.span layoutId="tab-underline" className="underline"
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }} />
    )}
  </button>
))}
```

### Scroll-driven effects

Modern browsers can tie an animation's progress to scroll position in CSS, with no script:

```css
.reveal { opacity: 1; transform: none; }  /* default: visible */

@supports (animation-timeline: view()) {
  .reveal {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
  @keyframes rise { from { opacity: 0; transform: translateY(24px); } }
}
```

The default state is the finished state, so browsers without support, screenshots and crawlers see the real page. For a reading progress bar, use `animation-timeline: scroll()` on a `scaleX` animation.

If you need a Motion version, `whileInView` with `viewport={{ once: true, margin: "-80px" }}` runs once as the element enters. Fire reveals once; replaying them on every scroll past makes the page feel twitchy. Reveals suit marketing pages. Don't put them on the screens someone uses all day.

Parallax is the same family: small (under about 80px of travel), on decorative layers only, and never on text. Off on phones and under reduced motion.

### Page and view transitions

The browser can cross-fade or morph between states for you:

```css
@view-transition { navigation: auto; }   /* multi-page sites, same origin */

::view-transition-old(root) { animation: 160ms var(--ease-exit) both fade-out; }
::view-transition-new(root) { animation: 260ms var(--ease-out) both fade-in; }
```

For a single-page app, wrap the state change:

```js
if (document.startViewTransition) document.startViewTransition(() => setView(next));
else setView(next);
```

To make one element travel between views (a thumbnail that becomes a hero image), give both the same `view-transition-name`. Browsers without support just switch instantly, which is acceptable. In React or Next.js without the browser API, wrap routes in `AnimatePresence mode="wait"` keyed by pathname, with a short fade plus 8px shift. Keep it under 300ms total; people pay this cost on every navigation.

### Number counters

Count up once, when the number first appears, and only for figures worth a moment (a result, a total at checkout). Never for a live dashboard figure that updates every few seconds.

```jsx
import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

function Count({ to }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, {
      duration: 1.1, ease: [0.22, 1, 0.36, 1],
      onUpdate: v => { ref.current.textContent = Math.round(v).toLocaleString(); },
    });
    return () => c.stop();
  }, [seen, to]);
  return <span ref={ref} className="num">{to.toLocaleString()}</span>;
}
```

```css
.num { font-variant-numeric: tabular-nums; }
```

Tabular figures stop the width jittering as digits change. The server-rendered value is the final one, so it's correct without script.

### Skeleton loading

Use a skeleton when the layout is known and the wait is over about 300ms. Match the real content's size so nothing jumps when it loads. A slow sweep, not a pulse on every block:

```css
.skel {
  background: linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface) 100%);
  background-size: 200% 100%;
  animation: sweep 1.6s linear infinite;
}
@keyframes sweep { to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .skel { animation: none; } }
```

Under 300ms, show nothing; a skeleton that flashes up and vanishes is worse than a short blank.

### Success, error and validation

- Success: the control changes to its done state (check icon, filled colour) over 200ms. A bigger flourish is for rare moments only.
- Error: a short horizontal shake (3 swings, 8 to 10px, about 300ms) on the field, plus visible text. Motion can't be the only signal.
- Inline validation: the message eases in below the field; the border colour changes. No shake on every keystroke.

### Drag, swipe and dismiss

Use springs. Track the pointer with transforms on the dragged element only; capture the pointer so the drag continues outside the element; ignore extra touches once a drag starts; let the element go past its limits with rising resistance instead of a hard wall. Dismiss on speed as well as distance: a quick flick should be enough, so check velocity (pixels travelled divided by time) alongside the threshold.

## 6. Glossary

- **Easing:** how speed varies over the course of an animation.
- **Ease-out:** fast start, gentle landing. The default for UI.
- **Ease-in-out:** gentle start and end, quick middle. For things already on screen.
- **Cubic-bezier:** a custom easing curve defined by four numbers.
- **Spring:** motion simulated from stiffness, damping and mass, with no set duration.
- **Stiffness:** how hard the spring pulls. Higher is snappier.
- **Damping:** how quickly the wobble dies. Lower damping means more bounce.
- **Stagger:** starting a group of animations a little apart so they cascade.
- **Transform origin:** the fixed point that a scale or rotation expands outward from.
- **Layout animation:** a size or position change that glides instead of snapping.
- **Shared element transition:** one element travelling between two views and changing shape on the way.
- **Scroll-driven animation:** progress tied to scroll position, not time.
- **Skeleton:** a placeholder shaped like the content, shown while it loads.
- **Jank:** visible stutter from missed frames.
- **Layout thrash:** forcing the browser to recompute layout repeatedly, often by reading and writing layout values in a loop.

## 7. Accessibility and performance

### Reduced motion

Some people get dizzy or sick from movement on screen, and some find constant motion hard to ignore. Operating systems offer a setting, and your CSS and JS can read it.

Done properly, reduced motion keeps what helps understanding: a fade, a colour change, a focus ring. It drops movement and size change, and anything that loops or plays by itself.

| Normally | With reduced motion |
|---|---|
| Slide and fade in | Fade only |
| Spring or bounce | Short fade or instant |
| Parallax, tilt, cursor tracking | Off, element rests in place |
| Marquee, floating, looping background | Stopped |
| Counter rolling up | Shows final value |
| Page transition with travel | Plain cross-fade, shorter |

Two sound ways to write it. For decorative motion, opt in:

```css
@media (prefers-reduced-motion: no-preference) {
  .float { animation: drift 9s ease-in-out infinite; }
}
```

For essential transitions, soften them:

```css
@media (prefers-reduced-motion: reduce) {
  .panel { transition: opacity 120ms linear; transform: none; }
}
```

Do not write `* { animation: none !important; transition: none !important; }`. It removes feedback along with movement, and breaks components that wait for a transition to end before continuing.

In React, let Motion handle the bulk of it and branch where needed:

```jsx
import { MotionConfig, useReducedMotion } from "motion/react";

<MotionConfig reducedMotion="user">{children}</MotionConfig>

const reduce = useReducedMotion();
const enter = reduce ? { opacity: 0 } : { opacity: 0, y: 12 };
```

`reducedMotion="user"` turns off transform and layout animations when the setting is on and keeps opacity and colour. Canvas and WebGL pieces render one still frame and stop. Test by switching the setting on in your OS or in browser devtools.

Other accessibility points:

- Nothing important should be communicated by movement alone. A shake needs an error message.
- Anything that moves automatically for longer than five seconds needs a pause control.
- Same action, same animation, every time.

### Performance

- **Target 60 frames per second:** about 16ms per frame, including your scripts. Newer screens run at 120.
- **Stick to `transform` and `opacity`** for anything that moves per frame. Section 2 lists the rest.
- **`will-change: transform`** promotes an element to its own layer ahead of time. It costs memory, so apply it just before a heavy animation starts (on hover of the parent, or when scrolling nears) and remove it afterwards. Never put it on a whole list or in a global rule.
- **Layout thrash** happens when code reads a layout value (`offsetHeight`, `getBoundingClientRect`) and then writes a style, repeatedly, inside a loop or animation frame. Batch the reads first, then the writes. Never read layout inside `requestAnimationFrame` callbacks that run every frame.
- **Prefer CSS and the Web Animations API for fixed motion.** They can run off the main thread. JavaScript frame loops stutter when the page is busy.
- **In Motion, the `x`, `y` and `scale` shorthands run on the main thread.** On a busy page, or where smoothness matters, animate a `transform` string instead: `animate={{ transform: "translateX(100px)" }}`. Use `style` plus `useTransform` for scroll-linked values.
- **Pause what's off screen.** Canvas and WebGL loops stop when the element leaves the viewport (`IntersectionObserver`) or the tab is hidden. Cap device pixel ratio at 2.

## 8. Review

### Checklist for existing animations

Go through each animation in the product and answer:

1. What does this tell the user? If nothing, delete it. Deleting is often the best fix.
2. How often is it seen? Does the duration match that frequency?
3. Is it triggered from the keyboard or many times a minute? Remove it.
4. Does it use only `transform` and `opacity` (plus small colour changes)?
5. Is there a `transition: all` anywhere? Name the properties.
6. Does anything start from `scale(0)`? Change to 0.94 plus opacity.
7. Is the easing ease-out for entrances and responses? Is there an ease-in on something the user waits for?
8. Is each duration within the table for its type? Is anything over 300ms without a reason?
9. Do popovers and menus grow from their trigger?
10. Can you interrupt it? Click, hover and leave, or toggle twice fast. Keyframes on a toggle are a defect.
11. Do exits take less time than entrances, and leave the way they came?
12. Is stagger capped, only on first view, and non-blocking?
13. Is hover motion gated behind `(hover: hover) and (pointer: fine)`?
14. Is the end state the default state, so the page works without script?
15. Does reduced motion produce a calm, complete page, with feedback intact?
16. Do all curves and durations come from tokens, and is the feel consistent across components?
17. Is there at most one signature moment, and is everything else quiet?
18. Played at one quarter speed, does it still look right? Look for abrupt stops, drifting origins, and properties falling out of sync. Look again the next day.
19. Test gestures on a real phone, not just a resized desktop window.

### Where motion usually belongs

- Press feedback on every button and tappable row.
- Menus, popovers, dialogs, drawers and toasts entering and leaving.
- Content swaps that would otherwise teleport: tab panels, accordions, a list gaining or losing an item.
- Route changes, briefly.
- Loading: skeletons, progress, spinner on the button that was pressed.
- Form results: success state, error message, field validation.
- Drag, swipe and reorder.
- One reveal sequence on the first screen of a marketing page.
- Rare happy moments: first success, completed order, inbox zero.

### Where motion never belongs

- Keyboard-driven actions: command palettes, shortcut-triggered panels, focus movement.
- Text the user is reading, including body copy that fades in line by line.
- Dense tables and data views, apart from a brief highlight on updated cells.
- Live numbers that update more than every few seconds.
- Error messages that the user must act on (the message appears at once; a colour pulse is the most you add).
- Anything that delays a click target from being usable.
- Every card on a page at once, on hover, forever.
- Decorative loops behind content: drifting orbs, floating shapes, gradient shifts.
- Anything that fires again every time it scrolls into view.

When in doubt, remove it, look at the page for a day, and add back only what you miss.
