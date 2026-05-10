"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/types/lead";
import Link from "next/link";
import { 
  ArrowLeft, Search, Filter, ShieldAlert, 
  MapPin, Camera, Zap, FileText, User
} from "lucide-react";

export default function LeadsExplorer() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("rekha_leads").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
      } else {
        setLeads(data as Lead[] || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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

    const channel = supabase
      .channel("realtime-explorer")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rekha_leads" },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Hardcoded 13 AI Features
  const AI_FEATURES = [
    "Person Intrusion",
    "Person Loitering",
    "Wrong Way Detection",
    "Line Crossing",
    "Overcrowding",
    "Footfall Count",
    "Fire / Smoke Detection",
    "Violence / Fight Detection",
    "PPE Compliance",
    "Cleanliness Monitoring",
    "Camera Tampering Detection",
    "Animal / Dog Detection",
    "Vehicle Intrusion"
  ];

  // Extract unique filter options dynamically from data
  const allLocations = useMemo(() => {
    const locSet = new Set<string>();
    leads.forEach(l => {
        if(l.location_type) locSet.add(l.location_type);
    });
    return ["All", ...Array.from(locSet)];
  }, [leads]);

  const allCities = useMemo(() => {
    const citySet = new Set<string>();
    leads.forEach(l => {
        if(l.city) {
          // Normalize to title case for cleaner dropdowns
          const normalizedCity = l.city.charAt(0).toUpperCase() + l.city.slice(1).toLowerCase();
          citySet.add(normalizedCity);
        }
    });
    return ["All", ...Array.from(citySet)];
  }, [leads]);

  // Apply filters
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch = 
        (l.full_name?.toLowerCase() ?? "").includes(search.toLowerCase()) || 
        (l.phone ?? "").includes(search) ||
        (l.pincode ?? "").includes(search);
        
        const matchesFeature = featureFilters.length === 0 || (l.features && l.features.some(f => featureFilters.includes(f)));
      const matchesLocation = locationFilter === "All" || l.location_type === locationFilter;
      const matchesCity = cityFilter === "All" || (l.city && l.city.toLowerCase() === cityFilter.toLowerCase());

      return matchesSearch && matchesFeature && matchesLocation && matchesCity;
    });
  }, [leads, search, featureFilters, locationFilter, cityFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#FF4500] font-bold text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            <img 
              src="/Rekha-Ai logo.png" 
              alt="Rekha AI Logo" 
              className="h-24 w-auto object-contain"
            />
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data Explorer</h1>
              <p className="text-slate-500 font-medium mt-1">Detailed breakdown of every client request and configuration.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            Showing {filteredLeads.length} Leads
          </div>
        </div>
      </header>

      {/* Advanced Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name, phone, city, or pincode..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/20 outline-none transition-all"
          />
        </div>
        
        {/* Feature Filter (Multi-select) */}
        <div className="flex-1 md:max-w-xs relative">
          <label className="absolute -top-2 left-3 bg-white z-10 px-1 text-[10px] font-black uppercase text-[#FF4500] tracking-wider">AI Feature</label>
          <div 
            onClick={() => setIsFeatureDropdownOpen(!isFeatureDropdownOpen)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 cursor-pointer flex items-center justify-between transition-all hover:border-[#FF4500]"
          >
            <span className="truncate">
              {featureFilters.length === 0 ? "All Features" : `${featureFilters.length} Selected`}
            </span>
            <Filter className="text-slate-400" size={16} />
          </div>
          
          {isFeatureDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden">
              <div className="p-2 space-y-1">
                {AI_FEATURES.map((feature) => (
                  <label key={feature} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={featureFilters.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeatureFilters([...featureFilters, feature]);
                          } else {
                            setFeatureFilters(featureFilters.filter(f => f !== feature));
                          }
                        }}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-[#FF4500] checked:bg-[#FF4500] checked:border-[#FF4500] focus:ring-[#FF4500] focus:ring-offset-0 transition-all cursor-pointer"
                      />
                      <svg className="absolute w-3 h-3 text-white left-1 top-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="flex-1 md:max-w-xs relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black uppercase text-[#FF4500] tracking-wider">Location Type</label>
          <select 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/20 outline-none appearance-none"
          >
            {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* City Filter */}
        <div className="flex-1 md:max-w-xs relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black uppercase text-[#FF4500] tracking-wider">City</label>
          <select 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/20 outline-none appearance-none"
          >
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold">Loading exact data...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <ShieldAlert size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No leads found</h3>
          <p className="text-slate-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Client Details</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Camera Setup</th>
                  <th className="px-6 py-4">AI Features</th>
                  <th className="px-6 py-4">Quote</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLeads.map((lead) => {
                  const dateObj = new Date(lead.created_at);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-slate-900 font-medium">{dateObj.toLocaleDateString("en-IN")}</p>
                        <p className="text-xs text-slate-500">{dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-900 font-black text-base">{lead.full_name}</p>
                        <p className="text-slate-600 font-medium">{lead.phone}</p>
                        <p className="text-xs text-slate-400 mt-1">{lead.city || 'N/A'}, {lead.state || ''} {lead.pincode || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                          {lead.location_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900">{lead.camera_count} Cameras</span>
                          <span className="text-xs text-slate-500">{lead.camera_brand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[250px] whitespace-normal">
                          {lead.features && lead.features.length > 0 ? (
                            lead.features.map(f => (
                              <span key={f} className="bg-orange-50 text-[#FF4500] text-[10px] font-bold px-2 py-0.5 rounded border border-orange-100">
                                {f}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-xs">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900 text-base">
                          {lead.total_quote ? `₹${lead.total_quote.toLocaleString("en-IN")}` : "Custom"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 border ${
                          lead.status === "New" ? "bg-orange-50 text-orange-600 border-orange-200" :
                          lead.status === "Closed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          lead.status === "Lost" ? "bg-red-50 text-red-600 border-red-200" :
                          "bg-blue-50 text-blue-600 border-blue-200"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
