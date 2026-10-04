import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Inter, Cinzel } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Layout from '@/components/Layout';
import { PricesProvider } from '@/lib/PricesContext';
import '@/styles/globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Cinzel({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display', display: 'swap' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${sans.variable} ${display.variable} font-sans`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lost Mokokos</title>
      </Head>
      <PricesProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PricesProvider>
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics gaId="G-Z3BL4HXK7M" />
    </div>
  );
}
