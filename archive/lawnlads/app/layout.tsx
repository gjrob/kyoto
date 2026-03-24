import PoweredByBTV from './components/PoweredByBTV'
import type { Metadata } from 'next'
import './globals.css'
import ChatBot from '../components/ChatBot'

export const metadata: Metadata = {
  title: 'Lawn Lads — Teen Lawn Care · Wilmington NC',
  description: 'Affordable, reliable lawn care by motivated local teens. Mowing, edging, cleanup & more in Wilmington NC.',
  openGraph: {
    type: 'website',
    title: 'Lawn Lads — Teen Lawn Care · Wilmington NC',
    description: 'Affordable, reliable lawn care by motivated local teens. Mowing, edging, cleanup & more in Wilmington NC.',
    url: 'https://lawnlads.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lawn Lads — Teen Lawn Care · Wilmington NC',
    description: 'Affordable, reliable lawn care by motivated local teens. Mowing, edging, cleanup & more in Wilmington NC.',
  },
  other: {
    'geo.region': 'US-NC',
    'geo.placename': 'Wilmington, North Carolina',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <ChatBot />
        <PoweredByBTV />
      </body>
    </html>
  )
}
