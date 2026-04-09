import { useState, useEffect } from "react";
import { CompanyType } from "./CompanyCard";
import { X } from "lucide-react";

export interface CompanyFormData {
  name: string;
  sector: string;
  logoUrl: string;
  headquarters: string;
  foundedYear: number;
  netWorth: string;
}

export default function CompanyModal({
  company,
  onClose,
  onSave
}: {
  company: CompanyType | null;
  onClose: () => void;
  onSave: (data: CompanyFormData) => void;
}) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    sector: "",
    logoUrl: "",
    headquarters: "",
    foundedYear: 2000,
    netWorth: ""
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        sector: company.sector,
        logoUrl: company.logoUrl,
        headquarters: company.headquarters,
        foundedYear: company.foundedYear,
        netWorth: company.netWorth
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
       <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
          <div className="flex justify-between items-center bg-slate-100 p-4 border-b">
             <h3 className="font-bold text-lg text-slate-800">{company ? "Edit Company" : "Add New Company"}</h3>
             <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 transition"><X className="w-5 h-5"/></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-sm font-medium mb-1 text-slate-700">Company Name</label>
                 <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00a651] outline-none transition" 
                   value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
               </div>
               <div className="flex-1">
                 <label className="block text-sm font-medium mb-1 text-slate-700">Sector/Industry</label>
                 <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00a651] outline-none transition" 
                   value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} required />
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1 text-slate-700">Logo Image URL</label>
               <input type="url" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00a651] outline-none transition" 
                 placeholder="https://..."
                 value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} />
             </div>

             <div className="flex gap-4">
               <div className="flex-[2]">
                 <label className="block text-sm font-medium mb-1 text-slate-700">Headquarters Location</label>
                 <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00a651] outline-none transition" 
                   value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} required />
               </div>
               <div className="flex-1">
                 <label className="block text-sm font-medium mb-1 text-slate-700">Founded Year</label>
                 <input type="number" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00a651] outline-none transition" 
                   value={formData.foundedYear} onChange={e => setFormData({...formData, foundedYear: parseInt(e.target.value)})} required />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium mb-1 text-slate-700">Net Worth / Revenue Valuation</label>
               <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00a651] outline-none transition" 
                 placeholder="e.g. $1.5B"
                 value={formData.netWorth} onChange={e => setFormData({...formData, netWorth: e.target.value})} required />
             </div>

             <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded font-medium text-slate-700 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#00a651] text-white rounded font-medium hover:bg-green-700 transition shadow-sm">
                  {company ? "Save Changes" : "Add Company"}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
}
