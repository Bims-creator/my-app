# Tally: design direction

Written before the redesign (anti-ai-slop-design skill, week 3). Every visual choice should trace back to this page.

## The default we refuse
Money apps look like banks: white screens, blue buttons, a row of stat cards, charts, pastel status pills. They're built for accountants. Tally is for someone with flour on their hands serving the next customer.

## Concept
**Tally is the slate behind the counter.** Regulars put it on the slate, and you wipe it clean when they pay.

What that means on screen:
- The first thing you see is the slate total: how much you're owed, written large.
- Entries read like lines on a slate: who, what, how much. Not cards, not tables.
- Paid-up customers go quiet: "wiped clean", in plain text, out of the way.
- The bottom of the screen is the counter: a deep green bar with the big mic where your thumb is.

## How it should feel
Quick, friendly, honest. Plain words a shopkeeper would say out loud. It always shows what it heard before saving, and the numbers add up.

## First screen
The product working with real numbers: the owed total in big type, one sentence under it ("£21.00 in sales today. 1 overdue."), and the big mic. No menus, charts or setup.

## Tokens
| Token | Value | Why |
|---|---|---|
| Ground | warm paper `#f6f4ef` | the counter top; never pure white for big surfaces |
| Ink | `hsl(160 20% 12%)` | off-black with a green cast, so it sits with the brand green |
| Brand | deep green `#0b6e4f` | the slate and the counter; the primary action |
| Accent (one job) | coral `#b4451f` | **only** money someone owes you: totals, owed amounts, overdue |
| Display face | Bricolage Grotesque | sturdy, slightly hand-cut shapes, like a painted shop sign; used for the wordmark, headings and big money figures |
| Body face | Geist | clear at small sizes; carries all UI text |
| Numbers | `tabular-nums` | amounts line up and don't jitter as they change |
| Spacing | 4px base, mostly 8 / 12 / 16 / 24 | |
| Radius | 10px controls, 16px floating panels and bubbles, full for the mic | smaller things get smaller corners |
| Shadow | only on the confirm card (it floats above the chat) | nothing else floats |

## Signature touch
The coral total at the top that drops to "Nobody owes you anything" when the slate is wiped clean.

## Why not the others
- **"A till receipt that remembers"**: receipts are about one sale; Tally is about who still owes.
- **"A market trader's notebook"**: lined-paper styling would push the app into the ledger-sheet overcorrection.
