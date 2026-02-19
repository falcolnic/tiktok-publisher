import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TikTok Publisher',
  description: 'Multi-account TikTok video publisher',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
