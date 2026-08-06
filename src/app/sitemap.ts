import { MetadataRoute } from "next";
import { mockProducts } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jpsfabrics.com";

  // Static routes
  const routes = [
    "",
    "/collections",
    "/about",
    "/contact",
    "/cart",
    "/checkout"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = mockProducts.map((product) => ({
    url: `${baseUrl}/collections/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...routes, ...productRoutes];
}
