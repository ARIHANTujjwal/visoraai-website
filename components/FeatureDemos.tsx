"use client";

import { useEffect, useState } from "react";

export function OCRDecisionDemo() {
  const [selected, setSelected] = useState<"custom" | "fallback">("custom");
  return <section className="ocr-section">
    <div className="section-shell ocr-layout">
      <div className="ocr-copy" data-reveal><p className="eyebrow eyebrow-light">OCR decision system</p><h2>Recognition is not accepted blindly.</h2><p>A custom CRNN-CTC model and Tesseract fallback can disagree. Confidence and readability checks help select a candidate, but they do not guarantee that it is correct.</p><div className="ocr-legend"><span><i className="cyan" /> candidate</span><span><i className="amber" /> issue found</span><span><i /> rejected</span></div></div>
      <div className="ocr-terminal" data-reveal>
        <div className="terminal-top"><span>OCR ROUTER / SAMPLE COMPARISON</span><span>LOCAL PROCESS</span></div>
        <div className="candidate-row"><button type="button" onClick={() => setSelected("custom")} className={selected === "custom" ? "is-selected" : ""}><span>CUSTOM CRNN-CTC</span><code>The quiet library opens at nine.</code><small>Readability checks: pass</small></button><button type="button" onClick={() => setSelected("fallback")} className={selected === "fallback" ? "is-selected" : ""}><span>TESSERACT FALLBACK</span><code>The qulet Iibrary opens at nine.</code><small>Possible substitutions: l / I</small></button></div>
        <div className="decision-line"><span>CHECK</span><i /><b>{selected === "custom" ? "Candidate retained for normalization" : "Alternative flagged for comparison"}</b></div>
        <div className="normalized-output"><span>SELECTED TEXT</span><p>{selected === "custom" ? "The quiet library opens at nine." : "No automatic acceptance; compare candidates."}</p></div>
      </div>
    </div>
  </section>;
}

const guidance = [
  ["Distance", "Move closer"], ["Blur", "Hold steady"], ["Glare", "Reduce glare"], ["Visibility", "Center the page"], ["Stability", "Ready to read"]
];
export function GuidanceLoop() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval = 0;
    const update = () => {
      window.clearInterval(interval);
      if (query.matches || document.documentElement.dataset.motion === "reduced") setActive(guidance.length - 1);
      else interval = window.setInterval(() => setActive((value) => (value + 1) % guidance.length), 2500);
    };
    const observer = new MutationObserver(update);
    update();
    query.addEventListener("change", update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { window.clearInterval(interval); query.removeEventListener("change", update); observer.disconnect(); };
  }, []);
  return <section className="guidance-section paper-section"><div className="section-shell guidance-layout">
    <div className="guidance-copy" data-reveal><p className="eyebrow">User guidance loop</p><h2>The system responds before it reads.</h2><p>Accessibility is part of the architecture. The system evaluates the image, speaks one actionable adjustment, waits for the user, and then tries again.</p><div className="guidance-options">{guidance.map(([label, prompt], index) => <button key={label} type="button" aria-pressed={index === active} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{label}</b><small>{prompt}</small></button>)}</div></div>
    <div className="guidance-visual" data-reveal><div className="loop-ring ring-one" /><div className="loop-ring ring-two" /><div className="loop-center"><span>SPOKEN GUIDANCE</span><strong>{guidance[active][1]}</strong><div className="tiny-wave">{[9,22,13,28,16,34,11,25,14].map((h,i) => <i key={i} style={{height:h}} />)}</div></div><span className="loop-node node-user">USER<br />POSITIONS</span><span className="loop-node node-camera">CAMERA<br />EVALUATES</span><span className="loop-node node-adjust">USER<br />ADJUSTS</span><span className="loop-node node-read">READING<br />BEGINS</span></div>
  </div></section>;
}
