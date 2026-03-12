import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlueTubeTV Sponsor Plans | Pricing',
  description:
    'Choose your sponsor package. Live streaming + local commerce for Wilmington NC venues. Three tiers starting at $99/mo.',
  keywords: 'BlueTubeTV sponsor Wilmington NC, BluRing Holdings, local business streaming',
  openGraph: {
    type: 'website',
    title: 'BlueTubeTV Sponsor Plans | Pricing',
    description: 'Choose your sponsor package. Live streaming + local commerce for Wilmington NC.',
    url: 'https://billing.bluetubetv.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlueTubeTV Sponsor Plans',
    description: 'Three tiers. Live streaming. Local commerce. Wilmington NC.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
