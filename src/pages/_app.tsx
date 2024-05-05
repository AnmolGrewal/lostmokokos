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
    <>
      <ClockBar />
      <NavigationBar currentPath={router.pathname}/>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;