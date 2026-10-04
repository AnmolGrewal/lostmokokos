const nf = new Intl.NumberFormat('en-US');
const compactNf = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const fmt = (n: number | null | undefined) => (n === null || n === undefined ? '—' : nf.format(n));
export const fmtCompact = (n: number | null | undefined) => (n === null || n === undefined ? '—' : compactNf.format(n));
export const fmtPct = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `${nf.format(n)}%`);
export const fmtUsd = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const tierClass = (tier: string | null | undefined) => {
  switch (tier) {
    case 'Tier 4.1':
      return 'text-tier-t41 border-tier-t41/40 bg-tier-t41/10';
    case 'Tier 4':
      return 'text-tier-t4 border-tier-t4/40 bg-tier-t4/10';
    case 'Tier 3':
      return 'text-tier-t3 border-tier-t3/40 bg-tier-t3/10';
    default:
      return 'text-tier-t2 border-tier-t2/40 bg-tier-t2/10';
  }
};

export const shortTier = (tier: string | null | undefined) => (tier ? tier.replace('Tier ', 'T') : '');
