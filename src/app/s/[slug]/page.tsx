import SharedPageClient from './shared-page-client';

export function generateStaticParams() {
  return [{ slug: 'sample' }, { slug: 'demo-household' }];
}

export default function SharedPage({ params }: { params: { slug: string } }) {
  return <SharedPageClient productId={params.slug} />;
}
