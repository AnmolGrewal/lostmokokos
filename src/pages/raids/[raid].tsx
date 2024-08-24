import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RaidGrid from '../../app/components/RaidGrid';
import raidsInfo, { Raid } from '../../data/raidsInfo';
import utilities from '@/utils/utilities';
import { debounce } from 'lodash';
import constants from '../../data/constants'


const RaidPage: React.FC = () => {
  const router = useRouter();
  const { raid } = router.query;

  useEffect(() => {
    const defaultRaid = constants.defaultRaid;
    const savedPath = typeof window !== 'undefined' ? localStorage.getItem('currentRaidPath') : null;
    const currentRaid = savedPath || defaultRaid;
    const debouncedPush = debounce((path) => {
      router.push(path, undefined, { shallow: true });
    }, 300);
  
    if (raid && typeof raid === 'string') {
      const baseRaidPath = `/raids/${raid.split('-')[0]}`;
      const storedPath = localStorage.getItem(`raidPath_${baseRaidPath}`);
      if (storedPath) {
        debouncedPush(storedPath);
      } else {
        localStorage.setItem('currentRaidPath', `/raids/${raid}`);
      }
    } else if (currentRaid) {
      debouncedPush(currentRaid);
    }
  
    return () => {
      debouncedPush.cancel();
    };
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
      : raidString.includes('-solo')
        ? `${utilities.capitalize(raidString.replace('-solo', ''))} Solo`
        : utilities.capitalize(raidString)
    : 'Raid';

  const hasHardVersion = raidsInfo.some((r: Raid) => r.path === `/raids/${raidString}-hard`) || raidString.endsWith('-hard');
  const hasSoloVersion = raidsInfo.some((r: Raid) => r.path === `/raids/${raidString}-solo`) || raidString.endsWith('-solo');

  return (
    <div className="bg-primary-background-color max-w-[1000px] mx-auto">
      <Head>
        <title>{raidLabel} - Raid Details</title>
        <meta name="description" content={`Learn more about the ${raidLabel} raid`} />
      </Head>
      {currentRaidData && (
        <RaidGrid 
          key={currentRaidData.path} 
          raid={currentRaidData} 
          hasHardVersion={hasHardVersion} 
          hasSoloVersion={hasSoloVersion}
        />
      )}
    </div>
  );
};

export default RaidPage;