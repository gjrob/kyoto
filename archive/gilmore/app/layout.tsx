import type { Metadata } from 'next'
import './globals.css'
import PoweredByBTV from './components/PoweredByBTV'
import ChatBot from './components/ChatBot'

export const metadata: Metadata = {
  title: 'Gilmore Craft & Coat | General Contractor Wilmington NC',
  description: 'Expert residential and commercial construction services in Wilmington NC. Licensed & insured general contractor. Custom builds, remodeling, painting, epoxy, roofing, and more. Free estimates.',
  keywords: 'general contractor Wilmington NC, construction Wilmington, remodeling Wilmington NC, Gilmore Craft and Coat, Shannon Gilmore, painting contractor, epoxy floors, roofing Wilmington',
  openGraph: {
    type: 'website',
    title: 'Gilmore Craft & Coat | General Contractor Wilmington NC',
    description: 'Expert and reliable residential & commercial construction. Licensed & insured. 30 years of craftsmanship.',
    url: 'https://gilmorecraftandcoat.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gilmore Craft & Coat | General Contractor Wilmington NC',
    description: 'Expert and reliable residential & commercial construction. Licensed & insured. 30 years of craftsmanship.',
    images: ['/og-image.jpg'],
  },
  other: {
    'geo.region': 'US-NC',
    'geo.placename': 'Wilmington, North Carolina',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PoweredByBTV />
        <ChatBot />
      </body>
    </html>
  )
}
