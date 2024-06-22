import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ContentSelector from '../../app/components/ContentSelector';

const RaidsIndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const defaultRaid = '/raids/thaemine'; // Default to the Thaemine raid
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
