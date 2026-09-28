import { LegalPage } from "@/components/legal-page";
import { getPrivacy } from "@/lib/content";

export async function generateMetadata() {
  const page = await getPrivacy();
  return { title: page.title, description: page.intro };
}

export default async function PrivacyPage() {
  return <LegalPage page={await getPrivacy()} />;
}
