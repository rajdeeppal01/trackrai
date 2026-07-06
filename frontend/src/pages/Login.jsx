import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, Cpu } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Login() {
  const { login, signup, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        }
      } else {
        const success = await signup(email, password);
        if (success) {
          setIsLogin(true); // Switch to login after signup
          setPassword('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden bg-[#050510]">
      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-500/15 to-transparent rounded-full filter blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full filter blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 z-10 shadow-2xl relative"
      >
        {/* App Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-4">
            <Cpu size={24} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">TrackrAI</h1>
          <p className="text-white/40 text-xs mt-1">
            {isLogin ? 'Sign in to manage your applications' : 'Create an account to start tracking'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="w-full py-3 mt-2 font-medium"
            icon={isLogin ? LogIn : UserPlus}
          >
            {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        {/* Auth Toggle */}
        <div className="text-center mt-6 text-xs text-white/40">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline transition-colors"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline transition-colors"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
