"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, ShieldCheck, Image as ImageIcon, Zap } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Haddii uu horey u soo galay (Logged in), si toos ah u gee Home Page-ka
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen bg-[#0f1012] items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase animate-pulse">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full bg-[#0f1012] text-[#e3e3e3] items-center justify-center font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Glow Lights (Gradients) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 bg-[#17181c]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-[#2b2d32] w-full max-w-md text-center space-y-8 shadow-2xl shadow-black/80 hover:border-blue-500/30 transition-all duration-300">
        
        {/* Logo & Header */}
        <div className="space-y-3">
          {/* Studio Icon Badge */}
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-1">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            SP AI Studio
          </h1>
          
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
            Create Google account.
          </p>
        </div>

        {/* Feature Highlights (Mini Cards) */}
        <div className="grid grid-cols-2 gap-2 text-left pt-1">
          <div className="p-2.5 rounded-xl bg-[#1f2126]/60 border border-[#2b2d32] flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-[11px] text-gray-300 font-medium">Fast Generation</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1f2126]/60 border border-[#2b2d32] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-[11px] text-gray-300 font-medium">Ultra HD Quality</span>
          </div>
        </div>

        {/* Google Login Button */}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-xl shadow-white/5 active:scale-98 cursor-pointer"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm">Continue with Google</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-gray-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure OAuth 2.0 Authentication</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-gray-500 pt-2 border-t border-[#26272b]">
           Sign in with Google SP AI Studio
        </p>

      </div>
    </div>
  );
}