import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import HealthConnectSVG from '../components/HealthConnectSVG';
import { AlertCircle, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await register(formData);
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
      {/* Background Liquid Blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-accentAlt/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center z-10">
        <div className="hidden lg:flex flex-col items-center justify-center text-center gap-12">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <HealthConnectSVG />
          </motion.div>
          <div className="flex flex-col gap-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-black bg-gradient-to-r from-accent to-accentAlt bg-clip-text text-transparent"
            >
              Join the Harmony
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-textMuted max-w-sm text-lg font-medium leading-relaxed"
            >
              Experience the perfect coordination of health and technology. Log in to access your personalized wellness journey.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 md:p-12 rounded-[48px] max-w-md w-full mx-auto shadow-2xl relative"
        >
          {/* Subtle Glow Border */}
          <div className="absolute inset-0 rounded-[48px] border border-accent/20 pointer-events-none" />
          
          <div className="mb-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:hidden mb-8 flex justify-center scale-75"
            >
              <HealthConnectSVG />
            </motion.div>
            <h2 className="text-4xl font-black mb-3">
              {isLogin ? 'Welcome Back 🙏' : 'Create Account ✨'}
            </h2>
            <p className="text-textMuted text-base font-medium">
              {isLogin ? "Continue your journey towards holistic health." : "Start your path to a balanced and harmonious life."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-danger/10 border border-danger/20 p-4 rounded-xl flex gap-3 text-danger text-sm mb-6"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none transition-colors"
                  placeholder="Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none transition-colors"
                placeholder="priya@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Register Now')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-textMuted">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            </span>
            <button
              onClick={() => navigate(`/auth?mode=${isLogin ? 'register' : 'login'}`)}
              className="text-accent font-bold hover:underline"
            >
              {isLogin ? 'Create one' : 'Sign in here'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
