import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Hero />
      {/* Additional sections (Collections, Stats, Offers, Contact, etc.) will be added here */}
      <div className="h-screen bg-secondary flex items-center justify-center">
        <h2 className="font-serif text-4xl text-primary">Discover the Collection</h2>
      </div>
    </main>
  );
}
