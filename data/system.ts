export type SystemDetail = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  purpose: string;
  role: string;
  input: string;
  method: string[];
  output: string;
  failures: string[];
  response: string[];
  limitations: string[];
  improvements: string[];
  related: string[];
  state: string;
};

export const systemDetails: SystemDetail[] = [
  {
    slug: "capture", number: "01", title: "Camera capture", shortTitle: "Capture",
    summary: "Turns a live camera stream into stable frame candidates the rest of the pipeline can evaluate.",
    purpose: "Acquire readable frames without assuming the user can visually judge the preview.",
    role: "Capture is the first quality gate. Blur, distance, exposure, and framing problems introduced here propagate into every later stage.",
    input: "A live camera feed and camera metadata.",
    method: ["Acquire frames continuously", "Measure sharpness and exposure", "Retain a short burst of candidates", "Prefer stable frames for downstream processing"],
    output: "A frame or short burst, plus quality signals used by detection and guidance.",
    failures: ["Handheld motion merges character strokes", "Text is too small at the current distance", "Glare removes visible detail", "The page falls outside the frame"],
    response: ["Ask the user to hold steady or move closer", "Delay capture until stability improves", "Pass several frames to burst stacking"],
    limitations: ["Quality thresholds vary by camera and lighting", "Automatic capture can feel slow when conditions keep changing"],
    improvements: ["Calibrate thresholds per camera", "Add exposure-aware capture", "Test automatic capture timing with users"],
    related: ["detection", "burst-stacking", "guidance"], state: "live frame"
  },
  {
    slug: "detection", number: "02", title: "Page and text detection", shortTitle: "Detect",
    summary: "Separates the printed page and its main text region from the camera background.",
    purpose: "Restrict recognition to the information the user is trying to read.",
    role: "Detection removes irrelevant surroundings, estimates page geometry, and provides framing evidence to the guidance loop.",
    input: "A camera frame and its quality measurements.",
    method: ["Find edges and candidate contours", "Approximate page corners", "Correct perspective where possible", "Locate the primary connected text region"],
    output: "A page boundary, a normalized crop, and detection confidence signals.",
    failures: ["Page and background have similar contrast", "Only part of the page is visible", "Curved paper breaks the rectangular assumption", "Busy backgrounds create false regions"],
    response: ["Fall back to text-region localization", "Ask the user to center the page", "Reject unstable crops instead of forwarding them"],
    limitations: ["Contour methods are sensitive to lighting", "Curved and folded documents remain difficult"],
    improvements: ["Evaluate learned document detectors", "Improve partial-page handling", "Track corners across consecutive frames"],
    related: ["capture", "enhancement", "guidance"], state: "page bounds"
  },
  {
    slug: "enhancement", number: "03", title: "Image enhancement", shortTitle: "Enhance",
    summary: "Improves the isolated text crop while monitoring blur and glare that filters cannot recover.",
    purpose: "Present OCR with a cleaner, more consistent representation of the printed text.",
    role: "Enhancement bridges camera variability and recognition by adjusting scale, contrast, noise, and edge clarity.",
    input: "A perspective-corrected page or text-region crop.",
    method: ["Convert to grayscale", "Normalize local contrast", "Denoise before sharpening", "Compare restrained preprocessing variants"],
    output: "One or more enhanced OCR candidates with quality metadata.",
    failures: ["Harsh thresholding erases thin strokes", "Sharpening creates false edges", "Glare has already removed information", "Low-resolution text cannot be reconstructed"],
    response: ["Keep the unmodified crop as a candidate", "Reject destructive variants", "Route persistent glare or blur to guidance"],
    limitations: ["No filter can restore missing pixels", "One preprocessing recipe does not fit every print style"],
    improvements: ["Choose variants using measured OCR quality", "Localize glare before processing", "Profile document-specific settings"],
    related: ["detection", "burst-stacking", "ocr"], state: "clean crop"
  },
  {
    slug: "burst-stacking", number: "04", title: "Median burst stacking", shortTitle: "Stack",
    summary: "Combines several nearby frames to reduce temporary variation before recognition.",
    purpose: "Recover a more stable view from a short sequence of imperfect captures.",
    role: "Stacking sits between enhancement and OCR when a single frame is not dependable enough.",
    input: "A short aligned burst of page crops.",
    method: ["Collect a bounded frame burst", "Estimate and correct small alignment shifts", "Take a median value across corresponding pixels", "Compare the result with the best single frame"],
    output: "A median-stacked candidate and the strongest single-frame alternative.",
    failures: ["Frames are too misaligned", "The page moves during collection", "Glare remains fixed across every frame", "Excessive depth adds delay"],
    response: ["Reduce the burst depth", "Use the best single frame", "Request a steadier capture"],
    limitations: ["Stacking is not guaranteed to improve recognition", "Alignment and processing time constrain depth on edge hardware"],
    improvements: ["Measure the depth/latency trade-off", "Benchmark against Character Error Rate", "Tune alignment for Raspberry Pi"],
    related: ["capture", "enhancement", "ocr"], state: "median frame"
  },
  {
    slug: "ocr", number: "05", title: "OCR recognition and validation", shortTitle: "Recognize",
    summary: "Generates candidate text, checks its plausibility, and avoids accepting recognition blindly.",
    purpose: "Convert the enhanced image into text that is useful enough to clean and speak.",
    role: "Recognition compares a custom CRNN-CTC path with Tesseract fallback output, then uses confidence and readability checks to select or reject a candidate.",
    input: "Enhanced single-frame and stacked image candidates.",
    method: ["Extract image features", "Decode a character sequence with CRNN-CTC", "Generate fallback candidates with Tesseract", "Check confidence, readability, spacing, and agreement"],
    output: "Selected text, its provenance, and validation signals; or a rejection reason.",
    failures: ["Similar glyphs are confused", "Line ordering is wrong", "Low confidence still looks superficially plausible", "Stylized fonts fall outside training data"],
    response: ["Compare alternative OCR paths", "Reject implausible text", "Ask for a new capture when no candidate is dependable"],
    limitations: ["Confidence is not guaranteed correctness", "Verified evaluation data is still needed before accuracy claims"],
    improvements: ["Evaluate on a documented dataset", "Expand controlled blur training", "Add language support after English stabilizes"],
    related: ["enhancement", "burst-stacking", "speech"], state: "decoded text"
  },
  {
    slug: "speech", number: "06", title: "Speech output", shortTitle: "Speak",
    summary: "Cleans accepted text and turns it into paced, interruptible spoken output.",
    purpose: "Deliver recognized information in a form the user can follow without reading a screen.",
    role: "Speech is the primary output channel. It also coordinates with guidance so corrective prompts do not collide with document reading.",
    input: "Validated OCR text and reading controls.",
    method: ["Normalize whitespace and punctuation", "Split long passages into manageable units", "Queue speech without overlap", "Pause for higher-priority guidance"],
    output: "Spoken document audio with a controllable reading sequence.",
    failures: ["OCR artifacts sound confusing", "Long output becomes hard to follow", "Guidance interrupts at the wrong time", "Punctuation produces unnatural pacing"],
    response: ["Suppress rejected OCR", "Chunk the passage", "Separate guidance and reading queues"],
    limitations: ["Text structure is only as good as OCR output", "Voice controls are still a planned interaction"],
    improvements: ["Add repeat, pause, and slower-reading commands", "Detect headings and lists", "Test pacing preferences"],
    related: ["ocr", "guidance"], state: "audio output"
  },
  {
    slug: "guidance", number: "07", title: "Spoken user guidance", shortTitle: "Guide",
    summary: "Turns measurable image problems into short instructions that help improve the next frame.",
    purpose: "Close the loop when the user cannot visually verify camera position or image quality.",
    role: "Guidance interprets blur, glare, distance, page visibility, and stability signals before recognition is attempted again.",
    input: "Quality measurements, detection state, OCR validation, and prompt history.",
    method: ["Prioritize the most actionable issue", "Map it to a short spoken instruction", "Apply cooldowns to prevent repetition", "Confirm when the page is ready"],
    output: "Prompts such as “Move closer,” “Hold steady,” “Reduce glare,” or “Ready to read.”",
    failures: ["Prompts repeat too often", "Several problems compete for attention", "A wrong diagnosis makes capture worse", "Instructions arrive too late"],
    response: ["Speak one issue at a time", "Use prompt cooldowns", "Stop prompting once the frame is acceptable"],
    limitations: ["Thresholds need user testing", "Not every failure can be translated into a simple correction"],
    improvements: ["Evaluate prompt clarity with users", "Tune priorities by failure type", "Add nonverbal alignment cues where appropriate"],
    related: ["capture", "detection", "speech"], state: "feedback loop"
  }
];

export const pipelineStages = [
  { id: "capture", label: "Capture", detail: "Acquire a stable live frame.", state: "raw" },
  { id: "detection", label: "Detect", detail: "Find the document boundary.", state: "bounds" },
  { id: "detection", label: "Isolate", detail: "Crop toward the primary text region.", state: "crop" },
  { id: "enhancement", label: "Enhance", detail: "Normalize contrast and sharpen carefully.", state: "enhanced" },
  { id: "burst-stacking", label: "Stack", detail: "Combine a short burst through a median frame.", state: "stacked" },
  { id: "ocr", label: "Recognize", detail: "Decode image features into character candidates.", state: "recognized" },
  { id: "ocr", label: "Validate", detail: "Compare candidates and reject weak output.", state: "validated" },
  { id: "speech", label: "Speak", detail: "Clean, pace, and synthesize the selected text.", state: "spoken" },
  { id: "guidance", label: "Guide", detail: "Use image signals to improve the next capture.", state: "guided" }
] as const;

export const getSystemDetail = (slug: string) => systemDetails.find((item) => item.slug === slug);
