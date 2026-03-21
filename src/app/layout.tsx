import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideQuest — Bali · May 2026',
  description: 'A curated travel immersion program for MBAs. 30 spots. First cohort. Bali, May 2026.',
  openGraph: {
    title: 'SideQuest — Bali · May 2026',
    description: '30 spots. By invite only. Travel with intention.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
