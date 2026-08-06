import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import FeatureJourney from "@/components/FeatureJourney";
import Collections from "@/components/Collections";
import VideoShowcase from "@/components/VideoShowcase";
import Testimonials from "@/components/Testimonials";
import USP from "@/components/USP";
import CommunityCTA from "@/components/CommunityCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-shimmer">
      <Navbar />
      <Hero />
      <Stats />
      <FeatureJourney />
      <VideoShowcase />
      <Collections />
      <Testimonials />
      <USP />
      <CommunityCTA />
      <Footer />
    </main>
  );
}
