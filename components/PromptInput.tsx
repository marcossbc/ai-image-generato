import { FaDice } from "react-icons/fa6";
import { DEFAULT_PROMPTS } from "@/lib/prompts";

export default function PromptInput({ prompt, setPrompt }: any) {
  const randomPrompt = () => {
    const random =
      DEFAULT_PROMPTS[Math.floor(Math.random() * DEFAULT_PROMPTS.length)];
    setPrompt(random);
  };

  return (
    <div className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="prompt-input border border-[#d4d4ed] bg-[#f1f1ff] text-[#09090e] w-full min-h-30 p-4
         rounded-lg resize-y focus:outline-none focus:border-[#8b5cf6] focus:shadow-lg"
        placeholder="Describe your imagination..."
        autoFocus
      />

      <button
        type="button"
        onClick={randomPrompt}
        className="absolute right-4 bottom-4 h-10 w-10 rounded-full text-white flex items-center justify-center cursor-pointer"
        style={{ background: "var(--color-gradient)" }}
      >
        <FaDice />
      </button>
    </div>
  );
}