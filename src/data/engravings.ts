import imagesData from './imageLinks';
interface Engraving {
  image: string;
  label: string;
  isClassEngraving?: boolean;
}

const engravings: Engraving[] = [
  { image: '', label: 'Adrenaline' },
  { image: '', label: 'All Out Attack' },
  { image: '', label: 'Arthetinean Skill', isClassEngraving: true },
  { image: '', label: 'Asura\'s Path', isClassEngraving: true },
  { image: '', label: 'Awakening' },
  { image: '', label: 'Barrage Enhancement', isClassEngraving: true },
  { image: '', label: 'Barricade' },
  { image: '', label: 'Berserker\'s Technique', isClassEngraving: true },
  { image: '', label: 'Blessed Aura', isClassEngraving: true },
  { image: '', label: 'Brawl King Storm', isClassEngraving: true },
  { image: '', label: 'Broken Bone' },
  { image: '', label: 'Combat Readiness', isClassEngraving: true },
  { image: '', label: 'Communication Overflow', isClassEngraving: true },
  { image: '', label: 'Contender' },
  { image: '', label: 'Control', isClassEngraving: true },
  { image: '', label: 'Crisis Evasion' },
  { image: '', label: 'Crushing Fist' },
  { image: '', label: 'Cursed Doll' },
  { image: '', label: 'Death Strike', isClassEngraving: true },
  { image: '', label: 'Deathblow', isClassEngraving: true },
  { image: '', label: 'Demonic Impulse', isClassEngraving: true },
  { image: '', label: 'Desperate Salvation', isClassEngraving: true },
  { image: '', label: 'Disrespect' },
  { image: '', label: 'Divine Protection' },
  { image: '', label: 'Drizzle', isClassEngraving: true },
  { image: '', label: 'Drops of Ether' },
  { image: '', label: 'Emergency Rescue' },
  { image: '', label: 'Empress\'s Grace', isClassEngraving: true },
  { image: '', label: 'Energy Overflow', isClassEngraving: true },
  { image: '', label: 'Enhanced Shield' },
  { image: '', label: 'Enhanced Weapon', isClassEngraving: true },
  { image: '', label: 'Esoteric Flurry', isClassEngraving: true },
  { image: '', label: 'Esoteric Skill Enhancement', isClassEngraving: true },
  { image: '', label: 'Ether Enhancement', isClassEngraving: true },
  { image: '', label: 'Expert' },
  { image: '', label: 'Explosive Expert' },
  { image: '', label: 'Fast Speed' },
  { image: '', label: 'Firepower Enhancement', isClassEngraving: true },
  { image: '', label: 'First Intention', isClassEngraving: true },
  { image: '', label: 'Fortitude' },
  { image: '', label: 'Full Bloom', isClassEngraving: true },
  { image: '', label: 'Full Moon Harvester', isClassEngraving: true },
  { image: '', label: 'Gravity Training', isClassEngraving: true },
  { image: '', label: 'Grudge' },
  { image: '', label: 'Heavy Armor Equipment' },
  { image: '', label: 'Hit Master' },
  { image: '', label: 'Hunger', isClassEngraving: true },
  { image: '', label: 'Igniter', isClassEngraving: true },
  { image: '', label: 'Increases Mass' },
  { image: '', label: 'Judgment', isClassEngraving: true },
  { image: '', label: 'Keen Blunt Weapon' },
  { image: '', label: 'Legacy of Evolution', isClassEngraving: true },
  { image: '', label: 'Lightning Fury' },
  { image: '', label: 'Lone Knight', isClassEngraving: true },
  { image: '', label: 'Loyal Companion', isClassEngraving: true },
  { image: '', label: 'Lunar Voice', isClassEngraving: true },
  { image: '', label: 'Magick Stream' },
  { image: '', label: 'Master Brawler' },
  { image: '', label: 'Master of Ambush' },
  { image: '', label: 'Master of Escape' },
  { image: '', label: 'Master Summoner', isClassEngraving: true },
  { image: '', label: 'Master\'s Tenacity' },
  { image: '', label: 'Max MP Increase' },
  { image: '', label: 'Mayhem', isClassEngraving: true },
  { image: '', label: 'MP Efficiency Increase' },
  { image: '', label: 'Necromancy' },
  { image: '', label: 'Night\'s Edge', isClassEngraving: true },
  { image: '', label: 'Order of the Emperor', isClassEngraving: true },
  { image: '', label: 'Peacemaker', isClassEngraving: true },
  { image: '', label: 'Perfect Suppression', isClassEngraving: true },
  { image: '', label: 'Pinnacle', isClassEngraving: true },
  { image: '', label: 'Pistoleer', isClassEngraving: true },
  { image: '', label: 'Precision Dagger' },
  { image: '', label: 'Predator', isClassEngraving: true },
  { image: '', label: 'Preemptive Strike' },
  { image: '', label: 'Propulsion' },
  { image: '', label: 'Punisher', isClassEngraving: true },
  { image: '', label: 'Rage Hammer', isClassEngraving: true },
  { image: '', label: 'Raid Captain' },
  { image: '', label: 'Recurrence', isClassEngraving: true },
  { image: '', label: 'Reflux', isClassEngraving: true },
  { image: '', label: 'Remaining Energy', isClassEngraving: true },
  { image: '', label: 'Robust Spirit', isClassEngraving: true },
  { image: '', label: 'Shield Piercing' },
  { image: '', label: 'Shock Training', isClassEngraving: true },
  { image: '', label: 'Sight Focus' },
  { image: '', label: 'Spirit Absorption' },
  { image: '', label: 'Stabilized Status' },
  { image: '', label: 'Strong Will' },
  { image: '', label: 'Super Charge' },
  { image: '', label: 'Surge', isClassEngraving: true },
  { image: '', label: 'Time to Hunt', isClassEngraving: true },
  { image: '', label: 'True Courage', isClassEngraving: true },
  { image: '', label: 'Ultimate Skill: Taijutsu', isClassEngraving: true },
  { image: '', label: 'Vital Point Hit' },
  { image: '', label: 'Wind Fury', isClassEngraving: true },
];

interface EngravingItem {
  image: string;
  label: string;
  values: number[][];
  maxValues: number[],
  fixedValues?: number[],
}

const engravingItems: EngravingItem[] = [
  {
    image: imagesData.ring,
    label: 'Ring',
    values: [
      [3, 4, 5, 6],
      [3],
      [1, 2, 3],
    ],
    maxValues: [6, 3],
  },
  {
    image: imagesData.necklace,
    label: 'Necklace',
    values: [
      [3, 4, 5, 6],
      [3],
      [1, 2, 3],
    ],
    maxValues: [6, 3],
  },
  {
    image: imagesData.earring,
    label: 'Earring',
    values: [
      [3, 4, 5, 6],
      [3],
      [1, 2, 3],
    ],
    maxValues: [6, 3],
  },
  {
    image: imagesData.abilityStone,
    label: 'Ability Stone',
    values: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ],
    maxValues: [10, 10],
  },
  {
    image: imagesData.book,
    label: 'Books',
    values: [[3, 6, 9, 12], [3, 6, 9, 12]],
    maxValues: [12, 12],
    fixedValues: [3, 6, 9, 12],
  },
];

interface NegativeEngraving {
  label: string;
}

const negativeEngravings: NegativeEngraving[] = [
  {
    label: 'Defence Reduction',
  },
  {
    label: 'Attack Power Reduction',
  },
  {
    label: 'Move Speed Reduction',
  },
  {
    label: 'Attack Speed Reduction',
  },
];

export { engravings, engravingItems, negativeEngravings };
export type { Engraving, EngravingItem, NegativeEngraving };