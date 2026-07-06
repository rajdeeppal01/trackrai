import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

// Dynamically inject token from localStorage on every request to avoid race conditions during initial mounting
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trackrai_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─── Applications ────────────────────────────────────────────────
export const getApplications = () =>
  api.get('/applications/').then((r) => r.data)

export const getApplication = (id) =>
  api.get(`/applications/${id}`).then((r) => r.data)

export const createApplication = (data) =>
  api.post('/applications/', data).then((r) => r.data)

export const updateApplication = (id, data) =>
  api.patch(`/applications/${id}`, data).then((r) => r.data)

export const deleteApplication = (id) =>
  api.delete(`/applications/${id}`).then((r) => r.data)

export default api
