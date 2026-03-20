import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'SideQuest Bali — May 9–17, 2025',
  description: '9 days in Bali for MBAs. Manta ray snorkeling, Mount Batur sunrise hike, and curated access to founders, NGOs, and changemakers.',
  openGraph: {
    title: 'SideQuest Bali — May 9–17, 2025',
    description: 'Travel with intention. 9 days. Bucket-list experiences. Real connections.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
