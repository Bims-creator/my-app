# Polish: The Details That Make UI Feel Finished

Read this after the direction, tokens and layout are settled. Polish is the last layer. It can't rescue a page with no point of view, but a page with a good point of view and none of this still feels like a draft.

Most of these details are invisible when they're right. Nobody thanks you for a button that responds on press or a number that doesn't jitter. They just stop noticing the interface and get on with their task. When a detail is wrong, people can't say why, only that the product feels cheap.

Every value below is a starting point. Change it if the concept calls for it, but change it on purpose and then use the new value everywhere.

## Buttons and press feedback

A button has five states, and generated pages usually style two of them: resting and hover. Style all five: rest, hover, pressed, focus-visible, disabled. A loading state is the sixth if the button submits anything.

**Pressed.** The button should react the instant the pointer goes down, not when it comes back up. A small shrink does it:

```css
.btn {
  transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1),
              background-color 140ms ease;
}
.btn:active { transform: scale(0.97); }
```

Keep the scale between 0.95 and 0.98. Smaller buttons can take the lower number; a large card-sized target should barely move. Anything lower than 0.95 looks like a cartoon.

**Never animate `all`.** Name the properties. `transition: all 300ms` also animates width, padding and anything else that changes later, and you get strange flickers you'll never trace.

**Disabled buttons** keep their shape and label. Drop opacity to about 0.45 and set `cursor: not-allowed`. Better still, leave the button enabled and explain what's missing when it's clicked, because a dead button gives no hint about why.

**Submitting.** Swap the label for a short verb phrase ("Saving") and block a second click. Reserve the button's width so it doesn't jump.

**One primary per view.** A screen with three filled accent buttons has no primary. Make the main action filled, secondary actions outlined or text-only, and destructive ones quiet until they're confirmed.

## Hover and focus states

**Hover is a hint for pointers, not a state touch screens should enter.** Wrap hover styles so phones don't leave things stuck after a tap:

```css
@media (hover: hover) and (pointer: fine) {
  .row:hover { background: var(--surface-2); }
}
```

**Hover changes one thing.** Background shifts a step, or the underline appears, or the arrow moves 2px. Lift plus glow plus scale plus colour change on every card is noise. Keep hover transitions around 120 to 180ms with a plain `ease`.

**Focus is for keyboards, and it must be visible.** Use `:focus-visible`, never remove `outline` without replacing it, and draw the ring outside the element so it doesn't collide with borders:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

Check the ring against every background it can land on, including dark surfaces and filled buttons. On a filled accent button, a ring in the same accent disappears; use an offset so a strip of page background shows between button and ring.

**Active nav and selected rows** need a state that survives without colour alone: weight, a bar, a check, or a filled background plus a label change.

## Shadows, borders and depth

Depth tells people what sits above what. If everything has a shadow, nothing floats.

**Use shadow for things that actually float:** menus, popovers, dialogs, toasts, dragged items. Cards resting on a page get a hairline border or just a background step.

**Layer two or three shadows instead of one heavy one.** A real shadow has a tight dark contact edge and a wide faint spread:

```css
--shadow-pop:
  0 1px 2px rgb(0 0 0 / 0.06),
  0 4px 8px rgb(0 0 0 / 0.06),
  0 12px 24px rgb(0 0 0 / 0.08);
```

The alpha values stay low. If you can see the shadow as a shape, it's too strong. Tint it toward the page's shade (a warm page gets a warm brown-black shadow at low alpha, not pure black), and keep the vertical offset larger than the horizontal, since light comes from above.

**Hairline borders** look better as a low-alpha value than as a flat grey, because they adapt to whatever surface sits behind them: `1px solid rgb(0 0 0 / 0.08)` on light, `rgb(255 255 255 / 0.1)` on dark. A 1px border plus a soft shadow is how a popover gets its crisp edge.

**Images get an edge.** A photo or screenshot sitting on a light page with no outline looks like it's bleeding into the background. A 1px inset overlay at about 8% black (`outline: 1px solid rgb(0 0 0 / 0.08); outline-offset: -1px`) pins it.

**Skip decorative border-left bars** on cards and callouts. It's one of the most recognisable generated looks.

## Radius families

The slop version is one radius everywhere. The designed version has a small system, and the system has a rule: **nested corners are concentric.** An inner shape's radius equals the outer radius minus the padding between them. A 20px card with 8px padding holds elements at 12px. Same radius on both makes the gap look fatter at the corners.

A workable set:

| Role | Radius |
| --- | --- |
| Checkboxes, tags, small chips | 4px |
| Inputs, buttons | 8px |
| Cards, popovers | 12px |
| Dialogs, sheets, big surfaces | 16 to 24px |
| Avatars, toggles, pills | 9999px |

Pick the personality first. A sharp, utilitarian product runs 0 to 4px across the board. A friendly consumer one runs larger. Both are fine. Mixing sharp inputs with pill buttons and 24px cards in one view is not.

## Typography details

**Tracking depends on size.** Big type needs tightening; small type needs a little air.

| Size | Letter-spacing |
| --- | --- |
| 48px and up | -0.02em to -0.03em |
| 24 to 40px | -0.01em to -0.02em |
| 16px body | 0 |
| 12 to 13px, and small caps labels | +0.01em to +0.06em |

**Leading runs the other way.** Display lines at 1.05 to 1.15, subheads at 1.25, body at 1.5 to 1.6, dense table text at 1.35 to 1.4. Languages with tall marks need more.

**Line length.** Body copy at `max-width: 65ch` or thereabouts. Wide paragraphs are the quiet giveaway of a page nobody read on a big monitor.

**Balanced headings.** Add `text-wrap: balance` to headings and short captions so you don't get a last line holding one word. Add `text-wrap: pretty` to paragraphs to avoid orphans. Both are one line of CSS.

**Tabular numbers.** Anywhere digits line up or change (prices in a column, timers, counters, table cells, live stats), set `font-variant-numeric: tabular-nums`. Without it, a ticking clock makes its neighbours wobble. For a Tailwind project that's `tabular-nums`.

**Optical sizing.** If the font has an optical size axis, leave `font-optical-sizing: auto` on and let the browser pick cuts for small and large text. Variable fonts that ship the axis (check the font's page) give you better small-size legibility for free.

**Weight carries emphasis.** Prefer 500 or 600 over 700 and 800 for UI labels. Heavy bold on every label flattens the hierarchy. Three weights across the whole product is plenty.

**Size units.** Set type and spacing in `rem` so larger user text settings scale the layout. Keep phone body text at 16px or above; inputs under 16px make iOS zoom the page.

**Typographic characters.** Curly quotes, an en dash in ranges, a true ellipsis. Straight quotes in a headline mark it as unedited.

## Spacing rhythm

Choose a unit (4 or 8px) and keep everything on it. The look of care comes from rhythm: related things close, unrelated things far.

- Space between groups is at least double the space inside a group. If a label sits 4px above its field, the gap to the next field is 16px or more.
- Padding scales with the container. A button wants 10 to 12px by 16 to 20px; a card wants 20 to 24px; a page section wants 64 to 120px of vertical space on desktop and about half that on a phone.
- Use `gap` in flex and grid layouts instead of margins on children, so spacing stays consistent when items are added or hidden.

## Translucent materials, and when they're earned

Frosted glass works in exactly one situation: a bar or panel floats over content that scrolls beneath it, and seeing a hint of that content helps the user keep their place. Sticky headers, bottom tab bars, sheets and command palettes qualify.

```css
.bar {
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: blur(16px) saturate(160%);
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
}
```

Rules to keep it honest:

- **Never put glass on cards that hold text over a flat background.** There's nothing behind to blur, so the effect adds nothing but cost.
- **Never stack one translucent layer on another.** Legibility falls apart.
- **Keep the tint high enough for contrast.** Check text against the lightest and darkest content that can scroll beneath it, not against the page background.
- **Bigger surfaces get more blur and a deeper shadow.** A small chip at 8px blur and a large sheet at 24px read as different thicknesses.
- **Provide the fallback.** Inside `@media (prefers-reduced-transparency: reduce)` raise the opacity and drop the filter; use `@supports not (backdrop-filter: blur(1px))` for older browsers.
- **Blur is expensive,** especially on large areas and in Safari. Keep it under about 20px, and don't animate the blur radius on big surfaces.

If you can't name what's scrolling under the surface, use a solid colour.

## Icons

The basic rules (a real set instead of emoji, none when words suffice) live in the main instructions. The finishing details:

- **One set, one stroke weight.** Mixing outline and filled icons, or 1.5px and 2px strokes, shows at once. Set stroke width globally (Lucide defaults to 2; 1.5 feels lighter at larger sizes).
- **Match the icon's size to the text beside it.** 16px icon with 14px text, 20px with 16px. Keep optical centre: icons usually sit about 1px low next to a label until you correct them.
- **Click area is larger than the glyph.** A 16px icon button still gets a 36 to 44px hit area; pad it, or use a pseudo-element to extend it.
- **Icon-only buttons need a name** (`aria-label`) and, on desktop, a tooltip.
- **Swap states with a brief crossfade and a scale from 0.8 to 1 plus a small blur,** so a copy icon turning into a check looks like one object changing, not two objects overlapping. 150 to 200ms is enough.
- **Neutral by default,** accent only on the active icon.

## Empty, loading and error states

These are screens too. A product with great happy-path screens and a blank white rectangle while it loads feels unfinished.

**Empty states** answer three questions: what goes here, why is it empty, and what do I do. One short line of explanation, one button that does the first useful thing. Skip the illustration unless it's a real piece of the brand, and skip the cheerful emoji. If it's empty because of a filter, say so and offer to clear it.

**Loading** depends on duration.
- Under about 300ms: show nothing; flashing a spinner for a fast response is worse than a brief pause.
- 300ms to a couple of seconds: skeletons shaped like the real content, with the same heights, so the page doesn't jump when data lands. Pulse them slowly (1.5 to 2s), low contrast.
- Longer: progress with words about what's happening, and keep anything the user already has on screen.

**Error states** say what happened in plain words, whether the user's work is safe, and what to try. "We couldn't save your changes. Your draft is still here. Try again" beats "Something went wrong." Put the message next to where the problem occurred, keep the retry action beside it, and never discard what the person typed.

Keep the layout stable across all three. If the empty state, skeleton and filled content each have different heights and padding, the page lurches.

## Forms and inputs

- **Labels sit above fields and stay visible.** Placeholder text is an example, not a label, and it vanishes at the moment the person needs it.
- **Match input size to the job.** Inputs on touch devices are at least 16px text and 44px tall. Pair `type`, `inputmode` and `autocomplete` correctly (`type="email"`, `inputmode="numeric"`, `autocomplete="one-time-code"`) so phones show the right keyboard and fill what they can.
- **Validate when the person leaves the field,** not on every keystroke and not only after submit. Place the message directly under the field, in words, with an icon or text so it doesn't depend on red alone. Once an error is showing, clear it as soon as the value is fixed.
- **Focus state matters most here.** Border to the accent colour plus a soft ring (`box-shadow: 0 0 0 3px rgb(from var(--accent) r g b / 0.2)`), with a transition of about 120ms.
- **Checkboxes, radios and toggles** have a label that is itself clickable, and a generous hit area. A toggle shows its state in two ways (position and fill), never colour only.
- **Don't confirm everything.** A confirmation dialog is for deleting or sending something irreversible. If the action can be undone, do it and offer Undo instead.
- **Stop double submits** by disabling the button while the request is in flight.

## Toasts and feedback

Every action should answer back, and the answer should match its weight. Toggling a setting needs a tiny state change in place. Saving a record needs a short confirmation. A failed payment needs something that can't be missed.

- **Prefer in-place feedback to a toast** when you can: the label turns to "Copied" for 1.5 seconds, a row updates, a check appears.
- **Toasts** appear in one consistent corner, stay 4 to 6 seconds (longer with an action, never auto-dismiss errors that need a decision), pause their timer on hover and when the tab is hidden, and can be dismissed by swipe or a close button.
- **Enter and exit on the same axis,** and use transitions rather than keyframes, since toasts arrive in bursts and keyframes restart when interrupted.
- **Write the message like a person:** "Invoice sent to Tola" instead of "Success! Operation completed."
- **Announce them.** Wrap them in a container with `role="status"` (or `role="alert"` for errors) so screen readers get the message.

## Cursor and pointer details

- `cursor: pointer` only on things that navigate or act. Pointer on everything stops meaning anything. Use `not-allowed` for disabled, `grab` / `grabbing` for draggable items, `text` for selectable text.
- `user-select: none` on buttons, tabs and drag handles so a double-click doesn't highlight the label. Leave it on for content people may copy.
- `touch-action: manipulation` on controls removes the double-tap zoom delay. Set `-webkit-tap-highlight-color: transparent` once you've built your own pressed state.
- `overscroll-behavior: contain` on modals, menus and inner scroll panes, so the page behind doesn't scroll at the end.
- Tooltips wait 400 to 600ms on first hover; once one is open, neighbours open instantly with no animation, which makes a toolbar feel fast.
- Popovers grow from their trigger (`transform-origin` at the trigger). Dialogs scale from the centre. Entry starts at `scale(0.95)` and `opacity: 0`, never `scale(0)`.

## Dark mode details

A dark theme is a separate design, not an inversion.

- **Surfaces, not shadows, make depth.** In the dark, shadows barely show. Raise elements with lighter surfaces: page `#0e0f11`, card `#16181b`, popover `#1d2024`. Add the hairline border from earlier.
- **Off-black and off-white.** Pure black next to bright white vibrates. Use a very dark grey with a slight tint matching the brand temperature, and text around 90% white. Secondary text should still pass 4.5:1.
- **Desaturate the accent a little** and raise its lightness; the same saturated blue that works on white glows on black.
- **Don't flip images and illustrations blindly.** Check logos, screenshots and charts. Screenshots with white backgrounds look like holes; give them a border and slightly reduced brightness (`filter: brightness(0.92)`).
- **Status colours** need their own dark values. Pale pastels on dark look chalky; use deeper tints with brighter text.
- **Switch themes without a flash.** Set the theme class before first paint (inline script in `<head>`) and add `color-scheme: light dark` so form controls and scrollbars follow.
- **Switch gently.** If the theme changes on a click, crossfade the colour variables (150 to 250ms) so a dark room isn't hit with a white flash.
## The invisible details checklist

Things nobody praises and everyone feels:

- Long names, long emails and unbroken strings truncate or wrap instead of pushing the layout (`min-width: 0`, `overflow-wrap: anywhere`, `text-overflow: ellipsis`).
- Nothing shifts as it loads: images carry width and height or `aspect-ratio`, fonts use `font-display: swap` with a metric-matched fallback, skeletons reserve space.
- `::selection` matches the brand; `<meta name="theme-color">` matches the page; the favicon exists for light and dark.
- Page titles change per page; the 404 and offline pages are designed.
- Escape closes overlays. Focus moves into a dialog on open, stays inside, and returns to the trigger on close.
- Numbers have formatting: separators, currency, relative time with the exact time on hover.
- Exits are faster than entrances. Staggers run 30 to 80ms apart and never block input.
- Phone safe areas are respected (`env(safe-area-inset-bottom)`). Layout holds at 320px and at larger text sizes.

## Taste: when restraint beats decoration

Decoration is cheap to generate. Restraint takes a decision, which is why it reads as expensive.

Ask of every effect: what job does it do? A shadow separates a floating thing. A blur keeps context behind a bar. A motion confirms a press. A gradient, a glow, a grain texture, a custom cursor, a parallax scene are all fine when they carry the concept, and all noise when they're sprinkled on because a page felt plain. If you can't say what an effect is for, delete it and look at the result.

Some working tests:

1. **Remove it and see what's lost.** If nothing, it was decoration.
2. **Count the effects on one screen.** More than two or three kinds (gradient, glow, blur, animation, texture) and they compete.
3. **Match intensity to frequency.** A launch page seen once can take a big moment. A tool used all day should be calm and mostly still.
4. **Hold one mood.** Motion speed, radius, shadow softness, copy tone and type weight should suggest the same personality.
5. **Spend the surprise once.** One well-built moment is remembered. Twenty micro-effects aren't.
6. **Look again tomorrow.** Fresh eyes catch the stray 3px and the animation a beat too long.

Restraint doesn't mean blandness. A plain screen with exact spacing, one strong colour, real content and the right type beats a busy one every time, as long as the plainness is chosen from the concept and not left over from a default.

## Polish pass checklist

Run it in this order, on desktop and phone, in both colour modes if the product has them.

**Interaction**
- [ ] Every button and clickable row has rest, hover, pressed, focus-visible and disabled states.
- [ ] Pressable things scale to about 0.97 on press, with transitions naming specific properties.
- [ ] Hover effects are gated to `(hover: hover)` and change one thing.
- [ ] Focus rings are visible on every background.
- [ ] Hit areas are 44px or more on touch.
- [ ] Cursors match the action.

**Surface**
- [ ] Shadows appear only on floating elements, layered and low in alpha.
- [ ] Borders are low-alpha hairlines; images have a subtle edge.
- [ ] Radius follows a rule, and nested corners are concentric.
- [ ] Glass is used only over scrolling content, with a fallback.

**Type and space**
- [ ] Display text is tightened, small text is opened up, leading shrinks as size grows.
- [ ] Headings use `text-wrap: balance`; paragraphs hold to roughly 65 characters.
- [ ] Numbers that align or change use tabular figures.
- [ ] All spacing sits on the unit, with group gaps at least double inner gaps.
- [ ] Real typographic characters in the copy.

**States**
- [ ] Empty, loading and error states exist, are written for humans, and keep the layout stable.
- [ ] Forms have visible labels, inline validation on blur, retained input and no double submit.
- [ ] Feedback matches the action's weight; toasts are announced, dismissible and consistent.

**Modes and motion**
- [ ] Dark mode has its own surfaces, accent and status colours, and no theme flash on load.
- [ ] Reduced motion and reduced transparency are handled.
- [ ] No UI animation over 300ms; no animation on keyboard-driven or high-frequency actions.

**Last look**
- [ ] Worst-case content (long names, tiny lists, huge numbers) was tried.
- [ ] Every effect on screen can be justified in one sentence.
- [ ] Reviewed a second time after a break, at slow speed for anything that moves.
