import React, { useState } from 'react';
import ContentSelector from '../../app/components/ContentSelector'; // Adjust the import path as necessary

const RaidsPage = () => {
  const [currentPath, setCurrentPath] = useState('/');

  return (
    <main className="main-content bg-primary-background-color min-h-screen">
      <ContentSelector currentPath={currentPath} setCurrentPath={setCurrentPath} />
    </main>
  );
};

export default RaidsPage;