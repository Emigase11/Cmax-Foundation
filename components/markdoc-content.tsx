import React from "react";
import Markdoc, { type Node } from "@markdoc/markdoc";

type Body = () => Promise<{ node: Node }>;

export async function MarkdocContent({ body, className = "" }: { body: Body; className?: string }) {
  const { node } = await body();
  const content = Markdoc.transform(node);
  return <div className={`prose ${className}`}>{Markdoc.renderers.react(content, React)}</div>;
}
