import PoweredByBTV from './components/PoweredByBTV'
import type { Metadata } from 'next';
import './globals.css';
import ChatBot from './components/ChatBot';

export const metadata: Metadata = {
  title: 'Cut the Crap Parenting | Denise — Wilmington, NC',
  description: 'Intuitive and holistic parenting support in Wilmington NC. In-home consultations, workshops, and The Blueprint online course. No judgment, just solutions.',
  keywords: 'parenting support Wilmington NC, Denise parenting coach, intuitive parenting, holistic parenting, parenting workshops, parenting course',
  openGraph: {
    title: 'Cut the Crap Parenting | Denise — Wilmington, NC',
    description: 'Intuitive and holistic parenting support. In-home consultations, workshops, and The Blueprint online course.',
    type: 'website',
    url: 'https://cutthecrapparenting.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cut the Crap Parenting | Denise — Wilmington, NC',
    description: 'Intuitive and holistic parenting support in Wilmington NC.',
    images: ['/og-image.jpg'],
  },
  other: {
    'geo.region': 'US-NC',
    'geo.placename': 'Wilmington, North Carolina',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatBot />
        <PoweredByBTV />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Cut the Crap Parenting',
              description: 'Intuitive and holistic parenting support in Wilmington NC. In-home consultations, workshops, and The Blueprint online course.',
              telephone: '(910) 612-7885',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Wilmington',
                addressRegion: 'NC',
                addressCountry: 'US',
              },
              url: 'https://cutthecrapparenting.com',
              areaServed: 'Wilmington, NC',
              serviceType: 'Parenting Support',
              priceRange: '$45 - $350',
            }),
          }}
        />
      </body>
    </html>
  );
}
