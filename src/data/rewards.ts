import type { F4ItemKey } from './sheet';

export interface RewardMeta {
  label: string;
  icon: string;
  /** Show the value as gold (coloured, thousands separators) */
  gold?: boolean;
}

const icon = (name: string) => `/icons/${name}.png`;

export const CLEAR_REWARDS: Record<string, RewardMeta> = {
  gold: { label: 'Gold', icon: icon('gold'), gold: true },
  rosterBoundGold: { label: 'Roster-bound gold', icon: icon('gold-roster-bound'), gold: true },
  characterBoundGold: { label: 'Character-bound gold', icon: icon('gold-character-bound'), gold: true },
  mainMaterials: { label: 'Main materials', icon: icon('main-materials') },
  clearMedal: { label: 'Clear medal', icon: icon('clear-medal') },
  destinyStone: { label: 'Destiny stone', icon: icon('destiny-stone') },
  destructionStones: { label: 'Destruction stones', icon: icon('destruction-stone') },
  guardianStones: { label: 'Guardian stones', icon: icon('guardian-stone') },
  shards: { label: 'Shards', icon: icon('shards') },
  leapstones: { label: 'Leapstones', icon: icon('leapstone') },
};

export const CHEST_REWARDS: Record<string, RewardMeta> = {
  mainMaterials: { label: 'Main materials', icon: icon('main-materials') },
  destructionStones: { label: 'Destruction stones', icon: icon('destruction-stone') },
  guardianStones: { label: 'Guardian stones', icon: icon('guardian-stone') },
  shards: { label: 'Shards', icon: icon('shards') },
  leapstones: { label: 'Leapstones', icon: icon('leapstone') },
  cardPack: { label: 'Card pack', icon: icon('card-pack') },
};

export const EXTRA_LOOT: Record<string, RewardMeta> = {
  arkGridCores: { label: 'Ark Grid cores', icon: icon('ark-grid-core') },
  accessories: { label: 'Accessories', icon: icon('accessory') },
  abilityStones: { label: 'Ability stones', icon: icon('ability-stone') },
  bracelets: { label: 'Bracelets', icon: icon('bracelet') },
  stoneOfChaos: { label: 'Stone of Chaos', icon: icon('stone-of-chaos') },
  fusedLeapstones: { label: 'Fused leapstones', icon: icon('fused-leapstone') },
  honingTomes: { label: 'Honing tomes', icon: icon('honing-tome') },
};

export const FIRST_CLEAR: Record<string, RewardMeta> = {
  silver: { label: 'Silver', icon: icon('silver') },
  mainMaterials: { label: 'Main materials', icon: icon('main-materials') },
  fusedLeapstones: { label: 'Fused leapstones', icon: icon('fused-leapstone') },
  stoneOfChaos: { label: 'Stone of Chaos', icon: icon('stone-of-chaos') },
  destinyStone: { label: 'Destiny stone', icon: icon('destiny-stone') },
};

export const F4_ITEMS: Record<F4ItemKey, RewardMeta> = {
  destructionStones: { label: 'Red stones', icon: icon('destruction-stone-alt') },
  guardianStones: { label: 'Blue stones', icon: icon('guardian-stone-alt') },
  leapstones: { label: 'Leapstones', icon: icon('leapstone-alt') },
  fusionMaterial: { label: 'Fusion material', icon: icon('fusion-material') },
  glaciersBreath: { label: "Glacier's Breath", icon: icon('glaciers-breath') },
  lavasBreath: { label: "Lava's Breath", icon: icon('lavas-breath') },
  shards: { label: 'Shards', icon: icon('shards') },
  cubeTickets: { label: 'Cube tickets', icon: icon('cube-ticket') },
  blueCrystals: { label: 'Blue Crystals', icon: icon('blue-crystal') },
  royalCrystals: { label: 'Royal Crystals', icon: icon('royal-crystal') },
};

export const DAILY_ICONS = {
  destructionStones: { label: 'Destruction stones', icon: icon('destruction-stone') },
  guardianStones: { label: 'Guardian stones', icon: icon('guardian-stone') },
  leapstones: { label: 'Leapstones', icon: icon('leapstone') },
  shards: { label: 'Shards', icon: icon('shards') },
  silver: { label: 'Silver', icon: icon('silver') },
  gemsT4: { label: 'Tier 4 gems (Lv. 1)', icon: icon('gem-t4') },
  gemsT3: { label: 'Tier 3 gems (Lv. 1)', icon: icon('gem-t3') },
  abilityStones: { label: 'Ability stones', icon: icon('ability-stone') },
  bracelets: { label: 'Bracelets', icon: icon('bracelet') },
  fragments: { label: 'Fragments', icon: icon('fragments') },
  accessories: { label: 'Accessories', icon: icon('accessory') },
} satisfies Record<string, RewardMeta>;
