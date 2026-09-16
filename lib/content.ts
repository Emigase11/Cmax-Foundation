import { cache } from "react";
import { reader } from "./reader";

export * from "./labels";

const byDateDesc = <T extends { entry: { date: string | null } }>(a: T, b: T) =>
  (b.entry.date ?? "").localeCompare(a.entry.date ?? "");

export const getSite = cache(async () => {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error("content/site/settings.yaml is missing");
  return site;
});

export const getHome = cache(async () => {
  const home = await reader.singletons.home.read();
  if (!home) throw new Error("content/site/home.yaml is missing");
  return home;
});

export const getAbout = cache(async () => {
  const about = await reader.singletons.about.read();
  if (!about) throw new Error("content/site/about.yaml is missing");
  return about;
});

export const getPrograms = cache(async () => {
  const all = await reader.collections.programs.all();
  return all.sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
});

export const getProgram = cache((slug: string) => reader.collections.programs.read(slug));

export const getActions = cache(async () => {
  const all = await reader.collections.actions.all();
  return all.filter((a) => a.entry.published).sort(byDateDesc);
});

export const getAction = cache((slug: string) => reader.collections.actions.read(slug));

export const getCampaigns = cache(async () => {
  const all = await reader.collections.campaigns.all();
  const rank: Record<string, number> = { active: 0, proposed: 1, review: 2, pending: 3, completed: 4 };
  return all
    .filter((c) => c.entry.published)
    .sort((a, b) => (rank[a.entry.status] ?? 9) - (rank[b.entry.status] ?? 9));
});

export const getCampaign = cache((slug: string) => reader.collections.campaigns.read(slug));

export const getActivities = cache(async () => {
  const all = await reader.collections.activities.all();
  return all.filter((a) => a.entry.published).sort(byDateDesc);
});

export const getActivity = cache((slug: string) => reader.collections.activities.read(slug));

export const getPeople = cache(async () => {
  const all = await reader.collections.people.all();
  return all
    .filter((p) => p.entry.verified)
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
});

