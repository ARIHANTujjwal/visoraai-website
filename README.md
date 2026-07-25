# VisoraAI website

A Next.js App Router website for VisoraAI, an independent assistive computer-vision project that turns printed text into spoken output and guides users toward a clearer image.

## Stack

- Next.js and TypeScript
- Tailwind CSS
- GSAP with ScrollTrigger
- Lenis smooth scrolling
- Local Instrument Sans, Atkinson Hyperlegible, and IBM Plex Mono font packages

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run build
```

Legacy `.html` URLs are handled through permanent redirects in `next.config.ts`.
