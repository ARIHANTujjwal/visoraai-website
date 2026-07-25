import { GlyphWearableHero } from "../components/GlyphWearableHero";
import { ArchitectureMap } from "../components/ArchitectureMap";
import { GuidanceLoop, OCRDecisionDemo } from "../components/FeatureDemos";
import { BurstStackDemo } from "../components/BurstStackDemo";
import { AboutClosing, AccessibilityPreview, DevelopmentTimeline, EdgeSection, ResearchPreview } from "../components/HomeSections";
import { BuiltWithClosing, HardwareShowcase } from "../components/HardwareShowcase";

export default function HomePage() {
  return <main id="main-content" className="page-enter">
    <GlyphWearableHero />
    <ArchitectureMap />
    <BurstStackDemo />
    <OCRDecisionDemo />
    <GuidanceLoop />
    <EdgeSection />
    <ResearchPreview />
    <DevelopmentTimeline />
    <AccessibilityPreview />
    <AboutClosing />
    <HardwareShowcase />
    <BuiltWithClosing />
  </main>;
}
