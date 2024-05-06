import React, { useState, useEffect } from 'react';
import ContentSelector from '../../app/components/ContentSelector';
import DynamicContent from '../../app/components/DynamicContent';
import { useRouter } from 'next/router';

const RaidsIndexPage: React.FC = () => {
  const router = useRouter();
  const [currentRaid, setCurrentRaid] = useState('');

  useEffect(() => {
    // This sets the default raid or the last visited raid
    const defaultRaid = '/raids/thaemine'; // Default to the Thaemine raid
    const savedPath = typeof window !== 'undefined' ? localStorage.getItem('currentRaidPath') : null;
    setCurrentRaid(savedPath || defaultRaid);
  }, []);

  useEffect(() => {
    if (currentRaid) {
      // Update local storage only when currentRaid changes
      localStorage.setItem('currentRaidPath', currentRaid);
      // Push to the router to update the URL, this is necessary to reflect the current raid in the URL
      router.push(currentRaid);
    }
  }, [currentRaid, router]);

  return (
    <div className='bg-primary-background-color'>
      <ContentSelector currentPath={router.asPath} />
      <DynamicContent currentRaid={currentRaid.replace('/raids/', '')} />
    </div>
  );
};

export default RaidsIndexPage;
