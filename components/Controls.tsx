import { Sparkles } from "lucide-react";

interface ControlsProps {
  setModel: (value: string) => void;
  setCount: (value: string) => void;
  setRatio: (value: string) => void;
  loading: boolean;
}

export default function Controls({
  setModel,
  setCount,
  setRatio,
  loading,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Model Selection */}
      <select
        onChange={(e) => setModel(e.target.value)}
        className="border border-[#d4d4ed] bg-[#f1f1ff] px-3 py-2 rounded-md flex-1 text-slate-700 outline-none"
        defaultValue="stabilityai/stable-diffusion-xl-base-1.0"
      >
        <option value="stabilityai/stable-diffusion-xl-base-1.0">SDXL (Recommended)</option>
        <option value="black-forest-labs/FLUX.1-schnell">FLUX.1 Schnell</option>
        <option value="black-forest-labs/FLUX.1-dev">FLUX.1 Dev</option>
        <option value="runwayml/stable-diffusion-v1-5">SD v1.5</option>
        <option value="prompthero/openjourney">Openjourney</option>
      </select>

      {/* Image Count */}
      <select
        onChange={(e) => setCount(e.target.value)}
        className="border border-[#d4d4ed] bg-[#f1f1ff] px-3 py-2 rounded-md flex-1 text-slate-700 outline-none"
        defaultValue="1"
      >
        <option value="1">1 Sawir</option>
        <option value="2">2 Sawir</option>
        <option value="3">3 Sawir</option>
        <option value="4">4 Sawir</option>
      </select>

      {/* Aspect Ratio */}
      <select
        onChange={(e) => setRatio(e.target.value)}
        className="border border-[#d4d4ed] bg-[#f1f1ff] px-3 py-2 rounded-md flex-1 text-slate-700 outline-none"
        defaultValue="1:1"
      >
        <option value="1:1">Square (1:1)</option>
        <option value="16:9">Landscape (16:9)</option>
        <option value="9:16">Portrait (9:16)</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 px-8 py-2 text-white rounded-md disabled:opacity-50 cursor-pointer font-medium"
        style={{ background: "var(--color-gradient, #4f46e5)" }}
      >
        <Sparkles size={18} />
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}