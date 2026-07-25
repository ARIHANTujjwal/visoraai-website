import type { NextConfig } from "next";

const redirects: Record<string, string> = {
  "/capture.html": "/system/capture",
  "/detection.html": "/system/detection",
  "/enhancement.html": "/system/enhancement",
  "/recognition.html": "/system/ocr",
  "/speech.html": "/system/speech",
  "/guidance.html": "/system/guidance",
  "/stack.html": "/system/burst-stacking",
  "/research.html": "/research",
  "/accessibility.html": "/accessibility",
  "/roadmap.html": "/development",
  "/technology.html": "/system",
  "/contact.html": "/contact",
  "/index.html": "/"
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(redirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true
    }));
  }
};

export default nextConfig;
