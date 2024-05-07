import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GoldGrid from '../../app/components/GoldGrid';
import raidsInfo from '../../data/raidsInfo';

const GoldCalculatorIndexPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Gold Calculator';
  }, []);

  return (
    <div className='bg-primary-background-color'>
      <Helmet>
        <title>Gold Calculator</title>
        <meta name="description" content="Description of Gold Calculator" />
      </Helmet>
      <GoldGrid raids={raidsInfo} />
    </div>
  );
};

export default GoldCalculatorIndexPage;