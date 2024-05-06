// [raid].tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RaidGrid from '../../app/components/RaidGrid'; // Import the RaidGrid component
import utilities from '@/utils/utilities';

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

const RaidPage = () => {
  const router = useRouter();
  const { raid } = router.query;

  useEffect(() => {
    const defaultRaid = '/raids/thaemine';
    const savedPath = typeof window !== 'undefined' ? localStorage.getItem('currentRaidPath') : null;
    const currentRaid = savedPath || defaultRaid;

    if (raid && typeof raid === 'string') {
      localStorage.setItem('currentRaidPath', `/raids/${raid}`);
    } else {
      router.push(currentRaid);
    }
  }, [raid, router]);

  if (!router.isReady || !raid) {
    return <div>Loading...</div>;
  }

  // Find the current raid data from raidsInfo based on the raid path
  const currentRaidData = raidsInfo.find(r => r.path === `/raids/${raid}`);
  const raidLabel = raid ? utilities.capitalize(raid) : "Raid"; // Capitalize raid name for display

  return (
    <div className='bg-primary-background-color main-content'>
      <Head>
        <title>{raidLabel} - Raid Details</title>
        <meta name="description" content={`Learn more about the ${raidLabel} raid`} />
      </Head>
      {currentRaidData && <RaidGrid raid={currentRaidData} />}
    </div>
  );
};

export default RaidPage;
