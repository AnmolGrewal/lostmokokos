import Link from 'next/link';
import { useMemo, useState } from 'react';
import Seo from '@/components/Seo';
import { Gold, PageHeader, TierBadge } from '@/components/ui';
import { TIER_ORDER, isAltEntry, primaryTier, sheet, type Raid } from '@/data/sheet';

function RaidCard({ raid }: { raid: Raid }) {
  const main = raid.modes.filter((m) => !isAltEntry(m.difficulty));
  const best = [...main].sort((a, b) => b.gold.total - a.gold.total)[0];
  const minIlvl = Math.min(...raid.modes.map((m) => m.itemLevel ?? Infinity));
  return (
    <Link href={`/raids/${raid.slug}`} className="card group flex flex-col gap-4 p-4 transition hover:-translate-y-0.5 hover:border-gold-500/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          {raid.category && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">{raid.category}</p>}
          <h3 className="font-display text-lg font-semibold text-ink-100 group-hover:text-gold-300">{raid.name}</h3>
        </div>
        <div className="flex gap-1">
          {raid.tiers.map((t) => (
            <TierBadge key={t} tier={t} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {raid.modes.map((m) => (
          <span key={m.difficulty} className="chip border-ink-700 bg-ink-850 text-ink-300">
            {m.difficulty} <span className="num text-ink-500">{m.itemLevel}</span>
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between border-t border-ink-800 pt-3 text-xs text-ink-400">
        <div>
          From <span className="num font-semibold text-ink-200">{minIlvl}</span>
        </div>
        {best && (
          <div className="text-right">
            <p>Up to ({best.difficulty})</p>
            <Gold value={best.gold.total} className="text-base" />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function RaidsPage() {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const raids = sheet.raids.filter((r) => !q || `${r.name} ${r.category ?? ''}`.toLowerCase().includes(q));
    return TIER_ORDER.map((tier) => ({ tier, raids: raids.filter((r) => primaryTier(r) === tier) })).filter((g) => g.raids.length);
  }, [query]);

  return (
    <>
      <Seo title="Raids" description="Every Lost Ark raid and abyssal dungeon with gate-by-gate gold, chest costs and loot." />
      <PageHeader
        eyebrow={sheet.lastUpdated ?? undefined}
        title="Raids & dungeons"
        actions={<input className="input w-56" placeholder="Search raids…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search raids" />}
      >
        Gate-by-gate gold, bound gold, chest costs, extra loot and first-clear rewards for every difficulty.
      </PageHeader>
      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.tier}>
            <div className="mb-3 flex items-center gap-3">
              <TierBadge tier={g.tier} />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-300">{g.tier}</h2>
              <div className="h-px flex-1 bg-ink-800" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.raids.map((r) => (
                <RaidCard key={r.slug} raid={r} />
              ))}
            </div>
          </section>
        ))}
        {!groups.length && <p className="text-sm text-ink-500">No raids match “{query}”.</p>}
      </div>
    </>
  );
}
