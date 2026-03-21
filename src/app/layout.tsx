import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideQuest — Bali · May 2026',
  description: 'A curated travel immersion for MBAs. 9 days in Bali. 30 spots. Info session early bird opens March 22.',
  openGraph: {
    title: 'SideQuest — Bali · May 2026',
    description: '30 spots. By application only. Travel that changes how you think.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  )
}
