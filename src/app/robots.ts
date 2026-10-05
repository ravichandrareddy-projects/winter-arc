import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://winterarc.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/callback", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/auth/callback", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
