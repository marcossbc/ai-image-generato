"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  PanelLeft, 
  Plus, 
  Sparkles, 
  Download, 
  Trash2, 
  LogOut, 
  Image as ImageIcon,
  Compass,
  Zap,
  LayoutGrid,
  Mic,
  MicOff,
  X,
  Menu
} from "lucide-react";

interface GenerationItem {
  _id: string;
  prompt: string;
  images: string[];
  ratio: string;
  createdAt: string;
}

export default function GeminiApp() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState("1");
  const [ratio, setRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [history, setHistory] = useState<GenerationItem[]>([]);
  const [activeItem, setActiveItem] = useState<GenerationItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile initial render
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Redirect haddii uu unauthenticated yahay
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch History
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/generate");
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHistory();
    }
  }, [session]);

  // Voice Recognition Logic (Speech-to-Text)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Browser-kaaga ma taageero Voice Input. Fadlan Chrome ama Edge isticmaal.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageCount: count, ratio }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveItem(data.data);
        setPrompt("");
        fetchHistory();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Failed to generate image!");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/generate?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
        if (activeItem?._id === id) setActiveItem(null);
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const downloadImage = (img: string) => {
    const a = document.createElement("a");
    a.href = img;
    a.download = `sp-ai-studio-${Date.now()}.png`;
    a.click();
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex h-screen bg-[#0f0f10] items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase animate-pulse">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f1012] text-[#e3e3e3] overflow-hidden font-sans selection:bg-blue-500/30 relative">
      
      {/* Mobile Sidebar Overlay (backdrop) */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* ================= 1. SIDEBAR (Responsive Gemini Style) ================= */}
      <aside
        className={`fixed md:relative z-40 h-full transition-all duration-300 ease-in-out bg-[#17181a] md:bg-[#17181a]/80 backdrop-blur-xl flex flex-col justify-between p-4 border-r border-[#26272b] ${
          sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
      >
        <div className="space-y-6">
          {/* Header & Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-[#26272b] text-gray-400 hover:text-white transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5 hidden md:block" />
              <X className="w-5 h-5 md:hidden" />
            </button>

            {sidebarOpen && (
              <button
                onClick={() => {
                  setActiveItem(null);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-blue-400 hover:text-blue-300 text-xs font-semibold px-4 py-2.5 rounded-full border border-blue-500/30 transition shadow-lg shadow-blue-500/5"
              >
                <Plus className="w-4 h-4" />
                <span>New Generation</span>
              </button>
            )}
          </div>

          {/* History List */}
          {sidebarOpen && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 px-3">
                Recent Generations
              </p>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {history.length === 0 ? (
                  <p className="text-xs text-gray-600 italic px-3 py-2">No history yet...</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setActiveItem(item);
                        if (window.innerWidth < 768) setSidebarOpen(false);
                      }}
                      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${
                        activeItem?._id === item._id
                          ? "bg-[#222428] text-blue-400 border border-blue-500/20 shadow-md"
                          : "hover:bg-[#1f2023] text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-6">
                        <ImageIcon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                        <span className="truncate">{item.prompt}</span>
                      </div>
                      <button
                        onClick={(e) => deleteHistoryItem(e, item._id)}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 hover:text-red-400 text-gray-500 transition-opacity rounded-md hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Footer Profile */}
        {sidebarOpen && session?.user && (
          <div className="pt-3 border-t border-[#26272b]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1d1e21]/50 border border-[#26272b]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="User"
                    className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
                  />
                )}
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-gray-200 truncate">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-gray-500 truncate">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ================= 2. MAIN BODY AREA ================= */}
      <main className="flex-1 flex flex-col justify-between items-center relative overflow-hidden bg-gradient-to-b from-[#121316] to-[#0f1012] w-full">
        
        {/* Header */}
        <header className="w-full py-3.5 px-4 sm:px-8 flex justify-between items-center border-b border-[#26272b]/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-[#26272b] text-gray-400 hover:text-white transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="p-1.5 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              SP AI Studio
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> <span className="hidden sm:inline">FLUX.1 Engine</span><span className="sm:hidden">FLUX.1</span>
            </span>
          </div>
        </header>

        {/* Dynamic Display Area */}
        <div className="flex-1 w-full max-w-5xl px-4 sm:px-6 py-4 overflow-y-auto flex flex-col items-center justify-start md:justify-center custom-scrollbar">
          
          {/* Welcome Screen */}
          {!activeItem && !loading && (
            <div className="text-center space-y-6 sm:space-y-8 max-w-2xl py-6 sm:py-12 my-auto animate-fade-in w-full">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                  Hi {session?.user?.name?.split(" ")[0] || "there"}, ready to create?
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm font-normal max-w-md mx-auto">
                  Turn your imagination into stunning high-definition visual artwork in seconds.
                </p>
              </div>

              {/* Sample Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2 sm:pt-4 w-full">
                {[
                  { title: "Cyberpunk City", desc: "A glowing futuristic metropolis at night with neon rain.", icon: Compass },
                  { title: "Cute Panda Astronaut", desc: "3D render of a panda floating in space with colorful nebula.", icon: Sparkles },
                  { title: "Realistic Portrait", desc: "Cinematic portrait lighting, 8k resolution hyper-detailed.", icon: LayoutGrid }
                ].map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(card.desc)}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#17181c] border border-[#26272b] hover:border-blue-500/40 hover:bg-[#1c1e23] transition-all group duration-200 space-y-1.5 text-left w-full"
                  >
                    <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xs font-semibold text-gray-200">{card.title}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{card.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="w-full flex flex-col items-center gap-5 py-12 my-auto">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 animate-spin blur-md opacity-50" />
                <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#121316] border-2 border-blue-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-gray-200">Generating Your Masterpiece...</p>
                <p className="text-[11px] text-gray-500">Flux AI is processing your prompt details</p>
              </div>
            </div>
          )}

          {/* Active Generation Result */}
          {activeItem && !loading && (
            <div className="w-full space-y-4 sm:space-y-6 animate-fade-in max-w-4xl py-2">
              {/* Prompt Card */}
              <div className="bg-[#17181c] p-3.5 sm:p-4 rounded-2xl border border-[#26272b] flex items-start justify-between gap-3 shadow-xl">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-400 tracking-wider">Active Prompt</span>
                  <p className="text-xs sm:text-base font-medium text-gray-100 mt-0.5">{activeItem.prompt}</p>
                </div>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold bg-[#222428] text-gray-400 border border-gray-700 shrink-0">
                  {activeItem.ratio}
                </span>
              </div>

              {/* Images Grid */}
              <div className={`grid gap-3 sm:gap-4 ${activeItem.images.length === 1 ? "grid-cols-1 max-w-xl mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
                {activeItem.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border border-[#26272b] bg-[#17181c] shadow-2xl transition-all duration-300 hover:border-blue-500/30">
                    <img src={img} alt={`AI Generated ${idx}`} className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-end justify-end p-3 sm:p-4">
                      <button
                        onClick={() => downloadImage(img)}
                        className="flex items-center gap-2 bg-white/90 hover:bg-white text-black font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs backdrop-blur-md transition shadow-lg active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download HD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= 3. GEMINI BOTTOM PROMPT BAR ================= */}
        <div className="w-full max-w-3xl p-3 sm:p-6 shrink-0">
          <form 
            onSubmit={handleSubmit} 
            className="bg-[#17181c]/95 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-[#2b2d32] focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 space-y-2 sm:space-y-3 shadow-2xl transition-all duration-300 relative"
          >
            <div className="relative flex items-center">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isListening ? "Listening... Speak your prompt" : "Describe the image you want to generate in detail..."}
                className="w-full bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none pr-10 pl-1 text-xs sm:text-sm leading-relaxed"
                rows={2}
              />

              {/* Voice Input Mic Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute right-1 top-1 p-2 rounded-full transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-400 animate-pulse ring-2 ring-red-500/50"
                    : "hover:bg-[#26272b] text-gray-400 hover:text-gray-200"
                }`}
                title={isListening ? "Stop Listening" : "Speak Prompt"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 pt-2 border-t border-[#26272b]/80">
              <div className="flex gap-1.5 sm:gap-2">
                {/* Ratio Selector */}
                <select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="bg-[#212328] hover:bg-[#282a30] text-[11px] sm:text-xs font-medium text-gray-300 rounded-xl px-2.5 py-1.5 outline-none border border-[#2b2d32] transition cursor-pointer"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                </select>

                {/* Count Selector */}
                <select
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="bg-[#212328] hover:bg-[#282a30] text-[11px] sm:text-xs font-medium text-gray-300 rounded-xl px-2.5 py-1.5 outline-none border border-[#2b2d32] transition cursor-pointer"
                >
                  <option value="1">1 Image</option>
                  <option value="2">2 Images</option>
                  <option value="4">4 Images</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:hover:from-blue-600 disabled:hover:to-purple-600 text-white font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-95 ml-auto"
              >
                <span>{loading ? "Creating..." : "Generate"}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}