import type { MetadataRoute } from "next";
import { systemDetails } from "../data/system";
import { editorialPages } from "../data/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://visoraai-website.vercel.app";
  return ["", "/system", ...systemDetails.map(({ slug }) => `/system/${slug}`), ...Object.keys(editorialPages).map((slug) => `/${slug}`)].map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "monthly" : "yearly", priority: path === "" ? 1 : 0.7 }));
}
