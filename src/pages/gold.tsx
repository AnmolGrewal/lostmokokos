import Link from 'next/link';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Seo from '@/components/Seo';
import { Gold, PageHeader, PctBar, Section, TierBadge } from '@/components/ui';
import { allModes, bestRaidsFor, isAltEntry, modeSlug, type RaidModeRef } from '@/data/sheet';
import { useStoredState } from '@/lib/useStoredState';

type SortKey = 'raid' | 'itemLevel' | 'total' | 'tradable' | 'bound' | 'chestCost' | 'value';

const avgValue = (ref: RaidModeRef) => {
  const vals = ref.mode.gates.map((g) => g.value.atItemLevel).filter((v): v is number => v !== null);
  return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
};

const SORTERS: Record<SortKey, (r: RaidModeRef) => number | string> = {
  raid: (r) => r.raid.name,
  itemLevel: (r) => r.mode.itemLevel ?? 0,
  total: (r) => r.mode.gold.total,
  tradable: (r) => r.mode.gold.tradable,
  bound: (r) => r.mode.gold.bound,
  chestCost: (r) => r.mode.gold.chestCost,
  value: (r) => avgValue(r) ?? -1,
};

export default function GoldPage() {
  const [ilvl, setIlvl] = useStoredState<number | ''>('lm.gold.ilvl', '');
  const [includeSolo, setIncludeSolo] = useStoredState('lm.gold.solo', false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'total', dir: -1 });

  const top = useMemo(() => (ilvl ? bestRaidsFor(ilvl, 3, { includeSolo }) : []), [ilvl, includeSolo]);
  const topKeys = new Set(top.map((t) => t.key));

  const rows = useMemo(() => {
    const list = allModes().filter((r) => (includeSolo || !isAltEntry(r.mode.difficulty)) && (!ilvl || (r.mode.itemLevel ?? 0) <= ilvl));
    const fn = SORTERS[sort.key];
    return list.sort((a, b) => {
      const x = fn(a);
      const y = fn(b);
      return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * sort.dir;
    });
  }, [ilvl, includeSolo, sort]);

  const header = (key: SortKey, label: string, right = true) => (
    <th className={clsx(right && 'text-right')}>
      <button
        className={clsx('inline-flex items-center gap-1 uppercase hover:text-ink-100', sort.key === key && 'text-gold-300')}
        onClick={() => setSort((s) => ({ key, dir: s.key === key ? ((s.dir * -1) as 1 | -1) : key === 'raid' ? 1 : -1 }))}
      >
        {label}
        {sort.key === key ? (sort.dir === -1 ? '↓' : '↑') : ''}
      </button>
    </th>
  );

  const topTotal = top.reduce((s, t) => s + t.mode.gold.total, 0);

  return (
    <>
      <Seo title="Weekly gold" description="Compare gold from every Lost Ark raid and difficulty, and find the best three raids for your item level." />
      <PageHeader eyebrow="Weekly gold" title="Gold by raid">
        Every raid and difficulty side by side. Enter your item level to see what you can run and which three raids pay the most.
      </PageHeader>

      <div className="mb-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="card flex flex-col gap-3 p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-400" htmlFor="ilvl">
            Your item level
          </label>
          <input
            id="ilvl"
            type="number"
            inputMode="numeric"
            className="input text-lg"
            placeholder="e.g. 1720"
            value={ilvl}
            onChange={(e) => setIlvl(e.target.value === '' ? '' : Number(e.target.value))}
          />
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input type="checkbox" checked={includeSolo} onChange={(e) => setIncludeSolo(e.target.checked)} className="accent-gold-500" />
            Include Solo &amp; Matching modes
          </label>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Best 3 raids{ilvl ? ` at ${ilvl}` : ''}</p>
          {top.length ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {top.map((t, i) => (
                <Link key={t.key} href={`/raids/${t.raid.slug}?mode=${modeSlug(t.mode.difficulty)}`} className="rounded-lg border border-gold-500/30 bg-gold-500/5 p-3 hover:border-gold-500/60">
                  <p className="text-xs text-ink-400">#{i + 1}</p>
                  <p className="font-semibold text-ink-100">{t.raid.name}</p>
                  <p className="text-xs text-ink-400">
                    {t.mode.difficulty} · {t.mode.itemLevel}
                  </p>
                  <Gold value={t.mode.gold.total} className="mt-1" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-500">{ilvl ? 'No raids available at that item level.' : 'Enter an item level to get a recommendation.'}</p>
          )}
          {top.length > 0 && (
            <p className="mt-3 text-sm text-ink-400">
              Weekly total: <Gold value={topTotal} /> per character
            </p>
          )}
        </div>
      </div>

      <Section title={`${rows.length} raid modes`} subtitle="Totals include tradable and bound gold. Chest value = market value of the bonus chest ÷ its cost, averaged across gates.">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                {header('raid', 'Raid', false)}
                <th>Mode</th>
                {header('itemLevel', 'iLvl')}
                {header('total', 'Total')}
                {header('tradable', 'Tradable')}
                {header('bound', 'Bound')}
                {header('chestCost', 'Chests')}
                {header('value', 'Chest value')}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className={clsx(topKeys.has(r.key) && '[&>td]:bg-gold-500/5')}>
                  <td>
                    <Link href={`/raids/${r.raid.slug}?mode=${modeSlug(r.mode.difficulty)}`} className="font-medium text-ink-100 hover:text-gold-300">
                      {r.raid.name}
                    </Link>
                    {topKeys.has(r.key) && <span className="chip ml-2 border-gold-500/40 bg-gold-500/10 text-gold-300">Top 3</span>}
                  </td>
                  <td>
                    <span className="flex items-center gap-2 text-ink-300">
                      <TierBadge tier={r.mode.tier} />
                      {r.mode.difficulty}
                    </span>
                  </td>
                  <td className="num text-right text-ink-300">{r.mode.itemLevel}</td>
                  <td className="text-right">
                    <Gold value={r.mode.gold.total} />
                  </td>
                  <td className="text-right">
                    <Gold value={r.mode.gold.tradable || null} tone="light" />
                  </td>
                  <td className="text-right">
                    <Gold value={r.mode.gold.bound || null} tone="muted" />
                  </td>
                  <td className="text-right">
                    <Gold value={r.mode.gold.chestCost || null} tone="bad" />
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <PctBar value={avgValue(r)} max={600} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
