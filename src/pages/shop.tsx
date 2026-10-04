import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Seo from '@/components/Seo';
import { Gold, ItemIcon, PageHeader, PctBar, Tabs } from '@/components/ui';
import { F4_ITEMS } from '@/data/rewards';
import { sheet, type F4Pack } from '@/data/sheet';
import { fmt, fmtCompact, fmtUsd } from '@/lib/format';
import { usePrices } from '@/lib/PricesContext';

type Sort = 'efficiency' | 'price';

function PackCard({ pack, rank, removed }: { pack: F4Pack; rank?: number; removed?: boolean }) {
  return (
    <article className={clsx('card flex flex-col gap-4 p-4', removed && 'opacity-70')}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            {rank ? `#${rank} · ` : ''}
            {pack.availability}
          </p>
          <h3 className="text-base font-semibold text-ink-100">{pack.name}</h3>
        </div>
        <div className="text-right">
          <p className="num text-lg font-semibold text-ink-100">{fmtUsd(pack.usd)}</p>
          <p className="num inline-flex items-center gap-1 text-xs text-ink-400">
            {fmt(pack.royalCrystals)} <ItemIcon src="/icons/royal-crystal.png" label="Royal Crystals" size={14} />
          </p>
        </div>
      </header>

      <ul className="grid grid-cols-2 gap-2 text-sm">
        {pack.contents.map((c) => (
          <li key={c.key} className="flex items-center gap-2 rounded-lg bg-ink-850 px-2 py-1.5">
            <ItemIcon src={F4_ITEMS[c.key].icon} label={F4_ITEMS[c.key].label} size={24} />
            <div className="min-w-0">
              <p className="num font-semibold text-ink-100">{fmtCompact(c.quantity)}</p>
              <p className="truncate text-[11px] text-ink-400">{F4_ITEMS[c.key].label}</p>
            </div>
          </li>
        ))}
        {pack.otherGold !== null && (
          <li className="flex items-center gap-2 rounded-lg bg-ink-850 px-2 py-1.5">
            <span className="grid h-6 w-6 place-items-center rounded bg-ink-700 text-xs text-ink-300">+</span>
            <div>
              <p className="num font-semibold text-ink-100">{fmtCompact(pack.otherGold)} gold</p>
              <p className="text-[11px] text-ink-400">Other</p>
            </div>
          </li>
        )}
      </ul>

      <footer className="mt-auto space-y-2 border-t border-ink-800 pt-3 text-xs">
        <div className="flex items-center justify-between text-ink-400">
          <span>Costs (gold eq.)</span>
          <Gold value={pack.goldCost} />
        </div>
        <div className="flex items-center justify-between text-ink-400">
          <span>Contents worth</span>
          <Gold value={pack.totalGold} />
        </div>
        <div className="flex items-center justify-between text-ink-400">
          <span>Efficiency</span>
          <PctBar value={pack.efficiency} max={400} />
        </div>
        {pack.efficiencyNoShards !== pack.efficiency && (
          <div className="flex items-center justify-between text-ink-400">
            <span>Without shards</span>
            <PctBar value={pack.efficiencyNoShards} max={400} />
          </div>
        )}
        {pack.notes && <p className="pt-1 text-ink-500">{pack.notes}</p>}
      </footer>
    </article>
  );
}

export default function ShopPage() {
  const [sort, setSort] = useState<Sort>('efficiency');
  const pricing = usePrices();
  const sections = useMemo(
    () =>
      sheet.f4.map((s) => ({
        ...s,
        packs: s.packs.map(pricing.f4Value).sort((a, b) => (sort === 'efficiency' ? (b.efficiency ?? 0) - (a.efficiency ?? 0) : (a.usd ?? 0) - (b.usd ?? 0))),
      })),
    [sort, pricing]
  );

  return (
    <>
      <Seo title="F4 shop packs" description="Which Lost Ark Royal Crystal and real-money packs are worth buying, ranked by gold value per crystal spent." />
      <PageHeader
        eyebrow="F4 shop"
        title="Are the packs worth it?"
        actions={
          <Tabs<Sort>
            value={sort}
            onChange={setSort}
            options={[
              { value: 'efficiency', label: 'Best value' },
              { value: 'price', label: 'Cheapest' },
            ]}
          />
        }
      >
        Pack contents valued at current market prices, divided by what the pack costs in gold (via Royal Crystals). 100% means you break even versus
        buying gold.
        {pricing.editedCount > 0 && <span className="text-amber-300"> Using your market prices.</span>}
      </PageHeader>
      <div className="space-y-10">
        {sections.map((s) => {
          const removed = /removed/i.test(s.name);
          return (
            <section key={s.name}>
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-300">{s.name}</h2>
                {s.note && <p className="text-xs text-ink-500">{s.note}</p>}
                <div className="h-px min-w-8 flex-1 bg-ink-800" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {s.packs.map((p, i) => (
                  <PackCard key={p.name} pack={p} rank={!removed && sort === 'efficiency' ? i + 1 : undefined} removed={removed} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
