import type { ReactNode } from "react";

export const metadata = { title: "CMAX Foundation — Content manager" };

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return <div className="fixed inset-0 z-50 bg-white">{children}</div>;
}
