import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const CharacterSheetIndexPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Engravings';
  }, []);

  return (
    <div className="bg-primary-background-color">
      <Helmet>
        <title>Engravings</title>
        <meta name="description" content="Engravings Tool for Lost Ark" />
      </Helmet>
    </div>
  );
};

export default CharacterSheetIndexPage;