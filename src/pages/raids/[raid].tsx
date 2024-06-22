import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RaidGrid from '../../app/components/RaidGrid';
import raidsInfo, { Raid } from '../../data/raidsInfo';
import utilities from '@/utils/utilities';

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

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      const savedScrollPosition = localStorage.getItem('scrollPosition');
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        localStorage.removeItem('scrollPosition');
      }
    };
  
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
  
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  if (!router.isReady || !raid) {
    return <div>Loading...</div>;
  }

  const raidString = Array.isArray(raid) ? raid[0] : raid;
  const currentRaidData = raidsInfo.find((r: Raid) => r.path === `/raids/${raidString}`);
  const raidLabel = raidString
    ? raidString.includes('-hard')
      ? `${utilities.capitalize(raidString.replace('-hard', ''))} Hard`
      : utilities.capitalize(raidString)
    : 'Raid';

  // Enhanced check for hard version
  const hasHardVersion = raidsInfo.some((r: Raid) => r.path === `/raids/${raidString}-hard`) || raidString.endsWith('-hard');

  return (
    <div className="bg-primary-background-color max-w-[1000px] mx-auto">
      <Head>
        <title>{raidLabel} - Raid Details</title>
        <meta name="description" content={`Learn more about the ${raidLabel} raid`} />
      </Head>
      {currentRaidData && <RaidGrid key={currentRaidData.path} raid={currentRaidData} hasHardVersion={hasHardVersion} />}
    </div>
  );
};

export default RaidPage;
