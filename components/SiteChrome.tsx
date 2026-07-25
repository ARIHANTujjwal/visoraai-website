"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";

const nav = [
  ["Overview", "/#overview"], ["System", "/system"], ["Research", "/research"],
  ["Accessibility", "/accessibility"], ["Development", "/development"], ["About", "/about"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 18);
      const layers = document.elementsFromPoint(Math.min(window.innerWidth / 2, 500), 86);
      const surface = layers.find((element) => !element.closest(".site-header") && !element.closest(".display-launcher"));
      let node: Element | null = surface || document.body;
      let color = "rgb(244, 241, 234)";
      while (node) {
        const value = getComputedStyle(node).backgroundColor;
        if (!value.endsWith(", 0)") && value !== "transparent" && value !== "rgba(0, 0, 0, 0)") { color = value; break; }
        node = node.parentElement;
      }
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [244, 241, 234];
      setTheme(channels[0] * .299 + channels[1] * .587 + channels[2] * .114 < 128 ? "dark" : "light");
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} data-theme={theme}>
      <nav className="nav-shell" aria-label="Main navigation">
        <Link href="/" className="wordmark" aria-label="VisoraAI home">
          <BrandLogo tone={theme === "dark" ? "light" : "dark"} eager />
        </Link>
        <div className="desktop-nav">
          {nav.map(([label, href]) => <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </div>
        <div className="nav-actions">
          <Link className="nav-github" href="https://github.com/ARIHANTujjwal/VisoraAI" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></Link>
          <Link className="nav-primary" href="/system">Explore the system</Link>
        </div>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>
          <span /><span />
        </button>
      </nav>
      <div id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {nav.map(([label, href], index) => <Link key={label} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link>)}
        <Link href="https://github.com/ARIHANTujjwal/VisoraAI" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>GitHub <span>↗</span></Link>
      </div>
    </header>
  </>;
}

type Prefs = { contrast: boolean; large: boolean; motion: boolean };
const defaultPrefs: Prefs = { contrast: false, large: false, motion: false };

export function DisplaySettings() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try { setPrefs({ ...defaultPrefs, ...JSON.parse(localStorage.getItem("visora-display") || "{}") }); } catch { /* keep defaults */ }
    });
  }, []);
  useEffect(() => {
    document.documentElement.dataset.contrast = prefs.contrast ? "high" : "standard";
    document.documentElement.dataset.text = prefs.large ? "large" : "standard";
    document.documentElement.dataset.motion = prefs.motion ? "reduced" : "standard";
    localStorage.setItem("visora-display", JSON.stringify(prefs));
  }, [prefs]);
  useEffect(() => {
    if (open) close.current?.focus();
    else opener.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const dialog = close.current?.closest(".settings-dialog");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute("disabled"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return <>
    <button ref={opener} className="display-launcher" onClick={() => setOpen(true)} type="button" aria-haspopup="dialog" aria-label="Open display settings">
      <span aria-hidden="true">Aa</span><b>Display</b>
    </button>
    {open && <div className="settings-wrap" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="settings-head"><div><p className="eyebrow">Accessibility</p><h2 id="settings-title">Display settings</h2></div><button ref={close} onClick={() => setOpen(false)} type="button" aria-label="Close display settings">×</button></div>
        <p>Choose a viewing mode. Preferences are stored only in this browser.</p>
        {([
          ["contrast", "Increased contrast", "Strengthen surface and text contrast."],
          ["large", "Larger body text", "Increase paragraph and interface text."],
          ["motion", "Reduced motion", "Remove smooth scrolling and complex movement."]
        ] as const).map(([key, label, description]) => <button key={key} className="setting-row" type="button" aria-pressed={prefs[key]} onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}>
          <span><strong>{label}</strong><small>{description}</small></span><i aria-hidden="true"><b /></i>
        </button>)}
      </section>
    </div>}
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-lead"><Link href="/" className="wordmark" aria-label="VisoraAI home"><BrandLogo tone="light" /></Link><div><p>Independent assistive computer vision for making printed text audible.</p><strong>Make the page readable.<br />Then make it heard.</strong></div></div>
    <div className="footer-links">
      <div><strong>Explore</strong><Link href="/system">System</Link><Link href="/research">Research</Link><Link href="/development">Development</Link></div>
      <div><strong>Project</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/accessibility">Accessibility</Link></div>
      <div><strong>Code</strong><Link href="https://github.com/ARIHANTujjwal/VisoraAI" target="_blank" rel="noreferrer">GitHub ↗</Link></div>
    </div>
    <div className="footer-base"><span>© {new Date().getFullYear()} VisoraAI</span><span>Independently developed.</span></div>
  </footer>;
}
