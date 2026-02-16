export interface GateData {
  gold?: number[];
  boundGold?: number[];
  boxCost: number[];
  itemLevels: number[];
  gateRewards?: number[][];
  honorShards?: number[];
  boxHonorShards?: number[];
  chaosStones?: number[];
  destructionStones?: number[];
  boxDestructionStones?: number[];
  clearMedal?: number[];
}

export interface Raid {
  path: string;
  label: string;
  imgSrc: string;
  gateData: GateData;
  gateRewardImgSrc?: string[][];
  gateRewardImgToolTip?: string[][];
}

const raidsInfo: Raid[] = [
  {
    path: '/raids/oreha',
    label: 'Oreha',
    imgSrc: 'https://i.imgur.com/WcAVFsZ.png',
    gateData: {
      boundGold: [200, 300],
      boxCost: [100, 150],
      itemLevels: [1340],
    },
  },
  {
    path: '/raids/oreha-hard',
    label: 'Oreha',
    imgSrc: 'https://i.imgur.com/WcAVFsZ.png',
    gateData: {
      boundGold: [300, 400],
      boxCost: [100, 150],
      itemLevels: [1370],
    },
  },
  {
    path: '/raids/argos',
    label: 'Argos',
    imgSrc: 'https://i.imgur.com/8sBbqnQ.png',
    gateData: {
      boundGold: [150, 150, 200],
      boxCost: [50, 75, 75],
      itemLevels: [1370],
    },
  },
  {
    path: '/raids/valtan-solo',
    label: 'Valtan',
    imgSrc: 'https://i.imgur.com/ApCDeQb.png',
    gateData: {
      boundGold: [290, 460],
      boxCost: [75, 100],
      itemLevels: [1415],
      clearMedal: [50, 70],
    },
  },
  {
    path: '/raids/valtan',
    label: 'Valtan',
    imgSrc: 'https://i.imgur.com/ApCDeQb.png',
    gateData: {
      gold: [40, 60],
      boundGold: [250, 400],
      boxCost: [75, 100],
      itemLevels: [1415],
      clearMedal: [50, 70],
    },
  },
  {
    path: '/raids/valtan-hard',
    label: 'Valtan',
    imgSrc: 'https://i.imgur.com/ApCDeQb.png',
    gateData: {
      gold: [70, 330],
      boundGold: [330, 570],
      boxCost: [175, 275],
      itemLevels: [1445],
      clearMedal: [50, 70],
    },
  },
  {
    path: '/raids/vykas-solo',
    label: 'Vykas',
    imgSrc: 'https://i.imgur.com/5VoXEOB.png',
    gateData: {
      boundGold: [350, 650],
      boxCost: [100, 150],
      itemLevels: [1430],
      clearMedal: [60, 100],
    },
  },
  {
    path: '/raids/vykas',
    label: 'Vykas',
    imgSrc: 'https://i.imgur.com/5VoXEOB.png',
    gateData: {
      gold: [50, 300],
      boundGold: [300, 550],
      boxCost: [100, 150],
      itemLevels: [1430],
      clearMedal: [60, 100],
    },
  },
  {
    path: '/raids/vykas-hard',
    label: 'Vykas',
    imgSrc: 'https://i.imgur.com/5VoXEOB.png',
    gateData: {
      gold: [80, 170],
      boundGold: [420, 830],
      boxCost: [280, 435],
      itemLevels: [1460],
      clearMedal: [60, 100],
    },
  },
  {
    path: '/raids/clown-solo',
    label: 'Clown',
    imgSrc: 'https://i.imgur.com/hOOSdDm.png',
    gateData: {
      boundGold: [400, 600, 1000],
      boxCost: [100, 150, 200],
      itemLevels: [1475],
      clearMedal: [60, 90, 150],
    },
  },
  {
    path: '/raids/clown',
    label: 'Clown',
    imgSrc: 'https://i.imgur.com/hOOSdDm.png',
    gateData: {
      gold: [70, 100, 180],
      boundGold: [330, 500, 820],
      boxCost: [100, 150, 200],
      itemLevels: [1475],
      clearMedal: [60, 90, 150],
    },
  },
  {
    path: '/raids/brelshaza-solo',
    label: 'Brelshaza',
    imgSrc: 'https://i.imgur.com/bL9k49k.png',
    gateData: {
      boundGold: [980, 1000, 1020, 1600],
      boxCost: [100, 150, 200, 375],
      itemLevels: [1490, 1490, 1500, 1520],
      clearMedal: [150, 150, 150, 250],
    },
  },
  {
    path: '/raids/brelshaza',
    label: 'Brelshaza',
    imgSrc: 'https://i.imgur.com/bL9k49k.png',
    gateData: {
      gold: [170, 180, 200, 300],
      boundGold: [810, 820, 820, 1300],
      boxCost: [100, 150, 200, 375],
      itemLevels: [1490, 1490, 1500, 1520],
      clearMedal: [150, 150, 150, 250],
    },
  },
  {
    path: '/raids/brelshaza-hard',
    label: 'Brelshaza',
    imgSrc: 'https://i.imgur.com/bL9k49k.png',
    gateData: {
      gold: [210, 220, 220, 350],
      boundGold: [970, 980, 1000, 1650],
      boxCost: [300, 300, 300, 500],
      itemLevels: [1540, 1540, 1550, 1560],
      clearMedal: [150, 150, 150, 250],
    },
  },
  {
    path: '/raids/kayangel-solo',
    label: 'Kayangel',
    imgSrc: 'https://i.imgur.com/2P9urFh.png',
    gateData: {
      boundGold: [1000, 1100, 1200],
      boxCost: [180, 200, 270],
      itemLevels: [1540],
      clearMedal: [100, 150, 200],
    },
  },
  {
    path: '/raids/kayangel',
    label: 'Kayangel',
    imgSrc: 'https://i.imgur.com/2P9urFh.png',
    gateData: {
      gold: [100, 200, 300],
      boundGold: [900, 900, 900],
      boxCost: [180, 200, 270],
      itemLevels: [1540],
      clearMedal: [100, 150, 200],
    },
  },
  {
    path: '/raids/kayangel-hard',
    label: 'Kayangel',
    imgSrc: 'https://i.imgur.com/2P9urFh.png',
    gateData: {
      gold: [150, 250, 400],
      boundGold: [1000, 1200, 1300],
      boxCost: [225, 350, 500],
      itemLevels: [1580],
      clearMedal: [100, 150, 200],
    },
  },
  {
    path: '/raids/akkan-solo',
    label: 'Akkan',
    imgSrc: 'https://i.imgur.com/W4ekupW.png',
    gateData: {
      boundGold: [1270, 1600, 1830],
      boxCost: [225, 275, 375],
      itemLevels: [1580],
      clearMedal: [190, 230, 330],
    },
  },
  {
    path: '/raids/akkan',
    label: 'Akkan',
    imgSrc: 'https://i.imgur.com/W4ekupW.png',
    gateData: {
      gold: [255, 200, 330],
      boundGold: [1015, 1300, 1500],
      boxCost: [190, 230, 330],
      itemLevels: [1580],
      clearMedal: [150, 200, 400],
    },
  },
  {
    path: '/raids/akkan-hard',
    label: 'Akkan',
    imgSrc: 'https://i.imgur.com/W4ekupW.png',
    gateData: {
      gold: [200, 410, 490],
      boundGold: [1300, 1640, 1960],
      boxCost: [300, 500, 700],
      itemLevels: [1620],
      clearMedal: [150, 200, 400],
    },
  },
  {
    path: '/raids/voldis-solo',
    label: 'Voldis',
    imgSrc: 'https://i.imgur.com/sSdCEIA.png',
    gateData: {
      boundGold: [1350, 1750, 2100],
      boxCost: [180, 220, 300],
      itemLevels: [1600],
      clearMedal: [200, 250, 450],
    },
  },
  {
    path: '/raids/voldis',
    label: 'Voldis',
    imgSrc: 'https://i.imgur.com/sSdCEIA.png',
    gateData: {
      gold: [250, 350, 420],
      boundGold: [1100, 1400, 1680],
      boxCost: [180, 220, 300],
      itemLevels: [1620],
      clearMedal: [200, 250, 450],
    },
  },
  {
    path: '/raids/voldis-hard',
    label: 'Voldis',
    imgSrc: 'https://i.imgur.com/sSdCEIA.png',
    gateData: {
      gold: [420, 480, 540],
      boundGold: [1680, 1920, 2160],
      boxCost: [350, 500, 950],
      itemLevels: [1610],
      clearMedal: [200, 250, 450],
    },
  },
  {
    path: '/raids/thaemine-solo',
    label: 'Thaemine',
    imgSrc: 'https://i.imgur.com/464OcZx.png',
    gateData: {
      boundGold: [1600, 2000, 2800],
      boxCost: [360, 440, 640],
      itemLevels: [1610],
      clearMedal: [250, 300, 500],
    },
  },
  {
    path: '/raids/thaemine',
    label: 'Thaemine',
    imgSrc: 'https://i.imgur.com/464OcZx.png',
    gateData: {
      gold: [320, 400, 560],
      boundGold: [1280, 1600, 2240],
      boxCost: [360, 440, 640],
      itemLevels: [1610],
      clearMedal: [250, 300, 500],
    },
  },
  {
    path: '/raids/thaemine-hard',
    label: 'Thaemine',
    imgSrc: 'https://i.imgur.com/464OcZx.png',
    gateData: {
      gold: [400, 480, 720, 1000],
      boundGold: [1600, 1920, 2880, 4000],
      boxCost: [500, 600, 900, 1250],
      itemLevels: [1620],
      clearMedal: [250, 300, 500, 0],
    },
  },
  {
    path: '/raids/echidna-solo',
    label: 'Echidna',
    imgSrc: 'https://i.imgur.com/tju1uI1.png',
    gateRewardImgSrc: [['https://i.imgur.com/paUGipq.png']],
    gateRewardImgToolTip: [['Scale of Agris']],
    gateData: {
      boundGold: [3500, 5600],
      boxCost: [310, 700],
      itemLevels: [1620],
      gateRewards: [[3], [6]],
      clearMedal: [400, 550],
    },
  },
  {
    path: '/raids/echidna',
    label: 'Echidna',
    imgSrc: 'https://i.imgur.com/tju1uI1.png',
    gateRewardImgSrc: [['https://i.imgur.com/paUGipq.png']],
    gateRewardImgToolTip: [['Scale of Agris']],
    gateData: {
      gold: [1750, 2800],
      boundGold: [1750, 2800],
      boxCost: [310, 700],
      itemLevels: [1620],
      gateRewards: [[3], [6]],
      clearMedal: [400, 550],
    },
  },
  {
    path: '/raids/echidna-hard',
    label: 'Echidna',
    imgSrc: 'https://i.imgur.com/tju1uI1.png',
    gateRewardImgSrc: [['https://i.imgur.com/9O6FFL2.png']],
    gateRewardImgToolTip: [['Alcyone Eye']],
    gateData: {
      gold: [2100, 2800],
      boundGold: [2800, 3500],
      boxCost: [720, 1630],
      itemLevels: [1630],
      gateRewards: [[3], [6]],
      clearMedal: [400, 550],
    },
  },
  {
    path: '/raids/behemoth',
    label: 'Behemoth',
    imgSrc: 'https://i.imgur.com/h8qcYOy.png',
    gateRewardImgSrc: [['https://i.imgur.com/7e19M0E.png' , 'https://i.imgur.com/BSm95D5.png']],
    gateRewardImgToolTip: [['Behemoth Scale' , 'Magical Spring Water']],
    gateData: {
      gold: [1750, 2800],
      boundGold: [1750, 2800],
      boxCost: [1250, 2000],
      itemLevels: [1620],
      gateRewards: [
        [10, 10],
        [20, 18],
      ],
    },
  },
  {
    path: '/raids/aegir-solo',
    label: 'Aegir',
    imgSrc: 'https://i.imgur.com/VgFaAwm.png',
    gateRewardImgSrc: [['https://i.imgur.com/A6B4rIn.png']],
    gateRewardImgToolTip: [['Hellfire Keystone']],
    gateData: {
      boundGold: [7000, 9800],
      boxCost: [750, 1780],
      itemLevels: [1660],
      gateRewards: [[4], [6]],
    },
  },
  {
    path: '/raids/aegir',
    label: 'Aegir',
    imgSrc: 'https://i.imgur.com/VgFaAwm.png',
    gateRewardImgSrc: [['https://i.imgur.com/A6B4rIn.png']],
    gateRewardImgToolTip: [['Hellfire Keystone']],
    gateData: {
      gold: [3500, 4900],
      boundGold: [3500, 4900],
      boxCost: [750, 1780],
      itemLevels: [1660],
      gateRewards: [[4], [6]],
    },
  },
  {
    path: '/raids/aegir-hard',
    label: 'Aegir',
    imgSrc: 'https://i.imgur.com/VgFaAwm.png',
    gateRewardImgSrc: [['https://i.imgur.com/A6B4rIn.png']],
    gateRewardImgToolTip: [['Hellfire Keystone']],
    gateData: {
      gold: [3500, 7000],
      boundGold: [3500, 7000],
      boxCost: [1820, 4150],
      itemLevels: [1680],
      gateRewards: [[8], [12]],
    },
  },
  {
    path: '/raids/brelshaza2-solo',
    label: 'Brelshaza v2',
    imgSrc: 'https://i.imgur.com/bL9k49k.png',
    gateRewardImgSrc: [['https://i.imgur.com/3poB3IP.png']],
    gateRewardImgToolTip: [['Karma']],
    gateData: {
      boundGold: [6300, 12950],
      boxCost: [1820, 3720],
      itemLevels: [1670],
      gateRewards: [[4], [6]],
    },
  },
  {
    path: '/raids/brelshaza2',
    label: 'Brelshaza v2',
    imgSrc: 'https://i.imgur.com/bL9k49k.png',
    gateRewardImgSrc: [['https://i.imgur.com/3poB3IP.png']],
    gateRewardImgToolTip: [['Karma']],
    gateData: {
      gold: [3150, 6475],
      boundGold: [3150, 6475],
      boxCost: [1820, 3720],
      itemLevels: [1670],
      gateRewards: [[4], [6]],
    },
  },
  {
    path: '/raids/brelshaza2-hard',
    label: 'Brelshaza v2',
    imgSrc: 'https://i.imgur.com/bL9k49k.png',
    gateRewardImgSrc: [['https://i.imgur.com/3poB3IP.png']],
    gateRewardImgToolTip: [['Karma']],
    gateData: {
      gold: [3850, 8050],
      boundGold: [3850, 8050],
      boxCost: [2400, 5100],
      itemLevels: [1690],
      gateRewards: [[8], [12]],
    },
  },
  {
    path: '/raids/mordum-solo',
    label: 'Mordum',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      boundGold: [6000, 9500, 12500],
      boxCost: [2400, 3200, 4200],
      itemLevels: [1680],
      gateRewards: [[3], [5], [10]],
    },
  },
  {
    path: '/raids/mordum',
    label: 'Mordum',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      gold: [4200, 6650, 8750],
      boundGold: [1800, 2850, 3750],
      boxCost: [2400, 3200, 4200],
      itemLevels: [1680],
      gateRewards: [[3], [5], [10]],
    },
  },
  {
    path: '/raids/mordum-hard',
    label: 'Mordum',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      gold: [4900, 7700, 14000],
      boxCost: [2100, 3300, 6000],
      itemLevels: [1700],
      gateRewards: [[3], [5], [10]],
    },
  },
  {
    path: '/raids/armoche',
    label: 'Armoche',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      gold: [12500, 20500],
      boxCost: [4000, 6560],
      itemLevels: [1700],
      gateRewards: [[1], [1]],
    },
  },
  {
    path: '/raids/armoche-hard',
    label: 'Armoche',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      gold: [15000, 27000],
      boxCost: [4800, 6560],
      itemLevels: [1720],
      gateRewards: [[1], [1]],
    },
  },
  {
    path: '/raids/finalday',
    label: 'Final Day',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      gold: [14000, 26000],
      boxCost: [4480, 8320],
      itemLevels: [1710],
      gateRewards: [[2], [2]],
    },
  },
  {
    path: '/raids/finalday-hard',
    label: 'Final Day',
    imgSrc: 'https://i.imgur.com/WXlrbfr.png',
    gateRewardImgSrc: [['https://i.imgur.com/WXlrbfr.png']],
    gateRewardImgToolTip: [['Main Material']],
    gateData: {
      gold: [17000, 35000],
      boxCost: [5440, 11200],
      itemLevels: [1730],
      gateRewards: [[2], [2]],
    },
  },
];

export default raidsInfo;
