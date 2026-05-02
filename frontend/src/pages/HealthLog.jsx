import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';

const HealthLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: '',
    calories: '',
    weight: '',
    water: '',
    sleep: '',
    heartRate: '',
    mood: 'good',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moods = [
    { id: 'great', emoji: '😄', label: 'Great' },
    { id: 'good', emoji: '🙂', label: 'Good' },
    { id: 'okay', emoji: '😐', label: 'Okay' },
    { id: 'bad', emoji: '😞', label: 'Bad' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // OPTIMISTIC UI: Show success immediately and navigate
    const optimisticData = { ...formData };
    
    try {
      const token = localStorage.getItem('token');
      // We don't await the alert, we want the user to feel the speed
      axios.post('http://localhost:5000/api/health/log', optimisticData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate immediately
      navigate('/dashboard');
      
      // Trigger a small vibration if supported (Haptic Feedback)
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error logging health data:', error);
      alert('Failed to save log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-syne font-extrabold mb-2">Log Your Vitals 📝</h1>
        <p className="text-textMuted font-medium">Keep track of your daily harmony and progress.</p>
      </header>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-success/10 border border-success/20 p-4 rounded-2xl flex items-center gap-3 text-success font-bold"
          >
            <CheckCircle2 size={20} />
            Health log saved successfully! Stay consistent.
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="glass p-8 md:p-12 rounded-[40px] grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Log Date</label>
          <input
            type="date"
            name="date"
            required
            className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none transition-colors"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {[
          { label: 'Steps Taken', name: 'steps', type: 'number', placeholder: 'e.g. 8000', unit: 'steps' },
          { label: 'Calories Consumed', name: 'calories', type: 'number', placeholder: 'e.g. 2100', unit: 'kcal' },
          { label: 'Body Weight', name: 'weight', type: 'number', placeholder: 'e.g. 65.5', unit: 'kg' },
          { label: 'Water Intake', name: 'water', type: 'number', placeholder: 'e.g. 2.5', unit: 'L' },
          { label: 'Sleep Duration', name: 'sleep', type: 'number', placeholder: 'e.g. 7.5', unit: 'hours' },
          { label: 'Avg Heart Rate', name: 'heartRate', type: 'number', placeholder: 'e.g. 72', unit: 'bpm' },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">
              {field.label} ({field.unit})
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none transition-colors"
              value={formData[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="flex flex-col gap-4 md:col-span-2">
          <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">How are you feeling today?</label>
          <div className="grid grid-cols-4 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => setFormData({ ...formData, mood: mood.id })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  formData.mood === mood.id 
                    ? 'bg-accent/10 border-accent scale-105' 
                    : 'glass border-transparent grayscale hover:grayscale-0'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 mt-4 bg-accent hover:scale-[1.01] active:scale-[0.99] transition-all py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Health Log</>}
        </button>
      </form>
    </div>
  );
};

export default HealthLog;
