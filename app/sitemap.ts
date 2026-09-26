import type { MetadataRoute } from "next";
import { getActions, getCampaigns, getPrograms } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cmaxfoundation.org";
  const [programs, actions, campaigns] = await Promise.all([getPrograms(), getActions(), getCampaigns()]);
  const fixed = ["", "/approach", "/about/press", "/our-actions", "/global-advocacy", "/global-advocacy/united-nations", "/about", "/about/team", "/about/transparency", "/support"];
  return [
    ...fixed.map((p) => ({ url: `${base}${p}` })),
    ...programs.map((p) => ({ url: `${base}/our-work/${p.slug}` })),
    ...actions.map((a) => ({ url: `${base}/our-actions/${a.slug}` })),
    ...campaigns.map((c) => ({ url: `${base}/campaigns/${c.slug}` })),
  ];
}
