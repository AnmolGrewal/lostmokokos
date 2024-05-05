import '../../src/app/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

// Dynamically import a component, disabling server-side rendering for it
const ClockBar = dynamic(() => import('../app/components/ClockBar'), {
  ssr: false
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClockBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;