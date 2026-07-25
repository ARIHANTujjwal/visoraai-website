"use client";

import { useState } from "react";

const nodes = [
  { id: "camera", group: "Perception", label: "Camera input", input: "Live frames", output: "Frame stream", method: "Camera acquisition", fail: "Unavailable or unstable feed", fallback: "Report capture state" },
  { id: "quality", group: "Perception", label: "Frame-quality analysis", input: "Frame stream", output: "Blur, glare, exposure signals", method: "Image statistics", fail: "Ambiguous threshold", fallback: "Keep sampling" },
  { id: "page", group: "Perception", label: "Page detector", input: "Candidate frame", output: "Page geometry", method: "Contours and corners", fail: "Boundary not found", fallback: "Use text-region detector" },
  { id: "region", group: "Perception", label: "Text-region detector", input: "Page or full frame", output: "Primary text crop", method: "Connected regions", fail: "Cluttered layout", fallback: "Request reframing" },
  { id: "enhance", group: "Recognition", label: "Image enhancement", input: "Text crop", output: "OCR variants", method: "Contrast, denoise, sharpen", fail: "Filter damages strokes", fallback: "Keep raw crop" },
  { id: "burst", group: "Recognition", label: "Burst collector", input: "Recent crops", output: "Aligned burst", method: "Bounded frame buffer", fail: "Motion too large", fallback: "Choose best single frame" },
  { id: "median", group: "Recognition", label: "Median stacker", input: "Aligned burst", output: "Stacked candidate", method: "Per-pixel median", fail: "Alignment error", fallback: "Discard stack" },
  { id: "custom", group: "Recognition", label: "Custom OCR", input: "OCR candidate", output: "Character sequence", method: "CRNN-CTC", fail: "Weak or implausible text", fallback: "Compare Tesseract" },
  { id: "fallback", group: "Recognition", label: "Tesseract fallback", input: "OCR candidate", output: "Alternative text", method: "Tesseract OCR", fail: "Weak alternative", fallback: "Reject result" },
  { id: "gate", group: "Decision", label: "Confidence gate", input: "OCR candidates", output: "Selected or rejected text", method: "Confidence and readability checks", fail: "No dependable candidate", fallback: "Request new capture" },
  { id: "normalize", group: "Decision", label: "Text normalization", input: "Selected text", output: "Clean reading text", method: "Whitespace and punctuation cleanup", fail: "Broken structure", fallback: "Preserve original candidate" },
  { id: "speech", group: "Interaction", label: "Speech manager", input: "Clean text", output: "Queued utterances", method: "Chunking and priority", fail: "Prompt collision", fallback: "Pause document reading" },
  { id: "audio", group: "Interaction", label: "Audio output", input: "Speech queue", output: "Spoken reading", method: "Text-to-speech", fail: "Audio unavailable", fallback: "Expose readable text" },
  { id: "guide", group: "Interaction", label: "User guidance loop", input: "Quality and rejection signals", output: "Corrective prompt", method: "Prioritized rules", fail: "Prompt not actionable", fallback: "Ask for a fresh capture" }
];

const groups = ["Perception", "Recognition", "Decision", "Interaction"];

export function ArchitectureMap() {
  const [selected, setSelected] = useState(nodes[0]);
  return <section className="architecture-section" id="architecture">
    <div className="section-shell architecture-head" data-reveal><div><p className="eyebrow">System architecture</p><h2>One reading task.<br />Multiple coordinated systems.</h2></div><p>Data moves forward toward speech. Quality and rejection signals loop back toward the user, so a weak input becomes an instruction rather than silent failure.</p></div>
    <div className="architecture-workspace section-shell" data-reveal>
      <div className="architecture-map" aria-label="Interactive VisoraAI system architecture">
        <svg className="architecture-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          <path d="M80 145 C250 145 220 145 390 145 S600 145 730 145 S850 145 940 145" />
          <path d="M195 215 C270 310 380 310 455 215" />
          <path className="feedback-path" d="M930 420 C720 535 350 535 95 300" />
        </svg>
        {groups.map((group, groupIndex) => <div className={`architecture-group group-${groupIndex}`} key={group}>
          <h3><span>0{groupIndex + 1}</span>{group}</h3>
          <div className="architecture-nodes">
            {nodes.filter((node) => node.group === group).map((node) => <button key={node.id} className={node.id === selected.id ? "is-active" : ""} onClick={() => setSelected(node)} type="button" aria-pressed={node.id === selected.id}>
              <i aria-hidden="true" /><span>{node.label}</span><b>+</b>
            </button>)}
          </div>
        </div>)}
      </div>
      <aside className="node-inspector" aria-live="polite"><p className="eyebrow">Selected node / {selected.group}</p><h3>{selected.label}</h3><dl><div><dt>Purpose</dt><dd>{selected.method}</dd></div><div><dt>Input</dt><dd>{selected.input}</dd></div><div><dt>Output</dt><dd>{selected.output}</dd></div><div><dt>Failure</dt><dd>{selected.fail}</dd></div><div><dt>Response</dt><dd>{selected.fallback}</dd></div></dl></aside>
    </div>
  </section>;
}
