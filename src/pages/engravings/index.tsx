import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import EngravingCalculator from '../../app/components/EngravingCalculator';

const CharacterSheetIndexPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Engravings';
  }, []);

  return (
    <div className="bg-primary-background-color size-full flex max-w-[1350px] mx-auto">
      <Helmet>
        <title>Engravings</title>
        <meta name="description" content="Engravings Calculator for Lost Ark" />
      </Helmet>
      <EngravingCalculator />
    </div>
  );
};

export default CharacterSheetIndexPage;
