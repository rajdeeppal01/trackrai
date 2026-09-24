"use client";

import { useState } from 'react';
import { Mail, Plus, Search, Trash2, Check, X, Clock } from 'lucide-react';
import { useColdEmails } from '../../hooks/useColdEmails';
import Button from '../../components/ui/Button';

export default function ColdOutreachTracker() {
  const { coldEmails, loading, addColdEmail, editColdEmail, deleteColdEmail, submitting } = useColdEmails();
  const [newCompany, setNewCompany] = useState('');
  const [search, setSearch] = useState('');
  const [flippedCards, setFlippedCards] = useState(new Set()); // Track which cards are flipped

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCompany.trim()) return;
    await addColdEmail({ company_name: newCompany.trim(), status: 'Pending' });
    setNewCompany('');
  };

  const handleStatusChange = async (id, newStatus) => {
    await editColdEmail({ id, data: { status: newStatus } });
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent card from flipping when clicking delete
    if (confirm("Remove this company from your tracker?")) {
      await deleteColdEmail(id);
    }
  };

  const toggleFlip = (id) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(id)) {
      newFlipped.delete(id);
    } else {
      newFlipped.add(id);
    }
    setFlippedCards(newFlipped);
  };

  const filteredEmails = coldEmails.filter(email => 
    email.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Answered Yes': return <Check size={20} className="text-green-400" />;
      case 'Answered No': return <X size={20} className="text-red-400" />;
      default: return <Clock size={20} className="text-yellow-400" />;
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
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Mail size={24} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Outreach Vault</h1>
              <p className="text-white/40 text-sm mt-1">Keep track of your applications without the stress. Click a card to reveal its status.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full sm:w-56 bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Add Company Form */}
        <div className="glass p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input
            type="text"
            placeholder="Type a company name and press Enter..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
            disabled={submitting}
          />
          <Button
            type="button"
            onClick={handleAdd}
            variant="primary"
            disabled={!newCompany.trim() || submitting}
            className="px-6 py-2 rounded-xl shrink-0"
            icon={Plus}
          >
            Add Company
          </Button>
        </div>

        {/* 3D Flip Card Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-white/40">Loading vault...</div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-white/20 glass rounded-3xl border-dashed border-2 border-white/5">
            <Mail size={48} className="stroke-[1] mb-4 opacity-40 text-white/30" />
            <p className="text-base font-medium text-white/60">Your vault is empty</p>
            <p className="text-sm mt-2 max-w-sm">Add a company above to create your first outreach card.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
            {filteredEmails.map((email) => {
              const isFlipped = flippedCards.has(email.id);

              return (
                <div 
                  key={email.id} 
                  className="relative h-48 w-full group cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => toggleFlip(email.id)}
                >
                  {/* Card Inner Container (handles the 3D flip) */}
                  <div 
                    className="w-full h-full transition-transform duration-500"
                    style={{ 
                      transformStyle: 'preserve-3d', 
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                    }}
                  >
                    
                    {/* FRONT OF CARD (Uniform, No Status) */}
                    <div 
                      className="absolute inset-0 w-full h-full glass rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 shadow-lg hover:border-indigo-500/30 transition-colors bg-gradient-to-br from-[#0a0a16] to-[#13132b]"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Mail size={24} className="text-white/60" />
                      </div>
                      <h3 className="text-lg font-bold text-white/90 text-center truncate w-full">
                        {email.company_name}
                      </h3>
                      <p className="text-xs text-white/30 mt-2 font-medium tracking-wide uppercase">
                        Click to reveal
                      </p>
                    </div>

                    {/* BACK OF CARD (Reveals Status & Controls) */}
                    <div 
                      className="absolute inset-0 w-full h-full glass rounded-3xl border border-white/10 flex flex-col p-5 shadow-lg bg-[#0a0a16]"
                      style={{ 
                        transform: 'rotateY(180deg)', 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden' 
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-bold text-white/90 truncate pr-2">
                          {email.company_name}
                        </h3>
                        <button
                          onClick={(e) => handleDelete(email.id, e)}
                          disabled={submitting}
                          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 flex items-center justify-center transition-colors shrink-0"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={email.status}
                            onChange={(e) => handleStatusChange(email.id, e.target.value)}
                            disabled={submitting}
                            className={`w-full appearance-none cursor-pointer border rounded-xl pl-4 pr-10 py-3 text-sm font-semibold outline-none transition-colors ${getStatusStyle(email.status)}`}
                          >
                            <option value="Pending" className="bg-[#0f0f13] text-white">Pending</option>
                            <option value="Answered Yes" className="bg-[#0f0f13] text-white">Answered Yes</option>
                            <option value="Answered No" className="bg-[#0f0f13] text-white">Answered No</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            {getStatusIcon(email.status)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">
                          Added {new Date(email.created_at).toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
