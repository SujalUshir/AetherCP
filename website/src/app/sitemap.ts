import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aethercp.dev";
  const routes = [
    "",
    "/features",
    "/screenshots",
    "/downloads",
    "/changelog",
    "/roadmap",
    "/about",
    "/privacy",
    "/feedback",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
