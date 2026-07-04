import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationCard from './ApplicationCard';
import { ApplicationCardSkeleton } from '../ui/Skeletons';
import ConfirmDialog from '../ui/ConfirmDialog';
import { STATUS_CONFIG } from '../../utils/statusConfig';
import { Search, Plus, Inbox } from 'lucide-react';

export default function ApplicationGrid({ applications = [], loading, onEdit, onDelete, submitting }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // { id, company, role }

  const statuses = useMemo(() => Object.values(STATUS_CONFIG), []);

  // Dynamic counts for filter buttons
  const counts = useMemo(() => {
    const cnt = { All: applications.length };
    statuses.forEach(({ label }) => {
      cnt[label] = applications.filter(app => app.status === label).length;
    });
    return cnt;
  }, [applications, statuses]);

  // Filtered + sorted applications
  const filteredApps = useMemo(() => {
    return applications
      .filter(app => {
        const matchesSearch =
          (app.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.role || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
  }, [applications, searchTerm, filterStatus]);

  // ── Delete flow ──────────────────────────────────────────────
  function requestDelete(app) {
    setConfirmTarget({ id: app.id, company: app.company, role: app.role });
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    try {
      await onDelete(confirmTarget.id);
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  // ── Loading skeleton ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row gap-4 justify-between">
          <div className="skeleton h-10 w-full max-w-md rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-10 w-24 rounded-xl" />)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <ApplicationCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // ── Empty dashboard state ────────────────────────────────────
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/8 flex items-center justify-center mb-6">
          <Inbox size={36} className="text-white/25" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
        <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-6">
          Add your first job application to start tracking your search. Every offer starts with one application.
        </p>
        <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
          <Plus size={14} />
          Click "New Application" above to get started
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              filterStatus === 'All'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'glass text-white/50 hover:text-white hover:bg-white/8'
            }`}
          >
            All <span className="opacity-60 ml-0.5">({counts['All'] || 0})</span>
          </button>
          {statuses.map(({ label }) => (
            <button
              key={label}
              onClick={() => setFilterStatus(label)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterStatus === label
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              {label} <span className="opacity-60 ml-0.5">({counts[label] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, layout: { duration: 0.25 } }}
              >
                <ApplicationCard
                  application={app}
                  onEdit={onEdit}
                  onDelete={requestDelete}
                  deleting={deletingId === app.id}
                  disabled={submitting}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-16 text-center glass rounded-2xl"
            >
              <Search size={32} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No applications match your search.</p>
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
                className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!confirmTarget}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmDelete}
        loading={!!deletingId}
        title="Delete Application?"
        message={`Remove ${confirmTarget?.company}${confirmTarget?.role ? ` — ${confirmTarget.role}` : ''}? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}