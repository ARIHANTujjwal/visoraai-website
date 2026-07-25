import Link from "next/link";
import { systemDetails } from "../data/system";

export function ProblemSection() {
  return <section className="problem-section paper-section" id="problem">
    <div className="section-shell problem-layout">
      <div className="problem-copy" data-reveal><p className="eyebrow">The capture problem</p><h2>Access often ends where print begins.</h2><p>Printed information remains difficult to access independently when a person cannot clearly see the page. Recognition systems also tend to assume the user has already captured a usable image.</p><p>VisoraAI treats capture, recognition, and guidance as one connected problem.</p></div>
      <div className="condition-sequence" data-reveal><div className="condition-top"><span>CAMERA CONDITIONS</span><span>SCROLL SEQUENCE</span></div><div className="condition-page"><div className="condition-glare" /><strong>PUBLIC LIBRARY<br />VISITOR GUIDE</strong><i /><i /><i /><i /><div className="condition-frame"><b /><b /><b /><b /></div></div><div className="condition-track">{["Weak light", "Glare", "Motion blur", "Poor framing", "Clear capture"].map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}</div></div>
    </div>
  </section>;
}

export function EdgeSection() {
  return <section className="edge-section"><div className="section-shell edge-layout">
    <div className="edge-copy" data-reveal><p className="eyebrow eyebrow-light">Edge deployment</p><h2>Designed for the edge, not only the lab.</h2><p>The Raspberry Pi direction favors local camera processing and lower dependence on continuous cloud access. It also introduces real constraints: CPU budgets, exposure control, frame skipping, service boundaries, and headless operation.</p><dl><div><dt>Local input</dt><dd>Camera frames stay close to the reading device.</dd></div><div><dt>CPU-conscious</dt><dd>Work is bounded, skipped, or delayed when it does not help.</dd></div><div><dt>Modular services</dt><dd>Capture, recognition, speech, and guidance can fail independently.</dd></div></dl></div>
    <div className="edge-diagram" data-reveal aria-label="Abstract exploded view of camera, Raspberry Pi processing, and audio output">
      <div className="edge-layer camera-layer"><span>01 / CAMERA</span><div className="lens"><i /><i /><i /></div><small>Live frame + exposure</small></div><i className="edge-connector" />
      <div className="edge-layer pi-layer"><span>02 / RASPBERRY PI</span><div className="board"><i /><i /><i /><b>V</b><i /><i /></div><small>Vision + OCR services</small></div><i className="edge-connector" />
      <div className="edge-layer audio-layer"><span>03 / AUDIO</span><div className="speaker"><i /><i /><i /></div><small>Speech + guidance</small></div>
    </div>
  </div></section>;
}

export function ResearchPreview() {
  const metrics = ["Character Error Rate", "Recognition behavior", "Burst depth", "Processing time", "Blur severity", "Glare conditions", "Confidence", "Failure categories"];
  return <section className="research-preview paper-section" id="research"><div className="section-shell">
    <div className="research-head" data-reveal><div><p className="eyebrow">Research</p><h2>Built through testing,<br />not assumptions.</h2></div><div><p>Verified numerical results were not found in the website repository. The evaluation framework is ready, but claims stay withheld until the dataset and conditions are documented.</p><Link className="text-link" href="/research">Read the research approach <span>↗</span></Link></div></div>
    <div className="research-board" data-reveal><div className="research-status"><i /><span>CONTROLLED EVALUATION IN PROGRESS</span><b>NO UNVERIFIED VALUES SHOWN</b></div><div className="metric-grid">{metrics.map((metric, index) => <div key={metric}><span>{String(index + 1).padStart(2,"0")}</span><h3>{metric}</h3><div className="pending-rule"><i style={{width:`${35 + (index % 4) * 13}%`}} /></div><small>Awaiting verified dataset results</small></div>)}</div></div>
  </div></section>;
}

const development = [
  ["Basic image-to-text", "Recognition exposed input quality as the first failure."], ["Live camera", "Continuous frames made stability measurable."], ["Text-to-speech", "Output became accessible, not just visible."], ["Page segmentation", "Background clutter stopped reaching OCR."], ["Quality checks", "Blur and glare became explicit states."], ["Custom OCR", "CRNN-CTC created a controlled research path."], ["Fallback routing", "Disagreement became a decision, not an error."], ["Burst stacking", "Several frames could form one candidate."], ["Raspberry Pi", "Latency and CPU limits shaped the design."], ["Spoken guidance", "Failure became an actionable feedback loop."]
];
export function DevelopmentTimeline() {
  return <section className="development-section"><div className="section-shell"><div className="development-head" data-reveal><p className="eyebrow eyebrow-light">Development progression</p><h2>The system became useful<br />one failure at a time.</h2></div><div className="timeline" data-line-reveal>{development.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2,"0")}</span><i /><h3>{title}</h3><p>{text}</p></article>)}</div><Link className="button button-cyan" href="/development">Follow the full progression <span>↗</span></Link></div></section>;
}

export function AccessibilityPreview() {
  return <section className="access-preview paper-section" id="accessibility"><div className="section-shell access-layout"><div data-reveal><p className="eyebrow">Accessibility</p><h2>A website about accessibility must demonstrate it.</h2></div><div className="access-principles" data-reveal>{[["01","Perceivable","High contrast, readable type, and text equivalents."],["02","Operable","Keyboard access, clear focus, and practical targets."],["03","Adaptable","Larger text, increased contrast, and reduced motion."],["04","Honest","No automatic audio and no meaning hidden in animation."]].map(([n,title,text]) => <div key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></div>)}</div><p className="access-note" data-reveal>Use the <b>Display</b> control at the lower edge of the screen to adjust the experience. <Link href="/accessibility">Read the accessibility approach ↗</Link></p></div></section>;
}

export function AboutClosing() {
  return <><section className="about-section"><div className="section-shell about-layout"><div data-reveal><p className="eyebrow eyebrow-light">About VisoraAI</p><h2>An independent exploration of accessible vision systems.</h2></div><div data-reveal><p>VisoraAI explores the relationship between computer vision, embedded systems, OCR, accessible interaction, and human-centered engineering.</p><p>It is an independently developed project, presented with its current limits intact: not a released medical device, not a commercial product, and not a claim of proven large-scale impact.</p><Link className="text-link text-link-light" href="/about">Read about the project <span>↗</span></Link></div></div></section>
  <section className="closing-section paper-section"><div className="closing-orbit" aria-hidden="true"><i /><i /><i /></div><div className="section-shell" data-reveal><p className="eyebrow">Continue exploring</p><h2>Make the page readable.<br /><em>Then make it heard.</em></h2><div className="closing-actions"><Link href="/system"><span>01</span><b>Explore the full system</b><i>↗</i></Link><Link href="/research"><span>02</span><b>Read the research</b><i>↗</i></Link><Link href="https://github.com/ARIHANTujjwal/VisoraAI" target="_blank" rel="noreferrer"><span>03</span><b>View the code</b><i>↗</i></Link></div></div></section></>;
}

export function SystemIndexGrid() {
  return <div className="system-index-grid">{systemDetails.map((item) => <Link href={`/system/${item.slug}`} key={item.slug}><span>{item.number}</span><i>{item.state}</i><h2>{item.title}</h2><p>{item.summary}</p><b>Open technical page ↗</b></Link>)}</div>;
}
