import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RaidGrid from '../../app/components/RaidGrid';
import raidsInfo, { Raid } from '../../data/raidsInfo';
import utilities from '@/utils/utilities';

const RaidPage: React.FC = () => {
  const router = useRouter();
  const { raid } = router.query;

  const [scrollPosition, setScrollPosition] = useState(0);

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

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setScrollPosition(window.pageYOffset);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  useEffect(() => {
    if (router.isReady && raid) {
      window.scrollTo(0, scrollPosition);
    }
  }, [router.isReady, raid, scrollPosition]);

  if (!router.isReady || !raid) {
    return <div>Loading...</div>;
  }

  const raidString = Array.isArray(raid) ? raid[0] : raid;
  const currentRaidData = raidsInfo.find((r: Raid) => r.path === `/raids/${raidString}`);
  const raidLabel = raidString ? utilities.capitalize(raidString) : "Raid";
  const hasHardVersion = raidsInfo.some((r: Raid) => r.path === `/raids/${raidString}-hard`);

  return (
    <div className='bg-primary-background-color'>
      <Head>
        <title>{raidLabel} - Raid Details</title>
        <meta name="description" content={`Learn more about the ${raidLabel} raid`} />
      </Head>
      {currentRaidData && <RaidGrid raid={currentRaidData} hasHardVersion={hasHardVersion} />}
    </div>
  );
};

export default RaidPage;
