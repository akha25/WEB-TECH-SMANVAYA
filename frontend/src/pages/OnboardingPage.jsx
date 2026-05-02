import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Ruler, Weight, Target, Activity, Heart, ChevronRight, ChevronLeft } from 'lucide-react';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    dob: '',
    height: '',
    weight: '',
    goal: 'Maintain Weight',
    activityLevel: 'Moderate',
    allergies: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleComplete = async () => {
    try {
      await updateProfile(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    { id: 1, title: 'Personal Info', icon: Calendar },
    { id: 2, title: 'Physical Vitals', icon: Ruler },
    { id: 3, title: 'Your Goals', icon: Target },
    { id: 4, title: 'Health Notes', icon: Heart },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface -translate-y-1/2 z-0" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              step >= s.id ? 'bg-accent text-white' : 'bg-surface text-textMuted border border-border'
            }`}>
              <s.icon size={18} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-accent' : 'text-textMuted'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <div className="glass p-10 md:p-14 rounded-[48px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h2 className="text-3xl font-syne font-extrabold mb-2">When is your birthday? 🎂</h2>
                <p className="text-textMuted">This helps us calculate your age and tailor your health metrics.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textMuted uppercase tracking-widest">Date of Birth</label>
                <input
                  type="date"
                  className="glass bg-transparent px-6 py-4 rounded-2xl border-border focus:border-accent outline-none text-lg"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
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
                <h2 className="text-3xl font-syne font-extrabold mb-2">Physical Vitals 📏</h2>
                <p className="text-textMuted">Let's get your current measurements to track progress.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-widest">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="170"
                    className="glass bg-transparent px-6 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-widest">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="65"
                    className="glass bg-transparent px-6 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
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
                <h2 className="text-3xl font-syne font-extrabold mb-2">What's your goal? 🎯</h2>
                <p className="text-textMuted">We'll help you stay focused on what matters most to you.</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-widest">Health Goal</label>
                  <select
                    className="glass bg-transparent px-6 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Maintain Weight">Maintain Weight</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Holistic Balance">Holistic Balance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-widest">Activity Level</label>
                  <select
                    className="glass bg-transparent px-6 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  >
                    <option value="Sedentary">Sedentary (Office job)</option>
                    <option value="Light">Light (1-2 days/week)</option>
                    <option value="Moderate">Moderate (3-5 days/week)</option>
                    <option value="Active">Active (Daily exercise)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h2 className="text-3xl font-syne font-extrabold mb-2">Health Notes 🩺</h2>
                <p className="text-textMuted">Any allergies or medical conditions we should know about?</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textMuted uppercase tracking-widest">Allergies / Conditions</label>
                <textarea
                  className="glass bg-transparent px-6 py-4 rounded-2xl border-border focus:border-accent outline-none min-h-[150px]"
                  placeholder="e.g. Peanut allergy, Lactose intolerant..."
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 text-textMuted font-bold hover:text-text transition-colors"
            >
              <ChevronLeft size={20} /> Back
            </button>
          ) : <div />}

          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-textMuted text-sm font-bold hover:underline"
            >
              Skip for now →
            </button>
            <button 
              onClick={step === steps.length ? handleComplete : nextStep}
              className="bg-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              {step === steps.length ? 'Finish' : 'Next'} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
