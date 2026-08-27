import axios from 'axios'

const api = axios.create({
 baseURL: '/api',
 headers: { 'Content-Type': 'application/json' },
 timeout: 60000,
 withCredentials: true,
})


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
