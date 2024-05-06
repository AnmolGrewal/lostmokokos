export interface GateData {
  gold: number[];
  boxCost: number[];
}

export interface Raid {
  path: string;
  label: string;
  imgSrc: string;
  gateData: GateData;
}

const raidsInfo: Raid[] = [
  {
    path: "/raids/oreha",
    label: "Oreha",
    imgSrc: "https://i.imgur.com/WcAVFsZ.png",
    gateData: {
      gold: [200, 300],
      boxCost: [100, 150]
    }
  },
  {
    path: "/raids/oreha-hard",
    label: "Oreha",
    imgSrc: "https://i.imgur.com/WcAVFsZ.png",
    gateData: {
      gold: [300, 400],
      boxCost: [100, 150]
    }
  },
  {
    path: "/raids/argos",
    label: "Argos",
    imgSrc: "https://i.imgur.com/8sBbqnQ.png",
    gateData: {
      gold: [300, 300, 400],
      boxCost: [100, 150, 150]
    }
  },
  {
    path: "/raids/valtan",
    label: "Valtan",
    imgSrc: "https://i.imgur.com/ApCDeQb.png",
    gateData: {
      gold: [500, 700],
      boxCost: [300, 400]
    }
  },
  {
    path: "/raids/valtan-hard",
    label: "Valtan",
    imgSrc: "https://i.imgur.com/ApCDeQb.png",
    gateData: {
      gold: [700, 1100],
      boxCost: [450, 600]
    }
  },
  {
    path: "/raids/vykas",
    label: "Vykas",
    imgSrc: "https://i.imgur.com/5VoXEOB.png",
    gateData: {
      gold: [600, 1000],
      boxCost: [300, 450]
    }
  },
  {
    path: "/raids/vykas-hard",
    label: "Vykas",
    imgSrc: "https://i.imgur.com/5VoXEOB.png",
    gateData: {
      gold: [900, 1500],
      boxCost: [500, 650]
    }
  },
  {
    path: "/raids/clown",
    label: "Clown",
    imgSrc: "https://i.imgur.com/hOOSdDm.png",
    gateData: {
      gold: [600, 900, 1500],
      boxCost: [300, 500, 700]
    }
  },
  {
    path: "/raids/brelshaza",
    label: "Brelshaza",
    imgSrc: "https://i.imgur.com/bL9k49k.png",
    gateData: {
      gold: [2000, 2500, 1500, 2500],
      boxCost: [400, 600, 800, 1500]
    }
  },
  {
    path: "/raids/brelshaza-hard",
    label: "Brelshaza",
    imgSrc: "https://i.imgur.com/bL9k49k.png",
    gateData: {
      gold: [2500, 3000, 2000, 3000],
      boxCost: [700, 900, 1100, 1800]
    }
  },
  {
    path: "/raids/kayangel",
    label: "Kayangel",
    imgSrc: "https://i.imgur.com/2P9urFh.png",
    gateData: {
      gold: [1000, 1500, 2000],
      boxCost: [600, 800, 1000]
    }
  },
  {
    path: "/raids/kayangel-hard",
    label: "Kayangel",
    imgSrc: "https://i.imgur.com/2P9urFh.png",
    gateData: {
      gold: [1500, 2000, 3000],
      boxCost: [700, 900, 1100]
    }
  },
  {
    path: "/raids/akkan",
    label: "Akkan",
    imgSrc: "https://i.imgur.com/W4ekupW.png",
    gateData: {
      gold: [1500, 2000, 4000],
      boxCost: [900, 1100, 1500]
    }
  },
  {
    path: "/raids/akkan-hard",
    label: "Akkan",
    imgSrc: "https://i.imgur.com/W4ekupW.png",
    gateData: {
      gold: [1750, 2500, 5750],
      boxCost: [1200, 1400, 1900]
    }
  },
  {
    path: "/raids/voldis",
    label: "Voldis",
    imgSrc: "https://i.imgur.com/sSdCEIA.png",
    gateData: {
      gold: [1500, 1750, 2500, 3250],
      boxCost: [700, 800, 900, 1100]
    }
  },
  {
    path: "/raids/voldis-hard",
    label: "Voldis",
    imgSrc: "https://i.imgur.com/sSdCEIA.png",
    gateData: {
      gold: [2000, 2500, 4000, 6000],
      boxCost: [1000, 1000, 1500, 2000]
    }
  },
  {
    path: "/raids/thaemine",
    label: "Thaemine",
    imgSrc: "https://i.imgur.com/464OcZx.png",
    gateData: {
      gold: [3500, 4000, 5500],
      boxCost: [1500, 1800, 2500]
    }
  },
  {
    path: "/raids/thaemine-hard",
    label: "Thaemine",
    imgSrc: "https://i.imgur.com/464OcZx.png",
    gateData: {
      gold: [5000, 6000, 9000, 21000],
      boxCost: [2000, 2400, 2800, 3600]
    }
  },
];

export default raidsInfo;