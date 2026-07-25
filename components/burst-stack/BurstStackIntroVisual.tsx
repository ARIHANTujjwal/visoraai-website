"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BurstFramePreview } from "./BurstFramePreview";
import { burstDemoFrames } from "./data";

export function BurstStackIntroVisual() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let context: gsap.Context | undefined;

    const configure = () => {
      context?.revert();
      context = undefined;
      const reduced = preference.matches || document.documentElement.dataset.motion === "reduced";
      if (reduced || window.innerWidth < 768 || !root.current) return;
      context = gsap.context(() => {
        const frames = gsap.utils.toArray<HTMLElement>(".burst-intro-frame");
        const offsets = [
          { x: -72, y: 18, rotation: -5 },
          { x: -38, y: -18, rotation: -2.5 },
          { x: 0, y: 10, rotation: 0 },
          { x: 38, y: -12, rotation: 2.5 },
          { x: 72, y: 20, rotation: 5 },
        ];
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 78%", end: "bottom 38%", scrub: .7 },
        });
        frames.forEach((frame, index) => timeline.fromTo(frame, offsets[index], { x: 0, y: 0, rotation: 0, ease: "none" }, 0));
        timeline.to(".burst-intro-annotation", { opacity: .18, ease: "none" }, .54)
          .to(frames, { opacity: .12, scale: .965, ease: "none" }, .65)
          .fromTo(".burst-intro-result", { opacity: 0, scale: .965 }, { opacity: 1, scale: 1, ease: "none" }, .66)
          .fromTo(".burst-intro-median", { opacity: 0, y: 8 }, { opacity: 1, y: 0, ease: "none" }, .58)
          .fromTo(".burst-intro-route i", { scaleY: 0 }, { scaleY: 1, ease: "none" }, .72);
      }, root);
    };

    const observer = new MutationObserver(configure);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    preference.addEventListener("change", configure);
    configure();
    return () => { observer.disconnect(); preference.removeEventListener("change", configure); context?.revert(); };
  }, []);

  return <div className="burst-intro-visual" ref={root} aria-label="Several simulated captures with different defects move into alignment and form a more stable candidate frame.">
    <div className="burst-intro-stage">
      {burstDemoFrames.slice(0, 5).map((frame, index) => <div className={`burst-intro-frame intro-frame-${index + 1}`} key={frame.id}><BurstFramePreview frame={frame} variant="intro" /><span className="burst-intro-annotation" aria-hidden="true">FRAME {String(frame.id).padStart(2, "0")} — {frame.label.toUpperCase()}</span></div>)}
      <div className="burst-intro-result"><BurstFramePreview frame={{ ...burstDemoFrames[0], id: 5, description: "a simulated stack result formed from aligned input frames" }} variant="result" /></div>
      <span className="burst-intro-depth">05 INPUT FRAMES</span>
      <span className="burst-intro-median">PER-PIXEL MEDIAN</span>
    </div>
    <div className="burst-intro-route" aria-hidden="true"><i /><span>INTERACTIVE DEMONSTRATION</span></div>
  </div>;
}
