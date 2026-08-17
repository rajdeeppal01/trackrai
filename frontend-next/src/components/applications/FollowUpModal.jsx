import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Copy, Check, Mail, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/applications'

export default function FollowUpModal({ isOpen, onClose, application }) {
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(null)
  
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)

  useEffect(() => {
    if (isOpen && application && !draft && !loading) {
      generateFollowUp()
    }
    if (!isOpen) {
      // Reset state on close
      setDraft(null)
      setDraftSubject('')
      setDraftBody('')
    }
  }, [isOpen, application])

  const generateFollowUp = async () => {
    setLoading(true)
    try {
      const res = await api.post('/copilot/draft-follow-up', {
        application_id: application.id
      })
      setDraft(res.data)
      setDraftSubject(res.data.subject)
      setDraftBody(res.data.body)
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate follow-up email')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'subject') {
      setCopiedSubject(true)
      setTimeout(() => setCopiedSubject(false), 2000)
    } else {
      setCopiedBody(true)
      setTimeout(() => setCopiedBody(false), 2000)
    }
    toast.success('Copied to clipboard!')
  }

  // Pre-fill mailto URL parameters safely
  const getMailtoLink = () => {
    const subjectEncoded = encodeURIComponent(draftSubject)
    const bodyEncoded = encodeURIComponent(draftBody)
    // We don't have a specific recruiter email in the model, so we leave 'to' blank
    return `mailto:?subject=${subjectEncoded}&body=${bodyEncoded}`
  }

  // Pre-fill Gmail web-client compose URL safely
  const getGmailLink = () => {
    const subject = encodeURIComponent(draftSubject)
    const body = encodeURIComponent(draftBody)
    return `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0A18] border border-white/10 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Draft Follow-up</h2>
                    <p className="text-xs text-white/50">{application?.company} - {application?.role}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#0A0A18] to-black">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-indigo-400 space-y-4">
                    <span className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium animate-pulse">Drafting the perfect follow-up...</p>
                  </div>
                ) : draft ? (
                  <div className="space-y-6">
                    {/* Email Headers */}
                    <div className="space-y-3 pb-5 border-b border-white/10 text-sm">
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-1 items-center bg-black/40 rounded-xl px-4 py-2 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
                          <span className="w-16 text-white/40 font-medium select-none">Subject:</span>
                          <input
                            type="text"
                            value={draftSubject}
                            onChange={(e) => setDraftSubject(e.target.value)}
                            className="bg-transparent text-white font-semibold flex-1 border-none focus:outline-none focus:ring-0 p-0 text-sm"
                          />
                        </div>
                        <button
                          onClick={() => handleCopy(draftSubject, 'subject')}
                          className="ml-3 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Copy Subject"
                        >
                          {copiedSubject ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="relative">
                      <textarea
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        rows={10}
                        className="w-full bg-black/40 rounded-2xl text-white/85 text-sm leading-relaxed font-light border border-white/5 focus:border-indigo-500/50 outline-none p-5 resize-none h-full min-h-[220px] scrollbar-thin"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer Actions */}
              {draft && !loading && (
                <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => handleCopy(draftBody, 'body')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/85 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedBody ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    <span>Copy Body</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <a
                      href={getMailtoLink()}
                      className="w-full sm:w-auto text-center px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Mail size={16} />
                      <span>Mail App</span>
                    </a>
                    <a
                      href={getGmailLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto text-center px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/30"
                    >
                      <Send size={16} />
                      <span>Send via Gmail</span>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
