"use client";

import { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { useColdEmails } from '../../hooks/useColdEmails';
import Button from '../../components/ui/Button';
import dynamic from 'next/dynamic';

// Dynamically import ForceGraph to avoid SSR issues with canvas
const ForceGraph = dynamic(() => import('../../components/ui/ForceGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center text-white/40">
      Initializing neural map...
    </div>
  )
});

export default function ColdOutreachTracker() {
  const { coldEmails, loading, addColdEmail, editColdEmail, deleteColdEmail, submitting } = useColdEmails();
  const [newCompany, setNewCompany] = useState('');
  const [search, setSearch] = useState('');
  
  // State for the side panel
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCompany.trim()) return;
    await addColdEmail({ company_name: newCompany.trim(), status: 'Pending' });
    setNewCompany('');
  };

  const handleStatusChange = async (id, newStatus) => {
    await editColdEmail({ id, data: { status: newStatus } });
    
    // Update local selected state to reflect change immediately
    if (selectedCompany && selectedCompany.id === id) {
      setSelectedCompany(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this company from your outreach map?")) {
      await deleteColdEmail(id);
      if (selectedCompany && selectedCompany.id === id) {
        setSelectedCompany(null);
      }
    }
  };

  // Prepare nodes and links for the graph
  const graphData = useMemo(() => {
    const nodes = [{ id: 'root', name: 'My Outreach' }];
    const links = [];
    
    coldEmails.forEach(email => {
      if (email.company_name.toLowerCase().includes(search.toLowerCase())) {
         nodes.push({ id: email.id, name: email.company_name, emailData: email });
         links.push({ source: 'root', target: email.id });
      }
    });
    
    return { nodes, links };
  }, [coldEmails, search]);

  const handleNodeClick = useCallback((node) => {
    if (node.id === 'root') return;
    setSelectedCompany(node.emailData);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Answered Yes': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Answered No': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="h-screen w-full font-sans relative overflow-hidden flex">
      
      {/* Main Canvas Area */}
      <div className="flex-1 h-full relative">
        
        {/* Floating Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center max-w-5xl mx-auto pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-2xl font-bold text-white/90 drop-shadow-md">Outreach Graph</h1>
            <p className="text-white/60 text-xs drop-shadow-md">Click a node to view status.</p>
          </div>

          <div className="flex gap-4 items-center w-full md:w-auto pointer-events-auto">
            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                type="text"
                placeholder="Company name..."
                className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors w-40 sm:w-auto"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                disabled={submitting}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!newCompany.trim() || submitting}
                className="px-4 py-2 rounded-2xl shrink-0"
                icon={Plus}
              >
                Add
              </Button>
            </form>

            <div className="relative shrink-0 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
              <input
                type="text"
                placeholder="Search graph..."
                className="w-48 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="absolute inset-0 bg-[#050510]">
          {!loading && <ForceGraph data={graphData} onNodeClick={handleNodeClick} />}
        </div>
      </div>

      {/* Side Panel (Details) */}
      <div className={`absolute top-0 right-0 h-full w-80 bg-[#050510] shadow-2xl border-l border-white/10 transform transition-transform duration-300 z-50 flex flex-col ${selectedCompany ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white truncate pr-4">
            {selectedCompany?.company_name}
          </h2>
          <button 
            onClick={() => setSelectedCompany(null)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {selectedCompany && (
          <div className="p-6 flex-1 flex flex-col gap-6">
            
            <div>
              <p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">Outreach Status</p>
              <select
                value={selectedCompany.status}
                onChange={(e) => handleStatusChange(selectedCompany.id, e.target.value)}
                disabled={submitting}
                className={`w-full appearance-none cursor-pointer border rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-colors ${getStatusStyle(selectedCompany.status)}`}
              >
                <option value="Pending" className="bg-[#0f0f13] text-white">Pending</option>
                <option value="Answered Yes" className="bg-[#0f0f13] text-white">Answered Yes</option>
                <option value="Answered No" className="bg-[#0f0f13] text-white">Answered No</option>
              </select>
            </div>

            <div>
              <p className="text-xs text-white/40 mb-1 font-medium uppercase tracking-wider">Date Added</p>
              <p className="text-sm text-white/80">
                {new Date(selectedCompany.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={() => handleDelete(selectedCompany.id)}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                Delete Node
              </button>
            </div>
            
          </div>
        )}
      </div>

    </div>
  );
}
