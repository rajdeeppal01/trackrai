"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, XCircle, ArrowUpRight } from 'lucide-react';
import api from '../../api/applications';
import Button from '../../components/ui/Button';

export default function FreeResumeGrader() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Both Resume and Job Description are required.');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    try {
      // Direct POST to the backend using axios (assuming the proxy is set up or api client points to backend)
      // Since it's public, we don't need auth headers
      const res = await api.post('/copilot/public-ats-match', {
        job_description: jobDescription,
        resume_text: resumeText
      });
      
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError('Failed to analyze resume. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen font-sans text-white relative">
      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          Trackr<span className="text-indigo-500">AI</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles size={14} /> 100% Free Tool
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 text-transparent bg-clip-text pb-2">
            Free AI Resume Grader
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Paste your resume and the job description below. Our AI will simulate an Applicant Tracking System (ATS) and tell you exactly why you're getting rejected.
          </p>
        </div>

        {/* Input Layout */}
        {!result ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-3xl p-6">
              <label className="flex items-center gap-2 font-bold mb-4 text-white/90">
                <FileText className="text-indigo-400" size={20} /> Your Resume
              </label>
              <textarea 
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your entire resume text here..."
                className="w-full h-96 bg-black/20 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
              />
            </div>
            
            <div className="glass rounded-3xl p-6">
              <label className="flex items-center gap-2 font-bold mb-4 text-white/90">
                <Target className="text-emerald-400" size={20} /> Job Description
              </label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full h-96 bg-black/20 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none font-mono"
              />
            </div>
          </div>
        ) : (
          /* Results Layout */
          <div className="glass-strong rounded-3xl p-8 mb-8 animate-fade-in border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="text-center shrink-0">
                <div className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">ATS Match Score</div>
                <div className={`text-8xl font-black ${getScoreColor(result.match_score)} drop-shadow-lg`}>
                  {result.match_score}%
                </div>
                {result.match_score < 70 && (
                  <div className="mt-4 text-red-400 text-sm font-semibold flex items-center justify-center gap-2">
                    <AlertTriangle size={16} /> High risk of auto-rejection
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-8 w-full">
                {result.missing_keywords?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-3">
                      <XCircle className="text-red-400" size={20} /> Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.improvement_tips?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-3">
                      <Sparkles className="text-indigo-400" size={20} /> Actionable Tips
                    </h3>
                    <ul className="space-y-3">
                      {result.improvement_tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-white/70 bg-white/5 p-4 rounded-2xl text-sm leading-relaxed">
                          <CheckCircle2 className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* The Trap (Lead Magnet CTA) */}
            <div className="mt-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 saas-grid-bg opacity-30"></div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">Stop writing resumes blindly.</h3>
              <p className="text-indigo-200 mb-6 max-w-lg mx-auto relative z-10">
                Sign up for TrackrAI for free to save your resume, generate AI cover letters, and track all your job applications in one beautiful dashboard.
              </p>
              <Link href="/signup" className="relative z-10 inline-flex">
                <Button variant="primary" size="lg" className="px-8 shadow-xl hover:shadow-indigo-500/25">
                  Create Free Account <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setResult(null)}
                className="text-white/40 hover:text-white text-sm font-semibold transition-colors"
              >
                Scan another resume
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        {!result && (
          <div className="text-center">
            <Button 
              onClick={handleAnalyze} 
              disabled={loading} 
              variant="primary" 
              size="lg"
              className="w-full md:w-auto md:px-16"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-3"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  Simulate ATS Scan <ArrowUpRight className="ml-2" size={20} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
