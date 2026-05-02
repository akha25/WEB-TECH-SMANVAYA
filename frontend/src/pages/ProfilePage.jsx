import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Ruler, Weight, Target, Lock, Save, Loader2, Calculator } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    height: user?.height || '',
    weight: user?.weight || '',
    goal: user?.goal || 'Maintain Weight',
  });

  const bmi = (formData.weight && formData.height) 
    ? (formData.weight / ((formData.height/100) ** 2)).toFixed(1)
    : null;

  const getBMICategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-warning' };
    if (val < 25) return { label: 'Healthy', color: 'text-success' };
    if (val < 30) return { label: 'Overweight', color: 'text-warning' };
    return { label: 'Obese', color: 'text-danger' };
  };

  const bmiCat = bmi ? getBMICategory(bmi) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-syne font-extrabold mb-2">Your Profile 👤</h1>
        <p className="text-textMuted font-medium">Manage your personal settings and health profile.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-[40px] flex flex-col items-center text-center gap-6"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent/20">
                <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-[-8px] border-2 border-accent/30 rounded-full"
              />
            </div>
            <div>
              <h2 className="text-2xl font-syne font-extrabold">{user?.name}</h2>
              <p className="text-textMuted text-sm font-medium">{user?.email}</p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
              {user?.role} Role
            </div>
          </motion.div>

          {bmi && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[32px] flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 text-accent">
                <Calculator size={24} />
                <h3 className="text-lg font-bold">BMI Calculator</h3>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl font-syne font-extrabold">{bmi}</span>
                <span className={`font-bold uppercase tracking-widest text-xs ${bmiCat.color}`}>{bmiCat.label}</span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden flex">
                <div className="h-full bg-warning w-[30%]" />
                <div className="h-full bg-success w-[30%]" />
                <div className="h-full bg-danger w-[40%]" />
              </div>
              <p className="text-xs text-textMuted text-center">Your BMI is calculated based on your current height and weight settings.</p>
            </motion.div>
          )}
        </div>

        {/* Edit Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass p-10 rounded-[40px] flex flex-col gap-10"
        >
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <User className="text-accent" size={24} />
            <h2 className="text-2xl font-syne font-extrabold">Account Settings</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="text"
                  className="glass bg-transparent pl-12 pr-5 py-4 rounded-2xl border-border focus:border-accent outline-none w-full transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="email"
                  className="glass bg-transparent pl-12 pr-5 py-4 rounded-2xl border-border focus:border-accent outline-none w-full transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Height (cm)</label>
              <div className="relative">
                <Ruler size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="number"
                  className="glass bg-transparent pl-12 pr-5 py-4 rounded-2xl border-border focus:border-accent outline-none w-full transition-colors"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Weight (kg)</label>
              <div className="relative">
                <Weight size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="number"
                  className="glass bg-transparent pl-12 pr-5 py-4 rounded-2xl border-border focus:border-accent outline-none w-full transition-colors"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Health Goal</label>
              <div className="relative">
                <Target size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted" />
                <select
                  className="glass bg-transparent pl-12 pr-5 py-4 rounded-2xl border-border focus:border-accent outline-none w-full transition-colors"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Holistic Balance">Holistic Balance</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-4 bg-accent hover:scale-[1.01] active:scale-[0.99] transition-all py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Profile Changes</>}
            </button>
          </form>

          <div className="flex items-center gap-4 border-t border-border pt-10 pb-6">
            <Lock className="text-danger" size={24} />
            <h2 className="text-2xl font-syne font-extrabold">Change Password</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="glass bg-transparent px-5 py-4 rounded-2xl border-border outline-none w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">New Password</label>
              <input type="password" placeholder="••••••••" className="glass bg-transparent px-5 py-4 rounded-2xl border-border outline-none w-full" />
            </div>
            <button className="md:col-span-2 glass border-danger/20 text-danger py-4 rounded-2xl font-bold hover:bg-danger/5 transition-all">Update Password</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
