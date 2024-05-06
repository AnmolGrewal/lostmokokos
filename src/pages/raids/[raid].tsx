import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import DynamicContent from '../../app/components/DynamicContent';

const RaidPage = () => {
  const router = useRouter();
  const { raid } = router.query;

  // Ensure that the router has finished and the `raid` query is available
  if (!router.isReady || !raid) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-primary-background-color .main-content'>
      <Head>
        <title>{raid} - Raid Details</title>
        <meta name="description" content={`Learn more about the ${raid} raid`} />
      </Head>
      <h1>{raid} Raid</h1>
      <DynamicContent currentRaid={raid as string} />
    </div>
  );
};

export default RaidPage;
