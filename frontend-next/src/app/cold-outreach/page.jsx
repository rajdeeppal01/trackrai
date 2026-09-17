"use client";

import { useState } from 'react';
import { Mail, Plus, Search, Trash2, Check, X, Clock } from 'lucide-react';
import { useColdEmails } from '../../hooks/useColdEmails';
import Button from '../../components/ui/Button';

export default function ColdOutreachTracker() {
  const { coldEmails, loading, addColdEmail, editColdEmail, deleteColdEmail, submitting } = useColdEmails();
  const [newCompany, setNewCompany] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCompany.trim()) return;
    await addColdEmail({ company_name: newCompany.trim(), status: 'Pending' });
    setNewCompany('');
  };

  const handleStatusChange = async (id, newStatus) => {
    await editColdEmail({ id, data: { status: newStatus } });
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this company from your tracker?")) {
      await deleteColdEmail(id);
    }
  };

  const filteredEmails = coldEmails.filter(email => 
    email.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Answered Yes': return <Check size={16} className="text-green-400" />;
      case 'Answered No': return <X size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-yellow-400" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Answered Yes': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Answered No': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-3xl bg-indigo-500/15 flex items-center justify-center">
              <Mail size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Cold Outreach Tracker</h1>
              <p className="text-white/40 text-sm">Keep track of companies you've cold emailed and their responses.</p>
            </div>
          </div>
        </header>

        {/* Top Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-3xl">
          <form onSubmit={handleAdd} className="flex-1 flex gap-2 w-full">
            <input
              type="text"
              placeholder="Company name (e.g. OpenAI)"
              className="flex-1 bg-black/40 border border-white/10 rounded-3xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              disabled={submitting}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!newCompany.trim() || submitting}
              className="px-6 py-2.5 rounded-3xl shrink-0"
              icon={Plus}
            >
              Add
            </Button>
          </form>

          <div className="w-full md:w-64 relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full bg-black/40 border border-white/10 rounded-3xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tracker List */}
        <div className="glass rounded-3xl overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-white/40 text-sm">Loading tracker...</div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center text-white/20">
              <Mail size={48} className="stroke-[1.2] mb-3 opacity-60 text-white/30" />
              <p className="text-sm font-medium">No Outreach Tracked</p>
              <p className="text-xs max-w-sm mt-1">Add a company above to start tracking your cold emails.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredEmails.map((email) => (
                <div key={email.id} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
                  
                  <div>
                    <h3 className="text-base font-semibold text-white/90">{email.company_name}</h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      Added on {new Date(email.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={email.status}
                      onChange={(e) => handleStatusChange(email.id, e.target.value)}
                      disabled={submitting}
                      className={`appearance-none cursor-pointer border rounded-2xl px-3 py-1.5 text-xs font-semibold outline-none transition-colors pr-8 ${getStatusStyle(email.status)}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1em',
                      }}
                    >
                      <option value="Pending" className="bg-[#0f0f13] text-white">Pending</option>
                      <option value="Answered Yes" className="bg-[#0f0f13] text-white">Answered Yes</option>
                      <option value="Answered No" className="bg-[#0f0f13] text-white">Answered No</option>
                    </select>

                    <button
                      onClick={() => handleDelete(email.id)}
                      disabled={submitting}
                      className="w-8 h-8 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
