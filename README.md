# Tally

Small traders let regulars pay later, then lose track of who owes what. Tally is a phone-first web app for UK sole traders (home bakers, market stall holders, mobile hairdressers, cleaners) that does one job: say or type what you just sold, check it, save it, and see who owes you.

**Built in week 2 of the Hiram Initiative "From Beginner to Builder" course.**

## What it does

1. **Sign in with your email.** You get a link, no password.
2. **Record a sale.** Tap the mic and say "Sold 3 cakes to Ada for £45, she'll pay Friday", or type it. Tally fills in a card: customer, item, amount, paid or owes me, due date. You can change any field. Nothing is saved until you tap Save.
3. **Who owes me.** Everyone with a balance, biggest first, with overdue dates in coral. Tap a name for their history and a one-tap WhatsApp reminder.

You can say payments too: "Ada paid me £20" takes £20 off what Ada owes.

New accounts can tap **Fill with sample entries** to see a week of a home baker's records.

## How it works

- Next.js (App Router) from Supabase's `with-supabase` template, with Tailwind.
- Supabase handles email sign-in and the database. Row-level security is on for every table, so each trader can only read and write their own rows.
- Voice uses the phone browser's own speech-to-text (Chrome on Android, Safari on iPhone). The audio isn't saved or sent to Tally, only the words.
- The sentence is turned into a draft by simple rules in [`lib/parse.ts`](lib/parse.ts), not an AI service, so there's no API key or cost per entry. It understands numbers in words ("forty-five pounds"), weekdays ("she'll pay Friday"), "next week", "end of the month", and payments ("Kemi paid me £10").

### Data

| Table | What's in it |
|---|---|
| `profiles` | Business name |
| `customers` | First name, optional mobile |
| `entries` | Sales and payments: item, quantity, amount in pence, paid or owed, due date, what the trader said |
| `reminders` | When a WhatsApp reminder was opened (to count the success metric) |
| `customer_balances` (view) | Each customer's balance: unpaid sales minus payments |

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and publishable key
npm run dev
```

Parser tests:

```bash
node --test lib/parse.test.ts
```

## Not in v1

Payments and subscriptions, admin panel, expenses and profit reports, invoices, WhatsApp bot, automatic SMS, team accounts, Nigeria / naira, offline mode.
