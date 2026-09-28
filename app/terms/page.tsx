import { LegalPage } from "@/components/legal-page";
import { getTerms } from "@/lib/content";

export async function generateMetadata() {
  const page = await getTerms();
  return { title: page.title, description: page.intro };
}

export default async function TermsPage() {
  return <LegalPage page={await getTerms()} />;
}
