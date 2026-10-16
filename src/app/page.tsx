"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Database,
  ShieldCheck,
  Globe2,
  Pause,
  Play,
  ArrowRight,
  Info,
  Server,
  Layers,
} from "lucide-react";

// Dynamically import ThreeBackground with SSR disabled for optimal WebGL client rendering
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});

const TARGET_URL = "https://satudatabencana.bappenas.go.id";
const INITIAL_COUNTDOWN = 15;

const emptySubscribe = () => () => {};

export default function Home() {
  const [countdown, setCountdown] = useState<number>(INITIAL_COUNTDOWN);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Countdown timer for automatic redirection
  useEffect(() => {
    if (isPaused || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = TARGET_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, countdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TARGET_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRedirectNow = () => {
    window.location.href = TARGET_URL;
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const progressPercentage = ((INITIAL_COUNTDOWN - countdown) / INITIAL_COUNTDOWN) * 100;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#030712] text-slate-100">
      {/* 1. WebGL Three.js 3D Background */}
      <ThreeBackground />

      {/* 2. Soft Ambient Lighting Gradients over canvas */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-0 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030712]/40 to-[#030712]/90" />
      </div>

      {/* 3. Header Bar */}
      <header className="relative z-10 w-full border-b border-white/[0.08] bg-[#030712]/75 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Agency Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-teal-500/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Globe2 className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
                Republik Indonesia
              </div>
              <div className="text-sm sm:text-base font-semibold tracking-tight text-white flex items-center gap-2">
                Kementerian PPN / Bappenas
              </div>
            </div>
          </div>

          {/* Migration Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Migrasi Layanan Aktif
          </div>
        </div>
      </header>

      {/* 4. Main Announcement Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-md mb-6 shadow-xl">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-slate-200">
              Pemberitahuan Resmi • Penutupan Sementara
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
            Website Ditutup Sementara &{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Pindah Layanan
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed">
            Untuk peningkatan integrasi data bencana nasional secara terpusat dan terstandarisasi, website ini sedang ditutup sementara. Seluruh data, peta geospasial, dan layanan telah dialihkan ke portal resmi{" "}
            <strong className="text-white font-semibold">Satu Data Bencana Bappenas</strong>.
          </p>

          {/* URL Box & Action Center Card */}
          <div className="w-full max-w-2xl mt-8 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden group">
            {/* Top border glowing highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-75" />

            {/* Target Address Display */}
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
              Alamat Portal Baru Resmi
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-black/50 border border-cyan-500/20 text-left">
              <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <Server className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="truncate">
                  <div className="text-xs text-slate-400">URL Tujuan:</div>
                  <a
                    href={TARGET_URL}
                    className="text-sm sm:text-base font-mono font-medium text-cyan-300 hover:text-cyan-200 transition-colors truncate block underline-offset-4 hover:underline"
                  >
                    https://satudatabencana.bappenas.go.id
                  </a>
                </div>
              </div>

              {/* Copy URL Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
                title="Salin Alamat URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Main CTA Button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
              <a
                href={TARGET_URL}
                className="group/btn relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Buka Portal Satu Data Bencana</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={handleRedirectNow}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.99] text-slate-200 font-medium text-sm border border-white/10 transition-all cursor-pointer"
              >
                <span>Alihkan Langsung</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Countdown Redirection Bar */}
            {isClient && (
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>
                    {countdown > 0 ? (
                      <>
                        Otomatis dialihkan dalam{" "}
                        <strong className="text-cyan-300 font-bold text-sm">
                          {countdown}
                        </strong>{" "}
                        detik
                      </>
                    ) : (
                      <span className="text-cyan-300 font-semibold">Mengarahkan sekarang...</span>
                    )}
                  </span>
                </div>

                {/* Pause / Resume Controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors cursor-pointer"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3 h-3 text-emerald-400" />
                        <span>Lanjutkan Pengalihan</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 text-amber-400" />
                        <span>Jeda Timer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Visual Progress Bar */}
            {isClient && (
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}
          </div>

          {/* 5. Features & Information Grid */}
          <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Card 1 */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:border-cyan-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3.5 text-cyan-400 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Integrasi Data Nasional
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Penyatuan repositori data bencana dari berbagai kementerian dan lembaga dalam satu basis data geospasial terpadu.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:border-teal-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3.5 text-teal-400 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Katalog & Peta Tematik
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Akses peta risiko multibencana, analisis spasial ketangguhan wilayah, dan statistik historis kebencanaan Indonesia.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:border-blue-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3.5 text-blue-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Prinsip Satu Data Indonesia
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Mengimplementasikan standar data terbuka, metadata baku, serta interoperabilitas antar-sistem pemerintahan (SPBE).
              </p>
            </div>
          </div>

          {/* Security & Verification Callout */}
          <div className="mt-8 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 max-w-xl">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Pastikan Anda selalu memeriksa alamat tautan resmi pemerintah dengan domain{" "}
              <span className="text-slate-200 font-mono font-medium">.bappenas.go.id</span>
            </span>
          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.08] bg-[#030712]/80 backdrop-blur-md py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Kementerian Perencanaan Pembangunan Nasional / Bappenas Republik Indonesia.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.bappenas.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Portal Bappenas
            </a>
            <a
              href="https://data.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Satu Data Indonesia
            </a>
            <a
              href={TARGET_URL}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Satu Data Bencana
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive 3D WebGL Helper Hint Badge */}
      <div className="hidden lg:flex fixed bottom-5 left-5 z-20 items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-[11px] text-slate-300 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>Three.js WebGL: Arahkan kursor atau seret untuk memutar digital globe</span>
      </div>
    </div>
  );
}
