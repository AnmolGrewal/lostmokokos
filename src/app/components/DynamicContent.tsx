import React from 'react';
import { useRouter } from 'next/router';

const DynamicContent = () => {
  const router = useRouter();
  const { raid } = router.query;

  // Ensure the router is ready and the `raid` parameter is available
  if (!router.isReady || !raid) {
    return <div>Loading raid details...</div>; // Or any other placeholder content
  }

  // Display content based on `raid`
  return (
    <div>
      <h1>Details for {raid}</h1>
      {/* Load and display raid-specific content here */}
      {/* Example: You might want to fetch data based on `raid` or display different components */}
    </div>
  );
};

export default DynamicContent;
