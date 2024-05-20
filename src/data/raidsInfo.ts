export interface GateData {
  gold: number[];
  boxCost: number[];
  itemLevels: number[];
  gateRewards?: number[][];
  honorShards?: number[];
  boxHonorShards?: number[];
  chaosStones?: number[];
  destructionStones?: number[];
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
    path: "/raids/oreha",
    label: "Oreha",
    imgSrc: "https://i.imgur.com/WcAVFsZ.png",
    gateData: {
      gold: [200, 300],
      boxCost: [100, 150],
      itemLevels: [1340],
      honorShards: [200, 300],
      boxHonorShards: [400, 600],
      destructionStones: [75, 100],
    },
  },
  {
    path: "/raids/oreha-hard",
    label: "Oreha",
    imgSrc: "https://i.imgur.com/WcAVFsZ.png",
    gateData: {
      gold: [300, 400],
      boxCost: [100, 150],
      itemLevels: [1370],
      honorShards: [300, 400],
      boxHonorShards: [600, 800],
      destructionStones: [100, 150],
    },
  },
  {
    path: "/raids/argos",
    label: "Argos",
    imgSrc: "https://i.imgur.com/8sBbqnQ.png",
    gateData: {
      gold: [300, 300, 400],
      boxCost: [100, 150, 150],
      itemLevels: [1370],
      honorShards: [300, 300, 400],
      boxHonorShards: [520, 680, 720],
      destructionStones: [100, 100, 150],
    },
  },
  {
    path: "/raids/valtan",
    label: "Valtan",
    imgSrc: "https://i.imgur.com/ApCDeQb.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/VCqULik.png", "https://i.imgur.com/CloDByc.png"],
    ],
    gateRewardImgToolTip: [["Demon Beast Bone", "Demon Beast Tendon"]],
    gateData: {
      gold: [500, 700],
      boxCost: [300, 400],
      itemLevels: [1415],
      gateRewards: [
        [1, 3],
        [2, 3],
      ],
      honorShards: [400, 600],
      boxHonorShards: [400, 700],
      chaosStones: [0, 1],
      destructionStones: [150, 200],
    },
  },
  {
    path: "/raids/valtan-hard",
    label: "Valtan",
    imgSrc: "https://i.imgur.com/ApCDeQb.png",
    gateRewardImgSrc: [["https://i.imgur.com/VCqULik.png"]],
    gateRewardImgToolTip: [["Demon Beast Bone"]],
    gateData: {
      gold: [700, 1100],
      boxCost: [450, 600],
      itemLevels: [1445],
      gateRewards: [[3], [3]],
      honorShards: [500, 700],
      boxHonorShards: [1000, 1300],
      chaosStones: [0, 1],
      destructionStones: [200, 240],
    },
  },
  {
    path: "/raids/vykas",
    label: "Vykas",
    imgSrc: "https://i.imgur.com/5VoXEOB.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/uzmLA6L.png", "https://i.imgur.com/YhGuP3L.png"],
    ],
    gateRewardImgToolTip: [["Covetous Fang", "Covetous Wing"]],
    gateData: {
      gold: [600, 1000],
      boxCost: [300, 450],
      itemLevels: [1430],
      gateRewards: [
        [2, 1],
        [4, 2],
      ],
      honorShards: [500, 700],
      boxHonorShards: [700, 1000],
      chaosStones: [0, 1],
      destructionStones: [150, 200],
    },
  },
  {
    path: "/raids/vykas-hard",
    label: "Vykas",
    imgSrc: "https://i.imgur.com/5VoXEOB.png",
    gateRewardImgSrc: [["https://i.imgur.com/YhGuP3L.png"]],
    gateRewardImgToolTip: [["Covetous Wing"]],
    gateData: {
      gold: [900, 1500],
      boxCost: [500, 650],
      itemLevels: [1460],
      gateRewards: [[3], [3]],
      honorShards: [600, 900],
      boxHonorShards: [1600, 2000],
      chaosStones: [0, 1],
      destructionStones: [240, 280],
    },
  },
  {
    path: "/raids/clown",
    label: "Clown",
    imgSrc: "https://i.imgur.com/hOOSdDm.png",
    gateRewardImgSrc: [["https://i.imgur.com/XoYiAKo.png"]],
    gateRewardImgToolTip: [["Mayhem Horn"]],
    gateData: {
      gold: [600, 900, 1500],
      boxCost: [300, 500, 700],
      itemLevels: [1475],
      gateRewards: [[1], [2], [2]],
      honorShards: [800, 800, 800],
      boxHonorShards: [1300, 1300, 1600],
      chaosStones: [0, 0, 1],
      destructionStones: [200, 200, 280],
    },
  },
  {
    path: "/raids/brelshaza",
    label: "Brelshaza",
    imgSrc: "https://i.imgur.com/bL9k49k.png",
    gateRewardImgSrc: [["https://i.imgur.com/3poB3IP.png"]],
    gateRewardImgToolTip: [["Phantom Intention"]],
    gateData: {
      gold: [2000, 2500, 1500, 2500],
      boxCost: [400, 600, 800, 1500],
      itemLevels: [1490, 1490, 1500, 1520],
      gateRewards: [[4], [4], [5], [7]],
      honorShards: [1000, 1200, 1500, 3000],
      boxHonorShards: [2100, 2700, 3400, 7000],
      chaosStones: [0, 0, 1, 3],
      destructionStones: [100, 100, 120, 400],
    },
  },
  {
    path: "/raids/brelshaza-hard",
    label: "Brelshaza",
    imgSrc: "https://i.imgur.com/bL9k49k.png",
    gateRewardImgSrc: [["https://i.imgur.com/3poB3IP.png"]],
    gateRewardImgToolTip: [["Phantom Intention"]],
    gateData: {
      gold: [2500, 3000, 2000, 3000],
      boxCost: [700, 900, 1100, 1800],
      itemLevels: [1540, 1540, 1550, 1560],
      gateRewards: [[6], [6], [7], [10]],
      honorShards: [2500, 2500, 3000, 6000],
      boxHonorShards: [3000, 4000, 5200, 10000],
      chaosStones: [0, 0, 2, 5],
      destructionStones: [280, 320, 400, 800],
    },
  },
  {
    path: "/raids/kayangel",
    label: "Kayangel",
    imgSrc: "https://i.imgur.com/2P9urFh.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/RTrjfkO.png", "https://i.imgur.com/Cx0nbdR.png"],
    ],
    gateRewardImgToolTip: [["Light's Trial", "Empyrean of Contemplation"]],
    gateData: {
      gold: [1000, 1500, 2000],
      boxCost: [600, 800, 1000],
      itemLevels: [1540],
      gateRewards: [[11], [12, 1], [17, 2]],
      honorShards: [2000, 2500, 4000],
      boxHonorShards: [1000, 1500, 2000],
      chaosStones: [0, 0, 4],
      destructionStones: [240, 280, 360],
    },
  },
  {
    path: "/raids/kayangel-hard",
    label: "Kayangel",
    imgSrc: "https://i.imgur.com/2P9urFh.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/RTrjfkO.png", "https://i.imgur.com/Cx0nbdR.png"],
    ],
    gateRewardImgToolTip: [["Light's Trial", "Empyrean of Contemplation"]],
    gateData: {
      gold: [1500, 2000, 3000],
      boxCost: [700, 900, 1100],
      itemLevels: [1580],
      gateRewards: [
        [14, 1],
        [16, 1],
        [20, 3],
      ],
      honorShards: [2500, 3500, 5000],
      boxHonorShards: [1500, 2000, 2500],
      chaosStones: [0, 0, 3],
      destructionStones: [80, 120, 150],
    },
  },
  {
    path: "/raids/akkan",
    label: "Akkan",
    imgSrc: "https://i.imgur.com/W4ekupW.png",
    gateRewardImgSrc: [["https://i.imgur.com/UnGFUC6.png"]],
    gateRewardImgToolTip: [["Eye of Decay"]],
    gateData: {
      gold: [1500, 2000, 4000],
      boxCost: [900, 1100, 1500],
      itemLevels: [1580],
      gateRewards: [[3], [3], [5]],
      honorShards: [1600, 1600, 2400],
      boxHonorShards: [3000, 3000, 4200],
      chaosStones: [0, 0, 3],
      destructionStones: [120, 160, 240],
    },
  },
  {
    path: "/raids/akkan-hard",
    label: "Akkan",
    imgSrc: "https://i.imgur.com/W4ekupW.png",
    gateRewardImgSrc: [["https://i.imgur.com/UnGFUC6.png"]],
    gateRewardImgToolTip: [["Eye of Decay"]],
    gateData: {
      gold: [1750, 2500, 5750],
      boxCost: [1200, 1400, 1900],
      itemLevels: [1600],
      gateRewards: [[7], [7], [8]],
      honorShards: [2400, 2400, 4000],
      boxHonorShards: [4000, 4000, 5500],
      chaosStones: [0, 0, 3],
      destructionStones: [180, 200, 320],
    },
  },
  {
    path: "/raids/voldis",
    label: "Voldis",
    imgSrc: "https://i.imgur.com/sSdCEIA.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/LAzTJgP.png", "https://i.imgur.com/d5VKKW1.png"],
    ],
    gateRewardImgToolTip: [
      ["Clear Energy of Wisdom", " Clear Elixir of Wisdom"],
    ],
    gateData: {
      gold: [1500, 1750, 2500, 3250],
      boxCost: [700, 800, 900, 1100],
      itemLevels: [1600],
      gateRewards: [[2], [2], [3], [1, 1]],
      honorShards: [1500, 1500, 2000, 2000],
      boxHonorShards: [3000, 3000, 4000, 4500],
      chaosStones: [0, 1, 0, 2],
      destructionStones: [80, 80, 100, 100],
    },
  },
  {
    path: "/raids/voldis-hard",
    label: "Voldis",
    imgSrc: "https://i.imgur.com/sSdCEIA.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/XYyJ9aG.png", "https://i.imgur.com/dS0ZviV.png"],
    ],
    gateRewardImgToolTip: [
      ["Splendid Energy of Wisdom", "Splendid Elixir of Wisdom"],
    ],
    gateData: {
      gold: [2000, 2500, 4000, 6000],
      boxCost: [1000, 1000, 1500, 2000],
      itemLevels: [1620],
      gateRewards: [[2], [2], [3], [1, 1]],
      honorShards: [1800, 1800, 2400, 2400],
      boxHonorShards: [4000, 4000, 5000, 5500],
      chaosStones: [0, 1, 0, 2],
      destructionStones: [100, 100, 120, 120],
    },
  },
  {
    path: "/raids/thaemine",
    label: "Thaemine",
    imgSrc: "https://i.imgur.com/464OcZx.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/BSm95D5.png", "https://i.imgur.com/sU7Fdcu.png"],
    ],
    gateRewardImgToolTip: [["Magical Spring Water", "Dark Fire"]],
    gateData: {
      gold: [3500, 4000, 5500],
      boxCost: [1500, 1800, 2500],
      itemLevels: [1610],
      gateRewards: [
        [2, 3],
        [3, 4],
        [4, 6],
      ],
      honorShards: [2000, 2500, 3000],
      boxHonorShards: [3500, 4500, 6000],
      chaosStones: [0, 0, 5],
      destructionStones: [100, 120, 150],
    },
  },
  {
    path: "/raids/thaemine-hard",
    label: "Thaemine",
    imgSrc: "https://i.imgur.com/464OcZx.png",
    gateRewardImgSrc: [
      ["https://i.imgur.com/BSm95D5.png", "https://i.imgur.com/sU7Fdcu.png"],
    ],
    gateRewardImgToolTip: [["Magical Spring Water", "Dark Fire"]],
    gateData: {
      gold: [5000, 6000, 9000, 21000],
      boxCost: [2000, 2400, 2800, 3600],
      itemLevels: [1630],
      gateRewards: [
        [6, 6],
        [9, 8],
        [12, 12],
        [12, 12],
      ],
      honorShards: [2400, 3000, 3600, 4500],
      boxHonorShards: [5000, 6000, 7500, 9000],
      chaosStones: [0, 0, 7, 10],
      destructionStones: [150, 200, 240, 300],
    },
  },
  {
    path: "/raids/echidna",
    label: "Echidna",
    imgSrc: "https://i.imgur.com/tju1uI1.png",
    gateRewardImgSrc: [["https://i.imgur.com/paUGipq.png"]],
    gateRewardImgToolTip: [["Scale of Agris"]],
    gateData: {
      gold: [5000, 9500],
      boxCost: [2200, 3400],
      itemLevels: [1620],
      gateRewards: [[3], [6]],
    },
  },
  {
    path: "/raids/echidna-hard",
    label: "Echidna",
    imgSrc: "https://i.imgur.com/tju1uI1.png",
    gateRewardImgSrc: [["https://i.imgur.com/9O6FFL2.png"]],
    gateRewardImgToolTip: [["Alcyone Eye"]],
    gateData: {
      gold: [6000, 12500],
      boxCost: [2800, 4100],
      itemLevels: [1630],
      gateRewards: [[3], [6]],
    },
  },
];

export default raidsInfo;
