"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Zap, Eye, Menu, ArrowRight, X } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-[#0B0F19] overflow-hidden">
      {/* 1. BACKGROUND IMAGE STABILITY (Layer z-0) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Mobile Background Image */}
        <img
          src="/mobile-bg-img.png"
          alt="Rekha AI Mobile Background"
          className="w-full h-full object-cover md:hidden"
        />
        {/* Desktop Background */}
        <img
          src="/bg-image.png"
          alt="Rekha AI Desktop Background"
          className="w-full h-full object-cover md:object-center hidden md:block"
        />
        {/* Master Gradient Overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b md:bg-gradient-to-r from-[#050505] via-[#050505] via-40% md:via-45% to-transparent pointer-events-none md:hidden"></div>
      </div>

      {/* 2. STABLE NAVBAR STRUCTURE (Layer z-50) */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-[#050505]/60 border-b border-white/10 px-6 md:px-24 py-4 md:py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="/Rekha-Ai logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain shrink-0"
          />
          <span className="text-xl md:text-2xl font-black tracking-widest">
            <span className="text-white">REKHA </span>
            <span className="text-[#FACC15]">AI</span>
          </span>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-10 h-10 stroke-1" />
        </button>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-semibold text-slate-300 transition-colors hover:text-[#FACC15]">Solutions</a>
          <a href="#" className="text-sm font-semibold text-slate-300 transition-colors hover:text-[#FACC15]">Pricing</a>
          <a href="#" className="text-sm font-semibold text-slate-300 transition-colors hover:text-[#FACC15]">Contact</a>
          <Link href="/funnel">
            <button className="hidden md:block px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-900/20 transition-all">
              Enquiry
            </button>
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all">
          <button
            className="absolute top-6 right-6 text-white p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-10 h-10 stroke-1" />
          </button>
          <div className="flex flex-col items-center gap-8">
            <a href="#" className="text-2xl font-semibold text-slate-300 hover:text-[#FACC15]">Solutions</a>
            <a href="#" className="text-2xl font-semibold text-slate-300 hover:text-[#FACC15]">Pricing</a>
            <a href="#" className="text-2xl font-semibold text-slate-300 hover:text-[#FACC15]">Contact</a>
            <Link href="/funnel" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="mt-4 px-8 py-4 rounded-xl bg-[#2563EB] text-white text-xl font-bold shadow-lg shadow-blue-900/30">
                Enquiry
              </button>
            </Link>
            
            {/* Subtle Admin Link */}
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Admin Access
            </Link>
          </div>
        </div>
      )}

      {/* 3. HERO CONTENT SPACING (The Overlap Fix, Layer z-10) */}
      <div className="relative z-10 flex flex-col items-center md:items-start justify-start min-h-screen pt-36 md:pt-32 pb-12 px-6 md:px-24 w-full md:w-[60%] lg:w-[50%]">

        {/* 4. TYPOGRAPHY & SPACING REFINEMENTS */}
        <div className="w-full flex flex-col gap-0">
          <h2 className="text-center md:text-left text-5xl md:text-7xl lg:text-[5rem] font-black uppercase leading-[0.9] tracking-tight w-full text-white">
            STOP THEFT
          </h2>
          <h2 className="text-center md:text-left text-5xl md:text-7xl lg:text-[5rem] font-black uppercase leading-[0.9] tracking-tight w-full text-[#FACC15]">
            BEFORE
          </h2>
          <h2 className="text-center md:text-left text-5xl md:text-7xl lg:text-[5rem] font-black uppercase leading-[0.9] tracking-tight w-full text-white">
            IT HAPPENS.
          </h2>
        </div>

        <p className="text-center md:text-left mt-6 md:mt-4 text-base md:text-lg text-slate-300 max-w-lg">
          Upgrade your existing cameras with <br className="md:hidden" /><span className="font-bold"><span className="text-white">REKHA</span>-<span className="text-[#FACC15]">Ai</span></span>. Real-time intruder, fire & violence alerts with zero monthly guard costs.
        </p>

        <Link href="/funnel" className="w-full flex justify-center md:justify-start">
          <button className="mt-5 md:mt-4 w-fit px-8 py-4 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[17px] md:text-lg shadow-lg shadow-blue-900/30 hover:scale-105 transition-transform flex items-center justify-center gap-1">
            Start Your Free Setup <ArrowRight className="w-5 h-5" />
          </button>
        </Link>

        {/* 5. GLASS BADGES (2x1 Grid on Desktop) */}
        <div className="flex flex-col gap-3 mt-6 items-center md:items-start">
          <div className="flex flex-col md:flex-row gap-3 items-center md:items-start">
            {/* Badge 1: 24/7 THREAT DETECTION */}
            <div className="w-fit inline-flex backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-5 py-3 items-center gap-3 text-slate-200 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ease-out cursor-default hover:-translate-y-1 hover:bg-white/10 hover:border-[#FACC15]/50 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]">
              <ShieldCheck className="w-5 h-5 text-[#FACC15] flex-shrink-0" />
              24/7 THREAT DETECTION
            </div>
            {/* Badge 2: INSTANT ALERTS */}
            <div className="w-fit inline-flex backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-5 py-3 items-center gap-3 text-slate-200 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ease-out cursor-default hover:-translate-y-1 hover:bg-white/10 hover:border-[#FACC15]/50 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]">
              <Zap className="w-5 h-5 text-[#FACC15] flex-shrink-0" />
              INSTANT ALERTS
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            {/* Badge 3: ON-DEVICE AI */}
            <div className="w-fit inline-flex backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-5 py-3 items-center gap-3 text-slate-200 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ease-out cursor-default hover:-translate-y-1 hover:bg-white/10 hover:border-[#FACC15]/50 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]">
              <Eye className="w-5 h-5 text-[#FACC15] flex-shrink-0" />
              ON-DEVICE AI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
