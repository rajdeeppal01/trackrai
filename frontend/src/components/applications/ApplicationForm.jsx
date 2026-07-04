import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ALL_STATUSES, getStatusConfig } from '../../utils/statusConfig'
import Button from '../ui/Button'

const FIELD_CLASS = [
  'w-full rounded-xl px-4 py-3 text-sm text-white',
  'placeholder-white/30 bg-white/5 border border-white/10',
  'focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08]',
  'transition-all duration-200',
].join(' ')

const LABEL_CLASS = 'block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider'

export default function ApplicationForm({ onSubmit, initialData, submitting, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

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

      {/* Notes */}
      <div>
        <label className={LABEL_CLASS}>Notes</label>
        <textarea
          id="form-notes"
          {...register('notes')}
          placeholder="Interview rounds, contacts, important details..."
          rows={3}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
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
          variant="primary"
          loading={submitting}
          disabled={submitting}
          className="flex-1"
        >
          {initialData ? 'Save Changes' : 'Add Application'}
        </Button>
      </div>

    </form>
  )
}