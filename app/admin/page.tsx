"use client";

import { useEffect, useState } from "react";
import { CompanyType } from "@/components/CompanyCard";
import { Plus, Edit2, Trash2, LogOut, Eye, EyeOff, AlertTriangle } from "lucide-react";
import CompanyModal, { CompanyFormData } from "@/components/CompanyModal";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);

  // Login form states for simple inline login if no token
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminToken");
      if (saved) {
        setToken(saved);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch {
      setLoginError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/companies`);
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

  const handleAdd = async (data: CompanyFormData) => {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { 
         "Content-Type": "application/json",
         "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
       setIsModalOpen(false);
       fetchCompanies();
    } else {
       alert("Failed to add company. Unauthorized?");
    }
  };

  const handleEdit = async (data: CompanyFormData) => {
    if (!editingCompany) return;
    const res = await fetch(`/api/companies/${editingCompany._id}`, {
      method: "PUT",
      headers: { 
         "Content-Type": "application/json",
         "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
       setIsModalOpen(false);
       setEditingCompany(null);
       fetchCompanies();
    } else {
       alert("Failed to update company. Unauthorized?");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingCompanyId(id);
  };

  const confirmDelete = async () => {
    if (!deletingCompanyId) return;
    const res = await fetch(`/api/companies/${deletingCompanyId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      fetchCompanies();
    } else {
      alert("Failed to delete company. Unauthorized?");
    }
    setDeletingCompanyId(null);
  };

  // Render Login if no token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00a651] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 z-10 transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Gateway</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Please enter your credentials to proceed.</p>
          </div>
          
          {loginError && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100 flex items-center justify-center">{loginError}</div>}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Username</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#00a651] focus:bg-white outline-none transition font-medium" 
                value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className="w-full bg-slate-50 border border-slate-200 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-[#00a651] focus:bg-white outline-none transition font-medium" 
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-3 rounded-lg hover:bg-[#00a651] hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold tracking-wide mt-2">
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
          <div className="mt-6 text-center text-xs font-semibold text-slate-400 bg-slate-50 py-2 rounded-md">
             Hint: admin / admin123
          </div>
          <div className="mt-8 text-center">
             <a href="/" className="text-[#00a651] hover:underline text-sm font-semibold transition">← Back to Main Directory</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
           <h1 className="text-xl font-bold flex items-center gap-3 tracking-wide">
             <div className="bg-[#00a651] p-1.5 rounded-md">
                 <Edit2 className="w-4 h-4 text-white" />
             </div>
             Admin Dashboard
           </h1>
           <div className="flex items-center gap-6 font-medium">
             <a href="/" className="text-sm hover:text-[#00a651] transition">View Public Site</a>
             <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 hover:border-red-400">
               <LogOut className="w-4 h-4" /> Logout
             </button>
           </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Company Management</h2>
             <p className="text-slate-500 font-medium">Add, edit, or remove companies from the directory.</p>
           </div>
           
           <button 
             onClick={() => { setEditingCompany(null); setIsModalOpen(true); }}
             className="bg-[#00a651] hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition hover:shadow-lg hover:-translate-y-0.5"
           >
             <Plus className="w-5 h-5 shadow-sm" /> Add New Company
           </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4 font-bold w-1/3">Company Profile</th>
                <th className="px-6 py-4 font-bold">Sector</th>
                <th className="px-6 py-4 font-bold">Registration / HW</th>
                <th className="px-6 py-4 font-bold">Net Worth</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map(co => (
                <tr key={co._id} className="hover:bg-slate-50/80 transition group">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-4">
                     {co.logoUrl ? (
                         <img src={co.logoUrl} className="w-10 h-10 object-contain rounded-md border border-slate-100 bg-white p-1" alt="logo" />
                     ) : (
                         <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">?</div>
                     )}
                     <div>
                       <div className="text-base">{co.name}</div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-sm">{co.sector}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                      <div className="font-semibold text-slate-700">{co.headquarters}</div>
                      <div>Est. {co.foundedYear}</div>
                  </td>
                  <td className="px-6 py-4 text-green-700 font-bold tracking-tight text-lg">{co.netWorth}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingCompany(co); setIsModalOpen(true); }}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-md transition border border-blue-100 hover:border-blue-600 shadow-sm" title="Edit Company">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(co._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-md transition border border-red-100 hover:border-red-600 shadow-sm" title="Delete Company">
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && !loading && (
                <tr>
                   <td colSpan={5} className="py-16 text-center text-slate-500 font-medium">
                     <div className="flex flex-col items-center gap-3">
                         <div className="bg-slate-100 p-4 rounded-full text-slate-400"><Edit2 className="w-6 h-6"/></div>
                         <div>No companies in the directory yet. Click "Add New Company" to get started.</div>
                     </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <CompanyModal
          company={editingCompany}
          onClose={() => { setIsModalOpen(false); setEditingCompany(null); }}
          onSave={editingCompany ? handleEdit : handleAdd}
        />
      )}

      {deletingCompanyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-600">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                 <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this company? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 font-medium">
              <button 
                onClick={() => setDeletingCompanyId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
