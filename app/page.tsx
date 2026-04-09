"use client";

import { useEffect, useState } from "react";
import CompanyCard, { CompanyType } from "@/components/CompanyCard";
import { Search, Loader2 } from "lucide-react";

export default function Home() {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/companies?search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) {
        setCompanies(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCompanies(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex flex-col leading-none">
             <span className="text-3xl font-extrabold tracking-tighter uppercase text-slate-900">
               Forbes
             </span>
             <span className="text-xs font-semibold tracking-widest text-[#00a651] uppercase mt-1">
               BD Companies
             </span>
          </div>
          <div className="flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <input 
              type="text"
              placeholder="Search by name or sector..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border shadow-inner border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a651] focus:bg-white outline-none transition-all placeholder-gray-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <a href="/admin" className="text-sm font-semibold uppercase tracking-wider hover:text-[#00a651] text-gray-700 transition">
              Admin Login
            </a>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden rounded-lg">
          <div className="bg-slate-900 text-white px-4 py-3 flex text-xs font-bold uppercase tracking-widest">
             <div className="w-1/2 pl-12 text-slate-300">Rank & Name</div>
             <div className="w-1/4 hidden md:block border-l border-slate-700 pl-4 text-slate-300">Headquarters</div>
             <div className="w-1/4 text-right pr-4 text-slate-300">Net Worth</div>
          </div>
          
          <div className="divide-y divide-gray-100 min-h-[400px]">
             {loading ? (
                <div className="flex justify-center items-center h-[400px] text-slate-400 space-y-4 flex-col">
                  <Loader2 className="w-10 h-10 animate-spin text-[#00a651]" />
                  <span className="font-semibold uppercase tracking-widest text-sm text-slate-500">Loading Data</span>
                </div>
             ) : companies.length > 0 ? (
                companies.map((co, idx) => (
                  <CompanyCard key={co._id as string} company={co} rank={idx + 1} />
                ))
             ) : (
                <div className="flex justify-center items-center h-[400px] text-gray-500 font-medium">
                  No companies found matching "{searchTerm}"
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
