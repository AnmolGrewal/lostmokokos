/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface RaidGridProps {
  raid: {
    path: string;
    label: string;
    imgSrc: string;
    gateData: {
      gold: number[];
      rewards: string[];
      boxRewards: string[];
      boxCost: number[];
    };
  };
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid }) => {
  const totalGold = raid.gateData.gold.reduce((acc, curr) => acc + curr, 0);
  const totalBoxCost = raid.gateData.boxCost.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center w-full">
        <img src={raid.imgSrc} alt={`${raid.label} Raid`} className="rounded-full w-48 h-48" />
        <h2 className="text-primary-text-label-color text-2xl mt-2">{raid.label} Raid</h2>
      </div>
      <div>Item Level:</div>
      <table className="m-auto">
        <thead>
          <tr>
            <th>Gate</th>
            {raid.gateData.gold.map((_, index) => <th key={index}>Gate {index + 1}</th>)}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gold</td>
            {raid.gateData.gold.map((gold, index) => <td key={index}>{gold}</td>)}
            <td>{totalGold}</td>
          </tr>
          <tr>
            <td>Rewards</td>
            {raid.gateData.rewards.map((reward, index) => <td key={index}>{reward}</td>)}
            <td></td> {/* Placeholder for total rewards calculation */}
          </tr>
          <tr>
            <td>Box Rewards</td>
            {raid.gateData.boxRewards.map((boxReward, index) => <td key={index}>{boxReward}</td>)}
            <td></td> {/* Placeholder for total box rewards calculation */}
          </tr>
          <tr>
            <td>Box Cost</td>
            {raid.gateData.boxCost.map((cost, index) => <td key={index}>{cost}</td>)}
            <td>{totalBoxCost}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RaidGrid;
