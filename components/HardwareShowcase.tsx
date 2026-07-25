"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const hardwareStages = [
  ["Input", "A printed page enters the camera field of view.", "Printed page"],
  ["Camera", "The camera module captures a live document image.", "Captures the live document image"],
  ["Connection", "A direct connection transfers image frames to the edge computer.", "Transfers image frames for local processing"],
  ["Edge processing", "The Raspberry Pi runs the vision pipeline locally.", "Detect → Enhance → Stack → Recognize"],
  ["OCR", "Image evidence becomes a readable character sequence.", "Converts the page into readable text"],
  ["Decision", "Custom OCR and Tesseract candidates pass through concise validation checks.", "Selects the most readable output"],
  ["Audio", "Approved text becomes an audio waveform for spoken output.", "Reads the result aloud"],
  ["Complete system", "Every verified component aligns into one continuous page-to-speech path.", "One device. One continuous path from page to speech."],
] as const;

const componentDetails = [
  { id: "page", name: "Printed-page input", role: "Provides the source document the system is trying to make accessible.", input: "Printed information", output: "Visible page content" },
  { id: "camera", name: "Camera module", role: "Captures the live page image and supplies frames to the vision pipeline.", input: "Printed page", output: "Image frames" },
  { id: "pi", name: "Raspberry Pi edge computer", role: "Coordinates local detection, enhancement, OCR, validation, and speech services.", input: "Camera frames", output: "Recognized and validated text" },
  { id: "audio", name: "Audio output", role: "Turns accepted text and capture guidance into audible output.", input: "Final text", output: "Spoken reading and guidance" },
] as const;

type ComponentId = (typeof componentDetails)[number]["id"];
type Pose = Record<ComponentId | "power", { x: number; y: number; rotation: number; opacity: number }>;

const poses: Pose[] = [
  { page:{x:-28,y:8,rotation:-7,opacity:1},camera:{x:44,y:-8,rotation:4,opacity:.65},pi:{x:112,y:32,rotation:3,opacity:.22},audio:{x:124,y:48,rotation:2,opacity:.16},power:{x:80,y:70,rotation:0,opacity:.12} },
  { page:{x:-12,y:4,rotation:-4,opacity:.75},camera:{x:0,y:0,rotation:0,opacity:1},pi:{x:92,y:25,rotation:2,opacity:.28},audio:{x:118,y:45,rotation:2,opacity:.16},power:{x:74,y:65,rotation:0,opacity:.12} },
  { page:{x:-15,y:4,rotation:-4,opacity:.45},camera:{x:-16,y:-4,rotation:-2,opacity:1},pi:{x:34,y:8,rotation:1,opacity:1},audio:{x:94,y:38,rotation:1,opacity:.2},power:{x:52,y:55,rotation:0,opacity:.16} },
  { page:{x:-20,y:4,rotation:-3,opacity:.28},camera:{x:-36,y:-8,rotation:-3,opacity:.6},pi:{x:0,y:0,rotation:0,opacity:1},audio:{x:80,y:30,rotation:1,opacity:.25},power:{x:34,y:42,rotation:0,opacity:.3} },
  { page:{x:-18,y:4,rotation:-3,opacity:.34},camera:{x:-28,y:-5,rotation:-2,opacity:.58},pi:{x:-2,y:0,rotation:0,opacity:1},audio:{x:70,y:24,rotation:1,opacity:.22},power:{x:30,y:40,rotation:0,opacity:.25} },
  { page:{x:-12,y:2,rotation:-2,opacity:.28},camera:{x:-22,y:-3,rotation:-2,opacity:.45},pi:{x:-5,y:0,rotation:0,opacity:1},audio:{x:58,y:20,rotation:1,opacity:.25},power:{x:26,y:34,rotation:0,opacity:.25} },
  { page:{x:-8,y:0,rotation:-2,opacity:.2},camera:{x:-18,y:-2,rotation:-1,opacity:.36},pi:{x:-12,y:0,rotation:0,opacity:.56},audio:{x:0,y:0,rotation:0,opacity:1},power:{x:14,y:20,rotation:0,opacity:.35} },
  { page:{x:0,y:0,rotation:-2,opacity:.9},camera:{x:0,y:0,rotation:0,opacity:1},pi:{x:0,y:0,rotation:0,opacity:1},audio:{x:0,y:0,rotation:0,opacity:1},power:{x:0,y:0,rotation:0,opacity:1} },
];

const technologyLinks = [
  ["Raspberry Pi", "/system"],
  ["Computer Vision", "/system/detection"],
  ["Python", "/development"],
  ["OpenCV", "/system/enhancement"],
  ["CRNN-CTC", "/system/ocr"],
  ["Tesseract", "/system/ocr"],
  ["Burst Stacking", "/system/burst-stacking"],
  ["Text to Speech", "/system/speech"],
] as const;

function HardwarePart({ id, label, interactive, selected, onSelect, children }: {
  id: ComponentId;
  label: string;
  interactive: boolean;
  selected: boolean;
  onSelect?: (id: ComponentId) => void;
  children: React.ReactNode;
}) {
  const className = `hw-part hw-${id} ${selected ? "is-selected" : ""}`;
  if (!interactive) return <div className={className} data-part={id} aria-hidden="true">{children}</div>;
  return <button className={className} data-part={id} type="button" aria-label={`Inspect ${label}`} aria-pressed={selected} onClick={() => onSelect?.(id)}>{children}</button>;
}

function HardwareScene({ stage, compact = false, sceneRef, selected, onSelect, onClose }: {
  stage: number;
  compact?: boolean;
  sceneRef?: Ref<HTMLDivElement>;
  selected: ComponentId | null;
  onSelect?: (id: ComponentId) => void;
  onClose?: () => void;
}) {
  const detail = componentDetails.find((item) => item.id === selected);
  const interactive = !compact;
  const visible = (index: number) => stage === index || stage === 7;
  return <div ref={sceneRef} className={`hardware-scene hw-stage-${stage} ${compact ? "is-compact" : ""}`} role={compact ? "img" : "group"} aria-label={`Hardware assembly stage ${stage + 1}: ${hardwareStages[stage][0]}`}>
    <span className="hw-outline-label" aria-hidden="true">HARDWARE</span>
    <div className="hw-scene-status"><span>ASSEMBLY / {String(stage + 1).padStart(2, "0")}</span><b>{hardwareStages[stage][0]}</b></div>
    <svg className="hw-signal-map" viewBox="0 0 1000 620" aria-hidden="true">
      <path className="hw-camera-link" d="M330 255 C390 250 420 292 486 300" />
      <path className="hw-audio-link" d="M626 335 C690 345 720 338 778 318" />
      <path className="hw-power-link" d="M556 445 L556 505" />
    </svg>
    <HardwarePart id="page" label="printed-page input" interactive={interactive} selected={selected === "page"} onSelect={onSelect}>
      <span className="hw-page-sheet"><i /><i /><i /><i /><i /></span><span className="hw-page-bounds"><i /><i /><i /><i /></span>
      <span className="hw-part-name">PRINTED PAGE</span>
    </HardwarePart>
    <div className="hw-viewfinder" aria-hidden="true"><i /><i /><i /><i /><span>PAGE BOUNDARY</span></div>
    <div className="hw-light-path" aria-hidden="true"><i /><i /><i /></div>
    <HardwarePart id="camera" label="camera module" interactive={interactive} selected={selected === "camera"} onSelect={onSelect}>
      <span className="hw-camera-body"><i className="hw-lens-ring"><b /></i><i className="hw-camera-port" /></span><span className="hw-part-name">CAMERA MODULE</span>
    </HardwarePart>
    <div className="hw-ribbon" data-part="connection" aria-hidden="true"><i /><i /></div>
    <HardwarePart id="pi" label="Raspberry Pi edge computer" interactive={interactive} selected={selected === "pi"} onSelect={onSelect}>
      <span className="hw-board"><i className="hw-chip">V</i><i /><i /><i /><b className="hw-port" /><b className="hw-port" /></span><span className="hw-part-name">RASPBERRY PI</span>
    </HardwarePart>
    <HardwarePart id="audio" label="audio output" interactive={interactive} selected={selected === "audio"} onSelect={onSelect}>
      <span className="hw-speaker"><i /><i /><i /></span><span className="hw-part-name">AUDIO OUTPUT</span>
    </HardwarePart>
    <div className="hw-part hw-power" data-part="power" aria-hidden="true"><span className="hw-power-plug"><i /><i /></span><span className="hw-part-name">POWER INPUT</span></div>
    <div className="hw-process-path" aria-hidden="true"><span>DETECT</span><i /><span>ENHANCE</span><i /><span>STACK</span><i /><span>RECOGNIZE</span></div>
    <div className="hw-ocr-preview" aria-hidden="true"><span>RAW IMAGE</span><i>→</i><span>PROCESSED</span><i>→</i><strong>READABLE TEXT</strong></div>
    <div className="hw-decision" aria-hidden="true"><span>CUSTOM OCR <b>candidate</b></span><span>TESSERACT <b>fallback</b></span><strong>SELECTED OUTPUT ✓</strong></div>
    <div className="hw-wave" aria-hidden="true">{[9,24,13,36,17,28,10,32,16,39,12,26].map((height, index) => <i key={index} style={{ height }} />)}</div>
    <div className={`hw-annotation hw-ann-page ${visible(0) ? "is-visible" : ""}`}><span>PRINTED PAGE</span><b>Input source</b><small>IN / Print · OUT / Visible content</small></div>
    <div className={`hw-annotation hw-ann-camera ${visible(1) ? "is-visible" : ""}`}><span>CAMERA MODULE</span><b>Live image capture</b><small>IN / Page · OUT / Image frames</small></div>
    <div className={`hw-annotation hw-ann-connection ${visible(2) ? "is-visible" : ""}`}><span>CAMERA CONNECTION</span><b>Frame transfer</b><small>IN / Frames · OUT / Local stream</small></div>
    <div className={`hw-annotation hw-ann-pi ${visible(3) ? "is-visible" : ""}`}><span>RASPBERRY PI</span><b>Local edge processing</b><small>IN / Frames · OUT / Candidate text</small></div>
    <div className={`hw-annotation hw-ann-audio ${visible(6) ? "is-visible" : ""}`}><span>AUDIO OUTPUT</span><b>Speech and guidance</b><small>IN / Final text · OUT / Spoken audio</small></div>
    <div className={`hw-annotation hw-ann-power ${stage === 7 ? "is-visible" : ""}`}><span>POWER INPUT</span><b>External system power</b><small>IN / Power · OUT / Device operation</small></div>
    <p className="hw-final-caption">One device. One continuous path from page to speech.</p>
    {interactive && detail && <aside className="hw-inline-panel" aria-live="polite">
      <button type="button" onClick={onClose} aria-label="Close component details">×</button><span>COMPONENT DETAIL</span><h3>{detail.name}</h3><p>{detail.role}</p><dl><div><dt>Input</dt><dd>{detail.input}</dd></div><div><dt>Output</dt><dd>{detail.output}</dd></div></dl>
    </aside>}
  </div>;
}

export function HardwareShowcase() {
  const root = useRef<HTMLElement>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches || document.documentElement.dataset.motion === "reduced");
    const observer = new MutationObserver(update);
    update();
    query.addEventListener("change", update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { query.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (reduced) {
      queueMicrotask(() => setActive(7));
      if (scene.current) (Object.keys(poses[7]) as (keyof Pose)[]).forEach((id) => {
        const target = scene.current?.querySelector(`[data-part="${id}"]`);
        if (target) gsap.set(target, poses[7][id]);
      });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      if (!sequence.current || !pin.current) return;
      const pinned = ScrollTrigger.create({ trigger: sequence.current, start: "top 94px", end: "bottom bottom", pin: pin.current, pinSpacing: false, anticipatePin: 1 });
      const triggers = steps.current.flatMap((element, index) => element ? [ScrollTrigger.create({ trigger: element, start: "top 55%", end: "bottom 45%", onEnter: () => setActive(index), onEnterBack: () => setActive(index) })] : []);
      ScrollTrigger.refresh();
      return () => { pinned.kill(); triggers.forEach((trigger) => trigger.kill()); };
    });
    return () => media.revert();
  }, [reduced]);

  useEffect(() => {
    if (!scene.current || reduced) return;
    const pose = poses[active];
    (Object.keys(pose) as (keyof Pose)[]).forEach((id) => {
      const target = scene.current?.querySelector(`[data-part="${id}"]`);
      if (target) gsap.to(target, { ...pose[id], duration: .9, ease: "power3.inOut", overwrite: true });
    });
    const annotations = scene.current.querySelectorAll(".hw-annotation");
    const visibleAnnotations = scene.current.querySelectorAll(".hw-annotation.is-visible");
    if (annotations.length) gsap.set(annotations, { y: 0, opacity: 0 });
    if (visibleAnnotations.length) gsap.fromTo(visibleAnnotations, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .06, ease: "power2.out" });
  }, [active, reduced]);

  const selectedDetail = componentDetails.find((item) => item.id === selected);
  return <section ref={root} className={`hardware-showcase ${reduced ? "is-reduced" : ""}`} id="hardware">
    <div className="hardware-heading section-shell">
      <p className="eyebrow eyebrow-light">Physical system</p><h2>The hardware behind<br />the reading loop.</h2><p>Camera input, local processing, and spoken output work together as one portable assistive system.</p>
    </div>
    <div ref={sequence} className="hardware-sequence section-shell">
      <div className="hardware-stage-column"><div ref={pin} className="hardware-pin"><HardwareScene stage={active} sceneRef={scene} selected={selected} onSelect={setSelected} onClose={() => setSelected(null)} /></div></div>
      <div className="hardware-steps">
        {hardwareStages.map(([title, body, label], index) => <article key={title} ref={(element) => { steps.current[index] = element; }} className={`hardware-step ${active === index ? "is-active" : ""}`} aria-current={active === index ? "step" : undefined}>
          <span>{String(index + 1).padStart(2, "0")}</span><div><small>STAGE</small><h3>{title}</h3><p>{body}</p><b>{label}</b></div>
        </article>)}
      </div>
    </div>
    {reduced && <div className="hardware-reduced-mobile section-shell"><HardwareScene stage={7} compact selected={null} /></div>}
    <div className="hardware-mobile section-shell">
      {hardwareStages.map(([title, body, label], index) => <article className="hardware-mobile-stage" key={`${title}-mobile`}>
        <header><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{body}</p><b>{label}</b></div></header><HardwareScene stage={index} compact selected={null} />
      </article>)}
    </div>
    <div className="hardware-component-console section-shell">
      <div><p className="eyebrow eyebrow-light">Inspect the completed system</p><h3>Select a verified component.</h3></div>
      <div className="hardware-component-index">{componentDetails.map((item) => <button key={item.id} type="button" className={selected === item.id ? "is-selected" : ""} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span>{item.name}</span><i>↗</i></button>)}</div>
      {selectedDetail && <aside className="hardware-component-panel" aria-live="polite"><button type="button" onClick={() => setSelected(null)} aria-label="Close component details">×</button><span>COMPONENT DETAIL</span><h3>{selectedDetail.name}</h3><p>{selectedDetail.role}</p><dl><div><dt>Input</dt><dd>{selectedDetail.input}</dd></div><div><dt>Output</dt><dd>{selectedDetail.output}</dd></div></dl></aside>}
    </div>
  </section>;
}

export function BuiltWithClosing() {
  return <section className="built-with-section" aria-labelledby="built-with-title">
    <h2 id="built-with-title">This system was built with…</h2>
    <nav className="built-with-row" aria-label="Technologies used in VisoraAI">{technologyLinks.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
  </section>;
}
