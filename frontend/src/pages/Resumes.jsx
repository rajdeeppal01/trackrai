import { useState, useEffect, useRef } from 'react'
import { FileText, UploadCloud, Trash2, CheckCircle2, FileDown } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import useDocumentTitle from '../hooks/useDocumentTitle'
import api from '../api/applications'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Resumes() {
  useDocumentTitle('Resumes')
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  async function fetchResumes() {
    try {
      const res = await api.get('/resumes')
      setResumes(res.data)
    } catch (err) {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.txt') && !file.name.toLowerCase().endsWith('.md')) {
      toast.error('Please upload a PDF, DOCX, or TXT file.')
      e.target.value = ''
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', file.name.replace(/\.[^/.]+$/, "")) // Remove extension for name
    formData.append('is_default', resumes.length === 0)

    try {
      await api.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Resume uploaded successfully!')
      fetchResumes()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to upload resume')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function setAsDefault(id) {
    try {
      await api.put(`/resumes/${id}`, { is_default: true })
      toast.success('Default resume updated')
      fetchResumes()
    } catch (err) {
      toast.error('Failed to update default status')
    }
  }

  async function deleteResume(id) {
    try {
      await api.delete(`/resumes/${id}`)
      toast.success('Resume deleted')
      fetchResumes()
    } catch (err) {
      toast.error('Failed to delete resume')
    }
  }

  async function downloadResume(id, filename) {
    try {
      const res = await api.get(`/resumes/${id}/download`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename || 'resume.pdf')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      toast.error('Failed to download resume')
    }
  }

  return (
    <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Resumes</h1>
          <p className="text-white/40 text-sm mt-1">Manage your tailored resumes. We support PDF, DOCX, and TXT files.</p>
        </div>
        
        {!user?.is_premium && resumes.length >= 2 ? (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            Free Plan Limit Reached (2/2)
          </div>
        ) : (
          <div>
            <input 
              type="file" 
              accept=".pdf,.docx,.txt,.md" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <Button 
              variant="primary" 
              loading={uploading} 
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={16} className="mr-2" />
              Upload Resume
            </Button>
          </div>
        )}
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/5">
          <FileText className="mx-auto text-white/20 mb-4" size={48} />
          <h3 className="text-lg font-bold text-white mb-2">No Resumes Found</h3>
          <p className="text-white/40 mb-6 max-w-sm mx-auto">Upload your first resume to use it across ATS Matcher and Cold Emailer.</p>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-2xl p-5 border relative group transition-colors ${resume.is_default ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-indigo-400">
                  <FileText size={24} />
                </div>
                {resume.is_default && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    <CheckCircle2 size={12} />
                    Default
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-white text-lg mb-1 truncate" title={resume.name}>{resume.name}</h3>
              <p className="text-xs text-white/40 mb-4 truncate">{resume.filename || 'Original file'}</p>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadResume(resume.id, resume.filename)}
                    title="Download PDF"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <FileDown size={14} />
                  </button>
                  {!resume.is_default && (
                    <button 
                      onClick={() => setAsDefault(resume.id)}
                      title="Set as Default"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-white/60 hover:text-indigo-400 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this resume?')) deleteResume(resume.id)
                  }}
                  title="Delete Resume"
                  className="w-8 h-8 rounded-lg bg-red-500/5 hover:bg-red-500/20 flex items-center justify-center text-red-500/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
