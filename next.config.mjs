/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Pages folded into the new layout
      { source: '/compare', destination: '/gold', permanent: true },
      { source: '/gold-calculator', destination: '/characters', permanent: true },
      { source: '/engravings', destination: '/', permanent: false },
      // Raids renamed or removed in the sheet
      { source: '/raids/voldis:suffix(-hard|-solo)?', destination: '/raids/ivory-tower', permanent: true },
      { source: '/raids/clown:suffix(-hard|-solo)?', destination: '/raids/kakul-saydon', permanent: true },
      { source: '/raids/:slug(oreha|oreha-hard|argos)', destination: '/raids', permanent: true },
      // Old per-difficulty URLs (/raids/aegir-hard) now live on one page with a ?mode= tab
      { source: '/raids/:slug([a-z0-9]+)-:mode(hard|solo)', destination: '/raids/:slug?mode=:mode', permanent: true },
    ];
  },
};

export default nextConfig;
