import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CharacterGrid from '../../app/components/CharacterGrid';
import raidsInfo from '../../data/raidsInfo';

const CharacterSheetIndexPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Character Sheet';
  }, []);

  return (
    <div className="bg-primary-background-color">
      <Helmet>
        <title>Character Sheet</title>
        <meta name="description" content="Character Sheet for Lost Ark" />
      </Helmet>
      <CharacterGrid raids={raidsInfo} />
    </div>
  );
};

export default CharacterSheetIndexPage;
