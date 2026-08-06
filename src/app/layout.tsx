import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MiniCart from "@/components/MiniCart";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <FloatingWhatsApp />
        <MiniCart />
      </body>
    </html>
  );
}
