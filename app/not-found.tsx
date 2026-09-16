import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="display text-[clamp(2.6rem,1.6rem+5vw,5.2rem)]">This page is not on the record.</h1>
      <p className="lede mt-6 max-w-[44ch] text-ink-2">
        The address may have changed with the new site. Everything published is reachable from the sections below.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href="/our-actions">Our Actions</ButtonLink>
        <ButtonLink href="/" variant="secondary">Home</ButtonLink>
      </div>
    </Container>
  );
}
