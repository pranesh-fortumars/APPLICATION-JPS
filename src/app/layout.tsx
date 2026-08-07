import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MiniCart from "@/components/MiniCart";
import CustomCursor from "@/components/CustomCursor";

const playfair = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Outfit({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | JPS Fabrics",
    default: "JPS Fabrics | Luxury Women's Boutique",
  },
  description: "Experience unparalleled luxury with JPS Fabrics. We source the finest silks, georgettes, and premium materials for bespoke tailoring and bridal couture.",
  keywords: ["luxury fabrics", "bridal couture", "banarasi silk", "premium textiles", "boutique fabrics"],
  authors: [{ name: "JPS Fabrics" }],
  creator: "JPS Fabrics",
  openGraph: {
    title: "JPS Fabrics | Luxury Women's Boutique",
    description: "Experience unparalleled luxury with JPS Fabrics. We source the finest silks and premium materials for bespoke tailoring.",
    url: "https://jpsfabrics.com",
    siteName: "JPS Fabrics",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPS Fabrics | Luxury Women's Boutique",
    description: "Premium textiles for bridal couture and bespoke fashion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`${inter.variable} ${playfair.variable} ${script.variable} min-h-screen bg-background text-foreground selection:bg-accent selection:text-dark`}
      >
        <SmoothScroll>
          <CustomCursor />
          {children}
          <MiniCart />
          <FloatingWhatsApp />
        </SmoothScroll>
      </body>
    </html>
  );
}
