import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { sheet } from '@/data/sheet';
import { usePrices } from '@/lib/PricesContext';
import { formatCountdown, nextDailyReset, nextWeeklyReset, useNow } from '@/lib/resets';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/raids', label: 'Raids' },
  { href: '/gold', label: 'Gold' },
  { href: '/characters', label: 'Roster' },
  { href: '/daily', label: 'Daily' },
  { href: '/market', label: 'Market' },
  { href: '/shop', label: 'F4 Shop' },
];

/** Shown everywhere while someone's own market prices are in use. */
function CustomPricesChip() {
  const { editedCount, reset } = usePrices();
  if (!editedCount) return null;
  return (
    <span className="chip hidden items-center gap-2 border-amber-500/40 bg-amber-500/10 text-amber-300 sm:inline-flex">
      <Link href="/market?tab=prices" className="hover:underline" title="Values across the site use your prices">
        Your prices ({editedCount})
      </Link>
      <button className="text-amber-400/80 hover:text-amber-200" onClick={reset} title="Go back to the sheet's prices">
        reset
      </button>
    </span>
  );
}

function ResetClock() {
  const now = useNow();
  const daily = now ? formatCountdown(nextDailyReset(now).getTime() - now.getTime()) : '—';
  const weekly = now ? formatCountdown(nextWeeklyReset(now).getTime() - now.getTime()) : '—';
  return (
    <div className="hidden items-center gap-4 text-xs text-ink-400 lg:flex">
      <span>
        Daily reset <span className="num font-semibold text-ink-200">{daily}</span>
      </span>
      <span>
        Weekly reset <span className="num font-semibold text-ink-200">{weekly}</span>
      </span>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink-100">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40">LM</span>
            Lost Mokokos
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                  isActive(item.href) ? 'bg-ink-800 text-gold-300' : 'text-ink-300 hover:bg-ink-850 hover:text-ink-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <CustomPricesChip />
          <ResetClock />
          <button className="btn ml-auto md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            Menu
          </button>
        </div>
        {open && (
          <nav className="grid grid-cols-2 gap-1 border-t border-ink-800 px-4 py-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx('rounded-lg px-3 py-2 text-sm font-medium', isActive(item.href) ? 'bg-ink-800 text-gold-300' : 'text-ink-300')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-ink-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Data from the community{' '}
            <a className="text-ink-300 underline decoration-ink-600 underline-offset-2 hover:text-gold-300" href={sheet.source} target="_blank" rel="noreferrer">
              Raids, Dungeons &amp; Guardians Rewards
            </a>{' '}
            sheet by Tylobic{sheet.lastUpdated ? ` · last updated ${sheet.lastUpdated}` : ''}.
          </p>
          <p>Lost Mokokos is a fan site and is not affiliated with Smilegate or Amazon Games.</p>
        </div>
      </footer>
    </div>
  );
}
