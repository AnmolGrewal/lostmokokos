import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const GoldCharacterIndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/characters');
  }, [router]);

  return null;
};

export default GoldCharacterIndexPage;