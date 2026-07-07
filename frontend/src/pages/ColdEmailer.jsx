import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Send, Copy, Check, Sparkles, Trash2,
  User, Briefcase, History, FileText, ChevronRight
} from 'lucide-react'
import api from '../api/applications'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ColdEmailer() {
  const { user } = useAuth()
  
  const [email, setEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientRole, setRecipientRole] = useState('Founder/CEO')
  const [company, setCompany] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [userBio, setUserBio] = useState('')
  const [tone, setTone] = useState('Professional')

  const [loading, setLoading] = useState(false)
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)

  // Sender email (pre-filled from registered account)
  const [senderEmail, setSenderEmail] = useState('')

  // Editable draft states
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')

  // Current active draft
  const [activeDraft, setActiveDraft] = useState(null)
  
  // History of generated drafts
  const [history, setHistory] = useState([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('trackrai_cold_emails')
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load email drafts history', e)
    }
  }, [])

  // Sync senderEmail when user context loads
  useEffect(() => {
    if (user?.email && !senderEmail) {
      setSenderEmail(user.email)
    }
  }, [user])

  // Sync draftSubject and draftBody when activeDraft changes
  useEffect(() => {
    if (activeDraft) {
      setDraftSubject(activeDraft.subject)
      setDraftBody(activeDraft.body)
    } else {
      setDraftSubject('')
      setDraftBody('')
    }
  }, [activeDraft])

  // Save history helper
  const saveHistory = (newHistory) => {
    setHistory(newHistory)
    try {
      localStorage.setItem('trackrai_cold_emails', JSON.stringify(newHistory))
    } catch (e) {
      console.error('Failed to save email drafts history', e)
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)

    if (val.includes('@')) {
      const domain = val.split('@').pop().toLowerCase()
      const publicDomains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
        'protonmail.com', 'aol.com', 'icloud.com', 'zoho.com',
        'mail.com', 'gmx.com', 'yandex.com', 'proton.me'
      ]
      if (domain && !publicDomains.includes(domain)) {
        const part = domain.split('.')[0]
        if (part) {
          const formatted = part.charAt(0).toUpperCase() + part.slice(1)
          setCompany(formatted)
        }
      }
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Recipient email is required')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/copilot/draft-cold-email', {
        recipient_email: email,
        recipient_name: recipientName,
        recipient_role: recipientRole,
        company_name: company,
        target_role: targetRole,
        user_bio: userBio,
        tone: tone
      })

      const draft = {
        id: Date.now(),
        email,
        recipientName,
        recipientRole,
        company: company || 'their company',
        targetRole,
        tone,
        subject: res.data.subject,
        body: res.data.body,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      }

      setActiveDraft(draft)
      
      // Prepend to history
      const updatedHistory = [draft, ...history.slice(0, 19)] // Limit to 20 items
      saveHistory(updatedHistory)
      
      toast.success('Cold email drafted successfully!')
    } catch (err) {
      console.error('Failed to generate cold email', err)
      toast.error('Failed to draft cold email')
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

  const handleDeleteHistory = (id, e) => {
    e.stopPropagation()
    const updated = history.filter(item => item.id !== id)
    saveHistory(updated)
    if (activeDraft && activeDraft.id === id) {
      setActiveDraft(null)
    }
    toast.success('Draft removed')
  }

  const loadDraft = (draft) => {
    setActiveDraft(draft)
    setEmail(draft.email)
    setRecipientName(draft.recipientName || '')
    setRecipientRole(draft.recipientRole || 'Founder/CEO')
    setCompany(draft.company || '')
    setTargetRole(draft.targetRole || '')
    setTone(draft.tone || 'Professional')
  }

  // Pre-fill mailto URL parameters safely
  const getMailtoLink = () => {
    if (!activeDraft) return '#'
    const subjectEncoded = encodeURIComponent(draftSubject)
    const bodyEncoded = encodeURIComponent(draftBody)
    return `mailto:${activeDraft.email}?subject=${subjectEncoded}&body=${bodyEncoded}`
  }

  // Pre-fill Gmail web-client compose URL safely
  const getGmailLink = () => {
    if (!activeDraft) return '#'
    const to = encodeURIComponent(activeDraft.email)
    const subject = encodeURIComponent(draftSubject)
    const body = encodeURIComponent(draftBody)
    const from = encodeURIComponent(senderEmail)
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}${from ? `&from=${from}` : ''}`
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <Mail size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Cold Emailer</h1>
              <p className="text-white/40 text-sm">Draft personalized outreach to founders, CEOs, and recruiters instantly.</p>
            </div>
          </div>
        </header>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleGenerate} className="glass rounded-3xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                <h3 className="font-bold text-white text-sm">Customize Outreach</h3>
              </div>

              {/* Recipient Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white/50">Recipient Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. founder@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/50">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/50">Company Name</label>
                  <input
                    type="text"
                    placeholder="Auto-extracted"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Recipient Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/50">Recipient Role</label>
                  <select
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value)}
                    className="w-full glass border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors [&>option]:bg-[#080820]"
                  >
                    <option value="Founder/CEO">Founder/CEO</option>
                    <option value="Hiring Manager/Recruiter">Hiring Manager</option>
                    <option value="Engineering Lead">Engineering Lead</option>
                    <option value="Individual Contributor">Individual Contributor</option>
                  </select>
                </div>

                {/* Tone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/50">Email Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full glass border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors [&>option]:bg-[#080820]"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Conversational">Casual & Warm</option>
                    <option value="Direct">Direct & Short</option>
                    <option value="Creative">Creative / Hook-based</option>
                  </select>
                </div>
              </div>

              {/* Target Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white/50">Target Role (Your Target)</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer Intern, frontend dev"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Pitch/Bio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white/50">Your Brief Pitch / Highlights (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Add 2-3 sentences about your core skills, notable projects, or achievements..."
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all duration-200 active:scale-98 cursor-pointer shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Drafting Email...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Cold Email</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Email Preview & Copy Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden min-h-[460px] flex flex-col">
              
              {/* Mock browser title bar */}
              <div className="bg-white/3 px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-white/30 font-medium tracking-wide">DRAFT PREVIEW</span>
                <span className="w-10" />
              </div>

              {activeDraft ? (
                <div className="p-6 flex-1 flex flex-col space-y-5">
                  {/* Email Headers */}
                  <div className="space-y-2 pb-4 border-b border-white/5 text-sm">
                    <div className="flex items-center">
                      <span className="w-16 text-white/40 font-medium select-none">From:</span>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="your.email@domain.com"
                        className="bg-transparent text-white/80 border-none focus:outline-none focus:ring-0 p-0 text-sm flex-1 font-light"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 text-white/40 font-medium select-none">To:</span>
                      <span className="text-white/80 font-light">{activeDraft.email}</span>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div className="flex flex-1 items-center">
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
                        className="text-white/40 hover:text-white transition-colors p-1"
                        title="Copy Subject"
                      >
                        {copiedSubject ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="flex-1 py-2">
                    <textarea
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      rows={12}
                      className="w-full bg-transparent text-white/85 text-sm leading-relaxed font-light border-none focus:outline-none focus:ring-0 p-0 resize-none h-full min-h-[250px] scrollbar-thin"
                    />
                  </div>

                  {/* Actions footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-4">
                    <button
                      onClick={() => handleCopy(draftBody, 'body')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/85 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {copiedBody ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      <span>Copy Email Body</span>
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                      <a
                        href={getMailtoLink()}
                        className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/7 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Mail size={13} />
                        <span>Send in Mail App</span>
                      </a>
                      <a
                        href={getGmailLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/20 active:scale-95"
                      >
                        <Send size={13} />
                        <span>Send via Gmail</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white/20">
                  <Mail size={48} className="stroke-[1.2] mb-3 opacity-60 text-white/30" />
                  <p className="text-sm font-medium">No Email Drafted Yet</p>
                  <p className="text-xs max-w-sm mt-1">Fill out the customization form on the left and click generate to get started.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* History section */}
        {history.length > 0 && (
          <section className="glass rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
              <History size={16} className="text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Recent Cold Emails</h3>
              <span className="text-xs text-white/30">({history.length} saved drafts)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {history.map((item) => {
                  const isCurrent = activeDraft?.id === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => loadDraft(item)}
                      className={`glass p-4 rounded-2xl border transition-all cursor-pointer text-left relative group ${
                        isCurrent ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCurrent ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/40'
                          }`}>
                            <FileText size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white truncate max-w-[140px]">
                              {item.recipientName || item.email}
                            </p>
                            <p className="text-[10px] text-white/35 font-medium">{item.company}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteHistory(item.id, e)}
                          className="w-7 h-7 rounded-lg bg-white/0 hover:bg-red-500/10 text-white/30 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                          title="Delete draft"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="line-clamp-2 text-xs text-white/50 mb-3 font-light">
                        {item.subject}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-white/30 pt-2 border-t border-white/5">
                        <span>{item.date}</span>
                        <div className="flex items-center gap-0.5 text-indigo-400 font-medium">
                          <span>View</span>
                          <ChevronRight size={10} />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
