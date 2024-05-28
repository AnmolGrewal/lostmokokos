import imagesData from './imageLinks';
interface Engraving {
  image: string;
  label: string;
}

const engravings: Engraving[] = [
  { image: '', label: 'Adrenaline' },
  { image: '', label: 'All Out Attack' },
  { image: '', label: 'Arthetinean Skill' },
  { image: '', label: 'Asura\'s Path' },
  { image: '', label: 'Awakening' },
  { image: '', label: 'Barrage Enhancement' },
  { image: '', label: 'Barricade' },
  { image: '', label: 'Berserker\'s Technique' },
  { image: '', label: 'Blessed Aura' },
  { image: '', label: 'Brawl King Storm' },
  { image: '', label: 'Broken Bone' },
  { image: '', label: 'Combat Readiness' },
  { image: '', label: 'Communication Overflow' },
  { image: '', label: 'Contender' },
  { image: '', label: 'Control' },
  { image: '', label: 'Crisis Evasion' },
  { image: '', label: 'Crushing Fist' },
  { image: '', label: 'Cursed Doll' },
  { image: '', label: 'Death Strike' },
  { image: '', label: 'Deathblow' },
  { image: '', label: 'Demonic Impulse' },
  { image: '', label: 'Desperate Salvation' },
  { image: '', label: 'Disrespect' },
  { image: '', label: 'Divine Protection' },
  { image: '', label: 'Drizzle' },
  { image: '', label: 'Drops of Ether' },
  { image: '', label: 'Emergency Rescue' },
  { image: '', label: 'Empress\'s Grace' },
  { image: '', label: 'Energy Overflow' },
  { image: '', label: 'Enhanced Shield' },
  { image: '', label: 'Enhanced Weapon' },
  { image: '', label: 'Esoteric Flurry' },
  { image: '', label: 'Esoteric Skill Enhancement' },
  { image: '', label: 'Ether Enhancement' },
  { image: '', label: 'Expert' },
  { image: '', label: 'Explosive Expert' },
  { image: '', label: 'Fast Speed' },
  { image: '', label: 'Firepower Enhancement' },
  { image: '', label: 'First Intention' },
  { image: '', label: 'Fortitude' },
  { image: '', label: 'Full Bloom' },
  { image: '', label: 'Full Moon Harvester' },
  { image: '', label: 'Gravity Training' },
  { image: '', label: 'Grudge' },
  { image: '', label: 'Heavy Armor Equipment' },
  { image: '', label: 'Hit Master' },
  { image: '', label: 'Hunger' },
  { image: '', label: 'Igniter' },
  { image: '', label: 'Increases Mass' },
  { image: '', label: 'Judgment' },
  { image: '', label: 'Keen Blunt Weapon' },
  { image: '', label: 'Legacy of Evolution' },
  { image: '', label: 'Lightning Fury' },
  { image: '', label: 'Lone Knight' },
  { image: '', label: 'Loyal Companion' },
  { image: '', label: 'Lunar Voice' },
  { image: '', label: 'Magick Stream' },
  { image: '', label: 'Master Brawler' },
  { image: '', label: 'Master of Ambush' },
  { image: '', label: 'Master of Escape' },
  { image: '', label: 'Master Summoner' },
  { image: '', label: 'Master\'s Tenacity' },
  { image: '', label: 'Max MP Increase' },
  { image: '', label: 'Mayhem' },
  { image: '', label: 'MP Efficiency Increase' },
  { image: '', label: 'Necromancy' },
  { image: '', label: 'Night\'s Edge' },
  { image: '', label: 'Order of the Emperor' },
  { image: '', label: 'Peacemaker' },
  { image: '', label: 'Perfect Suppression' },
  { image: '', label: 'Pinnacle' },
  { image: '', label: 'Pistoleer' },
  { image: '', label: 'Precision Dagger' },
  { image: '', label: 'Predator' },
  { image: '', label: 'Preemptive Strike' },
  { image: '', label: 'Propulsion' },
  { image: '', label: 'Punisher' },
  { image: '', label: 'Rage Hammer' },
  { image: '', label: 'Raid Captain' },
  { image: '', label: 'Recurrence' },
  { image: '', label: 'Reflux' },
  { image: '', label: 'Remaining Energy' },
  { image: '', label: 'Robust Spirit' },
  { image: '', label: 'Shield Piercing' },
  { image: '', label: 'Shock Training' },
  { image: '', label: 'Sight Focus' },
  { image: '', label: 'Spirit Absorption' },
  { image: '', label: 'Stabilized Status' },
  { image: '', label: 'Strong Will' },
  { image: '', label: 'Super Charge' },
  { image: '', label: 'Surge' },
  { image: '', label: 'Time to Hunt' },
  { image: '', label: 'True Courage' },
  { image: '', label: 'Ultimate Skill: Taijutsu' },
  { image: '', label: 'Vital Point Strike' },
  { image: '', label: 'Wind Fury' },
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
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3],
      [1, 2, 3],
    ],
    maxValues: [6, 3],
  },
  {
    image: imagesData.necklace,
    label: 'Necklace',
    values: [
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3],
      [1, 2, 3],
    ],
    maxValues: [6, 3],
  },
  {
    image: imagesData.earring,
    label: 'Earring',
    values: [
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3],
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