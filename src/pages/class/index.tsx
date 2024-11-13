import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ClassSelection from '@/app/components/ClassSelection';

const CharacterSheetIndexPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Lost Ark Classes';
  }, []);

  return (
    <div className="bg-primary-background-color size-full flex max-w-[1350px] mx-auto">
      <Helmet>
        <title>Lost Ark Classes</title>
        <meta name="description" content="All Classes for Lost Ark" />
      </Helmet>
      <ClassSelection/>
    </div>
  );
};

export default CharacterSheetIndexPage;
