"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function MedianOperation({ depth }: { depth: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced") return;
    const block = root.current.querySelector(".median-block");
    const detail = root.current.querySelector(".median-pixel-detail");
    const pulse = gsap.fromTo(block, { scale: .94 }, { scale: 1, duration: .42, ease: "power2.out" });
    const reveal = gsap.fromTo(detail, { opacity: .8 }, { opacity: .12, duration: .7, ease: "power2.out" });
    return () => { pulse.kill(); reveal.kill(); };
  }, [depth]);

  return <div className="median-operation" ref={root} tabIndex={0} aria-describedby="median-operation-explanation">
    <i className="median-flow-line median-flow-in" aria-hidden="true" />
    <div className="median-block" aria-hidden="true">
      <div className="median-pixel-detail">{Array.from({ length: 16 }, (_, index) => <i key={index} />)}</div>
      <div className="median-layer-stack">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div>
    </div>
    <strong>PER-PIXEL<br />MEDIAN</strong>
    <p id="median-operation-explanation">For each pixel location, the middle value across the selected frames is retained.</p>
    <i className="median-flow-line median-flow-out" aria-hidden="true" />
  </div>;
}

