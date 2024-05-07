import React from 'react';
import GoldGrid from '../../app/components/GoldGrid';
import raidsInfo from '../../data/raidsInfo';

const GoldCalculatorIndexPage: React.FC = () => {

  return (
    <div className='bg-primary-background-color'>
      <GoldGrid raids={raidsInfo} />
    </div>
  );
};

export default GoldCalculatorIndexPage;
