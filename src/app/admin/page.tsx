"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/types/lead";
import { 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, CartesianGrid
} from "recharts";
import { 
  Search, ShieldAlert, Target, TrendingUp, Users, Activity, 
  MessageCircle, RefreshCw, LayoutList, Zap
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA FALLBACK ---
const MOCK_LEADS: Lead[] = [
  { id: "1", created_at: new Date(Date.now() - 86400000 * 1).toISOString(), full_name: "Rahul Sharma", phone: "9876543210", location_type: "Society / apartment", camera_brand: "Hikvision", camera_count: 12, features: ["Person Loitering", "ANPR"], total_quote: 37999, city: "Mumbai", status: "New" },
  { id: "2", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), full_name: "Priya Singh", phone: "9123456780", location_type: "Shop / store", camera_brand: "CP Plus", camera_count: 4, features: ["Person Intrusion"], total_quote: 14999, city: "Delhi", status: "Called" },
  { id: "3", created_at: new Date(Date.now() - 86400000 * 3).toISOString(), full_name: "Amit Patel", phone: "9988776655", location_type: "Warehouse / storage", camera_brand: "Dahua / Imou", camera_count: 20, features: ["Fire / Smoke Detection", "PPE Compliance"], total_quote: 85000, city: "Ahmedabad", status: "Closed" },
  { id: "4", created_at: new Date(Date.now() - 86400000 * 0).toISOString(), full_name: "Neha Gupta", phone: "9876501234", location_type: "Home", camera_brand: "WiFi camera (no DVR)", camera_count: 2, features: ["Person Loitering"], total_quote: 14999, city: "Bangalore", status: "New" },
  { id: "5", created_at: new Date(Date.now() - 86400000 * 5).toISOString(), full_name: "Vikram Reddy", phone: "9001122334", location_type: "Office / business", camera_brand: "Hikvision", camera_count: 8, features: ["Cleanliness Monitoring"], total_quote: 19999, city: "Hyderabad", status: "Lost" },
];

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("rekha_leads").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
        setLeads([]);
      } else {
        setLeads(data as Lead[] || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setLeads([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Secondary client-side security check
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('rekha_admin_auth='));
    if (!authCookie || !authCookie.includes('true')) {
      window.location.href = '/admin/login';
      return;
    }

    fetchLeads();

    // Set up Realtime Subscription for Live Updates
    const channel = supabase
      .channel("realtime-leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rekha_leads" },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchLeads(); // Refetch to keep state perfectly synchronized
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: Lead["status"]) => {
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    // Real update
    try {
      await supabase.from("rekha_leads").update({ status: newStatus }).eq("id", id);
    } catch (err) {
      console.error("Error updating status:", err);
      fetchLeads(); // Revert on error
    }
  };

  // --- DERIVED STATE / ANALYTICS ---
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch = l.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                            l.phone?.includes(search) || 
                            l.city?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const activePipelineValue = useMemo(() => {
    return leads.filter((l) => l.status !== "Lost").reduce((sum, l) => sum + (l.total_quote || 0), 0);
  }, [leads]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const highValueTargets = leads.filter((l) => l.camera_count >= 8).length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;
  const conversionRate = totalLeads ? Math.round((closedLeads / totalLeads) * 100) : 0;

  // Chart data
  const velocityData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
    }
    leads.forEach((l) => {
      const dateStr = new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (days[dateStr] !== undefined) days[dateStr]++;
    });
    return Object.entries(days).map(([name, leads]) => ({ name, leads }));
  }, [leads]);

  const segmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const type = l.location_type || "Other";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const featureDemandData = useMemo(() => {
    const ALL_FEATURES = [
      "Person Intrusion", "Perimeter Intrusion", "Fire / Smoke Detection", 
      "Camera Tampering Detection", "Person Loitering", "Automatic Number Plate Recognition (ANPR)", 
      "No-Go Zone Detection", "Footfall Count", "Crowd Monitoring", 
      "PPE / Safety Compliance", "Person Missing (X min)", "Cleanliness Monitoring", 
      "Personal Monitoring"
    ];
    const counts: Record<string, number> = {};
    ALL_FEATURES.forEach(f => { counts[f] = 0; });

    leads.forEach((l) => {
      l.features?.forEach((feat) => {
        if (counts[feat] !== undefined) {
          counts[feat]++;
        } else {
          // Handle legacy/alternate names from mock data
          const altName = ALL_FEATURES.find(f => f.includes(feat) || feat.includes(f));
          if (altName) counts[altName]++;
          else counts[feat] = 1;
        }
      });
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const COLORS = ["#FF4500", "#ff7340", "#ff9d79", "#ffc6b3", "#cbd5e1"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 font-sans p-4 md:p-8">
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <img 
              src="/Rekha-Ai logo.png" 
              alt="Rekha AI Logo" 
              className="h-28 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-widest">REKHA AI ADMIN</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-xs font-bold text-orange-600 tracking-wider uppercase">Live Feed Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/leads"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            <LayoutList size={16} />
            Data Explorer
          </Link>
          <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pipeline Value</p>
              <p className="text-2xl font-black text-[#FF4500]">
                ₹{activePipelineValue.toLocaleString("en-IN")}
              </p>
            </div>
            <TrendingUp className="text-orange-500/50" size={32} />
          </div>
        </div>
      </header>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Leads</p>
            <p className="text-2xl font-black text-slate-900">{totalLeads}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Activity size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Leads</p>
            <p className="text-2xl font-black text-slate-900">{newLeads}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Target size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">High-Value (8+ Cams)</p>
            <p className="text-2xl font-black text-slate-900">{highValueTargets}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Conversion Rate</p>
            <p className="text-2xl font-black text-slate-900">{conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[#FF4500]" /> Lead Velocity (7 Days)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "#FF4500", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="leads" stroke="#FF4500" strokeWidth={3} dot={{ fill: "#FF4500", r: 4 }} activeDot={{ r: 6, fill: "#fff", stroke: "#FF4500", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Target size={16} className="text-[#FF4500]" /> Market Segment
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* NEW: Feature Demand Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap size={200} />
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <Zap size={18} />
            </div>
            High Demand AI Features
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureDemandData} margin={{ top: 20, right: 10, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontFamily="system-ui"
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={110}
                  dy={15}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: "#f8fafc", radius: 8 }}
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", padding: "16px" }}
                  itemStyle={{ color: "#2563EB", fontWeight: "900", fontSize: "18px" }}
                  labelStyle={{ color: "#64748b", fontSize: "12px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {["All", "New", "Called", "Closed", "Lost"].map((s) => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  statusFilter === s 
                    ? "bg-[#FF4500] text-white shadow-md shadow-orange-500/20" 
                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 flex gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] outline-none transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={fetchLeads} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
              title="Force Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Setup</th>
                <th className="px-6 py-4">Quote</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-[#FF4500]" size={24} />
                    Loading Live Leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                      <ShieldAlert size={40} className="text-orange-500 mb-4 opacity-50" />
                      <h3 className="text-lg font-bold text-slate-800 mb-2">No leads visible</h3>
                      <p className="text-sm text-slate-500">
                        If you just submitted a lead and it is not appearing here, it means Supabase Row Level Security (RLS) is blocking the dashboard from reading the data. 
                        Please go to your Supabase Dashboard ➔ Authentication ➔ Policies and ensure a <strong>SELECT</strong> policy exists for anonymous users on the `rekha_leads` table.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => {
                  const dateObj = new Date(l.created_at);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-slate-900 font-medium">{dateObj.toLocaleDateString("en-IN")}</p>
                        <p className="text-xs text-slate-500">{dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-900 font-bold">{l.full_name}</p>
                        <p className="text-xs text-slate-500">{l.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">{l.location_type}</p>
                        <p className="text-xs text-slate-400">{l.city}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="bg-slate-100 text-slate-600 font-medium text-[11px] px-2 py-1 rounded w-fit border border-slate-200">{l.camera_brand}</span>
                          <span className="text-xs font-bold text-orange-600">{l.camera_count} Cameras</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900 tracking-wide">
                          {l.total_quote ? `₹${l.total_quote.toLocaleString("en-IN")}` : "Custom"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={l.status || "New"}
                          onChange={(e) => handleStatusChange(l.id || "", e.target.value as LeadStatus)}
                          className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 border appearance-none cursor-pointer outline-none transition-colors ${
                            (l.status || "New") === "New" ? "bg-orange-50 text-orange-600 border-orange-200 focus:ring-2 focus:ring-orange-500/20" :
                            (l.status || "New") === "Called" ? "bg-blue-50 text-blue-600 border-blue-200 focus:ring-2 focus:ring-blue-500/20" :
                            (l.status || "New") === "Closed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-2 focus:ring-emerald-500/20" :
                            "bg-red-50 text-red-600 border-red-200 focus:ring-2 focus:ring-red-500/20"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Called">Called</option>
                          <option value="Closed">Closed</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a 
                          href={`https://wa.me/${(l.phone || "").replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(l.full_name || "Client")},%20I'm%20looking%20at%20your%20configuration%20for%20Rekha%20AI%20in%20${encodeURIComponent(l.city || "your city")}.%20Can%20we%20talk?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 hover:border-green-500"
                          title="WhatsApp Client"
                        >
                          <MessageCircle size={18} />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
