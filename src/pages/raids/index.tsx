import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ContentSelector from '../../app/components/ContentSelector';
import constants from '../../data/constants';

const RaidsIndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const defaultRaid = constants.defaultRaid
    const savedRaid = localStorage.getItem('currentRaidPath');
    const raidPath = savedRaid || defaultRaid;
    const savedScrollPosition = localStorage.getItem('scrollPosition');
  
    router.push(raidPath).then(() => {
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        localStorage.removeItem('scrollPosition');
      }
    });
  }, [router]);

  return (
    <div className="bg-primary-background-color">
      <ContentSelector currentPath={router.asPath} />
    </div>
  );
};

export default RaidsIndexPage;
