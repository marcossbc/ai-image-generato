"use client";

import { useState } from "react";
import { Sparkles, Video, Download, Loader2, Play } from "lucide-react";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setVideoLoading(true); // Waxaan sugeynaa marka uu MP4-ga si dhab ah u soo load-gali doono
      } else {
        alert("Cilad ayaa dhacday: " + (data.error || "Fiidiyowga lagu ma guulaysan"));
      }
    } catch (err) {
      console.error(err);
      alert("Cilad dhanka network-ka ah ayaa dhacday!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1012] text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pollinations Free AI Powered</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Qor waxaad rabto inaad fiidiyow u beddesho, AI-ga ayaa kuugu diyaarinaya HD Video!
          </p>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleGenerateVideo} className="space-y-4">
          <div className="relative bg-[#17181c] p-2 rounded-2xl border border-[#2b2d32] focus-within:border-purple-500/50 transition shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. Cinematic shot of a futuristic sports car driving through a rainy cyberpunk city at night with neon reflections..."
              className="w-full bg-transparent p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none"
              rows={3}
            />
            
            <div className="flex justify-between items-center pt-2 px-2 border-t border-[#26272b]">
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> 16:9 Landscape • HD 1080p
              </span>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-xl text-xs transition shadow-lg active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Video Player Output Area */}
        <div className="bg-[#17181c] border border-[#26272b] rounded-2xl p-4 min-h-[300px] flex items-center justify-center relative overflow-hidden">
          
          {loading && (
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-gray-300">Fiidiyowgaagii waa la soo samaynayaa...</p>
              <p className="text-xs text-gray-500">Waxay qaadanaysaa inta u dhaxeysa 10 - 20 ilbiriqsi</p>
            </div>
          )}

          {!loading && !videoUrl && (
            <div className="text-center space-y-2 text-gray-500 p-6">
              <Play className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs">Weli fiidiyow ma aad samaysan. Prompt-ka kor ku qor oo guji Generate.</p>
            </div>
          )}

          {!loading && videoUrl && (
            <div className="w-full space-y-3 relative">
              {videoLoading && (
                <div className="absolute inset-0 bg-[#17181c]/90 z-10 flex flex-col items-center justify-center gap-2 rounded-xl">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-xs text-gray-400">Loading MP4 Video stream...</p>
                </div>
              )}

              <video
                src={videoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setVideoLoading(false)}
                className="w-full h-auto rounded-xl border border-[#26272b] shadow-2xl"
              />
              
              <div className="flex justify-end">
                <a
                  href={videoUrl}
                  target="_blank"
                  download="ai-generated-video.mp4"
                  className="flex items-center gap-2 bg-[#222428] hover:bg-[#2b2d32] text-gray-200 text-xs font-semibold px-4 py-2 rounded-xl border border-[#32353c] transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video (MP4)</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}