import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Seo from '@/components/Seo';
import { Gold, ItemIcon, PageHeader, Section, Stat, Tabs } from '@/components/ui';
import { sheet } from '@/data/sheet';
import { fmt } from '@/lib/format';

const { market, mari } = sheet;

/** Best-effort icon lookup by item name. */
function iconFor(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('blue stone')) return '/icons/guardian-stone.png';
  if (n.includes('red stone')) return '/icons/destruction-stone.png';
  if (n.includes('leapstone')) return '/icons/leapstone.png';
  if (n.includes('shard')) return '/icons/shards.png';
  if (n.includes('fusion')) return '/icons/fusion-material.png';
  if (n.includes('glacier')) return '/icons/glaciers-breath.png';
  if (n.includes('lava')) return '/icons/lavas-breath.png';
  if (n.includes('gem')) return '/icons/gem-t4.png';
  if (n.includes('cube')) return '/icons/cube-ticket.png';
  if (n.includes('blue crystal')) return '/icons/blue-crystal.png';
  if (n.includes('royal crystal')) return '/icons/royal-crystal.png';
  return null;
}

function Name({ name }: { name: string }) {
  const icon = iconFor(name);
  return (
    <span className="flex items-center gap-2 text-ink-100">
      {icon ? <ItemIcon src={icon} label={name} size={22} /> : <span className="inline-block h-[22px] w-[22px] rounded bg-ink-800" />}
      {name}
    </span>
  );
}

type Tab = 'mari' | 'prices';

export default function MarketPage() {
  const [tab, setTab] = useState<Tab>('mari');
  const blueCrystal = market.conversions.find((c) => c.label === '1 Blue Crystal')?.value ?? null;
  const royalCrystal = market.conversions.find((c) => c.label === '1 Royal Crystal')?.value ?? null;

  const deals = useMemo(
    () =>
      mari.map((d) => {
        const comparable = d.marketGold !== null && d.goldEquivalent !== null;
        const savings = comparable ? d.marketGold! - d.goldEquivalent! : null;
        return { ...d, comparable, savings };
      }),
    []
  );
  const mariWins = deals.filter((d) => d.cheaper === 'Mari');

  return (
    <>
      <Seo title="Market & Mari's shop" description="Lost Ark market prices and whether Mari's shop deals beat the auction house." />
      <PageHeader
        eyebrow={market.region && market.date ? `${market.region} · ${market.date}` : 'Market'}
        title="Market & Mari's shop"
        actions={
          <Tabs<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'mari', label: "Mari's shop" },
              { value: 'prices', label: 'Market prices' },
            ]}
          />
        }
      >
        Prices the rest of the site uses to value chests, chaos runs and shop packs.
      </PageHeader>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="1 Blue Crystal" hint="Gold → Blue Crystal exchange">
          <Gold value={blueCrystal} size={20} />
        </Stat>
        <Stat label="1 Royal Crystal" hint="Royal Crystal → Gold">
          <Gold value={royalCrystal} size={20} />
        </Stat>
        <Stat label="Mari deals worth it" hint="Cheaper than buying on the market">
          <span className={clsx(mariWins.length ? 'text-good' : 'text-ink-300')}>
            {mariWins.length} of {deals.filter((d) => d.comparable).length}
          </span>
        </Stat>
      </div>

      {tab === 'mari' ? (
        <Section title="Mari's shop (F4) vs market (Alt+Y)" subtitle="Blue Crystal cost converted to gold at the current exchange rate. Items without a market price can only be bought from Mari.">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Blue Crystals</th>
                  <th className="text-right">Mari (gold eq.)</th>
                  <th className="text-right">Market</th>
                  <th className="text-right">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d, i) => (
                  <tr key={`${d.item}-${d.quantity}-${i}`}>
                    <td>
                      <Name name={d.item} />
                    </td>
                    <td className="num text-right text-ink-300">{fmt(d.quantity)}</td>
                    <td className="num text-right text-ink-200">
                      <span className="inline-flex items-center gap-1">
                        {fmt(d.blueCrystals)} <ItemIcon src="/icons/blue-crystal.png" label="Blue Crystals" size={16} />
                      </span>
                    </td>
                    <td className="text-right">
                      <Gold value={d.goldEquivalent} />
                    </td>
                    <td className="text-right">
                      <Gold value={d.marketGold} tone="light" />
                    </td>
                    <td className="text-right">
                      {d.cheaper === 'Mari' ? (
                        <span className="chip border-good/40 bg-good/10 text-good">Buy from Mari · save {fmt(d.savings)}</span>
                      ) : d.cheaper === 'Market' ? (
                        <span className="chip border-ink-700 bg-ink-850 text-ink-400">Market is cheaper</span>
                      ) : (
                        <span className="text-xs text-ink-500">Mari only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Section title="Market listings" subtitle={market.title ?? undefined}>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th className="text-right">T4.1</th>
                    <th className="text-right">T4</th>
                  </tr>
                </thead>
                <tbody>
                  {market.listings.map((l) => (
                    <tr key={l.name}>
                      <td>
                        <Name name={l.name} />
                      </td>
                      <td className="text-right">
                        <Gold value={l.t41} />
                      </td>
                      <td className="text-right">{l.note ? <span className="text-xs text-ink-500">{l.note}</span> : <Gold value={l.t4} tone="light" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <div className="space-y-6">
            <Section title="Per-unit prices" subtitle="Used to value raid chests and packs">
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th className="text-right">T4.1</th>
                      <th className="text-right">T4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {market.units.map((u) => (
                      <tr key={u.name}>
                        <td className="text-ink-200">{u.name}</td>
                        <td className="num text-right text-gold-300">{fmt(u.t41)}</td>
                        <td className="num text-right text-ink-300">{fmt(u.t4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
            <Section title="Currency">
              <ul className="divide-y divide-ink-800 text-sm">
                {market.conversions.map((c) => (
                  <li key={c.label + c.section} className="flex items-center justify-between px-4 py-2">
                    <span className="text-ink-300">
                      <span className="block text-[11px] uppercase tracking-wide text-ink-500">{c.section}</span>
                      {c.label}
                    </span>
                    {c.unit === 'gold' ? <Gold value={c.value} /> : <span className="num font-semibold text-ink-100">{c.unit === 'USD' ? `$${c.value.toFixed(2)}` : `${fmt(c.value)} ${c.unit}`}</span>}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      )}
    </>
  );
}
