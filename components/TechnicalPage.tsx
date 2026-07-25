import Link from "next/link";
import type { SystemDetail } from "../data/system";
import { getSystemDetail } from "../data/system";

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone?: string }) {
  return <section className={`technical-block ${tone || ""}`}><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export function TechnicalPage({ detail }: { detail: SystemDetail }) {
  return <main id="main-content" className="technical-page page-enter">
    <header className="technical-hero"><div className="section-shell"><p className="eyebrow">System / {detail.number}</p><h1>{detail.title}</h1><p>{detail.summary}</p><div className="technical-state"><span>PIPELINE STATE</span><b>{detail.state}</b></div></div></header>
    <div className="section-shell technical-layout">
      <aside className="technical-sidebar"><p>On this page</p>{["Purpose","Role in pipeline","Input and method","Output","Failure cases","Current limits","Next improvements"].map((label, index) => <a href={`#section-${index}`} key={label}><span>0{index + 1}</span>{label}</a>)}</aside>
      <article className="technical-content">
        <section className="technical-block technical-lead" id="section-0"><p className="eyebrow">Purpose</p><h2>{detail.purpose}</h2></section>
        <section className="technical-block" id="section-1"><h2>Role in the complete pipeline</h2><p>{detail.role}</p></section>
        <section className="technical-block io-block" id="section-2"><div><span>INPUT</span><p>{detail.input}</p></div><i aria-hidden="true">→</i><div><span>METHOD</span><ol>{detail.method.map((step) => <li key={step}>{step}</li>)}</ol></div></section>
        <section className="technical-block output-block" id="section-3"><span>OUTPUT</span><h2>{detail.output}</h2></section>
        <div id="section-4"><ListBlock title="Common failure cases" items={detail.failures} tone="failure-block" /><ListBlock title="How VisoraAI responds" items={detail.response} tone="response-block" /></div>
        <div id="section-5"><ListBlock title="Current limitations" items={detail.limitations} /></div>
        <div id="section-6"><ListBlock title="Planned improvements" items={detail.improvements} /></div>
        <section className="related-block"><p className="eyebrow">Related components</p><div>{detail.related.map((slug) => { const related = getSystemDetail(slug); return related ? <Link key={slug} href={`/system/${slug}`}><span>{related.number}</span>{related.title}<b>↗</b></Link> : null; })}</div></section>
      </article>
    </div>
  </main>;
}
