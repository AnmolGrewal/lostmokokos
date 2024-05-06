import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ContentSelector from '../../app/components/ContentSelector';
import DynamicContent from '../../app/components/DynamicContent';

const RaidsIndexPage: React.FC = () => {
  const router = useRouter();
  const [currentRaid, setCurrentRaid] = useState<string>('');

  useEffect(() => {
    const defaultRaid = '/raids/thaemine'; // Default to the Thaemine raid
    const savedRaid = localStorage.getItem('currentRaidPath');
    const raidPath = savedRaid || defaultRaid;
    setCurrentRaid(raidPath);
    router.push(raidPath); // Navigate to the current raid URL
  }, [router]);

  return (
    <div className='bg-primary-background-color'>
      <ContentSelector currentPath={router.asPath} /> {/* Pass the current path */}
      <DynamicContent currentRaid={currentRaid} /> {/* Pass the current raid URL */}
    </div>
  );
};

export default RaidsIndexPage;
