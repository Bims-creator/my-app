# Components That Feel Crafted

Read this when the redesign needs a component the page doesn't have yet, or when an existing component looks like the default version of itself. A page doesn't look designed because of a long list of effects. It looks designed because three or four moments on it were given real thought, and everything around them is quiet.

## The Rule: Borrow the Idea, Rebuild the Thing

Component libraries are good for one thing here: showing you what a considered version of a component looks like. Use them as a menu of ideas.

Then rebuild the idea on the project's own tokens: its colours, radius rule, type scale, spacing unit and easing curve. Three reasons:

- A pasted component carries another project's styling. Its radius, shadow and font choices sit next to yours and the page stops looking like one decision.
- Many of these libraries are licensed with restrictions (some add a Commons Clause, some include paid components). Rebuilding an idea avoids the question. If you do copy code, read the component's current terms on its page and credit the author where asked. Never ship copied components as part of a reusable kit or template.
- You learn what the component is doing, so you can adapt it when the content turns out to be longer, shorter or stranger than the demo.

### Finding the moments

Before choosing anything, list two to four places on the screen where something matters to the person using it:

- a number they care about changes
- they're about to do something they can't undo
- they're waiting through several steps
- it's their first visit and they don't know what to do
- they move from one page or state to another

A component earns its place at one of those moments. One or two signature components per page is plenty. A rolling counter and a good page transition can carry a whole product. Five effects on one page read as generated.

## Where to Look

These are public. Open the component's page and watch its preview before deciding; names rarely tell you how something moves.

**Inspiration and distinctive components**

- **Rare UI** (https://rareui.com/components): around 25 unusual single-file components. Rolling-digit counters, a step player, a duration picker, confirm-in-place delete buttons, animated sidebars, animated checklists, AI status indicators. Good for finding small moments you wouldn't have invented. Installs through the shadcn CLI.
- **Great UI** (https://great-ui.com/components): around 50 components leaning on motion. Page and theme transitions, scroll-driven text effects, terminal-style loaders, device mockups, social profile cards, a multi-step deployment checklist, pixel and ASCII effects. Good for transitions and storytelling pages. Check the licence before commercial reuse of code.

**Foundations to build from**

- **shadcn/ui** (https://ui.shadcn.com): components you copy into your own repo and edit. A good starting point because the code becomes yours. Restyle it; the default theme is one of the most recognisable looks on the web.
- **Radix UI** (https://www.radix-ui.com): unstyled, accessible primitives (dialogs, popovers, menus, tabs). Take the behaviour, write the looks yourself.
- **Base UI** (https://base-ui.com): another set of unstyled accessible primitives, used the same way as Radix.

**Single-purpose libraries**

- **cmdk** (https://cmdk.paco.me): the command palette you open with a keyboard shortcut.
- **Sonner** (https://sonner.emilkowal.ski): toasts that stack and dismiss properly.
- **input-otp** (https://input-otp.rodz.dev): segmented verification-code inputs that handle paste and autofill.
- **Motion** (https://motion.dev): animation for React and plain JS; springs, layout animation, exit animation.
- **NumberFlow** (https://number-flow.barvian.me): numbers whose digits roll to a new value.
- **torph** (https://torph.lochie.me): text that morphs between strings.
- **Cobe** (https://cobe.vercel.app): a small, light 3D globe.
- **dnd kit** (https://dndkit.com): drag and drop with keyboard support.
- **Virtuoso** (https://virtuoso.dev): lists and tables with thousands of rows.
- **Recharts** (https://recharts.org): ordinary charts. **Liveline** (https://github.com/benjitaylor/liveline) is for charts that scroll with live data.
- **Satori** (https://github.com/vercel/satori): turns HTML and CSS into images, for share cards.
- **Shiki** (https://shiki.style): syntax highlighting that looks right.

## Choosing a Library for a Project

Work through these in order and stop when you have an answer.

1. **Name the task, not the package.** "A dropdown" is a primitives task. "Numbers that change" is an animated-number task. Match on what the screen needs.
2. **Open package.json first.** If the project already depends on something that does the job, use it. If it uses a different library for the same task, mention the alternative and leave the dependency alone unless the owner asks for the swap.
3. **Check the stack.** Single HTML file: choose something that works from a script tag or write it by hand. React or Next.js: any of the above works, and the installed UI kit narrows the choice.
4. **Prefer unstyled over styled.** A library that ships its own look fights your tokens. A headless one gives you behaviour (focus, keyboard, dismissal) and leaves the look to you.
5. **Prefer small and single-purpose** to a framework that does ten things. Each dependency is something you now maintain, and it has to survive the redesign.
6. **Pick one library per task.** One toast system, one animation library, one chart library.

Signs a hand-built version should have been a library: a dropdown made from divs with manual focus handling; a toast built on a modal; a number animated by re-rendering text; a list of more than a thousand rows rendered at once; conditional class strings nested three ternaries deep.

Signs it should not: a hover colour change or a fade. Plain CSS transitions do that with no dependency.

## Component Ideas by Need

Each entry says when it earns its place and the trap to avoid.

### Counters and changing numbers

An odometer-style counter has each digit roll on a vertical strip of 0 to 9, ending on the new value. Build one strip per digit, move it with `transform: translateY`, use tabular numerals so the width doesn't jitter, and stagger digits by a few tens of milliseconds.

- **Earns its place:** a balance, a total, a score, a count that changes while the person is looking. The roll tells them which direction it moved.
- **Trap:** counting up from zero on page load for a decorative stat. That's a gimmick and it delays the number you wanted them to read. Also check that the final value is in the DOM as text, so screen readers and print get the number.

### Progress and steps

For "how it works" sections, a step player advances through stages on a timer, with a thin progress bar on each step, like a short film. For an onboarding or setup flow, show every step at once and mark the current one.

- **Earns its place:** a process with real order, shown while the reader is still deciding whether to care.
- **Trap:** auto-advancing with no way to stop it. Pause on hover and focus, offer previous and next, respond to arrow keys, and stop entirely for reduced motion. Don't number steps that aren't sequential.

### Confirm before delete

Put the confirmation inside the button. First press turns it into "Really delete?" with a different colour and a short timeout that resets it. For the heaviest actions, use hold-to-confirm: a fill sweeps across (a `clip-path: inset()` animation over about 1.5 seconds) and snaps back if the person lets go.

- **Earns its place:** anything irreversible where a modal would feel like a tax: removing an item, closing an account, withdrawing funds.
- **Trap:** hold-to-confirm with no keyboard route. Offer Enter held, or a second press, for people who can't hold a pointer down. Also, make the destructive state look unlike the normal one in more than colour.

### Date and duration pickers

For "how long" or "until when", offer preset chips (30 days, 3 months, a year) plus a custom option, and write the resulting date in words beside it: "Ends on 14 March, a Saturday."

- **Earns its place:** subscriptions, locks, reminders, deadlines, where most people want one of three answers.
- **Trap:** a full calendar for a question with three common answers. Showing only the number of days, with no resulting date, makes people count on their fingers.

### Checklists

An animated checklist ticks items off with a short scale and opacity change, highlights the next item and keeps finished ones visible. A deployment-style version shows live status on each line: waiting, running, done, failed.

- **Earns its place:** first-run setup, and any long process with several stages where the person fears pressing the wrong thing.
- **Trap:** a checklist that finishes itself while the person watches nothing happen. Every line should reflect a real state, and a failed line should say what failed and what to do. Don't fake progress to look busy.

### Loaders

A loader with personality, such as a terminal-style log scrolling in, suits waits over a couple of seconds in a product where that voice fits.

- **Earns its place:** long operations in a technical product. Under a second, show nothing; under three, a plain spinner or skeleton does the job.
- **Trap:** theatre. Invented log lines that don't match what is happening erode trust the first time something fails. Show real steps, or keep the loader generic.

### Navigation and sidebars

Variants exist where the active marker slides to the chosen item, items spring slightly, or items grow as the cursor nears (dock-like). A table of contents rail that tracks the current section suits long documents, and a thin reading-progress bar suits articles.

- **Earns its place:** apps with a handful of destinations used all day, where small motion helps you track where you are.
- **Trap:** hover-driven effects on a phone, where there is no hover. Pair each with a tap state and make sure the nav works with no motion at all. Don't use a sidebar when four links would fit across the top.

### Cards

Social and profile cards (a founder's GitHub, X or LinkedIn presence) and overlapping avatar stacks can replace a "trusted by" strip, but only with real people.

- **Earns its place:** an about page, a founder note, a community of known users.
- **Trap:** placeholder faces and invented handles. A real card with a real photo beats a rich-looking fake. Cut the section if you have no real people.

### Device mockups

A laptop or phone frame around a screenshot or short video gives product shots a sense of scale.

- **Earns its place:** when the product is the thing being sold and the screen is worth looking at.
- **Trap:** a tilted frame floating on a gradient, which is the launch-page face. Keep the frame straight, put a real state in it, and make the screenshot readable at the size shown.

### Text reveals

Words that sharpen as you scroll, headlines that fly in line by line, strings that scramble before settling (good for addresses, codes and amounts), text that draws along a path.

- **Earns its place:** a single story section where reading pace should be controlled, or one hero line.
- **Trap:** hiding content until JavaScript runs, or applying it to every heading. Text must be visible and readable with no script and with reduced motion; the effect is an extra layer. Don't scramble text people need to copy.

### Theme and page transitions

A theme switch can grow a circular reveal from the toggle. A page change can use a cross-blur, a curtain or a sweep. The View Transitions API rebuilds most of these with little code, and a `clip-path: circle()` animation handles the circular theme reveal.

- **Earns its place:** moving between pages of a site or flipping light and dark, where a cut would feel abrupt.
- **Trap:** a long or different transition on every route. Pick one, keep it under about 600 ms, and make it skippable under reduced motion. Never delay the content people came for.

## Rebuild Checklist

1. Colours, radius, type and spacing come from the project's tokens, not the library's.
2. Animate `transform` and `opacity` where you can. Keep interface motion under about 300 ms; save longer for one-off moments like a hero.
3. Under `prefers-reduced-motion: reduce`, show the end state immediately.
4. Every hover effect has a touch equivalent (see mobile.md).
5. Content is present in the HTML before any script runs.
6. Test with the worst real data: the longest name, an empty list, a number with seven digits.

## Accessibility for Custom Components

Custom components are where accessibility most often breaks. If the component replaces a native control, it takes on everything the native control did for free.

- **Use the native element when one exists.** `<button>` for actions, `<a>` for navigation, `<input type="checkbox">` for toggles. Style those before replacing them. A `<div onclick>` has no keyboard support, no focus, no role.
- **Keyboard parity.** Everything doable with a pointer is doable with Tab, Enter, Space and arrow keys. Menus and tabs follow the standard patterns (arrow keys move, Escape closes).
- **Visible focus.** Keep a clear focus ring on every interactive part, including inside custom widgets. Use `:focus-visible` so it shows for keyboard users without flashing on every click.
- **Names and states.** Icon-only controls need an `aria-label`. Expandable parts expose `aria-expanded`, toggles expose `aria-pressed` or `aria-checked`, and the current item uses `aria-current`.
- **Dialogs and popovers.** Trap focus while open, return it to the trigger on close, close on Escape. This is the main reason to build on a headless primitive rather than from divs.
- **Live updates.** A counter, toast or progress change that matters should be announced through a polite live region (`aria-live="polite"`). Don't announce every tick of a rolling number; announce the result.
- **Motion.** Respect `prefers-reduced-motion`. Auto-playing motion longer than five seconds needs a pause control.
- **Contrast and size.** Text meets 4.5:1 (3:1 for large text) in every state, including disabled-looking ones people still need to read. Touch targets are at least 44px.
- **Don't carry meaning in colour or motion alone.** A failed step needs a word or shape as well as red.
- **Test it.** Tab through the whole component, then try it with a screen reader once. Ten minutes finds most problems.
