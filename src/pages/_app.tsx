import '../../src/app/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import ContentSelector from '../app/components/ContentSelector';

// Dynamically import a component, disabling server-side rendering for it
const ClockBar = dynamic(() => import('../app/components/ClockBar'), {
  ssr: false
});

const NavigationBar = dynamic(() => import('../app/components/NavigationBar'), {
  ssr: false
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isRaidPage = router.pathname.startsWith('/raids/');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <ClockBar />
        <NavigationBar currentPath={router.pathname} />
      </header>
      <main className="flex-grow">
        {isRaidPage && <ContentSelector currentPath={router.asPath} />}
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;