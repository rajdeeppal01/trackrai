import { useState, useEffect, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../api/applications'

const ACTIVITY_KEY = 'trackrai_activity'
const MAX_ACTIVITY = 30

// ─── Activity helpers ─────────────────────────────────────────────
function loadActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]')
  } catch {
    return []
  }
}

function saveActivity(items) {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items.slice(0, MAX_ACTIVITY)))
  } catch {
    // ignore storage errors
  }
}

function pushActivity(items, entry) {
  const updated = [{ ...entry, id: Date.now(), timestamp: new Date().toISOString() }, ...items]
  saveActivity(updated)
  return updated.slice(0, MAX_ACTIVITY)
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activity, setActivity] = useState(() => loadActivity())

  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // ─── Fetch ──────────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getApplications()
      if (mounted.current) setApplications(data)
    } catch (err) {
      if (mounted.current) {
        const msg = err?.response?.data?.detail || 'Failed to load applications'
        setError(msg)
        toast.error(msg)
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // ─── Create ─────────────────────────────────────────────────────
  const addApplication = useCallback(async (data) => {
    setSubmitting(true)
    try {
      const created = await createApplication(data)
      if (mounted.current) {
        setApplications((prev) => [created, ...prev])
        const act = pushActivity(activity, {
          type: 'created',
          label: `Applied to ${created.company} — ${created.role}`,
          status: created.status,
        })
        setActivity(act)
        toast.success(`Added ${created.company}!`)
      }
      return created
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to add application'
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
      throw err
    } finally {
      if (mounted.current) setSubmitting(false)
    }
  }, [activity])

  // ─── Update ─────────────────────────────────────────────────────
  const editApplication = useCallback(async (id, data) => {
    setSubmitting(true)
    try {
      const updated = await updateApplication(id, data)
      if (mounted.current) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? updated : a))
        )
        const act = pushActivity(activity, {
          type: 'updated',
          label: `Updated ${updated.company} — ${updated.role}`,
          status: updated.status,
        })
        setActivity(act)
        toast.success(`Updated ${updated.company}!`)
      }
      return updated
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to update application'
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
      throw err
    } finally {
      if (mounted.current) setSubmitting(false)
    }
  }, [activity])

  // ─── Delete ─────────────────────────────────────────────────────
  const removeApplication = useCallback(async (id) => {
    const app = applications.find((a) => a.id === id)
    setSubmitting(true)
    try {
      await deleteApplication(id)
      if (mounted.current) {
        setApplications((prev) => prev.filter((a) => a.id !== id))
        const act = pushActivity(activity, {
          type: 'deleted',
          label: `Removed ${app?.company || 'application'} — ${app?.role || ''}`,
          status: app?.status,
        })
        setActivity(act)
        toast.success('Application removed.')
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to delete application'
      toast.error(msg)
      throw err
    } finally {
      if (mounted.current) setSubmitting(false)
    }
  }, [applications, activity])

  return {
    applications,
    loading,
    error,
    submitting,
    activity,
    fetchApplications,
    addApplication,
    editApplication,
    removeApplication,
  }
}
