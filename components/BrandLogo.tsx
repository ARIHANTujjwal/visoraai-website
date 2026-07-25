import Image from "next/image";

type LogoTone = "dark" | "light";

export function BrandSymbol({ tone = "dark", accent = false, className = "", label }: { tone?: LogoTone; accent?: boolean; className?: string; label?: string }) {
  return <svg className={`brand-symbol ${className}`} viewBox="0 0 100 64" role={label ? "img" : undefined} aria-hidden={label ? undefined : true} aria-label={label}>
    {label && <title>{label}</title>}
    <path d="M4 4H19L35 49L55 4H70L43 62H28Z" fill={tone === "light" ? "#faf8f3" : "#0b0b0f"} />
    <path d="M73 8L97 62H81L67 30Z" fill={accent ? "#6547e8" : tone === "light" ? "#faf8f3" : "#0b0b0f"} />
  </svg>;
}

export function BrandLogo({ tone = "dark", className = "", showSymbol = true, eager = false }: { tone?: LogoTone; className?: string; showSymbol?: boolean; eager?: boolean }) {
  return <span className={`brand-logo ${className}`} aria-hidden="true">
    {showSymbol && <Image className="brand-logo-symbol" src={`/brand/visoraai-symbol${tone === "light" ? "-light" : ""}.svg`} width={100} height={64} loading={eager ? "eager" : "lazy"} unoptimized alt="" />}
    <Image className="brand-logo-wordmark" src={`/brand/visoraai-wordmark${tone === "light" ? "-light" : ""}.svg`} width={1091} height={147} loading={eager ? "eager" : "lazy"} unoptimized alt="" />
  </span>;
}
