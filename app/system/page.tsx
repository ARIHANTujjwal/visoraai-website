import type { Metadata } from "next";
import { SystemIndexGrid } from "../../components/HomeSections";

export const metadata: Metadata = { title: "System architecture", description: "Explore every stage in the VisoraAI capture, enhancement, OCR, speech, and guidance pipeline.", alternates: { canonical: "/system" } };

export default function SystemPage() {
  return <main id="main-content" className="index-page page-enter"><header className="index-hero"><div className="section-shell"><p className="eyebrow">Complete system</p><h1>From camera frame<br />to spoken page.</h1><p>Seven detailed components cooperate across perception, recognition, decision, and interaction. Each page documents inputs, methods, outputs, failure cases, and current limits.</p></div></header><div className="section-shell"><SystemIndexGrid /></div></main>;
}
