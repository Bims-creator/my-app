-- Week 3 launch check. Already applied to the "tally" Supabase project through the connector;
-- kept here as a record.

-- Logged-out visitors never read or write trader data; RLS already blocks them, this removes the grants too.
revoke all on table public.customers, public.entries, public.profiles, public.reminders from anon;
-- Signed-in traders only need normal reads and writes. TRUNCATE skips RLS, so take it away.
revoke truncate, trigger, references on table public.customers, public.entries, public.profiles, public.reminders from authenticated;

-- The balances view is read-only.
revoke all on table public.customer_balances from anon, authenticated;
grant select on table public.customer_balances to authenticated;

-- Indexes for foreign keys flagged by the performance advisor.
create index if not exists entries_customer_id_user_id_idx on public.entries (customer_id, user_id);
create index if not exists reminders_customer_id_user_id_idx on public.reminders (customer_id, user_id);
create index if not exists reminders_user_id_idx on public.reminders (user_id);
