import Link from 'next/link';
import { useMemo } from 'react';
import Seo from '@/components/Seo';
import { Gold, ItemIcon, PctBar, TierBadge } from '@/components/ui';
import { bestRaidsFor, modeSlug, sheet } from '@/data/sheet';
import { useStoredState } from '@/lib/useStoredState';

const SECTIONS = [
  { href: '/raids', title: 'Raids', body: 'Gate-by-gate gold, chests and loot for every raid and difficulty.', icon: '/icons/main-materials.png' },
  { href: '/gold', title: 'Weekly gold', body: 'Compare every raid and get your best three for any item level.', icon: '/icons/gold.png' },
  { href: '/characters', title: 'Roster tracker', body: 'Plan and tick off weekly gold across all your characters.', icon: '/icons/gold-roster-bound.png' },
  { href: '/daily', title: 'Chaos & Guardians', body: 'Daily content rewards and what they are worth on the market.', icon: '/icons/destruction-stone.png' },
  { href: '/market', title: "Market & Mari's shop", body: 'Current prices and which Mari deals beat the auction house.', icon: '/icons/blue-crystal.png' },
  { href: '/shop', title: 'F4 shop packs', body: 'Every pack ranked by value per Royal Crystal spent.', icon: '/icons/royal-crystal.png' },
];

export default function Home() {
  const [ilvl, setIlvl] = useStoredState<number | ''>('lm.gold.ilvl', '');
  const top = useMemo(() => (ilvl ? bestRaidsFor(ilvl, 3) : []), [ilvl]);

  const newest = sheet.raids[0];
  // Royal Crystal packs only — one-off real-money founder packs would always win.
  const bestPack = [...(sheet.f4[0]?.packs ?? [])]
    .sort((a, b) => (b.efficiency ?? 0) - (a.efficiency ?? 0))[0];
  const mariWins = sheet.mari.filter((d) => d.cheaper === 'Mari');
  const topRaid = [...sheet.raids.flatMap((r) => r.modes.map((m) => ({ r, m })))].sort((a, b) => b.m.gold.total - a.m.gold.total)[0];

  return (
    <>
      <Seo description="Lost Ark raid rewards, weekly gold planner, chaos & guardian loot, market prices and F4 shop value — updated from the community rewards sheet." />

      <section className="relative mb-10 overflow-hidden rounded-2xl border border-ink-800 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-850 px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        {sheet.lastUpdated && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-300">
            Updated for {sheet.lastUpdated}
          </p>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-100 sm:text-5xl">Lost Mokokos</h1>
        <p className="mt-3 max-w-2xl text-ink-300">Raid gold, loot and market value for Lost Ark — everything in one place, straight from the community rewards sheet.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div>
            <label htmlFor="home-ilvl" className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              What&apos;s your item level?
            </label>
            <input
              id="home-ilvl"
              type="number"
              inputMode="numeric"
              className="input mt-2 w-full text-lg"
              placeholder="e.g. 1720"
              value={ilvl}
              onChange={(e) => setIlvl(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <p className="mt-2 text-xs text-ink-500">We&apos;ll pick your three best gold raids.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {top.length
              ? top.map((t, i) => (
                  <Link
                    key={t.key}
                    href={`/raids/${t.raid.slug}?mode=${modeSlug(t.mode.difficulty)}`}
                    className="rounded-xl border border-ink-700 bg-ink-950/60 p-4 transition hover:border-gold-500/50"
                  >
                    <p className="text-xs text-ink-500">#{i + 1}</p>
                    <p className="font-semibold text-ink-100">{t.raid.name}</p>
                    <p className="text-xs text-ink-400">
                      {t.mode.difficulty} · {t.mode.itemLevel}
                    </p>
                    <Gold value={t.mode.gold.total} className="mt-2" />
                  </Link>
                ))
              : [0, 1, 2].map((i) => <div key={i} className="hidden rounded-xl border border-dashed border-ink-700 sm:block" />)}
            {ilvl !== '' && !top.length && <p className="text-sm text-ink-500">No gold raids at that item level yet.</p>}
          </div>
        </div>
      </section>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {newest && (
          <Link href={`/raids/${newest.slug}`} className="card p-4 hover:border-gold-500/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Newest content</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-ink-100">
              {newest.name} <TierBadge tier={newest.tiers[0]} />
            </p>
            <p className="text-xs text-ink-500">{newest.modes.map((m) => m.difficulty).join(' · ')}</p>
          </Link>
        )}
        {topRaid && (
          <Link href={`/raids/${topRaid.r.slug}?mode=${modeSlug(topRaid.m.difficulty)}`} className="card p-4 hover:border-gold-500/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Biggest payout</p>
            <p className="mt-1 text-lg font-semibold text-ink-100">
              {topRaid.r.name} {topRaid.m.difficulty}
            </p>
            <Gold value={topRaid.m.gold.total} />
          </Link>
        )}
        {bestPack && (
          <Link href="/shop" className="card p-4 hover:border-gold-500/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Best Royal Crystal pack</p>
            <p className="mt-1 text-lg font-semibold text-ink-100">{bestPack.name}</p>
            <PctBar value={bestPack.efficiency} max={Math.max(200, bestPack.efficiency ?? 0)} />
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="card group flex gap-4 p-5 transition hover:-translate-y-0.5 hover:border-gold-500/40">
            <ItemIcon src={s.icon} label={s.title} size={40} className="rounded-lg" />
            <div>
              <h2 className="font-semibold text-ink-100 group-hover:text-gold-300">{s.title}</h2>
              <p className="mt-1 text-sm text-ink-400">{s.body}</p>
            </div>
          </Link>
        ))}
      </div>

      {mariWins.length > 0 && (
        <p className="mt-8 text-center text-sm text-ink-400">
          {mariWins.length} Mari&apos;s shop deal{mariWins.length > 1 ? 's are' : ' is'} currently cheaper than the market —{' '}
          <Link href="/market" className="text-gold-300 hover:underline">
            see which
          </Link>
          .
        </p>
      )}
    </>
  );
}
