import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Seo from '@/components/Seo';
import { Gold, ItemIcon, PageHeader, PctBar, Section, Stat, Tabs, TierBadge } from '@/components/ui';
import { CHEST_REWARDS, CLEAR_REWARDS, EXTRA_LOOT, FIRST_CLEAR, type RewardMeta } from '@/data/rewards';
import { getRaid, modeSlug, sheet, type Gate, type RaidMode } from '@/data/sheet';
import { fmt } from '@/lib/format';

interface Row {
  meta: RewardMeta;
  values: (number | null)[];
  total?: number | null;
  kind?: 'gold' | 'pct' | 'count';
}

const sumOrNull = (values: (number | null)[]) => (values.some((v) => v !== null) ? values.reduce<number>((s, v) => s + (v ?? 0), 0) : null);

function buildRows<T>(gates: Gate[], metas: Record<string, RewardMeta>, pickFn: (g: Gate) => T | null | undefined, kind?: Row['kind']): Row[] {
  return Object.entries(metas)
    .map(([key, meta]) => {
      const values = gates.map((g) => {
        const src = pickFn(g) as Record<string, number | null> | null | undefined;
        return src ? (src[key] ?? null) : null;
      });
      return { meta, values, total: kind === 'pct' ? undefined : sumOrNull(values), kind: kind ?? (meta.gold ? 'gold' : 'count') };
    })
    .filter((r) => r.values.some((v) => v !== null && v !== 0));
}

function Cell({ value, kind }: { value: number | null | undefined; kind: Row['kind'] }) {
  if (value === null || value === undefined) return <span className="text-ink-700">—</span>;
  if (kind === 'gold') return <Gold value={value} />;
  if (kind === 'pct') return <PctBar value={value} />;
  return <span className="num text-ink-100">{fmt(value)}</span>;
}

function RewardTable({ gates, rows, showTotal = true }: { gates: Gate[]; rows: Row[]; showTotal?: boolean }) {
  if (!rows.length) return <p className="px-4 py-6 text-sm text-ink-500">Nothing listed for this difficulty.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="table-base">
        <thead>
          <tr>
            <th className="w-56">Reward</th>
            {gates.map((g) => (
              <th key={g.gate} className="text-right">
                {g.gate}
                {g.itemLevel && gates.some((x) => x.itemLevel !== gates[0].itemLevel) ? <span className="ml-1 font-normal normal-case text-ink-500">{g.itemLevel}</span> : null}
              </th>
            ))}
            {showTotal && <th className="text-right text-ink-300">Total</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.meta.label}>
              <td>
                <span className="flex items-center gap-2 text-ink-200">
                  <ItemIcon src={r.meta.icon} label={r.meta.label} size={22} />
                  {r.meta.label}
                </span>
              </td>
              {r.values.map((v, i) => (
                <td key={i} className="text-right">
                  <span className="inline-flex justify-end">
                    <Cell value={v} kind={r.kind} />
                  </span>
                </td>
              ))}
              {showTotal && (
                <td className="bg-ink-850/60 text-right">
                  <span className="inline-flex justify-end">
                    <Cell value={r.total} kind={r.kind} />
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModeView({ mode }: { mode: RaidMode }) {
  const gates = mode.gates;
  const clearRows = buildRows(gates, CLEAR_REWARDS, (g) => g.clear);
  const bidRows = buildRows(gates, { mainMaterials: { label: 'Main materials (bid)', icon: '/icons/main-materials.png' } }, (g) => g.bid);
  const chestRows = [
    ...buildRows(gates, { cost: { label: 'Chest cost', icon: '/icons/gold.png', gold: true } }, (g) => g.chest),
    ...buildRows(gates, CHEST_REWARDS, (g) => g.chest),
  ];
  const valueRows = buildRows(
    gates,
    {
      atItemLevel: { label: 'At item level', icon: '/icons/gold.png' },
      atItemLevelNoShards: { label: 'At item level, no shards', icon: '/icons/shards.png' },
      fiveToOne: { label: '5:1 into T4.1 mats', icon: '/icons/destruction-stone.png' },
      fiveToOneNoShards: { label: '5:1 into T4.1, no shards', icon: '/icons/shards.png' },
    },
    (g) => g.value,
    'pct'
  );
  const extraClear = buildRows(gates, EXTRA_LOOT, (g) => g.extra?.clear);
  const extraChest = buildRows(gates, EXTRA_LOOT, (g) => g.extra?.chest);
  const firstClear = mode.firstClear
    ? Object.entries(FIRST_CLEAR)
        .map(([k, meta]) => ({ meta, value: mode.firstClear?.[k as keyof typeof mode.firstClear] ?? null }))
        .filter((x) => x.value !== null && x.value !== '')
    : [];
  const cardPacks = sumOrNull(gates.map((g) => g.chest.cardPack));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total gold" hint={`${gates.length} gates · item level ${mode.itemLevel ?? '—'}`}>
          <Gold value={mode.gold.total} className="text-xl" size={20} />
        </Stat>
        <Stat label="Tradable gold">
          <Gold value={mode.gold.tradable} className="text-xl" size={20} />
        </Stat>
        <Stat label="Bound gold" hint={mode.gold.bound ? `${fmt(mode.gold.rosterBound)} roster · ${fmt(mode.gold.characterBound)} character` : 'None'}>
          <Gold value={mode.gold.bound} className="text-xl" size={20} />
        </Stat>
        <Stat label="All chests cost" hint={cardPacks ? `Includes ${cardPacks} card pack${cardPacks > 1 ? 's' : ''}` : undefined}>
          <Gold value={mode.gold.chestCost} className="text-xl" size={20} />
        </Stat>
      </div>

      <Section title="Clear rewards" subtitle="What every party member gets for clearing each gate.">
        <RewardTable gates={gates} rows={[...clearRows, ...bidRows]} />
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Bonus chest" subtitle="Optional chest you can buy after each gate.">
          <RewardTable gates={gates} rows={chestRows} />
        </Section>
        <Section title="Is the chest worth it?" subtitle="Market value of the chest's contents vs. its cost. Above 100% means profit.">
          <RewardTable gates={gates} rows={valueRows} showTotal={false} />
        </Section>
      </div>

      {(extraClear.length > 0 || extraChest.length > 0) && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Section title="Extra loot — clear">
            <RewardTable gates={gates} rows={extraClear} />
          </Section>
          <Section title="Extra loot — bonus chest">
            <RewardTable gates={gates} rows={extraChest} />
          </Section>
        </div>
      )}

      {firstClear.length > 0 && (
        <Section title="First clear rewards" subtitle="One-time rewards for your first clear of this difficulty.">
          <div className="flex flex-wrap gap-3 p-4">
            {firstClear.map(({ meta, value }) => (
              <div key={meta.label} className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-850 px-3 py-2">
                <ItemIcon src={meta.icon} label={meta.label} size={28} />
                <div>
                  <p className="num text-sm font-semibold text-ink-100">{typeof value === 'number' ? fmt(value) : value}</p>
                  <p className="text-xs text-ink-400">{meta.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

export default function RaidPage({ slug }: { slug: string }) {
  const raid = getRaid(slug)!;
  const router = useRouter();
  const options = useMemo(() => raid.modes.map((m) => ({ value: modeSlug(m.difficulty), label: m.difficulty })), [raid]);
  const [active, setActive] = useState(options[0].value);

  // Pick up ?mode= (also used by redirects from the old /raids/x-hard URLs)
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.mode;
    const wanted = typeof q === 'string' ? q.toLowerCase() : null;
    setActive(wanted && options.some((o) => o.value === wanted) ? wanted : options[0].value);
  }, [router.isReady, router.query.mode, options]);

  const select = (value: string) => {
    setActive(value);
    router.replace({ pathname: router.pathname, query: { slug, mode: value } }, undefined, { shallow: true, scroll: false });
  };

  const mode = raid.modes.find((m) => modeSlug(m.difficulty) === active) ?? raid.modes[0];
  const idx = sheet.raids.findIndex((r) => r.slug === slug);
  const prev = sheet.raids[idx - 1];
  const next = sheet.raids[idx + 1];

  return (
    <>
      <Seo
        title={raid.name}
        description={`${raid.name} rewards: gold per gate, bound gold, bonus chest costs and loot for ${raid.modes.map((m) => m.difficulty).join(', ')}.`}
      />
      <nav className="mb-4 text-xs text-ink-500">
        <Link href="/raids" className="hover:text-gold-300">
          Raids
        </Link>{' '}
        / <span className="text-ink-300">{raid.name}</span>
      </nav>
      <PageHeader
        eyebrow={raid.category ?? undefined}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {raid.name}
            {raid.tiers.map((t) => (
              <TierBadge key={t} tier={t} className="text-sm" />
            ))}
          </span>
        }
        actions={<Tabs value={active} options={options} onChange={select} />}
      >
        <span className={clsx('chip border-ink-700 bg-ink-850 text-ink-300')}>
          {mode.difficulty} · {mode.tier} · item level {mode.itemLevel}
        </span>
      </PageHeader>

      <ModeView mode={mode} />

      <div className="mt-10 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link href={`/raids/${prev.slug}`} className="btn">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/raids/${next.slug}`} className="btn">
            {next.name} →
          </Link>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: sheet.raids.map((r) => ({ params: { slug: r.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ slug: string }> = ({ params }) => ({
  props: { slug: String(params?.slug) },
});
