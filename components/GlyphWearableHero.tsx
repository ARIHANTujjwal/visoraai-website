"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandSymbol } from "./BrandLogo";
import { pipelineStages } from "../data/system";

const GlyphWearableScene = dynamic(() => import("./GlyphWearableScene"), {
  ssr: false,
  loading: () => <GlyphWearableFallback />,
});

const stageCopy = {
  Capture: "The camera acquires a live frame while the glyph field locks into a stable wearable system.",
  Detect: "Blue boundaries identify the printed page and locate its corners inside the frame.",
  Isolate: "The system crops toward the primary text region and removes unrelated visual information.",
  Enhance: "Contrast is normalized, text edges sharpen, and glare is reduced without inventing detail.",
  Stack: "A short burst contributes several imperfect views that combine into one stronger candidate.",
  Recognize: "Image features dissolve into OCR characters, uncertain marks, and readable language.",
  Validate: "Custom and fallback candidates are compared before a result is retained for speech.",
  Speak: "The selected sentence separates from the character field and becomes an audio waveform.",
  Guide: "Capture signals return as one actionable instruction, preparing the next reading attempt.",
} as const;

const stages = [
  {
    label: "Fragments",
    title: "Visual information begins as fragments.",
    body: "One image then travels through a continuous reading loop.",
    id: "capture",
    state: "unstructured input",
    intro: true,
  },
  ...pipelineStages.map((stage) => ({
    ...stage,
    title: stage.detail,
    body: stageCopy[stage.label],
    intro: false,
  })),
];

const sceneStops = [0, 1.85, 3.75, 4.08, 4.34, 4.58, 5.5, 6.38, 7.2, 8];

function GlyphWearableFallback() {
  return <svg className="glyph-wearable-fallback" viewBox="0 0 760 440" role="img" aria-label="Static glyph-based concept visualization of the VisoraAI glasses">
    <defs>
      <pattern id="glyph-pattern" width="25" height="19" patternUnits="userSpaceOnUse">
        <text x="1" y="14">OCR:94</text>
      </pattern>
      <pattern id="glyph-pattern-accent" width="19" height="18" patternUnits="userSpaceOnUse">
        <text x="1" y="13">[]+A</text>
      </pattern>
    </defs>
    <g fill="none" stroke="url(#glyph-pattern)" strokeWidth="18">
      <rect x="104" y="132" width="224" height="145" rx="52" />
      <rect x="432" y="132" width="224" height="145" rx="52" />
      <path d="M326 177Q380 146 434 177M104 158L34 94M655 158L726 96" />
    </g>
    <rect x="621" y="139" width="45" height="39" rx="8" fill="url(#glyph-pattern-accent)" />
    <path d="M34 94L5 48M726 96L755 50" stroke="url(#glyph-pattern)" strokeWidth="14" />
  </svg>;
}

function SceneCallout({ active }: { active: number }) {
  return <div className={`glyph-scene-callout glyph-callout-${active}`} aria-hidden="true">
    {active === 1 && <div className="glyph-capture-frame"><span>CAMERA INPUT</span><b>live frame</b><i /><i /><i /><i /></div>}
    {active === 2 && <div className="glyph-readout"><span>x: 184</span><span>y: 092</span><span>page: found</span><span>corners: 04</span><small>CONCEPT VALUES</small></div>}
    {active === 3 && <div className="glyph-isolate-frame"><span>PRIMARY TEXT REGION</span><i /><i /><i /><i /></div>}
    {active === 4 && <div className="glyph-enhance-readout"><span>BLUR</span><del>47</del><strong>12</strong><span>GLARE</span><del>high</del><strong>low</strong></div>}
    {active === 5 && <div className="glyph-stack-frames"><i>01</i><i>02</i><i>03</i><strong>MEDIAN CANDIDATE</strong></div>}
    {active === 6 && <div className="glyph-resolution"><del>Pr1nted texl</del><i>→</i><strong>Printed text</strong></div>}
    {active === 7 && <div className="glyph-confidence"><span>0.71</span><span>0.86</span><strong>0.94 / selected</strong></div>}
    {active === 8 && <div className="glyph-speech-label"><span>PRINTED TEXT</span><i>→</i><strong>SPOKEN OUTPUT</strong></div>}
    {active === 9 && <><div className="glyph-system-path"><span>PAGE</span><i>→</i><span>CAMERA</span><i>→</i><span>RECOGNITION</span><i>→</i><span>SPEECH</span></div><div className="glyph-guidance-state"><span>GUIDANCE</span><strong>Ready to read</strong></div></>}
  </div>;
}

export function GlyphWearableHero() {
  const root = useRef<HTMLElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const assembly = useRef(0);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [density, setDensity] = useState(12000);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const isMobile = mobileQuery.matches;
      const reduceMotion = motionQuery.matches || document.documentElement.dataset.motion === "reduced";
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;
      setMobile(isMobile);
      setReduced(reduceMotion);
      setDensity(isMobile ? (memory <= 4 ? 2200 : 3200) : window.innerWidth < 1100 ? 6800 : memory <= 4 ? 8200 : 12000);
    };
    const observer = new MutationObserver(update);
    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const canvas = document.createElement("canvas");
        setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
      } catch { setWebgl(false); }
    });
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "180px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    assembly.current = reduced || mobile ? 1 : 0.1;
  }, [mobile, reduced]);

  useEffect(() => {
    if (!root.current || !story.current) return;
    gsap.registerPlugin(ScrollTrigger);
    if (mobile || reduced) {
      progress.current = 8;
      queueMicrotask(() => setActive(9));
      return;
    }
    const stageTriggers = stageRefs.current.flatMap((element, index) => element ? [ScrollTrigger.create({
      trigger: element,
      start: "top 46%",
      end: "bottom 54%",
      onEnter: () => setActive(index),
      onEnterBack: () => setActive(index),
    })] : []);
    const progressTrigger = ScrollTrigger.create({
      trigger: story.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      onUpdate: (self) => {
        const storyProgress = self.progress * 9;
        const lower = Math.min(8, Math.floor(storyProgress));
        const mix = storyProgress - lower;
        progress.current = gsap.utils.interpolate(sceneStops[lower], sceneStops[lower + 1], mix);
        assembly.current = gsap.utils.clamp(0.1, 1, 0.1 + storyProgress * 2);
      },
    });
    ScrollTrigger.refresh();
    return () => { progressTrigger.kill(); stageTriggers.forEach((trigger) => trigger.kill()); };
  }, [mobile, reduced]);

  useEffect(() => {
    if (!root.current || reduced) return;
    const context = gsap.context(() => {
      gsap.fromTo(".glyph-intro-inner > *", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, delay: 0.35, ease: "power2.out" });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return <section ref={root} className={`glyph-hero ${reduced ? "is-reduced" : ""}`} id="overview">
    <div ref={story} className="glyph-story section-shell">
      <div className="glyph-stage-copy">
        {stages.map((stage, index) => <article
          ref={(element) => { stageRefs.current[index] = element; }}
          className={`glyph-story-stage ${stage.intro ? "glyph-intro" : ""} ${active === index ? "is-active" : ""}`}
          key={stage.label}
          aria-current={active === index && !mobile ? "step" : undefined}
        >
          {stage.intro ? <div className="glyph-intro-inner">
            <BrandSymbol className="glyph-brand-anchor" accent label="VisoraAI VA symbol" />
            <p className="eyebrow"><span /> Assistive computer vision</p>
            <h1>Printed text,<br /><em>made audible.</em></h1>
            <p className="glyph-hero-lede">VisoraAI detects printed pages, recognizes their text, and reads the result aloud while guiding the user toward a clearer image.</p>
            <div className="button-row"><Link className="button button-dark" href="/system">Explore the system <span>↗</span></Link><Link className="button button-quiet" href="/research">View the research <span>↗</span></Link></div>
            <div className="glyph-stage-note"><span>ONE IMAGE / CONTINUOUS LOOP</span><strong>{stage.title}</strong><small>{stage.body}</small></div>
          </div> : <div>
            <span className="glyph-stage-number">{String(index).padStart(2, "0")} / {stage.label}</span>
            <h2>{stage.title}</h2>
            <p>{stage.body}</p>
            <div className="glyph-stage-tech"><span>STATE / {stage.state}</span><Link href={`/system/${stage.id}`}>Open technical details <b>↗</b></Link></div>
          </div>}
        </article>)}
      </div>

      <div className="glyph-scene-column" aria-hidden="true">
        <div className="glyph-scene-sticky">
          <div className="glyph-scene-frame" data-glyph-density={density} data-render-mode={webgl ? "webgl-glyph-points" : "svg-fallback"}>
            <div className="glyph-scene-meta"><span>VISORAAI / CONCEPT PROTOTYPE</span><b>OCR GLYPH FIELD</b></div>
            {webgl ? <GlyphWearableScene assembly={assembly} density={density} mobile={mobile} progress={progress} reduced={reduced} visible={visible} /> : <GlyphWearableFallback />}
            <SceneCallout active={active} />
            <div className="glyph-scene-footer"><span>{active === 0 ? "INPUT / FRAGMENTS" : `${String(active).padStart(2, "0")} / 09`}</span><i><b style={{ width: `${(active / 9) * 100}%` }} /></i><span>{stages[active].label}</span></div>
          </div>
          <p className="glyph-concept-label">Concept visualization—not a final manufactured product.</p>
        </div>
      </div>
    </div>

    <div className="glyph-mobile-flow section-shell" aria-hidden="true">
      <div><span>PAGE</span><i className="glyph-mini-page">TXT<br />A8<br />94</i></div><b>→</b>
      <div><span>TEXT</span><i className="glyph-mini-text">Printed<br />text</i></div><b>→</b>
      <div><span>SPEECH</span><i className="glyph-mini-wave">▂▅▃▇▄▆▂</i></div>
    </div>

    <p className="sr-only">Conceptual VisoraAI glasses formed from OCR characters. As the sequence progresses, a printed page is captured, its text is detected and recognized, and the resulting words become an audio waveform.</p>
  </section>;
}
