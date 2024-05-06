import React from 'react';

interface DynamicContentProps {
  currentRaid: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ currentRaid }) => {
  // Since you're passing currentRaid as a prop now, you don't need to use useRouter here.
  return (
    <div>
      <h1>Details for {currentRaid}</h1>
      {/* Load and display raid-specific content here */}
      {/* This can include fetching data based on `currentRaid` or displaying different components */}
    </div>
  );
};

export default DynamicContent;
