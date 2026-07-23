import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, FileText, CheckCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/applications';
import toast from 'react-hot-toast';

export default function ATSMatcher() {
  useDocumentTitle('ATS Matcher');
  const { user } = useAuth();
  
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { match_score, missing_keywords, improvement_tips }

  import { useEffect } from 'react';
  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await api.get('/resumes/');
        setResumes(res.data);
        const defaultResume = res.data.find(r => r.is_default) || res.data[0];
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id.toString());
          setResumeText(defaultResume.content);
        }
      } catch (err) {
        console.error('Failed to load resumes', err);
      }
    }
    fetchResumes();
  }, []);

  const handleResumeSelect = (e) => {
    const id = e.target.value;
    setSelectedResumeId(id);
    if (id) {
      const selected = resumes.find(r => r.id.toString() === id);
      if (selected) setResumeText(selected.content);
    } else {
      setResumeText('');
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.error('Please provide both Job Description and Resume Text.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        job_description: jobDescription,
        resume_text: selectedResumeId ? undefined : resumeText,
        resume_id: selectedResumeId ? parseInt(selectedResumeId) : undefined
      };
      // If user edited the text after selecting, send text instead
      const selected = resumes.find(r => r.id.toString() === selectedResumeId);
      if (selected && selected.content !== resumeText) {
        payload.resume_text = resumeText;
        payload.resume_id = undefined;
      }

      const res = await api.post('/copilot/ats-match', payload);
      setResult(res.data);
      toast.success('ATS Match Complete!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to analyze ATS match.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-rose-400';
  };
  const scoreRingColor = (score) => {
    if (score >= 80) return 'stroke-emerald-400';
    if (score >= 50) return 'stroke-yellow-400';
    return 'stroke-rose-400';
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Target size={18} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">ATS Resume Matcher</h1>
          </div>
          <p className="text-white/40 text-sm ml-12">See how well your resume matches the job description before you apply.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Section */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-indigo-400" />
                <h2 className="font-semibold text-white/90">Job Description</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="flex-1 w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
              />
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-purple-400" />
                  <h2 className="font-semibold text-white/90">Your Resume</h2>
                </div>
                {resumes.length > 0 && (
                  <select
                    value={selectedResumeId}
                    onChange={handleResumeSelect}
                    className="bg-black/40 border border-white/10 rounded-lg text-xs text-white px-2 py-1 outline-none focus:border-purple-500/50"
                  >
                    <option value="">Custom Text</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id.toString()}>{r.name} {r.is_default ? '(Default)' : ''}</option>
                    ))}
                  </select>
                )}
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="flex-1 w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
              />
            </div>
          </div>

          {/* Result Section */}
          <div className="flex flex-col">
            <div className="glass rounded-3xl p-8 border border-purple-500/20 flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Target size={120} />
              </div>
              
              <div className="mb-8">
                <button
                  onClick={handleMatch}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Analyzing Match...
                    </div>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate ATS Match Score
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Score Circle */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                          <motion.circle
                            cx="96" cy="96" r="80"
                            stroke="currentColor" strokeWidth="12" fill="transparent"
                            strokeDasharray={80 * 2 * Math.PI}
                            initial={{ strokeDashoffset: 80 * 2 * Math.PI }}
                            animate={{ strokeDashoffset: (80 * 2 * Math.PI) * (1 - result.match_score / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${scoreRingColor(result.match_score)} drop-shadow-[0_0_15px_rgba(currentColor,0.5)] stroke-linecap-round`}
                            style={{ strokeLinecap: 'round' }}
                          />
                        </svg>
                        <div className="text-center">
                          <span className={`text-6xl font-black ${scoreColor(result.match_score)}`}>{result.match_score}</span>
                          <span className="text-xl text-white/40">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="mb-8">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-white/80 mb-3">
                        <AlertTriangle size={14} className="text-orange-400" />
                        Missing Keywords
                      </h3>
                      {result.missing_keywords?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.missing_keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs font-semibold rounded-lg">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-emerald-400/80 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                          Perfect! You hit all the major keywords.
                        </p>
                      )}
                    </div>

                    {/* Improvement Tips */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-white/80 mb-3">
                        <CheckCircle size={14} className="text-indigo-400" />
                        How to Improve
                      </h3>
                      <ul className="space-y-3">
                        {result.improvement_tips?.map((tip, i) => (
                          <li key={i} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-sm text-white/70 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-12"
                  >
                    <Target size={48} className="mb-4" />
                    <h3 className="text-lg font-semibold">Ready to Analyze</h3>
                    <p className="text-sm max-w-sm mt-2">Paste a job description and your resume text on the left, then click Generate to get your ATS Match Score.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
