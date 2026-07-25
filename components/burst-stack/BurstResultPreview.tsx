import { BurstFramePreview } from "./BurstFramePreview";
import { burstDemoFrames } from "./data";

function resultState(depth: number) {
  if (depth === 1) return { output: "Pr1nted te_t", note: "Insufficient temporal information", state: "limited" };
  if (depth === 2) return { output: "Pr1nted text", note: "Additional evidence; one substitution remains", state: "partial" };
  if (depth <= 5) return { output: "Printed text", note: "Balanced demonstration depth", state: "balanced" };
  return { output: "Printed text", note: "More frames increase processing and alignment cost", state: "cost" };
}

export function BurstResultPreview({ depth }: { depth: number }) {
  const result = resultState(depth);
  return <section className={`burst-result-v2 result-${result.state}`} aria-labelledby="burst-result-title">
    <header className="burst-panel-label">
      <div><span id="burst-result-title">RESULT</span><small>SIMULATED COMPARISON</small></div>
      <b>{depth === 1 ? "SINGLE CANDIDATE" : "STACK CANDIDATE"}</b>
    </header>
    <div className="burst-result-stage">
      <BurstFramePreview frame={{ ...burstDemoFrames[0], id: depth, description: "a simulated stack result formed from the selected input frames" }} variant="result" />
      <div className="burst-result-text" aria-live="polite"><span>DEMONSTRATION OUTPUT</span><strong>“{result.output}”</strong></div>
    </div>
    <div className="burst-result-compare">
      <div><span>SINGLE FRAME</span><b>“Pr1nted te_t”</b></div>
      <div><span>STACK RESULT</span><b>“{result.output}”</b></div>
    </div>
    <p className="burst-result-note"><i aria-hidden="true" />{result.note}</p>
  </section>;
}
