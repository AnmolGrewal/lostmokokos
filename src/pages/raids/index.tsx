import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ContentSelector from '../../app/components/ContentSelector';

const RaidsIndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const defaultRaid = '/raids/thaemine'; // Default to the Thaemine raid
    const savedRaid = localStorage.getItem('currentRaidPath');
    const raidPath = savedRaid || defaultRaid;
    router.push(raidPath); // Navigate to the current raid URL
  }, [router]);

  return (
    <div className="bg-primary-background-color">
      <ContentSelector currentPath={router.asPath} />
    </div>
  );
};

export default RaidsIndexPage;
