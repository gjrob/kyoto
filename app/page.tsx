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
