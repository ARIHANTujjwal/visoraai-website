"use client";

import { useState } from "react";
import { BurstInputFrames } from "./burst-stack/BurstInputFrames";
import { MedianOperation } from "./burst-stack/MedianOperation";
import { BurstResultPreview } from "./burst-stack/BurstResultPreview";
import { BurstStackIntroVisual } from "./burst-stack/BurstStackIntroVisual";
import { burstDepthStops } from "./burst-stack/data";

function depthGuidance(depth: number) {
  if (depth === 1) return "Insufficient temporal information.";
  if (depth === 2) return "More evidence, with low processing cost.";
  if (depth <= 5) return "Balanced demonstration depth.";
  return "More frames increase processing and alignment cost.";
}

export function BurstStackDemo() {
  const [depth, setDepth] = useState(3);
  return <section className="feature-section burst-feature" id="burst-stacking">
    <p className="sr-only">Several simulated captures of the same page contain different blur, glare, and alignment defects. Median stacking combines corresponding pixel values to create a more stable candidate image.</p>
    <div className="burst-intro section-shell">
      <BurstStackIntroVisual />
      <div className="burst-intro-heading" data-reveal><h2>A clearer image can exist across several imperfect frames.</h2></div>
      <div className="burst-intro-copy" data-reveal><p className="eyebrow eyebrow-light">Median burst stacking</p><p>A short burst captures slightly different blur, glare, and alignment. Median stacking can suppress temporary variation, but more frames also mean more processing and possible alignment error.</p></div>
    </div>
    <div className="burst-story-bridge section-shell" aria-hidden="true"><span>CONCEPT</span><i /><b>CONTROL</b></div>
    <div className="burst-workbench-v2 section-shell" data-reveal>
      <BurstInputFrames depth={depth} />
      <MedianOperation depth={depth} />
      <BurstResultPreview depth={depth} />
      <div className="depth-control-v2">
        <label htmlFor="stack-depth">Stack depth <b>{String(depth).padStart(2, "0")}</b></label>
        <div className="depth-range-wrap"><input id="stack-depth" type="range" min="1" max="8" step="1" value={depth} aria-valuetext={`${depth} simulated input frames selected`} onChange={(event) => setDepth(Number(event.target.value))} list="burst-depth-stops" /><datalist id="burst-depth-stops">{burstDepthStops.map((stop) => <option value={stop} key={stop} />)}</datalist><div className="depth-ticks" aria-hidden="true">{burstDepthStops.map((stop) => <span key={stop}>{String(stop).padStart(2, "0")}</span>)}</div></div>
        <p aria-live="polite">{depthGuidance(depth)}</p>
      </div>
    </div>
  </section>;
}

