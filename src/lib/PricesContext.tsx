import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { sheet, type ChaosRow, type F4Pack, type Gate, type MariDeal } from '@/data/sheet';
import { useStoredState } from '@/lib/useStoredState';
import { buildPrices, chaosValue, f4Value, gateValue, mariValue, type Overrides, type Prices } from '@/lib/prices';

const STORAGE_KEY = 'lm.prices.v1';
const DEFAULT_PRICES = buildPrices(sheet.market, {});

interface PricesApi {
  prices: Prices;
  defaults: Prices;
  overrides: Overrides;
  editedCount: number;
  isEdited: (key: string) => boolean;
  set: (key: string, value: number | null) => void;
  reset: () => void;
  gateValue: (gate: Gate, tier: string) => Gate['value'];
  chaosValue: (row: ChaosRow) => { normal: number | null; rested: number | null };
  mariValue: (deal: MariDeal) => ReturnType<typeof mariValue>;
  f4Value: (pack: F4Pack) => F4Pack;
}

const PricesContext = createContext<PricesApi | null>(null);

/** Drop anything that isn't a finite number (hand-edited storage, old versions…). */
function clean(raw: unknown): Overrides {
  if (!raw || typeof raw !== 'object') return {};
  return Object.fromEntries(Object.entries(raw as Record<string, unknown>).filter((e): e is [string, number] => typeof e[1] === 'number' && Number.isFinite(e[1])));
}

export function PricesProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useStoredState<Overrides>(STORAGE_KEY, {});
  const overrides = useMemo(() => clean(stored), [stored]);
  const prices = useMemo(() => (Object.keys(overrides).length ? buildPrices(sheet.market, overrides) : DEFAULT_PRICES), [overrides]);

  const set = useCallback(
    (key: string, value: number | null) =>
      setStored((prev) => {
        const next = { ...clean(prev) };
        if (value === null || !Number.isFinite(value)) delete next[key];
        else next[key] = value;
        return next;
      }),
    [setStored]
  );
  const reset = useCallback(() => setStored({}), [setStored]);

  const api = useMemo<PricesApi>(
    () => ({
      prices,
      defaults: DEFAULT_PRICES,
      overrides,
      editedCount: Object.keys(overrides).length,
      isEdited: (key) => key in overrides,
      set,
      reset,
      gateValue: (gate, tier) => gateValue(gate, tier, prices, DEFAULT_PRICES),
      chaosValue: (row) => chaosValue(row, prices, DEFAULT_PRICES),
      mariValue: (deal) => mariValue(deal, prices, DEFAULT_PRICES),
      f4Value: (pack) => f4Value(pack, prices, DEFAULT_PRICES),
    }),
    [prices, overrides, set, reset]
  );

  return <PricesContext.Provider value={api}>{children}</PricesContext.Provider>;
}

export function usePrices(): PricesApi {
  const ctx = useContext(PricesContext);
  if (!ctx) throw new Error('usePrices must be used inside <PricesProvider>');
  return ctx;
}
