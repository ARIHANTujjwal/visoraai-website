# VisoraAI Sui-inspired rebuild

This package replaces the previous website with a Sui-inspired static site for VisoraAI.

## Files
- `index.html` — main landing page with clickable stack map
- `stack.html` — full system stack overview
- `capture.html`, `detection.html`, `enhancement.html`, `recognition.html`, `speech.html`, `guidance.html` — detailed module pages
- `technology.html`, `research.html`, `accessibility.html`, `roadmap.html`, `contact.html` — supporting pages
- `styles.css` — full responsive design system
- `script.js` — mobile menu, display settings, scroll reveals

## Install into your repo
From your repo folder, remove old website files first if you want a clean replacement:

```bash
rm -f *.html styles.css script.js
rm -rf assets
```

Then copy this package into the repo root.

## Preview
```bash
python3 -m http.server 3000
```

Open `http://localhost:3000`.

## Push live
```bash
git add .
git commit -m "Rebuild VisoraAI website with assistive stack framework"
git push
```
