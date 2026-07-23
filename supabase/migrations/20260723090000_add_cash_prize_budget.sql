-- Adds the cash-prize budget ledger used by src/../_shared/cashPrizeBudget.ts.
--
-- cash_prize_budget_total  : running total ever credited to this user as
--                            "available for game cash prizes" - this is now
--                            where the 30% CASH_SHARE of every ad view goes
--                            (see ad-reward Edge Function), instead of
--                            crediting wallet_cash_balance directly.
-- cash_prize_budget_claimed: running total already paid out to the user
--                            through mini-game cash-prize wins.
--
-- available budget = cash_prize_budget_total - cash_prize_budget_claimed.
-- Only cash-TYPE prizes in Spin Wheel / Scratch Card / Slot Machine /
-- Lucky Chests draw from this. Silver/Gold/Diamond/ARPG are unaffected.
-- The Mega Pool Wheel is unaffected too - it already has its own separate,
-- explicitly-designed liquidity pool (the `mega_pool` table).

alter table public.profiles
  add column cash_prize_budget_total numeric(12, 4) not null default 0,
  add column cash_prize_budget_claimed numeric(12, 4) not null default 0;

-- FILE LOCATION: supabase/migrations/20260723090000_add_cash_prize_budget.sql (NEW file)
