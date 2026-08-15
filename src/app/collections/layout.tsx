import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections | JPS Fabrics",
  description: "Browse our extensive catalog of premium fabrics, from luxurious silks and georgettes to everyday cottons. Filter by material, pattern, and color.",
  openGraph: {
    title: "Shop All Collections | JPS Fabrics",
    description: "Browse our extensive catalog of premium fabrics, from luxurious silks to everyday cottons.",
  }
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
