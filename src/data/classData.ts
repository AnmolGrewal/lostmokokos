interface ClassInfo {
  name: string;
  role: 'Damage' | 'Support';
  imgSrc?: string;
  bgSrc?: string;
}

interface ClassCategories {
  [key: string]: ClassInfo[];
}

export const classData: ClassCategories = {
  Warriors: [
    { name: 'Berserker', role: 'Damage', bgSrc: 'https://i.imgur.com/3Gzm5YD.png' },
    { name: 'Destroyer', role: 'Damage' },
    { name: 'Gunlancer', role: 'Damage' },
    { name: 'Paladin', role: 'Support' },
    { name: 'Slayer', role: 'Damage' },
  ],
  Mages: [
    { name: 'Arcanist', role: 'Damage' },
    { name: 'Bard', role: 'Support' },
    { name: 'Sorceress', role: 'Damage' },
    { name: 'Summoner', role: 'Damage' },
  ],
  'Martial Artists': [
    { name: 'Striker', role: 'Damage' },
    { name: 'Wardancer', role: 'Damage' },
    { name: 'Scrapper', role: 'Damage' },
    { name: 'Soulfist', role: 'Damage' },
    { name: 'Glaivier', role: 'Damage' },
  ],
  Assassins: [
    { name: 'Deathblade', role: 'Damage' },
    { name: 'Shadowhunter', role: 'Damage' },
    { name: 'Reaper', role: 'Damage' },
  ],
  Gunners: [
    { name: 'Sharpshooter', role: 'Damage' },
    { name: 'Deadeye', role: 'Damage' },
    { name: 'Artillerist', role: 'Damage' },
    { name: 'Machinist', role: 'Damage' },
    { name: 'Gunslinger', role: 'Damage' },
  ],
  Specialists: [
    { name: 'Artist', role: 'Support' },
    { name: 'Aeromancer', role: 'Damage' },
  ]
};