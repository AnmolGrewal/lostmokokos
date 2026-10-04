import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Seo from '@/components/Seo';
import { Gold, ItemIcon, PageHeader, Section, Stat, Tabs } from '@/components/ui';
import { sheet } from '@/data/sheet';
import { fmt } from '@/lib/format';
import { usePrices } from '@/lib/PricesContext';
import { convKey, directUnits, isDerivedConversion, listingKey, unitKey } from '@/lib/prices';

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

const DIRECT_UNITS = new Set(directUnits(market));
const fmtUnit = (n: number | null | undefined) => (n === null || n === undefined ? '—' : n.toLocaleString('en-US', { maximumFractionDigits: n < 10 ? 3 : 2 }));

/**
 * Editable price cell. Shows the sheet's value until edited; edits are saved right away and an
 * empty field (or the reset button) goes back to the sheet's value.
 */
function PriceInput({ k, sheetValue, label }: { k: string; sheetValue: number | null; label: string }) {
  const { overrides, set, isEdited } = usePrices();
  const edited = isEdited(k);
  const current = edited ? overrides[k] : sheetValue;
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(text);
    const cleaned = text.replace(/,/g, '').trim();
    if (cleaned === '') return set(k, null);
    const n = Number(cleaned);
    if (!Number.isFinite(n) || n < 0) return;
    set(k, sheetValue !== null && n === sheetValue ? null : n);
  };

  return (
    <span className="inline-flex items-center justify-end gap-1">
      <input
        className={clsx(
          'input num w-28 py-1 text-right',
          edited ? 'border-amber-500/70 bg-amber-500/10 text-amber-200' : 'text-gold-300'
        )}
        inputMode="decimal"
        aria-label={label}
        title={edited ? `Sheet value: ${fmtUnit(sheetValue)}` : 'Sheet value — type to use your own price'}
        value={draft ?? (current === null ? '' : String(current))}
        placeholder={sheetValue === null ? '—' : fmtUnit(sheetValue)}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => setDraft(null)}
      />
      <button
        type="button"
        className={clsx('w-5 text-xs text-ink-500 hover:text-amber-300', !edited && 'invisible')}
        onClick={() => {
          setDraft(null);
          set(k, null);
        }}
        aria-label={`Reset ${label} to the sheet value`}
        title={`Back to sheet value (${fmtUnit(sheetValue)})`}
      >
        ↺
      </button>
    </span>
  );
}

export default function MarketPage() {
  const router = useRouter();
  const pricing = usePrices();
  const { prices, editedCount, reset } = pricing;
  const blueCrystal = prices.blueCrystal;
  const royalCrystal = prices.royalCrystal;

  const tab: Tab = router.query.tab === 'mari' ? 'mari' : 'prices';
  const setTab = (t: Tab) => router.replace({ pathname: router.pathname, query: { tab: t } }, undefined, { shallow: true, scroll: false });

  const deals = useMemo(
    () =>
      mari.map((d) => {
        const v = pricing.mariValue(d);
        return { ...v, comparable: v.marketGold !== null && v.goldEquivalent !== null };
      }),
    [pricing]
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
              { value: 'prices', label: 'Market prices' },
              { value: 'mari', label: "Mari's shop" },
            ]}
          />
        }
      >
        Prices the rest of the site uses to value chests, chaos runs, Mari&apos;s shop and F4 packs. Put in your own server&apos;s prices — they&apos;re saved in
        this browser and every calculation updates. Anything you don&apos;t edit uses the sheet&apos;s price.
      </PageHeader>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="1 Blue Crystal" hint="Gold → Blue Crystal exchange">
          <Gold value={Math.round(blueCrystal * 100) / 100} size={20} />
        </Stat>
        <Stat label="1 Royal Crystal" hint="Royal Crystal → Gold">
          <Gold value={Math.round(royalCrystal * 100) / 100} size={20} />
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
        <div className="space-y-4">
          <div
            className={clsx(
              'card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm',
              editedCount ? 'border-amber-500/40 bg-amber-500/5 text-amber-200' : 'text-ink-400'
            )}
          >
            <span>
              {editedCount
                ? `Using your prices for ${editedCount} value${editedCount === 1 ? '' : 's'} — chest values, chaos, Mari and F4 packs all use them.`
                : `Showing the sheet's ${market.region ?? ''} prices${market.date ? ` from ${market.date}` : ''}. Edit any gold field to use your own.`}
            </span>
            {editedCount > 0 && (
              <button className="btn text-xs" onClick={reset}>
                Reset all to sheet
              </button>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <Section title="Market listings" subtitle="What things cost on the auction house. Editable.">
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
                          {l.note && <span className="ml-8 block text-[11px] text-ink-500">{l.note}</span>}
                        </td>
                        <td className="text-right">
                          {l.t41 === null ? <span className="text-ink-700">—</span> : <PriceInput k={listingKey(l.name, 't41')} sheetValue={l.t41} label={`${l.name} T4.1 price`} />}
                        </td>
                        <td className="text-right">
                          {l.t4 === null ? <span className="text-ink-700">—</span> : <PriceInput k={listingKey(l.name, 't4')} sheetValue={l.t4} label={`${l.name} T4 price`} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
            <div className="space-y-6">
              <Section title="Currency" subtitle="Exchange rates. Editable.">
                <ul className="divide-y divide-ink-800 text-sm">
                  {market.conversions.map((c) => {
                    const derived = isDerivedConversion(c.label);
                    const value = prices.conversions[c.label];
                    return (
                      <li key={c.label + c.section} className="flex items-center justify-between gap-3 px-4 py-2">
                        <span className="text-ink-300">
                          <span className="block text-[11px] uppercase tracking-wide text-ink-500">{c.section}</span>
                          {c.label}
                        </span>
                        {derived ? (
                          <span className="num font-semibold text-ink-300">
                            {c.unit === 'USD' ? `$${fmtUnit(value)}` : `${fmtUnit(value)} ${c.unit}`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            {c.unit === 'USD' && <span className="text-ink-500">$</span>}
                            <PriceInput k={convKey(c.label)} sheetValue={c.value} label={`${c.label} (${c.unit})`} />
                            {c.unit !== 'USD' && <span className="text-xs text-ink-500">{c.unit}</span>}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Section>
              <Section title="Per-unit prices" subtitle="Worked out from the listings. Items not sold on the market can be edited here.">
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
                      {market.units.map((u) => {
                        const cur = prices.units[u.name];
                        const direct = DIRECT_UNITS.has(u.name);
                        return (
                          <tr key={u.name}>
                            <td className="text-ink-200">{u.name}</td>
                            <td className="num text-right text-gold-300">
                              {direct ? <PriceInput k={unitKey(u.name)} sheetValue={u.t41} label={`${u.name} price`} /> : fmtUnit(cur?.t41)}
                            </td>
                            <td className="num text-right text-ink-300">{direct ? null : fmtUnit(cur?.t4)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
