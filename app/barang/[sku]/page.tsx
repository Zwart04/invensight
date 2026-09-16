import { generateMockStockItems } from "@/lib/data";

export function generateStaticParams() {
  const items = generateMockStockItems();
  return items.map((item) => ({ sku: item.sku }));
}

export default function BarangDetailPage({ params }: { params: { sku: string } }) {
  return <BarangDetailClient sku={params.sku} />;
}

import BarangDetailClient from "./BarangDetailClient";
