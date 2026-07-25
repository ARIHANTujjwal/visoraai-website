export type EditorialSection = { title: string; text: string; items?: string[]; status?: string };
export type EditorialPage = { title: string; eyebrow: string; description: string; intro: string; sections: EditorialSection[] };

export const editorialPages: Record<string, EditorialPage> = {
  research: {
    eyebrow: "Research and evaluation", title: "Built through testing, not assumptions.",
    description: "How VisoraAI evaluates capture quality, OCR behavior, burst depth, and edge-device trade-offs.",
    intro: "VisoraAI’s evaluation plan connects image conditions to recognition behavior. The repository does not yet contain a verified results dataset, so this page documents the method and the evidence still required instead of presenting invented performance figures.",
    sections: [
      { title: "What is being tested", text: "Controlled printed samples can be captured across motion blur, glare, distance, framing, and lighting conditions. Single-frame and burst-stacked candidates should be evaluated against the same ground truth.", items: ["Character Error Rate", "Recognition acceptance or rejection", "Burst depth", "Processing time", "Blur and glare severity"] },
      { title: "Why these measures matter", text: "A recognition score alone does not explain whether the complete reading interaction works. Latency, rejection behavior, and guidance quality matter because the system must help the user recover when the first image is poor." },
      { title: "Current evidence status", text: "Verified dataset results have not been located in this repository. Charts remain deliberately qualitative until the sample set, ground truth, test conditions, and code version are documented together.", status: "Controlled evaluation in progress" },
      { title: "Limitations to record", text: "A useful report should state camera hardware, document types, font sizes, lighting setup, blur generation method, sample count, and the difference between model confidence and correctness." },
      { title: "What changes after testing", text: "Evaluation should inform blur thresholds, burst depth, preprocessing profiles, confidence gates, and guidance priorities. Every change needs a traceable reason rather than a decorative metric." }
    ]
  },
  accessibility: {
    eyebrow: "Accessibility", title: "A website about accessibility must demonstrate it.",
    description: "The interaction, content, motion, and visual systems used to make VisoraAI’s website more accessible.",
    intro: "Accessibility shapes both the assistive system and this website. The interface uses semantic structure, keyboard-operable controls, strong focus states, readable typography, reduced-motion alternatives, and text explanations for every animated demonstration.",
    sections: [
      { title: "Perceivable", text: "Warm paper and deep ink provide strong contrast without depending on color alone. Animated diagrams include visible labels and equivalent explanatory text.", items: ["Atkinson Hyperlegible for body copy", "No automatic audio", "Meaning is repeated in text", "Optional increased-contrast mode"] },
      { title: "Operable", text: "Navigation, stage controls, architecture nodes, the technical drawer, mobile menu, and display settings are keyboard accessible. Focus returns to the triggering control after dialogs close.", items: ["Skip link", "Visible focus ring", "Minimum practical target sizes", "No keyboard traps"] },
      { title: "Understandable", text: "Copy names real inputs, outputs, methods, and failure cases. Motion explains state changes but never hides essential information." },
      { title: "Adjustable", text: "The display control offers increased contrast, larger body text, and reduced motion. Preferences are saved locally and respect operating-system motion settings." },
      { title: "Known limits", text: "WCAG conformance is a continuing verification process. Automated checks, keyboard testing, zoom testing, and assistive-technology review should accompany future content changes." }
    ]
  },
  development: {
    eyebrow: "Development", title: "The system became useful one failure at a time.",
    description: "An engineering progression from basic image-to-text experiments to a guided edge-device reading system.",
    intro: "This is not a corporate timeline. It is a record of how each observed failure created the need for another part of the system.",
    sections: [
      { title: "Image to text", text: "A basic OCR pass proved that printed characters could become machine-readable, but it also exposed how strongly recognition depended on the image." },
      { title: "Live camera and speech", text: "Camera input and text-to-speech turned the experiment into a reading loop. They also showed that the user needed feedback before and after recognition." },
      { title: "Segmentation and quality checks", text: "Page detection, text-region localization, blur detection, and glare detection moved the project from hopeful OCR calls toward deliberate input control." },
      { title: "Custom recognition and fallback", text: "A CRNN-CTC model provides a research path while Tesseract remains a practical fallback. Candidate selection makes disagreement visible rather than pretending one engine is always right." },
      { title: "Burst stacking and edge optimization", text: "Median frame stacking addresses temporary variation, while Raspberry Pi constraints force decisions about frame skipping, depth, exposure, and service boundaries." },
      { title: "Adaptive spoken guidance", text: "The latest system direction closes the loop: detect the problem, speak one useful adjustment, and capture again when the page is ready." }
    ]
  },
  about: {
    eyebrow: "About", title: "An independent exploration of accessible vision systems.",
    description: "Why VisoraAI brings computer vision, OCR, embedded computing, and accessible interaction into one focused reading project.",
    intro: "VisoraAI is independently developed to explore a practical question: how can a camera-based system help a visually impaired user reach printed information without first requiring a perfect image?",
    sections: [
      { title: "The project", text: "VisoraAI combines live camera processing, page segmentation, image-quality analysis, OCR selection, text cleanup, speech, and spoken capture guidance." },
      { title: "The engineering focus", text: "The work sits at the intersection of computer vision, embedded systems, OCR, accessible interaction, and human-centered engineering." },
      { title: "The honest scope", text: "VisoraAI is an independent engineering project. It is not presented as a released medical device, commercial product, or validated replacement for established assistive technologies." },
      { title: "The direction", text: "The project is moving toward measurable evaluation, edge-device deployment, and clearer evidence about where the system succeeds or needs another capture." }
    ]
  },
  contact: {
    eyebrow: "Contact", title: "Questions, collaboration, and project context.",
    description: "Contact and repository links for the independently developed VisoraAI project.",
    intro: "For technical questions, evaluation ideas, or accessibility feedback, use the project repository or email. No contact form data is collected by this website.",
    sections: [
      { title: "Project code", text: "Implementation work and project history can be followed on GitHub.", items: ["github.com/ARIHANTujjwal/VisoraAI"] },
      { title: "Email", text: "General project correspondence can be sent to hello@visoraai.com." },
      { title: "Helpful context", text: "When reporting an issue, include the page, device, browser, viewport size, and whether reduced motion or increased contrast was enabled." }
    ]
  }
};
