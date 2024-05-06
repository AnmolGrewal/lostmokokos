import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RaidGrid from '../../app/components/RaidGrid';
import raidsInfo, { Raid } from '../../pages/raids/raidsInfo';  // Import the data and types
import utilities from '@/utils/utilities';  // Import utility functions

const RaidPage: React.FC = () => {
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

  const raidString = Array.isArray(raid) ? raid[0] : raid;
  const currentRaidData = raidsInfo.find((r: Raid) => r.path === `/raids/${raidString}`);
  const raidLabel = raidString ? utilities.capitalize(raidString) : "Raid";

  // Check if the raid has a separate path ending with "-hard"
  const hasHardVersion = raidsInfo.some((r: Raid) => r.path === `/raids/${raidString}-hard`);

  return (
    <div className='bg-primary-background-color'>
      <Head>
        <title>{raidLabel} - Raid Details</title>
        <meta name="description" content={`Learn more about the ${raidLabel} raid`} />
      </Head>
      {/* Pass hasHardVersion to RaidGrid component */}
      {currentRaidData && <RaidGrid raid={currentRaidData} hasHardVersion={hasHardVersion} />}
    </div>
  );
};

export default RaidPage;
