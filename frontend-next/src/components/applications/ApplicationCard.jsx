import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Calendar, ExternalLink, FileText, Pencil, Trash2, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import { PIPELINE_STAGES } from '../../utils/statusConfig'
import { formatDate } from '../../utils/formatters'

export default function ApplicationCard({ application, onEdit, onDelete, onFollowUp, deleting, disabled, disableLayout = false }) {
 const [expanded, setExpanded] = useState(false)
 const { id, company, role, status, applied_date, link, notes } = application
 const stageIdx = PIPELINE_STAGES.indexOf(status)
 const isRejected = status === 'Rejected'
 const pipelineProgress = isRejected ? 0 : stageIdx >= 0 ? stageIdx + 1 : 1
 const pipelinePercent = isRejected ? 100 : (pipelineProgress / PIPELINE_STAGES.length) * 100

 // Calculate if follow-up is due
 let isFollowUpDue = false;
 if (status === 'Applied' && applied_date) {
   const daysSince = Math.floor((new Date() - new Date(applied_date)) / (1000 * 60 * 60 * 24));
   if (daysSince >= 7) {
     isFollowUpDue = true;
   }
 }

 const getNotePreview = (htmlString) => {
 if (!htmlString) return '';
 const doc = new DOMParser().parseFromString(htmlString, 'text/html');
 return doc.body.textContent || "";
 };

 return (
 <motion.div
 layout={disableLayout ? false : true}
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8, scale: 0.97 }}
 whileHover={{ scale: 1.02, y: -4 }}
 whileTap={{ scale: 0.98 }}
 transition={{ duration: 0.25, layout: { duration: 0.3 }, type: "spring", stiffness: 300 }}
 className="h-full flex flex-col glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/20 hover:border-white/15 transition-all duration-300"
 >
 <div className={`h-0.5 w-full ${isRejected ? 'bg-gradient-to-r from-red-500/50 to-red-400/50' : status === 'Offer' ? 'bg-gradient-to-r from-emerald-500/60 to-teal-400/60' : 'bg-gradient-to-r from-brand-500/40 to-purple-500/40'}`} />

 <div className="p-5 flex flex-col flex-1">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-0.5">
 <div className="w-7 h-7 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
 <Building2 size={14} className="text-white/50" />
 </div>
 <h3 className="font-semibold text-white text-lg leading-tight truncate">{company}</h3>
 </div>
 <div className="ml-9 flex items-center gap-2">
 <p className="text-sm text-white/50">{role}</p>
 {isFollowUpDue && (
 <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
 <AlertCircle size={10} />
 Due
 </span>
 )}
 </div>
 </div>
 <StatusBadge status={status} />
 </div>

 {!isRejected && (
 <div className="mt-4">
 <div className="flex justify-between mb-1.5">
 {PIPELINE_STAGES.map((stage, i) => (
 <span key={stage} className={`text-[10px] font-medium transition-colors ${i < pipelineProgress ? 'text-brand-400' : 'text-white/20'}`}>
 {stage}
 </span>
 ))}
 </div>
 <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${pipelinePercent}%` }}
 transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
 className={`h-full rounded-full ${status === 'Offer' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-brand-500 to-purple-500'}`}
 />
 </div>
 </div>
 )}

 {isRejected && (
 <div className="mt-3 h-1.5 rounded-full bg-red-500/20 overflow-hidden">
 <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500/60 to-red-400/40" />
 </div>
 )}

 <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
 {applied_date && (
 <div className="flex items-center gap-1.5">
 <Calendar size={12} />
 <span>{formatDate(applied_date)}</span>
 </div>
 )}
 {link && (
 <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-brand-400/70 hover:text-brand-400 transition-colors">
 <ExternalLink size={12} />
 <span>View Job</span>
 </a>
 )}
 {notes && (
 <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-1.5 hover:text-white/60 transition-colors ml-auto">
 <FileText size={12} />
 <span>Notes</span>
 {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
 </button>
 )}
 </div>

 <AnimatePresence>
 {expanded && notes && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.25 }}
 className="overflow-hidden"
 >
 <div className="mt-3 p-3 rounded-3xl bg-white/3 max-h-32 overflow-y-auto">
 <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{getNotePreview(notes)}</p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/5">
 {isFollowUpDue && (
 <button 
 onClick={() => onFollowUp && onFollowUp(application)}
 disabled={disabled}
 className="w-full py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mb-1 border border-amber-500/20"
 >
 <Sparkles size={12} />
 Draft Follow-up Email
 </button>
 )}
 <div className="flex gap-2">
 <Button variant="secondary" size="sm" icon={Pencil} disabled={disabled} onClick={() => onEdit(application)} className="flex-1">Edit</Button>
 <Button variant="danger" size="sm" icon={Trash2} loading={deleting === id} disabled={disabled || deleting === id} onClick={() => onDelete(id)} className="flex-1">Delete</Button>
 </div>
 </div>
 </div>
 </motion.div>
 )
}