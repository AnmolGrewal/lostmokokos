import React, { useState, useEffect } from 'react';
import ContentSelector from '../../app/components/ContentSelector';
import DynamicContent from '../../app/components/DynamicContent';

const RaidsIndexPage: React.FC = () => {
  const defaultRaid = '/raids/thaemine'; // Default to the Thaemine raid
  const [currentPath, setCurrentPath] = useState(defaultRaid);

  useEffect(() => {
    const savedPath = localStorage.getItem('currentRaidPath');
    if (savedPath) {
      setCurrentPath(savedPath);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentRaidPath', currentPath);
  }, [currentPath]);

  return (
    <div>
      <h1>Welcome to the Raids</h1>
      <ContentSelector currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <DynamicContent currentPath={currentPath} />
    </div>
  );
};

export default RaidsIndexPage;
