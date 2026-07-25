export type BurstDefect = "blur" | "glare" | "shift" | "rotation" | "noise" | "exposure" | "crop" | "shadow";

export type BurstDemoFrame = {
  id: number;
  defect: BurstDefect;
  label: string;
  shortValue: string;
  description: string;
};

export const burstDemoFrames: BurstDemoFrame[] = [
  { id: 1, defect: "blur", label: "Blur", shortValue: "0.42", description: "slight simulated motion blur" },
  { id: 2, defect: "glare", label: "Glare", shortValue: "Med", description: "a narrow simulated glare band" },
  { id: 3, defect: "shift", label: "Shift", shortValue: "+3 px", description: "a small simulated horizontal offset" },
  { id: 4, defect: "rotation", label: "Rotation", shortValue: "+1.5°", description: "slight simulated rotation" },
  { id: 5, defect: "noise", label: "Noise", shortValue: "Mild", description: "mild simulated image noise" },
  { id: 6, defect: "exposure", label: "Exposure", shortValue: "Low", description: "slightly reduced simulated exposure" },
  { id: 7, defect: "crop", label: "Crop", shortValue: "Edge", description: "a simulated edge crop" },
  { id: 8, defect: "shadow", label: "Shadow", shortValue: "Soft", description: "a soft simulated page shadow" },
];

export const burstDepthStops = [1, 2, 3, 4, 5, 8];

