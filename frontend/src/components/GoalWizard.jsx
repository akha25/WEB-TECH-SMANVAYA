import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Calendar, Clock, Award, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const GoalWizard = ({ isOpen, onClose, onGoalCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'Steps Challenge',
    targetValue: '',
    deadline: '',
  });

  const goalTypes = [
    { id: 'Steps Challenge', label: 'Steps Challenge', icon: '👟', desc: 'Set a daily step target' },
    { id: 'Weight Loss', label: 'Weight Loss', icon: '⚖️', desc: 'Reach your ideal weight' },
    { id: 'Sleep Improvement', label: 'Sleep Improvement', icon: '😴', desc: 'Better sleep habits' },
    { id: 'Water Intake', label: 'Water Intake', icon: '💧', desc: 'Stay hydrated daily' },
    { id: 'Meditation Streak', label: 'Meditation Streak', icon: '🧘', desc: 'Consistency in mindfulness' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/goals', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onGoalCreated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass p-10 rounded-[48px] max-w-xl w-full flex flex-col gap-10 shadow-2xl relative border-accent/20"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-surface rounded-xl text-textMuted"><X size={24} /></button>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-accent">
            <Target size={32} />
            <h2 className="text-3xl font-extrabold">New Goal Wizard</h2>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-accent' : 'bg-surface'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="text-xl font-extrabold mb-2">Choose Goal Type</h3>
                <p className="text-textMuted text-sm font-medium">What aspect of your harmony would you like to focus on?</p>
              </div>
              <div className="grid gap-4">
                {goalTypes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setFormData({ ...formData, type: t.id }); setStep(2); }}
                    className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group ${
                      formData.type === t.id ? 'bg-accent/10 border-accent scale-[1.02]' : 'glass border-transparent hover:bg-accent/5'
                    }`}
                  >
                    <div className="text-3xl bg-surface w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">{t.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-sm">{t.label}</h4>
                      <p className="text-xs text-textMuted font-medium">{t.desc}</p>
                    </div>
                    <ChevronRight size={20} className="text-textMuted" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h3 className="text-xl font-extrabold mb-2">Set Your Target</h3>
                <p className="text-textMuted text-sm font-medium">Be ambitious but realistic. Harmony takes time.</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest ml-1">Target Value</label>
                  <input
                    type="number"
                    required
                    className="glass bg-transparent px-6 py-5 rounded-[24px] border-border focus:border-accent outline-none text-2xl font-extrabold"
                    placeholder="e.g. 10000"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  />
                </div>
                <button 
                  onClick={() => setStep(3)}
                  className="bg-accent text-white py-5 rounded-[24px] font-extrabold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20"
                >
                  Continue
                </button>
                <button onClick={() => setStep(1)} className="text-[10px] font-bold text-textMuted uppercase tracking-widest hover:text-text transition-colors">Back to Type</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h3 className="text-xl font-extrabold mb-2">Pick a Deadline</h3>
                <p className="text-textMuted text-sm font-medium">When do you want to achieve this by?</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest ml-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    className="glass bg-transparent px-6 py-5 rounded-[24px] border-border focus:border-accent outline-none text-xl"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-accent text-white py-5 rounded-[24px] font-extrabold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} /> Create My Goal
                </button>
                <button onClick={() => setStep(2)} className="text-[10px] font-bold text-textMuted uppercase tracking-widest hover:text-text transition-colors">Back to Target</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GoalWizard;
