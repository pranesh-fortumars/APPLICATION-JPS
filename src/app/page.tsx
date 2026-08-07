import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import InteractiveCategories from "@/components/InteractiveCategories";
import AboutBoutique from "@/components/AboutBoutique";
import FeatureJourney from "@/components/FeatureJourney";
import Collections from "@/components/Collections";
import VideoShowcase from "@/components/VideoShowcase";
import Testimonials from "@/components/Testimonials";
import USP from "@/components/USP";
import ReachOut from "@/components/ReachOut";
import CommunityCTA from "@/components/CommunityCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-shimmer">
      <Navbar />
      <Hero />
      <Stats />
      <InteractiveCategories />
      <AboutBoutique />
      <FeatureJourney />
      <VideoShowcase />
      <Collections />
      <Testimonials />
      <USP />
      <ReachOut />
      <CommunityCTA />
      <Footer />
    </main>
  );
}
