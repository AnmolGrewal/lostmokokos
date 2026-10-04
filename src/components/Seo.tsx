import Head from 'next/head';

export default function Seo({ title, description }: { title?: string; description?: string }) {
  const full = title ? `${title} · Lost Mokokos` : 'Lost Mokokos — Lost Ark rewards & gold';
  return (
    <Head>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
    </Head>
  );
}
