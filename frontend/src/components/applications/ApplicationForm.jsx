import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ALL_STATUSES, getStatusConfig } from '../../utils/statusConfig'
import Button from '../ui/Button'
import WarRoomEditor from './WarRoomEditor'

const FIELD_CLASS = [
 'w-full rounded-3xl px-4 py-3 text-sm text-white',
 'placeholder-white/30 bg-white/5 ',
 'focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08]',
 'transition-all duration-200',
].join(' ')

const LABEL_CLASS = 'block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider'

export default function ApplicationForm({ onSubmit, initialData, submitting, onCancel }) {
 const {
 register,
 handleSubmit,
 reset,
 setValue,
 watch,
 formState: { errors },
 } = useForm({
 defaultValues: initialData || {
 company: '',
 role: '',
 status: 'Applied',
 applied_date: '',
 link: '',
 notes: '',
 },
 })

 const notes = watch('notes')

 const [activeTab, setActiveTab] = useState('details') // 'details' | 'warroom'

 useEffect(() => {
 if (initialData) {
 reset({
 company: initialData.company || '',
 role: initialData.role || '',
 status: initialData.status || 'Applied',
 applied_date: initialData.applied_date || '',
 link: initialData.link || '',
 notes: initialData.notes || '',
 })
 }
 }, [initialData, reset])

 return (
 <div className="flex flex-col h-full max-h-[80vh]">
 {/* Tab Navigation */}
 <div className="flex border-b mb-5">
 <button
 type="button"
 onClick={() => setActiveTab('details')}
 className={`px-4 py-2 text-sm font-medium transition-colors ${
 activeTab === 'details'
 ? 'text-indigo-400 border-b-2 border-indigo-500'
 : 'text-white/40 hover:text-white/80'
 }`}
 >
 Application Details
 </button>
 {initialData && (
 <button
 type="button"
 onClick={() => setActiveTab('warroom')}
 className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
 activeTab === 'warroom'
 ? 'text-indigo-400 border-b-2 border-indigo-500'
 : 'text-white/40 hover:text-white/80'
 }`}
 >
 <span>Interview War Room</span>
 <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded">AI</span>
 </button>
 )}
 </div>

 <div className="overflow-y-auto flex-1 pr-2">
 <form id="app-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 h-full" noValidate>
 <div className={activeTab === 'details' ? 'block space-y-5' : 'hidden'}>

 {/* Company */}
 <div>
 <label className={LABEL_CLASS}>Company *</label>
 <input
 id="form-company"
 {...register('company', { required: 'Company name is required' })}
 placeholder="e.g. Google, Microsoft, Amazon"
 className={`${FIELD_CLASS} ${errors.company ? 'border-red-500/60' : ''}`}
 />
 {errors.company && (
 <p className="mt-1.5 text-xs text-red-400">{errors.company.message}</p>
 )}
 </div>

 {/* Role */}
 <div>
 <label className={LABEL_CLASS}>Role *</label>
 <input
 id="form-role"
 {...register('role', { required: 'Role is required' })}
 placeholder="e.g. Software Engineer Intern"
 className={`${FIELD_CLASS} ${errors.role ? 'border-red-500/60' : ''}`}
 />
 {errors.role && (
 <p className="mt-1.5 text-xs text-red-400">{errors.role.message}</p>
 )}
 </div>

 {/* Status + Date */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className={LABEL_CLASS}>Status</label>
 <select
 id="form-status"
 {...register('status')}
 className={`${FIELD_CLASS} cursor-pointer`}
 style={{ colorScheme: 'dark' }}
 >
 {ALL_STATUSES.map((s) => {
 const cfg = getStatusConfig(s)
 return <option key={s} value={s}>{cfg.label}</option>
 })}
 </select>
 </div>
 <div>
 <label className={LABEL_CLASS}>Applied Date</label>
 <input
 id="form-date"
 type="date"
 {...register('applied_date')}
 className={FIELD_CLASS}
 style={{ colorScheme: 'dark' }}
 />
 </div>
 </div>

 {/* Job Link */}
 <div>
 <label className={LABEL_CLASS}>Job Link</label>
 <input
 id="form-link"
 {...register('link')}
 placeholder="https://careers.example.com/job/123"
 className={FIELD_CLASS}
 />
 </div>

 {/* Hidden Notes Field for Tiptap integration */}
 <input type="hidden" {...register('notes')} />

 </div>
 <div className={activeTab === 'warroom' ? 'block' : 'hidden'}>
 <WarRoomEditor 
 application={initialData} 
 content={notes}
 onChange={(html) => setValue('notes', html)} 
 />
 </div>
 </form>
 </div>

 {/* Actions */}
 <div className="flex gap-3 pt-4 border-t mt-4">
 {onCancel && (
 <Button
 type="button"
 variant="secondary"
 onClick={onCancel}
 disabled={submitting}
 className="flex-1"
 >
 Cancel
 </Button>
 )}
 <Button
 type="submit"
 form="app-form"
 variant="primary"
 loading={submitting}
 disabled={submitting}
 className="flex-1"
 >
 {initialData ? 'Save Changes' : 'Add Application'}
 </Button>
 </div>
 </div>
 )
}