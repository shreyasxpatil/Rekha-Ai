"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Home,
  Building2,
  Warehouse,
  Briefcase,
  Camera,
  Wifi,
  ShieldCheck,
  Flame,
  PackageOpen,
  Swords,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  UserX,
  Users,
  AlertTriangle,
  UserMinus,
  Crosshair,
  CarFront,
  AlertOctagon,
  Sparkles,
  UserCheck,
  Zap,
  LayoutGrid,
  Globe,
  RefreshCw,
  Loader2,
  MapPin,
  Layers,
  Cpu,
  UserPlus
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LeadState {
  location: string;
  cameraBrand: string;
  cameraCount: string;
  price: string;
  priceNum: number;
  features: string[];
  name: string;
  phone: string;
  state: string;
  city: string;
  pincode: string;
}

// ─── Motion Variants ─────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
};

const transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

// ─── Sub-components ──────────────────────────────────────────────────────────

function RoadmapTimeline({ step, total }: { step: number; total: number }) {
  const steps = [
    { label: "Location", icon: <MapPin size={14} /> },
    { label: "Hardware", icon: <Camera size={14} /> },
    { label: "Quantity", icon: <Layers size={14} /> },
    { label: "AI Models", icon: <Cpu size={14} /> },
    { label: "Summary", icon: <ShieldCheck size={14} /> },
    { label: "Contact", icon: <UserPlus size={14} /> },
  ];

  return (
    <div className="w-full pt-2 pb-0">
      <div className="relative flex justify-between">
        {/* Connecting Line Background */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2" />

        {/* Dynamic Connecting Line Fill */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-[#2563EB] -translate-y-1/2 origin-left z-10"
          initial={false}
          animate={{ width: `${((step - 1) / (total - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;

          return (
            <div key={i} className="relative z-20 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 relative
                  ${isCompleted ? "bg-[#2563EB] border-[#2563EB] text-white" :
                    isActive ? "bg-white border-[#2563EB] text-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-2 ring-[#2563EB]/20" :
                      "bg-slate-100 border-slate-200 text-slate-400"}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="glow"
                    className="absolute inset-0 rounded-full border-2 border-[#2563EB] animate-ping"
                    transition={{ duration: 1 }}
                  />
                )}
                {isCompleted ? <CheckCircle2 size={16} /> : s.icon}
              </motion.div>
              <span className={`hidden md:block mt-2 text-[10px] font-bold uppercase tracking-tighter transition-colors duration-300
                ${isActive ? "text-[#2563EB]" : isCompleted ? "text-slate-600" : "text-slate-400"}
              `}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FloatingCard({
  icon,
  label,
  title,
  sub,
  dark = false,
  extra,
}: {
  icon?: React.ReactNode;
  label?: string;
  title: React.ReactNode;
  sub?: string;
  dark?: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative mb-8 overflow-hidden"
    >
      {/* Decorative gradient orb */}
      {!dark && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      )}
      {dark && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
      )}

      {(icon || label) && (
        <div className="flex items-center gap-2 mb-3 relative z-10">
          {icon && (
            <span className={`text-amber-500`}>
              {icon}
            </span>
          )}
          {label && (
            <span
              className={`text-xs font-bold uppercase tracking-widest text-slate-500`}
            >
              {label}
            </span>
          )}
        </div>
      )}
      <p className={`text-base font-semibold leading-relaxed text-slate-600 relative z-10`}>
        {title}
      </p>
      {sub && <p className={`text-sm mt-2 relative z-10 ${dark ? "text-slate-400" : "text-slate-500"}`}>{sub}</p>}
      {extra && <div className="relative z-10">{extra}</div>}
    </motion.div>
  );
}

function SelectCard({
  icon,
  iconBgColor = "bg-slate-100 text-slate-500",
  title,
  sub,
  right,
  selected,
  onClick,
}: {
  icon?: React.ReactNode;
  iconBgColor?: string;
  title: string;
  sub?: string;
  right?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer shadow-sm ${selected ? "border-[#2563EB] bg-blue-50/50" : "border-slate-200 bg-white hover:border-blue-300"}`}
    >
      {icon && (
        <span className={`flex-shrink-0 p-3 rounded-xl transition-colors ${selected ? "text-[#2563EB]" : iconBgColor}`}>
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-[16px] transition-colors ${selected ? "text-blue-950" : "text-slate-700"}`}>
          {title}
        </p>
        {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {right && (
        <span className={`text-sm flex-shrink-0 px-3 py-1 rounded-lg ${selected ? "text-green-600 font-bold" : "text-slate-500"}`}>
          {right}
        </span>
      )}
      <div
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? "border-[#2563EB] bg-[#2563EB]" : "border-slate-300 bg-white"}`}
      >
        <AnimatePresence>
          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-2.5 h-2.5 rounded-full bg-white block"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

// ─── Step 1: Location ─────────────────────────────────────────────────────────

function Step1({ lead, setLead }: { lead: LeadState; setLead: (l: LeadState) => void }) {
  const options = [
    { title: "Shop / store", icon: <ShoppingBag size={22} />, color: "bg-blue-50 text-blue-500" },
    { title: "Home", icon: <Home size={22} />, color: "bg-green-50 text-green-500" },
    { title: "Society / apartment", icon: <Building2 size={22} />, color: "bg-purple-50 text-purple-500" },
    { title: "Warehouse / storage", icon: <Warehouse size={22} />, color: "bg-amber-50 text-amber-500" },
    { title: "Office / business", icon: <Briefcase size={22} />, color: "bg-indigo-50 text-indigo-500" },
  ];

  return (
    <div>
      <FloatingCard
        icon={<BarChart3 size={16} />}
        label="DID YOU KNOW?"
        title={
          <>
            India reports 1 property theft every 3 minutes. <span className="text-[#2563EB]">Most happen while CCTVs record—but nobody watches.</span>
          </>
        }
      />
      <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Where do you need this?</h2>
      {options.map((o) => (
        <SelectCard
          key={o.title}
          title={o.title}
          icon={o.icon}
          iconBgColor={o.color}
          selected={lead.location === o.title}
          onClick={() => setLead({ ...lead, location: o.title })}
        />
      ))}
    </div>
  );
}

// ─── Step 2: Camera Brand ────────────────────────────────────────────────────

function Step2({ lead, setLead }: { lead: LeadState; setLead: (l: LeadState) => void }) {
  const brands = [
    { title: "CP Plus", icon: <Camera size={22} />, color: "bg-red-50 text-red-600", sub: "Most popular in India" },
    { title: "Hikvision", icon: <ShieldCheck size={22} />, color: "bg-blue-50 text-blue-600", sub: "Enterprise grade security" },
    { title: "Dahua / Imou", icon: <Zap size={22} />, color: "bg-orange-50 text-orange-600", sub: "Advanced smart features" },
    { title: "WiFi camera (no DVR)", icon: <Wifi size={22} />, color: "bg-cyan-50 text-cyan-600", sub: "TP-Link, Qubo, Mi, etc." },
    { title: "Some other brand", icon: <Camera size={22} />, color: "bg-indigo-50 text-indigo-600", sub: "Godrej, Honeywell, etc." },
    { title: "Don't know / Not have", icon: <AlertTriangle size={22} />, color: "bg-slate-100 text-slate-500", sub: "We'll help you find out" },
  ];

  return (
    <div>
      <FloatingCard
        icon={<Building2 size={16} />}
        label="PROACTIVE SECURITY"
        title={
          <>
            Standard CCTVs only provide footage after a theft. <span className="font-black"><span className="text-[#2563EB] font-black">REKHA-</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span> analyzes live feeds</span> to detect and stop intruders in real-time.
          </>
        }
      />
      <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Which camera do you have?</h2>
      <div className="space-y-3">
        {brands.map((b) => (
          <SelectCard
            key={b.title}
            title={b.title}
            sub={b.sub}
            icon={b.icon}
            iconBgColor={b.color}
            selected={lead.cameraBrand === b.title}
            onClick={() => setLead({ ...lead, cameraBrand: b.title })}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Camera Count / Tier ─────────────────────────────────────────────

function Step3({ lead, setLead }: { lead: LeadState; setLead: (l: LeadState) => void }) {
  const tiers = [
    { title: "1 to 4 cameras", price: "₹14,999", priceNum: 14999, icon: <Camera size={22} />, color: "bg-green-50 text-green-600", sub: "Perfect for small shops or single floor homes" },
    { title: "5 to 8 cameras", price: "₹17,999", priceNum: 17999, icon: <LayoutGrid size={22} />, color: "bg-blue-50 text-blue-600", sub: "Great for medium offices and large homes" },
    { title: "9 to 16 cameras", price: "₹22,999", priceNum: 22999, icon: <Building2 size={22} />, color: "bg-purple-50 text-purple-600", sub: "Ideal for warehouses and small societies" },
    { title: "16+ cameras", price: "Custom", priceNum: 0, icon: <Sparkles size={22} />, color: "bg-indigo-50 text-indigo-600", sub: "Enterprise solutions for large complexes" },
  ];

  return (
    <div>
      <FloatingCard
        icon={<ShieldCheck size={16} />}
        label="FULL COVERAGE"
        title={
          <>
            <span className="font-bold"><span className="text-[#2563EB] font-black">REKHA-</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span></span> turns your cameras into a virtual security guard that never sleeps.
          </>
        }
      />
      <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">How many cameras?</h2>
      <div className="space-y-3">
        {tiers.map((t) => (
          <SelectCard
            key={t.title}
            title={t.title}
            sub={t.sub}
            icon={t.icon}
            iconBgColor={t.color}
            right={t.price}
            selected={lead.cameraCount === t.title}
            onClick={() => setLead({ ...lead, cameraCount: t.title, price: t.price, priceNum: t.priceNum })}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: AI Features ─────────────────────────────────────────────────────

function Step4({ lead, setLead }: { lead: LeadState; setLead: (l: LeadState) => void }) {
  const features = [
    { id: "Person Intrusion Detection", title: "Person Intrusion", icon: <Crosshair size={20} />, color: "text-rose-500 bg-rose-50" },
    { id: "Perimeter Intrusion Detection", title: "Perimeter Intrusion", icon: <Zap size={20} />, color: "text-indigo-500 bg-indigo-50" },
    { id: "Fire / Smoke Detection", title: "Fire / Smoke Detection", icon: <Flame size={20} />, color: "text-red-500 bg-red-50" },
    { id: "Camera Tampering Detection", title: "Camera Tampering Detection", icon: <AlertTriangle size={20} />, color: "text-amber-500 bg-amber-50" },
    { id: "Person Loitering", title: "Person Loitering", icon: <UserX size={20} />, color: "text-red-500 bg-red-50" },
    { id: "ANPR", title: "Automatic Number Plate Recognition (ANPR)", icon: <CarFront size={20} />, color: "text-cyan-500 bg-cyan-50" },
    { id: "No-Go Zone Detection", title: "No-Go Zone Detection", icon: <AlertOctagon size={20} />, color: "text-rose-600 bg-rose-50" },
    { id: "Footfall Count", title: "Footfall Count", icon: <Users size={20} />, color: "text-blue-500 bg-blue-50" },
    { id: "Crowd Monitoring", title: "Crowd Monitoring", icon: <Users size={20} />, color: "text-violet-500 bg-violet-50" },
    { id: "PPE Compliance", title: "PPE / Safety Compliance", icon: <ShieldCheck size={20} />, color: "text-emerald-500 bg-emerald-50" },
    { id: "Person Missing", title: "Person Missing (X min)", icon: <UserMinus size={20} />, color: "text-purple-500 bg-purple-50" },
    { id: "Cleanliness Monitoring", title: "Cleanliness Monitoring", icon: <Sparkles size={20} />, color: "text-teal-500 bg-teal-50" },
    { id: "Personal Monitoring", title: "Personal Monitoring", icon: <UserCheck size={20} />, color: "text-sky-500 bg-sky-50" },
  ];

  const toggle = (id: string) => {
    const current = lead.features;
    const updated = current.includes(id) ? current.filter((f) => f !== id) : [...current, id];
    setLead({ ...lead, features: updated });
  };

  return (
    <div>
      <FloatingCard
        dark
        icon={<Zap size={16} />}
        label="CONFIGURE VISION AI"
        title="Choose from 13 active AI models to customize your 24/7 protection."
      />
      <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Select events to monitor:</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
        {features.map((f, i) => {
          const selected = lead.features.includes(f.id);
          return (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggle(f.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors cursor-pointer shadow-sm ${selected ? "border-[#2563EB] bg-blue-50/50" : "border-slate-200 bg-white hover:border-blue-300"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selected ? "text-[#2563EB]" : f.color}`}>
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-[14px] leading-tight transition-colors ${selected ? "text-blue-950 font-medium" : "text-slate-700"}`}>
                  {f.title}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? "bg-[#2563EB] border-[#2563EB] text-white" : "border-slate-300 bg-white"}`}>
                <AnimatePresence>
                  {selected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <CheckCircle2 size={16} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 5: Summary / Anchor ────────────────────────────────────────────────

function Step5({ lead }: { lead: LeadState }) {
  return (
    <div>
      <FloatingCard
        icon={<ShieldCheck size={16} />}
        label="RETURN ON INVESTMENT"
        title={
          <>
            Monitoring 4 cameras needs 2 guards ₹40,000/mo.{" "}
            <span className="font-extrabold text-1.7xl"><span className="text-[#2563EB] font-black">REKHA-</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span> is ₹14,999/mo</span>
          </>
        }
      />
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center">
        Your <span className="text-[#2563EB] font-black">REKHA-</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span> is ready.
      </h2>

      {/* Premium Receipt Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-2xl mb-6 relative overflow-hidden flex flex-col"
      >
        {/* Top Header - Dark Theme */}
        <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
          {/* Abstract glowing background shapes */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />

          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 relative z-10">Per month AI cost</p>
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10"
          >
            {lead.price || "—"}
          </motion.p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 w-full" />

        {/* Details Section - Light Theme */}
        <div className="px-8 py-6 bg-white">
          <div className="space-y-0">
            {[
              { icon: <MapPin size={16} className="text-slate-400" />, label: "Location", value: lead.location || "—" },
              { icon: <Camera size={16} className="text-slate-400" />, label: "Camera", value: lead.cameraBrand || "—" },
              { icon: <LayoutGrid size={16} className="text-slate-400" />, label: "Coverage", value: lead.cameraCount || "—" },
              { icon: <Cpu size={16} className="text-slate-400" />, label: "AI Processing", value: "On-device — no cloud", highlight: true },
              { icon: <Zap size={16} className="text-slate-400" />, label: "Features", value: lead.features.length > 0 ? lead.features.join(", ") : "None selected" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 group">
                <div className="flex items-center gap-3">
                  {row.icon}
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{row.label}</span>
                </div>
                <div className="text-right flex-1 pl-4">
                  {row.highlight ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[13px] font-bold">
                      {row.value}
                    </span>
                  ) : (
                    <span className="text-[14px] font-semibold text-slate-800 leading-tight">
                      {row.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step 6: Lead Capture ────────────────────────────────────────────────────

function Step6({ lead, setLead, submitted, setSubmitted, resetForm }: { lead: LeadState; setLead: (l: LeadState) => void, submitted: boolean, setSubmitted: (b: boolean) => void, resetForm: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.from("rekha_leads").insert([
        {
          full_name: lead.name,
          phone: lead.phone,
          state: lead.state,
          city: lead.city,
          pincode: lead.pincode,
          location_type: lead.location,
          camera_brand: lead.cameraBrand,
          camera_count: parseInt(lead.cameraCount) || 0,
          features: lead.features,
          total_quote: lead.priceNum,
          status: "New"
        }
      ]);

      if (error) {
        console.error("Supabase Error:", error);
        setSubmitError("Connection timeout. Please try clicking submit again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Catch Error:", err);
      setSubmitError("Connection timeout. Please try clicking submit again.");
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-20 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 blur-3xl rounded-full pointer-events-none" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center mb-8 shadow-lg shadow-green-500/30 text-white"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Received.</h2>
        <p className="text-slate-500 text-lg max-w-sm mb-10 font-medium leading-relaxed">
          Our team is reviewing your configuration for {lead.city || "your city"}. We will WhatsApp you shortly from our official number.
        </p>
        <div className="flex flex-row items-center justify-center gap-6 mt-10">
          <button
            onClick={resetForm}
            className="px-8 py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-bold transition-all shadow-sm"
          >
            Fill another
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-10 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-900/20 hover:scale-[1.03]"
          >
            Done
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Last step.</h2>
      <p className="text-lg text-slate-500 mb-10 font-medium">
        We'll WhatsApp you when your<br></br><span className="font-bold"><span className="text-[#2563EB] font-black"> REKHA-</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span></span> is ready to ship.
      </p>

      <form onSubmit={handleSubmit} id="lead-form" className="space-y-5 pb-8">
        {[
          { key: "name", label: "Your Name", placeholder: "Rahul Sharma", type: "text" },
          { key: "phone", label: "WhatsApp / Phone Number", placeholder: "9876543210", type: "tel" },
          { key: "state", label: "State", placeholder: "Maharashtra", type: "text" },
          { key: "city", label: "City", placeholder: "Mumbai", type: "text" },
          { key: "pincode", label: "Pincode", placeholder: "400001", type: "text" },
        ].map((field) => (
          <div key={field.key} className="relative group">
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest group-focus-within:text-[#2563EB] transition-colors">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={lead[field.key as keyof LeadState] as string}
              onChange={(e) => setLead({ ...lead, [field.key]: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 text-slate-900 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] placeholder:text-slate-400 outline-none transition-all bg-white"
            />
          </div>
        ))}

        <div className="pt-8 relative">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-start gap-3">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
              <p>{submitError}</p>
            </div>
          )}
          {/* Glowing effect behind button */}


          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-[#2563EB] opacity-70 cursor-not-allowed" : "bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-900/10"}`}
          >

            {isSubmitting ? (
              <Loader2 className="animate-spin relative z-10" size={24} />
            ) : (
              <CheckCircle2 size={24} className="relative z-10" />
            )}
            <span className="relative z-10">{isSubmitting ? "Securing your spot..." : "Book my spot — Free"}</span>
          </motion.button>
          <p className="text-center text-[13px] font-bold text-slate-400 mt-6 flex items-center justify-center gap-2">
            <ShieldCheck size={14} />
            No payment now. No spam. Just one message.
          </p>
        </div>
      </form>
    </div>
  );
}

// ─── Main Funnel Component ───────────────────────────────────────────────────

export default function FunnelPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 6;

  const [lead, setLead] = useState<LeadState>({
    location: "",
    cameraBrand: "",
    cameraCount: "",
    price: "",
    priceNum: 0,
    features: [],
    name: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
  });

  const next = () => {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    if (currentStep === 1) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setDirection(-1);
    setLead({
      location: "",
      cameraBrand: "",
      cameraCount: "",
      price: "",
      priceNum: 0,
      features: [],
      name: "",
      phone: "",
      state: "",
      city: "",
      pincode: "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 lead={lead} setLead={setLead} />;
      case 2: return <Step2 lead={lead} setLead={setLead} />;
      case 3: return <Step3 lead={lead} setLead={setLead} />;
      case 4: return <Step4 lead={lead} setLead={setLead} />;
      case 5: return <Step5 lead={lead} />;
      case 6: return <Step6 lead={lead} setLead={setLead} submitted={submitted} setSubmitted={setSubmitted} resetForm={resetForm} />;
      default: return null;
    }
  };

  const getNextButtonState = () => {
    let disabled = false;
    let text = "Next Step";

    if (currentStep === 1 && !lead.location) disabled = true;
    if (currentStep === 2 && !lead.cameraBrand) disabled = true;
    if (currentStep === 3 && !lead.cameraCount) disabled = true;

    if (currentStep === 4) {
      text = "See my price";
    }

    if (currentStep === 5) {
      text = "I want this — Continue";
    }

    return { disabled, text };
  };

  const nextBtnState = getNextButtonState();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      {/* Dynamic Background subtle gradient */}


      {/* Top bar (Header) */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-black/10 px-6 pt-4 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-row items-center justify-start gap-3 mb-1 p-0 m-0">
            <img src="/Rekha-Ai logo.png" alt="Rekha AI Logo" className="h-10 md:h-14 w-auto object-contain p-0 m-0" />
            <p className="font-black text-2xl md:text-3xl tracking-widest text-left">
              <span className="text-slate-900 font-black">REKHA-</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-2 mb-0">
            <span className="text-slate-500 font-semibold text-sm">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <RoadmapTimeline step={currentStep} total={totalSteps} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 pt-4 pb-40 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Footer */}
      {!submitted && currentStep < 6 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-50"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={back}
                className="px-6 py-3 rounded-lg text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Back
              </motion.button>
            ) : (
              <div className="w-[100px]"></div> /* Empty spacer to balance flex-between on step 1 */
            )}

            <motion.button
              whileHover={!nextBtnState.disabled ? { scale: 1.02 } : {}}
              whileTap={!nextBtnState.disabled ? { scale: 0.98 } : {}}
              onClick={next}
              disabled={nextBtnState.disabled}
              className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${nextBtnState.disabled ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-900/10"}`}
            >

              <span className="relative z-10">{nextBtnState.text}</span>
              <ArrowRight size={18} className="relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
