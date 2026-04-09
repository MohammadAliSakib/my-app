export interface CompanyType {
  _id: string;
  name: string;
  sector: string;
  logoUrl: string;
  headquarters: string;
  foundedYear: number;
  netWorth: string;
}

import { Building2, MapPin } from "lucide-react";

export default function CompanyCard({ company, rank }: { company: CompanyType; rank: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 w-1/2">
        <div className="text-xl font-bold text-gray-500 w-8">{rank}.</div>
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={company.name} className="w-12 h-12 object-contain" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
            <Building2 className="text-gray-400" />
          </div>
        )}
        <div className="truncate pr-4">
          <h3 className="font-bold text-lg text-gray-900 truncate">{company.name}</h3>
          <p className="text-sm text-gray-500 truncate">{company.sector}</p>
        </div>
      </div>
      
      <div className="hidden md:flex flex-col w-1/4">
        <div className="flex items-center text-gray-600 border-l border-gray-200 pl-4 truncate">
           <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
           <span className="text-sm truncate">{company.headquarters}</span>
        </div>
      </div>

      <div className="w-1/4 flex flex-col items-end pr-4">
        <span className="text-green-700 font-bold text-lg">{company.netWorth}</span>
        <span className="text-xs text-gray-400">Est. {company.foundedYear}</span>
      </div>
    </div>
  );
}
