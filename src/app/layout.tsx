import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/app-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InvenSight - Inventory & Stock Visibility OS',
  description: 'Dashboard visibilitas stok real-time untuk UMKM dengan AI restock prediction dan canvas heatmap.',
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
