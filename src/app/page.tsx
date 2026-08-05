import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Collections from "@/components/Collections";
import VideoShowcase from "@/components/VideoShowcase";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <VideoShowcase />
      <Collections />
      <Testimonials />
      <Footer />
    </main>
  );
}
