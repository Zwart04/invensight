import type { Metadata } from "next";
import "./globals.css";
import { InventoryProvider } from "@/lib/store";
import { AppProvider } from "@/lib/app-provider";

export const metadata: Metadata = {
  title: "InvenSight — Inventory OS",
  description: "Real-time stock tracking, AI restock prediction, and distribution heatmap for small warehouses and UMKM.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <InventoryProvider>{children}</InventoryProvider>
        </AppProvider>
      </body>
    </html>
  );
}
