import Link from 'next/link';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Not found" />
      <div className="card mx-auto max-w-lg px-6 py-16 text-center">
        <p className="font-display text-5xl font-bold text-gold-400">404</p>
        <p className="mt-3 text-ink-300">That page wandered off into the Abyss.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Back home
        </Link>
      </div>
    </>
  );
}
