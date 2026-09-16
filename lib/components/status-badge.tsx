"use client";

import { useApp } from "@/lib/app-provider";

export function StatusBadge({ status }: { status: string }) {
  const { t } = useApp();

  const map: Record<string, { bg: string; text: string; label: string }> = {
    normal: { bg: "bg-emerald-900/40 text-emerald-300", label: t("dashboard.statusNormal") },
    minimal: { bg: "bg-amber-900/40 text-amber-300", label: t("dashboard.statusMinimal") },
    ready_restock: { bg: "bg-rose-900/40 text-rose-300", label: t("dashboard.statusReadyRestock") },
    out_of_stock: { bg: "bg-red-900/40 text-red-300", label: t("dashboard.statusOutOfStock") },
  };

  const s = map[status] || map.normal;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg}`}>
      {s.label}
    </span>
  );
}
