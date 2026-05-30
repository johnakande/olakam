import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Olaitan & Kam | Wedding · 8.8.2026',
  description:
    'You are invited to witness the union of Olaitan Margaret Ajao and Kam Barinodum Wiwuga on Saturday, 8th August 2026.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-jost antialiased">
        {children}
      </body>
    </html>
  )
}
