import '../../src/app/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Dynamically import a component, disabling server-side rendering for it
const ClockBar = dynamic(() => import('../app/components/ClockBar'), {
  ssr: false
});

const NavigationBar = dynamic(() => import('../app/components/NavigationBar'), {
  ssr: false
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="">
        <ClockBar />
        <NavigationBar currentPath={router.pathname} />
      </header>
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;