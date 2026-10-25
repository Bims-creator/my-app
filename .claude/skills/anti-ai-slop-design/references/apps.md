# Designing Web Apps

A marketing page is visited once. A web app gets used for hours, by the same people, every day. The first impression matters less than the hundredth session, so design for the person who already knows what they want and wants it to take four seconds.

Most generated apps fail the same way: they copy the shape of a SaaS dashboard (sidebar, search bar, row of stat cards, chart, table) whatever the product does. The rules below are for making that decision from the work.

## 1. The main task owns the screen

Begin by asking what this person is opening the app for in the next ten seconds. Whatever answers it gets the middle of the screen and the best contrast. Everything else steps back.

Three examples, to show the size of the decision. Find the equivalent in your own product rather than reusing these:

- **A pharmacy stock app in Ibadan.** The pharmacist opens it to see what is about to run out and what has expired. The screen is a list sorted by days of stock left, with the urgent items at the top and a "Reorder" button on each. Totals live in one line under the title: "14 items low, 3 expire this month".
- **A hairdresser's booking app in Leeds.** The stylist opens it to see today's appointments. The screen is a timeline for the day with gaps visible, because a gap is a chance to fill. Revenue belongs in a monthly report, not on this screen.
- **A bus operator's dispatch tool in Nairobi.** The dispatcher needs to know which vehicles are late. The screen is the list of departures with the late ones raised and one-click contact for the driver.

If you can't say the main task in one sentence, ask the person who knows the business. Don't pad the screen with everything the database could show.

### Numbers go in a sentence, not in cards

A row of four boxes reading "Total orders", "Revenue", "Customers", "Conversion" with green up-arrows is the most recognisable AI-app tell. It also tells the user nothing they can act on. Turn the figures into a line of text that says something: "4 orders waiting over 30 minutes, 2 unpaid". If a figure drives a decision, make it a filter: clicking "unpaid: 2" shows those two orders. Put real reporting on its own screen.

## 2. Choose the shell from the work

The app's frame is a design decision. Pick it for the shape of the content.

| Shell | Fits | Notes |
|---|---|---|
| **Top bar** | Three to six sections, mostly one at a time (invoices, clients, settings) | Leaves the full width for tables and forms. Try this before a sidebar |
| **Sidebar** | Many destinations (eight or more), or deep nested sections, or a workspace switcher | Collapse to icons with labels on hover, and let the user hide it. Don't fill it with sections nobody visits |
| **Split view (list and detail)** | A queue where the user works through items: support tickets, applications, orders | The list is narrow and fixed, the detail takes the rest. Keyboard up and down moves through the list |
| **Canvas** | The content is spatial: a map, a floor plan, a timeline, a board | Controls float at the edges in small tool groups. The canvas fills everything else |
| **Single column with steps** | A short, linear job: checkout, onboarding, a wizard | No nav at all. The back button and a progress hint are enough |

Many small apps need none of the above: a single page with a title, a filter and a list. Don't build navigation for sections that don't exist yet.

On a phone, decide what the app is. It can be the full app, a read-only companion, or a triage view for urgent items. Whichever it is, design it. A sidebar squeezed into a hamburger menu is what happens when nobody decided. Bottom tab bars suit up to five frequent destinations; everything else goes behind a "More" tab.

## 3. Density

Apps carry more information per screen than websites do, and the right density depends on how often the user returns.

- **Body text 14px** is normal for a data-heavy tool, 15 or 16px for a lighter one (a family budget, a gym booking page). Don't go below 12px for anything the user needs to read, and keep contrast high on the small text.
- **Row height** of 40 to 48px for comfortable, 32 to 36px for dense. A pointer user can handle dense; a touch user needs 44px or more per tap target, so give the touch layout its own sizes.
- **Spacing in steps.** Pick a base (4 or 8px) and a short ladder. Related items sit close, unrelated groups sit far apart, so you can see the groups without drawing lines around them.
- **Offer the setting when it matters.** A table that a bookkeeper uses all day deserves a "Compact / Comfortable" switch. A booking form for customers doesn't.
- **Don't confuse small with dense.** Tiny light-grey text in generous padding is the worst of both: lots of empty space and nothing legible in it.

## 4. One surface, no boxes in boxes

The default app is a grey page with white cards on it, and inside the cards, smaller cards, and inside those, pills. Each level has its own border, radius and shadow. The result is noise, and the eye can't tell which edge matters.

Instead:

- Give the app **one background**. At most add one raised level for things that float: menus, dialogs, sheets and the selected row.
- Separate areas with **space, alignment and a hairline** (a 1px divider in a low-contrast tone). A heading with a thin line under it is enough to start a section.
- A **box** is for something that sits above the page and can be dismissed. If a region of the page is not floating, it doesn't need a border.
- When a table sits in a card on a grey page, remove the card and let the table sit on the page.
- Pick **one corner radius rule** (for example 6px for controls, 10px for floating panels) and keep every nested radius concentric: the inner radius equals the outer radius minus the padding between them.

## 5. Status without colour confetti

Orders are pending, paid, shipped, failed, refunded and overdue. The reflex is to give each a pastel pill: amber, green, blue, red, grey, purple. After six colours none of them mean anything and people with colour-blindness lose the information entirely.

Do this instead:

- **Show status with words first.** The word "Overdue" does the job without any colour at all.
- **Add a shape or position cue.** A small dot, a leading icon, or placing the exception rows in their own group at the top.
- **Spend colour only on what needs attention.** Normal states stay in the body text colour. Paid, shipped and delivered are quiet. Overdue and failed get the single warm accent.
- **Limit status colours to three:** needs attention, in progress, and done. Anything beyond that, use text.
- **Never rely on colour alone.** A red number needs a minus sign or a word beside it.

The same reasoning applies to the accent. Use one colour for the primary action and for what needs you now. If everything is blue, nothing stands out.

## 6. States

Every screen has at least five states, and the happy one is the one you designed first. Design the others in the same sitting, and make each reachable with a URL parameter (`?state=empty`, `?state=error`, `?state=loading`) so you can screenshot them.

### Empty

There are two kinds, and they need different handling.

- **First-run empty.** The user has never added anything. Say what will appear here and give one action that makes it appear: "Orders you receive show up here. Add your first product to start selling." Offer to load sample data if that helps the user understand the screen. Don't draw a large illustration and a paragraph.
- **Filtered empty.** The user searched or filtered and nothing matched. Quote their term ("No customers match 'Adebyo'") and give a clear way to remove the filter. A typo hint helps.

### Loading

- **Wait about 300 milliseconds before showing anything.** Short loads should look instant, not flicker through a skeleton.
- **Use skeletons that match the real layout:** the same number of rows, the same column widths. Never put a spinner in the centre of a blank page.
- **Keep the frame.** The title, the nav and the filters render immediately. Only the data area waits.
- **Disable and label the action that is in flight.** "Saving..." on the button, and keep the button its original width.

### Error

Tell the user plainly what went wrong, what they can do about it, and offer a retry. Keep everything they typed. "We couldn't save this order. Your changes are still here. Try again." is better than a red banner reading "Error 500" and far better than a technical message.

Put the error where the problem is: a failed row gets a message in the row, not a toast that vanishes in four seconds. Toasts are for confirmations ("Order archived. Undo"), not for failures that need action.

### Partial

Data arrives in pieces, or some of it is stale. Show what you have and mark what you don't. "Updated 4 min ago" next to a refresh button covers most cases. If one panel failed while the rest worked, show the error inside that panel only.

### Offline

If the app is used on patchy mobile data, which is a real condition for many users in Lagos, Kano and rural UK alike, handle it. A banner states that the connection is lost, lists what still works, and queues the changes with a visible "Will send when you're back online" marker. Test by switching the network to Offline in dev tools.

### First run

The very first session, before the user has any data. This is not the same as an empty list. Do a short setup if the app can't be used without one (business name, currency, tax rate) and keep it to the minimum. Let people skip everything optional and return to it later. Pre-fill what you can. After setup, drop the user into the main screen, not a tour.

### Other states worth designing

- **No permission.** Say why and who can: "Only the shop owner can change prices."
- **Destructive actions.** Prefer undo over "Are you sure?". Where undo is impossible, name the thing: "Delete 'Ankara print, 6 yards'?" with a button labelled "Delete product".
- **Overflow.** See `stress-test.md`.

## 7. Interaction patterns

### Tables and lists

Tables are the workhorse of most business apps. Make them good.

- **Alignment:** text on the left, numbers on the right with tabular figures, headers aligned with their column.
- **Header:** sticky when the table scrolls.
- **Primary column:** the name or identifier in the strongest weight; secondary columns in a lighter tone.
- **Width:** set columns from the content. A status column doesn't need 200px.
- **Truncation:** an ellipsis with the full value on focus or hover. Never let a status wrap onto four lines.
- **One primary action per row.** The thing people do most (Open, Reorder, Mark paid) is visible. The rest sit in a row menu or appear on hover and keyboard focus.
- **Sort and filter** that persist in the URL, with the current sort shown on the header.
- **Bulk actions** appear when rows are selected, in a bar that replaces the usual toolbar.
- **Time:** relative when it is recent ("12 min ago"), absolute when it isn't ("Tue 14 Oct"), with the exact time on hover.
- **Names as text.** A column of initials in coloured circles adds noise. Use avatars only where there are real photos.
- **On a phone,** a wide table becomes a list of rows with two or three key fields each, and the rest on the detail screen. Horizontal scrolling inside a table is a last resort.

### Forms

- **Labels above fields,** always visible. A placeholder is not a label because it disappears when the user types.
- **Validate after the user leaves the field,** not on every keystroke, and not only at submit. Show the message next to the field and say how to fix it: "Phone number needs 11 digits, like 0803 123 4567".
- **Keep submit enabled** unless you tell the user why it isn't. A silently disabled button teaches nothing.
- **Right keyboard on mobile:** `inputmode="numeric"` for amounts and codes, `type="email"`, `autocomplete` values for names and addresses.
- **Group long forms** into sections with headings, and put the main action at the end of the form, aligned with the fields.
- **Save behaviour should be clear.** Either autosave with a visible "Saved" indicator, or an explicit button. Don't mix the two on one screen.
- **Keep the draft** if the user navigates away by mistake.

### Keyboard

Keyboard access is the mark of a serious tool.

- Everything is reachable with Tab, with a **visible focus ring** that doesn't depend on colour alone.
- **Shortcuts for frequent actions,** listed in the tooltips and menus. A single key for the most common (N for new), and Escape to close.
- **A command palette** (Cmd+K or Ctrl+K) once the app has more than about ten actions. Show the right modifier for the user's platform and support both.
- **Arrow keys** move through lists and tables, Enter opens, and the focus returns to where it was when a dialog closes.
- **Don't override** browser shortcuts for things people expect (Cmd+F, Cmd+L, Cmd+R).

### URLs are state

Filters, sort order, the open tab, the selected record and the date range go into the URL. Then the back button works, a view can be bookmarked, and a colleague can be sent a link to exactly what you are looking at. This also makes every state testable.

### Settings pages

Settings pages are where tidy apps and messy apps separate.

- **Group by what people are trying to do** (Profile, Notifications, Billing, Team), not by how the code is organised.
- **Each setting gets a label and one line of explanation** of what changes. Skip the explanation if the label is already clear.
- **Put the most-used settings first.** The rarely used and dangerous ones (delete account, export data) go last in their own section.
- **Apply instantly for toggles and show "Saved".** Use a Save button for groups of fields that must change together.
- **Search** once there are more than about a dozen settings.
- **Danger zone:** one section at the bottom, in plain text with a clearly labelled button, and a confirmation that names what will be lost.

## 8. Dashboards without the metric-card reflex

Some products do need a dashboard: a morning view for an owner, a team overview. Build it as a decision tool, not as a display case.

1. **Start with the questions.** List the three or four things this person wants to know when they open it. "Am I behind on anything? What changed since yesterday? What do I need to do?" Each becomes one block.
2. **Give the first question the most space,** and write the answer in words with the number inside it: "You're behind on 3 deliveries; two are in Lekki." The detail is below, or a click away.
3. **Choose the chart for the question.** A trend over time wants a line. A comparison between five branches wants a sorted bar chart. A part-of-whole with three parts wants a sentence. If a number has no comparison, a chart doesn't help; a sparkline in every card is decoration.
4. **Give every number a comparison** (against last week, against the target, against the other shop) or leave it out. A lone "1,284" asks the reader to do the maths.
5. **Make it actionable.** Each block ends in the thing you can do: a link to the late orders, a button to message the customers.
6. **Fewer blocks.** Four well-chosen blocks beat twelve equal tiles. Differences in size should reflect differences in importance.
7. **Avoid "+12% from last month" under every figure.** Say it once, where it matters, in plain words and with the period spelled out.
8. **Treat it as a report when it is a report.** If the content is for a monthly review, give it a print-friendly layout with a date range picker, not a live widget wall.

Test a dashboard by covering the labels. If you can't tell from the layout which block matters most, the hierarchy hasn't been decided yet.

## 9. The look of an app

Pick a short list on purpose and let everything else recede, which leaves the user's content as the loudest thing on screen: one ground colour with hairline dividers, one good UI face (plus a monospace for IDs and amounts if needed), one accent for the primary action and the "needs you now" signal, one control material, and a single signature touch that shows off the product's personality, such as a stock bar that empties like a fuel gauge.

## Before you hand it over

- Every state above is designed and reachable by URL.
- The main task is visible in the first viewport at 1280px and at 390px.
- Tab through the whole screen and check that focus is always visible.
- Run the worst-case data pass from `stress-test.md`.
- Check the app with JavaScript disabled: an app can't work without it, so add a `<noscript>` line that says so instead of showing a blank page.
