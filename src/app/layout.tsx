import '@/app/globals.css';
import { AppProvider } from '@/lib/app-provider';

export const metadata = {
  title: 'InvenSight - Inventory Visibility OS',
  description: 'Professional inventory management with AI-assisted restock prediction, real-time stock monitoring.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
