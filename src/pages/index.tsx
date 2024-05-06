import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/raids');
  }, [router]);

  return (
    <main className="main-content bg-primary-background-color">
      {/* You can add some loading animation or text here if needed */}
    </main>
  );
}
