import Link from "next/link";
import type { EditorialPage as EditorialPageType } from "../data/pages";

export function EditorialPage({ page, slug }: { page: EditorialPageType; slug: string }) {
  const isContact = slug === "contact";
  return <main id="main-content" className="editorial-page page-enter"><header className="editorial-hero"><div className="section-shell"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.intro}</p>{isContact && <div className="button-row"><Link className="button button-dark" href="mailto:hello@visoraai.com">Email the project ↗</Link><Link className="button button-quiet" href="https://github.com/ARIHANTujjwal/VisoraAI" target="_blank" rel="noreferrer">View GitHub ↗</Link></div>}</div></header><div className="section-shell editorial-sections">{page.sections.map((section, index) => <section key={section.title} data-reveal><span>{String(index + 1).padStart(2,"0")}</span><div><h2>{section.title}</h2><p>{section.text}</p>{section.status && <strong className="status-label"><i />{section.status}</strong>}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div></section>)}</div></main>;
}
