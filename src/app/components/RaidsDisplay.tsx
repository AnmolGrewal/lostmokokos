import React from 'react';
import RaidGrid from './RaidGrid';

const raidsInfo = [
  {
    path: "/raids/oreha",
    label: "Oreha",
    imgSrc: "https://i.imgur.com/WcAVFsZ.png",
    gateData: {
      gold: [500, 700], // Example data
      rewards: ["x1 x3", "x2 x3"],
      boxRewards: ["x1 x3", "x2 x3"],
      boxCost: [300, 400]
    }
  },
  // Add other raids with their respective data
];

const RaidsDisplay: React.FC = () => {
  return (
    <div>
      {raidsInfo.map((raid, index) => (
        <RaidGrid key={index} raid={raid} />
      ))}
    </div>
  );
};

export default RaidsDisplay;
