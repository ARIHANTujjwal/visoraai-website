import { BurstFramePreview } from "./BurstFramePreview";
import { burstDemoFrames } from "./data";

export function BurstInputFrames({ depth }: { depth: number }) {
  const visibleFrames = burstDemoFrames.slice(0, Math.min(depth, 5));
  const remaining = Math.max(0, depth - visibleFrames.length);

  return <section className="burst-source-v2" aria-labelledby="burst-input-title">
    <header className="burst-panel-label">
      <div><span id="burst-input-title">INPUT FRAMES</span><small>CONCEPT DEMONSTRATION</small></div>
      <b aria-live="polite">{depth} selected</b>
    </header>
    <div className={`burst-input-stage has-${visibleFrames.length}`}>
      {visibleFrames.map((frame, index) => <BurstFramePreview key={frame.id} frame={frame} variant="input" position={index} />)}
      {remaining > 0 && <span className="burst-more-frames" aria-label={`${remaining} additional simulated frames selected`}>+{remaining} MORE</span>}
    </div>
  </section>;
}

