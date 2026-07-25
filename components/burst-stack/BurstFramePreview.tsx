import type { BurstDemoFrame } from "./data";

type BurstFramePreviewProps = {
  frame: BurstDemoFrame;
  variant: "intro" | "input" | "result";
  position?: number;
  selected?: boolean;
};

export function BurstFramePreview({ frame, variant, position = 0, selected = true }: BurstFramePreviewProps) {
  const index = String(frame.id).padStart(2, "0");
  return <div
    className={`burst-document burst-document-${variant} defect-${frame.defect} burst-position-${position} ${selected ? "is-selected" : ""}`}
    role="img"
    aria-label={`Frame ${index}: ${frame.description}. Concept demonstration.`}
    data-burst-input={variant === "input" ? "" : undefined}
  >
    <div className="burst-document-meta" aria-hidden="true"><span>{index}</span><b>{variant === "result" ? "STACK RESULT" : "SIMULATED INPUT"}</b></div>
    <div className="burst-document-page" aria-hidden="true">
      <div className="burst-document-copy"><strong>PUBLIC LIBRARY</strong><span>Printed information remains available when several imperfect observations are compared carefully.</span></div>
      <div className="burst-document-lines"><i /><i /><i /><i /><i /></div>
      <div className="burst-defect-overlay" />
    </div>
    {variant !== "result" && <div className="burst-document-defect" aria-hidden="true"><span>{frame.label.toUpperCase()}</span><b>/</b><em>{frame.shortValue.toUpperCase()}</em></div>}
  </div>;
}

