import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import BookingForm from "@/components/BookingForm";
import Reviews from "@/components/Reviews";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'ElectronicsRepairShop',
                  name: 'Cell Phone Paradise',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '1929 Oleander Dr #B',
                    addressLocality: 'Wilmington',
                    addressRegion: 'NC',
                    addressCountry: 'US',
                  },
                  telephone: '(910) 772-5599',
                  url: 'https://cellphoneparadise.com',
                })
              }}
            />

      <TopBar />
      <Nav />
      <Hero />
      <ServicesGrid />
      <BookingForm />
      <Reviews />
      <AboutSection />
      <FAQ />
      <Footer />
    </main>
  );
}
