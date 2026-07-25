"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionProvider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    const configure = () => {
      stop();
      stop = () => {};
      const reduced = media.matches || document.documentElement.dataset.motion === "reduced";
      if (reduced) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        gsap.set("[data-reveal]", { clearProps: "all" });
        gsap.set("[data-line-reveal]", { clearProps: "all" });
        return;
      }

      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      const update = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(element, { y: 34, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true }
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-line-reveal]").forEach((element) => {
          gsap.fromTo(element, { clipPath: "inset(0 100% 0 0)" }, {
            clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut",
            scrollTrigger: { trigger: element, start: "top 82%", once: true }
          });
        });
      });
      stop = () => {
        ctx.revert();
        lenis.destroy();
        gsap.ticker.remove(update);
      };
    };

    const observer = new MutationObserver(configure);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    media.addEventListener("change", configure);
    configure();

    return () => {
      observer.disconnect();
      media.removeEventListener("change", configure);
      stop();
    };
  }, []);

  return null;
}
