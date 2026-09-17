import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/support": ["./content/**/*"],
    "/api/support": ["./content/**/*"],
  },
  images: {
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2400, 2800],
  },
  async redirects() {
    // Paths from the previous WordPress site.
    return [
      { source: "/allstaff", destination: "/about/team", permanent: true },
      { source: "/misionandvision", destination: "/about", permanent: true },
      { source: "/impact", destination: "/our-actions", permanent: true },
      { source: "/100model", destination: "/about/transparency", permanent: true },
      { source: "/cmax-for-covid-19", destination: "/our-actions/covid-19-response", permanent: true },
      { source: "/innovations", destination: "/our-work", permanent: true },
      { source: "/social-innovation-lab", destination: "/our-work/community-preparedness", permanent: true },
      { source: "/news", destination: "/global-advocacy", permanent: true },
      { source: "/contacts", destination: "/support", permanent: true },
      { source: "/consultative-status-united-nations", destination: "/global-advocacy/united-nations", permanent: true },
      { source: "/the-revolution-of-priority-united-nations-dec-9-2019", destination: "/global-advocacy/united-nations", permanent: true },
      { source: "/cmax-foundation-launches-in-mexico-a-public-private-network-for-drr", destination: "/our-actions/mexico-public-private-network-for-disaster-risk-reduction", permanent: true },
      { source: "/el-primer-laboratorio-de-innovacion-social-para-la-emergencia-lise", destination: "/our-actions/mexico-social-innovation-lab-for-emergencies", permanent: true },
    ];
  },
};

export default nextConfig;
