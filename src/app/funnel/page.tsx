"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Lead, LeadStatus } from "@/types/lead";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
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
  Loader2,
  Cpu,
  UserPlus,
} from "lucide-react";

// --- Types ---

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

// --- Motion Variants ---

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
};

const transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

// --- RoadmapTimeline (strictly 2 steps) ---

function RoadmapTimeline({ step, total }: { step: number; total: number }) {
  const steps = [
    { label: "AI Models", icon: <Cpu size={14} /> },
    { label: "Contact", icon: <UserPlus size={14} /> },
  ];

  return (
    <div className="w-full pt-2 pb-0">
      <div className="relative flex justify-between">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2" />
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
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 relative ${isCompleted ? "bg-[#2563EB] border-[#2563EB] text-white" : isActive ? "bg-white border-[#2563EB] text-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-2 ring-[#2563EB]/20" : "bg-slate-100 border-slate-200 text-slate-400"}`}
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
              <span className={`hidden md:block mt-2 text-[10px] font-bold uppercase tracking-tighter transition-colors duration-300 ${isActive ? "text-[#2563EB]" : isCompleted ? "text-slate-600" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- FloatingCard ---

function FloatingCard({ icon, label, title, sub, dark = false, extra }: {
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
      {!dark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />}
      {dark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />}
      {(icon || label) && (
        <div className="flex items-center gap-2 mb-3 relative z-10">
          {icon && <span className="text-amber-500">{icon}</span>}
          {label && <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>}
        </div>
      )}
      <p className="text-base font-semibold leading-relaxed text-slate-600 relative z-10">{title}</p>
      {sub && <p className={`text-sm mt-2 relative z-10 ${dark ? "text-slate-400" : "text-slate-500"}`}>{sub}</p>}
      {extra && <div className="relative z-10">{extra}</div>}
    </motion.div>
  );
}

// ============================================================
// NEW STEP 1: AI Features Selection  (was old Step 4)
// ============================================================

function StepAIFeatures({ lead, setLead }: { lead: LeadState; setLead: (l: LeadState) => void }) {
  const features = [
    { id: "Person Intrusion Detection",    title: "Person Intrusion",                          icon: <Crosshair size={20} />,     color: "text-rose-500 bg-rose-50" },
    { id: "Perimeter Intrusion Detection", title: "Perimeter Intrusion",                       icon: <Zap size={20} />,           color: "text-indigo-500 bg-indigo-50" },
    { id: "Fire / Smoke Detection",        title: "Fire / Smoke Detection",                    icon: <Flame size={20} />,         color: "text-red-500 bg-red-50" },
    { id: "Camera Tampering Detection",    title: "Camera Tampering Detection",                icon: <AlertTriangle size={20} />,  color: "text-amber-500 bg-amber-50" },
    { id: "Person Loitering",             title: "Person Loitering",                          icon: <UserX size={20} />,         color: "text-red-500 bg-red-50" },
    { id: "ANPR",                          title: "Automatic Number Plate Recognition (ANPR)", icon: <CarFront size={20} />,      color: "text-cyan-500 bg-cyan-50" },
    { id: "No-Go Zone Detection",          title: "No-Go Zone Detection",                      icon: <AlertOctagon size={20} />,  color: "text-rose-600 bg-rose-50" },
    { id: "Footfall Count",               title: "Footfall Count",                            icon: <Users size={20} />,         color: "text-blue-500 bg-blue-50" },
    { id: "Crowd Monitoring",             title: "Crowd Monitoring",                          icon: <Users size={20} />,         color: "text-violet-500 bg-violet-50" },
    { id: "PPE Compliance",               title: "PPE / Safety Compliance",                   icon: <ShieldCheck size={20} />,   color: "text-emerald-500 bg-emerald-50" },
    { id: "Person Missing",               title: "Person Missing (X min)",                    icon: <UserMinus size={20} />,     color: "text-purple-500 bg-purple-50" },
    { id: "Cleanliness Monitoring",        title: "Cleanliness Monitoring",                    icon: <Sparkles size={20} />,      color: "text-teal-500 bg-teal-50" },
    { id: "Personal Monitoring",          title: "Personal Monitoring",                       icon: <UserCheck size={20} />,    color: "text-sky-500 bg-sky-50" },
  ];

  const toggle = (id: string) => {
    const updated = lead.features.includes(id)
      ? lead.features.filter((f) => f !== id)
      : [...lead.features, id];
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
                <p className={`font-medium text-[14px] leading-tight transition-colors ${selected ? "text-blue-950" : "text-slate-700"}`}>
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

// ============================================================
// NEW STEP 2: Contact Form  (was old Step 6)
// ============================================================

function StepContactForm({
  lead,
  setLead,
  submitted,
  setSubmitted,
  resetForm,
  leadId,
}: {
  lead: LeadState;
  setLead: (l: LeadState) => void;
  submitted: boolean;
  setSubmitted: (b: boolean) => void;
  resetForm: () => void;
  leadId: string | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let supabaseError = null;

      if (leadId) {
        // Partial lead exists — update it with contact info
        const { error } = await supabase
          .from("rekha_leads")
          .update({
            full_name: lead.name,
            phone: lead.phone,
            state: lead.state,
            city: lead.city,
            pincode: lead.pincode,
            status: "New" as LeadStatus,
          })
          .eq("id", leadId);
        supabaseError = error;
      } else {
        // Fallback: partial capture failed — insert everything together
        const { error } = await supabase.from("rekha_leads").insert([
          {
            full_name: lead.name,
            phone: lead.phone,
            state: lead.state,
            city: lead.city,
            pincode: lead.pincode,
            features: lead.features,
            status: "New" as LeadStatus,
          },
        ]);
        supabaseError = error;
      }

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        setSubmitError("Connection timeout. Please try clicking submit again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
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
          Our team is reviewing your configuration for {lead.city ?? "your city"}. We will WhatsApp you shortly from our official number.
        </p>
        <div className="flex flex-row items-center justify-center gap-6 mt-10">
          <button
            onClick={resetForm}
            className="px-8 py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-bold transition-all shadow-sm"
          >
            Fill another
          </button>
          <button
            onClick={() => { window.location.href = "/"; }}
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
        {"We'll WhatsApp you when your"}
        <br />
        <span className="font-bold">
          <span className="text-[#2563EB] font-black"> REKHA-</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span>
        </span>
        {" is ready to ship."}
      </p>

      <form onSubmit={handleSubmit} id="lead-form" className="space-y-5 pb-8">
        {[
          { key: "name",    label: "Your Name",               placeholder: "Rahul Sharma", type: "text" },
          { key: "phone",   label: "WhatsApp / Phone Number", placeholder: "9876543210",   type: "tel"  },
          { key: "state",   label: "State",                   placeholder: "Maharashtra",  type: "text" },
          { key: "city",    label: "City",                    placeholder: "Mumbai",       type: "text" },
          { key: "pincode", label: "Pincode",                 placeholder: "400001",       type: "text" },
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-[#2563EB] opacity-70 cursor-not-allowed" : "bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-900/10"}`}
          >
            {isSubmitting ? <Loader2 className="animate-spin relative z-10" size={24} /> : <CheckCircle2 size={24} className="relative z-10" />}
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

// ============================================================
// MAIN FUNNEL COMPONENT  (2 steps, hard-coded)
// ============================================================

export default function FunnelPage() {
  // Hard-coded to 2 — never changes
  const totalSteps = 2;

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  // Holds the UUID of the partial lead row created after Step 1
  const [leadId, setLeadId] = useState<string | null>(null);

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

  // Triggered in the background when the user clicks Next on Step 1
  const savePartialLead = async () => {
    try {
      if (leadId) {
        // User went back and changed features — update existing row
        const { error } = await supabase
          .from("rekha_leads")
          .update({ features: lead.features })
          .eq("id", leadId);
        if (error) console.error("Supabase partial-update error:", error);
      } else {
        // First capture — insert partial row and store its ID
        const { data, error } = await supabase
          .from("rekha_leads")
          .insert([{ features: lead.features, status: "New" as LeadStatus }])
          .select();
        if (error) {
          console.error("Supabase partial-insert error:", error);
          return;
        }
        const rows = data as Lead[] | null;
        if (rows && rows[0]?.id) {
          setLeadId(rows[0].id);
        }
      }
    } catch (err) {
      console.error("Error in savePartialLead:", err);
    }
  };

  const next = () => {
    if (currentStep === 1) {
      // Fire-and-forget so the UI advances immediately
      void savePartialLead();
    }
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (currentStep === 1) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setDirection(-1);
    setLeadId(null);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 1 = AI Features, Step 2 = Contact Form — no other cases exist
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepAIFeatures lead={lead} setLead={setLead} />;
      case 2:
        return (
          <StepContactForm
            lead={lead}
            setLead={setLead}
            submitted={submitted}
            setSubmitted={setSubmitted}
            resetForm={resetForm}
            leadId={leadId}
          />
        );
      default:
        return null;
    }
  };

  // Disable Next on Step 1 until at least one feature is selected
  const nextDisabled = currentStep === 1 && lead.features.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-black/10 px-6 pt-4 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-row items-center justify-start gap-3 mb-1 p-0 m-0">
            <img src="/Rekha-Ai logo.png" alt="Rekha AI Logo" className="h-10 md:h-14 w-auto object-contain p-0 m-0" />
            <p className="font-black text-2xl md:text-3xl tracking-widest text-left">
              <span className="text-slate-900 font-black">REKHA-</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 via-[60%] to-[#FACC15]">Ai</span>
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

      {/* Sticky Footer — Step 1: Next button only */}
      {!submitted && currentStep === 1 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-50"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-end gap-4">
            <motion.button
              whileHover={!nextDisabled ? { scale: 1.02 } : {}}
              whileTap={!nextDisabled ? { scale: 0.98 } : {}}
              onClick={next}
              disabled={nextDisabled}
              className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${nextDisabled ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-900/10"}`}
            >
              <span className="relative z-10">Next</span>
              <ArrowRight size={18} className="relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Sticky Footer — Step 2: Back button only (contact form has its own Submit) */}
      {!submitted && currentStep === 2 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-50"
        >
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={back}
              className="px-6 py-3 rounded-lg text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
