import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Dumbbell, Plus, Trash2, Calendar, Clock, Flame, Award, 
  ChevronRight, Activity, Heart, Droplets, Moon, Utensils, 
  TrendingUp, Zap, Target, Shield, LayoutDashboard, Search,
  Scale, ClipboardList, Info, Star, Trophy, Map, Pill
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

// --- Constants & Data ---
const EXERCISE_PRESETS = {
  'Chest': ['Bench Press', 'Incline Press', 'Decline Press', 'Cable Fly', 'Push-ups', 'Chest Press Machine'],
  'Back': ['Pull-ups', 'Deadlift', 'Bent Over Row', 'Lat Pulldown', 'Seated Cable Row', 'T-Bar Row'],
  'Shoulders': ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Face Pulls', 'Reverse Fly', 'Shoulder Press Machine'],
  'Biceps': ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Concentration Curl'],
  'Triceps': ['Tricep Pushdown', 'Skull Crushers', 'Dips', 'Overhead Extension', 'Close Grip Bench Press'],
  'Legs': ['Squat', 'Leg Press', 'Lunge', 'Leg Extension', 'Leg Curl', 'Calf Raise'],
  'Core/Abs': ['Plank', 'Crunches', 'Leg Raise', 'Russian Twist', 'Ab Wheel'],
  'Cardio': ['Running', 'Cycling', 'Swimming', 'Jump Rope', 'Elliptical'],
  'Full Body': ['Burpees', 'Clean and Press', 'Thrusters', 'Kettlebell Swing']
};

const CATEGORIES = Object.keys(EXERCISE_PRESETS);

const SUPPLEMENTS_LIST = ['Creatine', 'Whey Protein', 'Pre-Workout', 'BCAA', 'Multivitamin', 'Fish Oil'];

// --- Helper Components ---

const StatCard = ({ title, value, unit, icon: Icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-3xl flex items-center justify-between group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full translate-x-12 -translate-y-12" style={{ color }} />
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={24} />
      </div>
      <div>
        <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">{title}</span>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-extrabold">{value}</h3>
          <span className="text-xs font-bold text-textMuted">{unit}</span>
        </div>
      </div>
    </div>
    {trend && (
      <div className={`text-xs font-bold ${trend > 0 ? 'text-success' : 'text-danger'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </div>
    )}
  </motion.div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {subtitle && <p className="text-sm font-medium text-textMuted">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// --- Main Page Component ---

const WorkoutsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [height, setHeight] = useState(localStorage.getItem('user_height') || 175);
  const [workouts, setWorkouts] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    category: 'Full Body',
    date: new Date().toISOString().split('T')[0],
    exercises: [{ name: '', sets: [{ reps: '', weight: '' }], notes: '' }]
  });
  const [newSupplement, setNewSupplement] = useState({
    name: SUPPLEMENTS_LIST[0],
    dosage: '',
    timeTaken: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [workoutsRes, supplementsRes, healthRes, foodRes] = await Promise.all([
          axios.get('http://localhost:5000/api/workouts', { headers }),
          axios.get('http://localhost:5000/api/supplements', { headers }),
          axios.get('http://localhost:5000/api/health/logs', { headers }),
          axios.get('http://localhost:5000/api/food/logs', { headers })
        ]);

        setWorkouts(workoutsRes.data);
        setSupplements(supplementsRes.data);
        setHealthLogs(healthRes.data);
        setFoodLogs(foodRes.data);
      } catch (err) {
        console.error("Error fetching fitness data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Logic & Calculations ---
  
  const prs = useMemo(() => {
    const records = {};
    workouts.forEach(w => {
      w.exercises?.forEach(ex => {
        const weights = (ex.sets || []).map(s => parseFloat(s.weight) || 0);
        const maxWeight = weights.length ? Math.max(...weights) : 0;
        if (!records[ex.name] || maxWeight > records[ex.name].weight) {
          records[ex.name] = { weight: maxWeight, date: w.date };
        }
      });
    });
    return Object.entries(records).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.weight - a.weight);
  }, [workouts]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayWorkout = workouts.find(w => w.date === today);
    
    // Streak logic
    let streak = 0;
    const sortedDates = [...new Set(workouts.map(w => w.date))].sort((a, b) => new Date(b) - new Date(a));
    if (sortedDates.length > 0) {
      let current = new Date();
      for (let dateStr of sortedDates) {
        const d = new Date(dateStr);
        const diff = Math.floor((current - d) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
          streak++;
          current = d;
        } else {
          break;
        }
      }
    }

    // Water, Sleep, Weight (latest)
    const latestHealth = healthLogs[0] || {};
    const latestFood = foodLogs.filter(f => f.date === today);
    const totalCals = latestFood.reduce((acc, f) => acc + (f.calories || 0), 0);
    const effectiveHeight = user?.height || height || 175;

    return {
      streak,
      todayWorkout: todayWorkout ? todayWorkout.name : 'Rest Day',
      water: latestHealth.water ?? latestHealth.waterIntake ?? 0,
      sleep: latestHealth.sleep ?? latestHealth.sleepHours ?? 0,
      calories: totalCals,
      weight: latestHealth.weight || 0,
      bmi: latestHealth.weight ? (latestHealth.weight / Math.pow(effectiveHeight / 100, 2)).toFixed(1) : 0,
      prsThisWeek: 3 // Mocked for now
    };
  }, [workouts, healthLogs, foodLogs, height, user]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayWorkouts = workouts.filter(w => w.date === date);
      const dayHealth = healthLogs.find(h => h.date === date) || {};
      const dayFood = foodLogs.filter(f => f.date === date);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        workouts: dayWorkouts.length,
        calories: dayFood.reduce((acc, f) => acc + (f.calories || 0), 0),
        water: dayHealth.water ?? dayHealth.waterIntake ?? 0,
        sleep: dayHealth.sleep ?? dayHealth.sleepHours ?? 0
      };
    });
  }, [workouts, healthLogs, foodLogs]);

  // --- Render Functions ---

  const renderDashboard = () => (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Workout" value={stats.todayWorkout} unit="" icon={Dumbbell} color="#34d399" />
        <StatCard title="Current Streak" value={stats.streak} unit="days" icon={Zap} color="#fbbf24" />
        <StatCard title="Water Intake" value={stats.water} unit="L" icon={Droplets} color="#60a5fa" />
        <StatCard title="Sleep Duration" value={stats.sleep} unit="hrs" icon={Moon} color="#818cf8" />
        <StatCard title="Calories Eaten" value={stats.calories} unit="kcal" icon={Flame} color="#f87171" />
        <StatCard title="Body Weight" value={stats.weight} unit="kg" icon={Scale} color="#a78bfa" />
        <StatCard title="Current BMI" value={stats.bmi} unit="" icon={Activity} color="#2dd4bf" />
        <StatCard title="PRs This Week" value={stats.prsThisWeek} unit="achieved" icon={Trophy} color="#f472b6" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[32px]">
          <SectionHeader title="Weekly Activity" subtitle="Your workout and nutrition consistency" />
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#f8fafc' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="workouts" fill="#34d399" radius={[4, 4, 0, 0]} name="Workouts" />
                <Bar dataKey="calories" fill="#f87171" radius={[4, 4, 0, 0]} name="Calories (x10)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px]">
          <SectionHeader title="Sleep Trends" subtitle="Hours of rest over the past week" />
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="sleep" stroke="#818cf8" strokeWidth={4} dot={{ r: 6, fill: '#818cf8' }} activeDot={{ r: 8 }} name="Sleep Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogWorkout = () => (
    <div className="flex flex-col gap-8">
      <div className="glass p-10 rounded-[40px] max-w-4xl mx-auto w-full">
        <SectionHeader title="Log New Session" subtitle="Track your progress and break your records" />
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Workout Name</label>
            <input 
              type="text" 
              placeholder="e.g. Push Day"
              className="glass bg-transparent px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 ring-accent/20"
              value={newWorkout.name}
              onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Category</label>
            <select 
              className="glass bg-transparent px-6 py-4 rounded-2xl border-none outline-none appearance-none"
              value={newWorkout.category}
              onChange={(e) => setNewWorkout({...newWorkout, category: e.target.value})}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-bg">{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Exercises</h3>
            <button 
              onClick={() => setNewWorkout({
                ...newWorkout, 
                exercises: [...newWorkout.exercises, { name: '', sets: [{ reps: '', weight: '' }], notes: '' }]
              })}
              className="flex items-center gap-2 text-accent text-sm font-bold hover:underline"
            >
              <Plus size={16} /> Add Exercise
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {newWorkout.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="p-6 rounded-3xl bg-surface/30 border border-border/50">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input 
                      list={`exercises-${newWorkout.category}`}
                      placeholder="Exercise Name"
                      className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-accent font-bold"
                      value={ex.name}
                      onChange={(e) => {
                        const updated = [...newWorkout.exercises];
                        updated[exIdx].name = e.target.value;
                        setNewWorkout({...newWorkout, exercises: updated});
                      }}
                    />
                    <datalist id={`exercises-${newWorkout.category}`}>
                      {EXERCISE_PRESETS[newWorkout.category]?.map(p => <option key={p} value={p} />)}
                    </datalist>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = [...newWorkout.exercises];
                      updated.splice(exIdx, 1);
                      setNewWorkout({...newWorkout, exercises: updated});
                    }}
                    className="text-danger p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} className="flex items-center gap-4 text-sm">
                      <span className="w-8 font-bold text-textMuted">#{setIdx + 1}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <input 
                          type="number" 
                          placeholder="Weight" 
                          className="w-full glass bg-transparent px-4 py-2 rounded-xl text-center"
                          value={set.weight}
                          onChange={(e) => {
                            const updated = [...newWorkout.exercises];
                            updated[exIdx].sets[setIdx].weight = e.target.value;
                            setNewWorkout({...newWorkout, exercises: updated});
                          }}
                        />
                        <span className="text-textMuted">kg</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <input 
                          type="number" 
                          placeholder="Reps" 
                          className="w-full glass bg-transparent px-4 py-2 rounded-xl text-center"
                          value={set.reps}
                          onChange={(e) => {
                            const updated = [...newWorkout.exercises];
                            updated[exIdx].sets[setIdx].reps = e.target.value;
                            setNewWorkout({...newWorkout, exercises: updated});
                          }}
                        />
                        <span className="text-textMuted">reps</span>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = [...newWorkout.exercises];
                          updated[exIdx].sets.splice(setIdx, 1);
                          setNewWorkout({...newWorkout, exercises: updated});
                        }}
                        className="p-2 text-textMuted"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const updated = [...newWorkout.exercises];
                      updated[exIdx].sets.push({ reps: '', weight: '' });
                      setNewWorkout({...newWorkout, exercises: updated});
                    }}
                    className="text-accent text-xs font-bold mt-2"
                  >
                    + Add Set
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.post('http://localhost:5000/api/workouts', newWorkout, {
                headers: { Authorization: `Bearer ${token}` }
              });
              alert('Workout Logged! 🚀');
              window.location.reload();
            } catch (err) {
              console.error(err);
            }
          }}
          className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-lg mt-10 hover:scale-[1.02] transition-transform"
        >
          Save Workout Session
        </button>
      </div>
    </div>
  );

  const renderBodyMap = () => (
    <div className="flex flex-col items-center gap-10 py-10">
      <SectionHeader title="Muscle Group Visualizer" subtitle="Trained muscles highlighted based on your activity" />
      <div className="grid md:grid-cols-2 gap-20 max-w-5xl w-full">
        {/* Simplified SVG Human Body - Front */}
        <div className="flex flex-col items-center gap-6">
          <span className="text-sm font-bold text-textMuted uppercase tracking-widest">Front View</span>
          <svg viewBox="0 0 200 400" className="w-full max-w-[250px] drop-shadow-2xl">
            {/* Chest */}
            <path d="M70 100 Q100 90 130 100 L130 140 Q100 150 70 140 Z" fill={workouts.some(w => w.category === 'Chest') ? '#f87171' : '#334155'} />
            {/* Shoulders */}
            <circle cx="60" cy="110" r="15" fill={workouts.some(w => w.category === 'Shoulders') ? '#f87171' : '#334155'} />
            <circle cx="140" cy="110" r="15" fill={workouts.some(w => w.category === 'Shoulders') ? '#f87171' : '#334155'} />
            {/* Abs */}
            <rect x="80" y="150" width="40" height="60" rx="10" fill={workouts.some(w => w.category === 'Core/Abs') ? '#fbbf24' : '#334155'} />
            {/* Biceps */}
            <path d="M40 120 Q30 150 45 180" stroke={workouts.some(w => w.category === 'Biceps') ? '#f87171' : '#334155'} strokeWidth="15" strokeLinecap="round" />
            <path d="M160 120 Q170 150 155 180" stroke={workouts.some(w => w.category === 'Biceps') ? '#f87171' : '#334155'} strokeWidth="15" strokeLinecap="round" />
            {/* Quads */}
            <path d="M75 220 Q70 280 85 340" stroke={workouts.some(w => w.category === 'Legs') ? '#fbbf24' : '#334155'} strokeWidth="20" strokeLinecap="round" />
            <path d="M125 220 Q130 280 115 340" stroke={workouts.some(w => w.category === 'Legs') ? '#fbbf24' : '#334155'} strokeWidth="20" strokeLinecap="round" />
            {/* Head/Torso outline */}
            <path d="M100 40 Q115 40 115 65 Q115 90 100 90 Q85 90 85 65 Q85 40 100 40" fill="#475569" />
          </svg>
        </div>
        
        {/* Back View */}
        <div className="flex flex-col items-center gap-6">
          <span className="text-sm font-bold text-textMuted uppercase tracking-widest">Back View</span>
          <svg viewBox="0 0 200 400" className="w-full max-w-[250px] drop-shadow-2xl">
            {/* Upper Back */}
            <path d="M60 100 Q100 85 140 100 L140 150 Q100 165 60 150 Z" fill={workouts.some(w => w.category === 'Back') ? '#f87171' : '#334155'} />
            {/* Lower Back */}
            <path d="M75 160 Q100 155 125 160 L125 210 Q100 220 75 210 Z" fill={workouts.some(w => w.category === 'Back') ? '#fbbf24' : '#334155'} />
            {/* Triceps */}
            <path d="M45 120 Q35 150 50 180" stroke={workouts.some(w => w.category === 'Triceps') ? '#f87171' : '#334155'} strokeWidth="15" strokeLinecap="round" />
            <path d="M155 120 Q165 150 150 180" stroke={workouts.some(w => w.category === 'Triceps') ? '#f87171' : '#334155'} strokeWidth="15" strokeLinecap="round" />
            {/* Glutes/Hamstrings */}
            <path d="M75 220 Q70 280 85 340" stroke={workouts.some(w => w.category === 'Legs') ? '#fbbf24' : '#334155'} strokeWidth="20" strokeLinecap="round" />
            <path d="M125 220 Q130 280 115 340" stroke={workouts.some(w => w.category === 'Legs') ? '#fbbf24' : '#334155'} strokeWidth="20" strokeLinecap="round" />
            {/* Head/Torso outline */}
            <path d="M100 40 Q115 40 115 65 Q115 90 100 90 Q85 90 85 65 Q85 40 100 40" fill="#475569" />
          </svg>
        </div>
      </div>
      <div className="flex gap-6 mt-10">
        <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
          <div className="w-4 h-4 rounded-full bg-danger" /> Trained Today
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
          <div className="w-4 h-4 rounded-full bg-warning" /> Trained This Week
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
          <div className="w-4 h-4 rounded-full bg-surface" /> Not Trained
        </div>
      </div>
    </div>
  );

  const renderSupplements = () => (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Supplement Tracker" subtitle="Stay consistent with your fuel" />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[32px]">
          <h3 className="text-lg font-bold mb-6">Consistency Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (34 - i));
              const dateStr = d.toISOString().split('T')[0];
              const daySupps = supplements.filter(s => s.date === dateStr);
              const intensity = daySupps.length > 0 ? Math.min(daySupps.length / 3, 1) : 0;
              return (
                <div 
                  key={i} 
                  title={`${dateStr}: ${daySupps.length} supplements`}
                  className="aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold transition-all"
                  style={{ 
                    backgroundColor: intensity > 0 ? `rgba(52, 211, 153, ${0.2 + intensity * 0.8})` : 'rgba(255,255,255,0.05)',
                    color: intensity > 0.5 ? '#fff' : '#94a3b8'
                  }}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] flex flex-col gap-6">
          <h3 className="text-lg font-bold">Log Supplement</h3>
          <div className="flex flex-col gap-4">
            <select 
              className="glass bg-transparent px-5 py-4 rounded-2xl border-none outline-none appearance-none"
              value={newSupplement.name}
              onChange={(e) => setNewSupplement({...newSupplement, name: e.target.value})}
            >
              {SUPPLEMENTS_LIST.map(s => <option key={s} value={s} className="bg-bg">{s}</option>)}
              <option value="Custom" className="bg-bg">Custom...</option>
            </select>
            {newSupplement.name === 'Custom' && (
              <input 
                type="text" 
                placeholder="Supplement Name" 
                className="glass bg-transparent px-5 py-4 rounded-2xl border-none outline-none"
                onChange={(e) => setNewSupplement({...newSupplement, customName: e.target.value})}
              />
            )}
            <input 
              type="text" 
              placeholder="Dosage (e.g. 5g)" 
              className="glass bg-transparent px-5 py-4 rounded-2xl border-none outline-none"
              value={newSupplement.dosage}
              onChange={(e) => setNewSupplement({...newSupplement, dosage: e.target.value})}
            />
            <input 
              type="time" 
              className="glass bg-transparent px-5 py-4 rounded-2xl border-none outline-none"
              value={newSupplement.timeTaken}
              onChange={(e) => setNewSupplement({...newSupplement, timeTaken: e.target.value})}
            />
            <button 
              className="bg-accent text-white py-4 rounded-2xl font-bold mt-2 hover:scale-[1.02] transition-transform"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const data = {
                    ...newSupplement,
                    name: newSupplement.name === 'Custom' ? newSupplement.customName : newSupplement.name
                  };
                  await axios.post('http://localhost:5000/api/supplements', data, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  alert('Supplement Logged! 💊');
                  window.location.reload();
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Log Intake
            </button>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px]">
        <h3 className="text-lg font-bold mb-6">Today's Intake</h3>
        <div className="flex flex-wrap gap-4">
          {SUPPLEMENTS_LIST.map(supp => {
            const entry = supplements.find(s => s.name === supp && s.date === new Date().toISOString().split('T')[0]);
            return (
              <div 
                key={supp}
                className={`px-6 py-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  entry ? 'bg-accent/10 border-accent text-accent' : 'bg-surface/20 border-border text-textMuted'
                }`}
              >
                <Pill size={18} />
                <div className="flex flex-col">
                  <span className="font-bold">{supp}</span>
                  {entry && <span className="text-[10px] font-bold opacity-70">{entry.dosage} @ {entry.timeTaken}</span>}
                </div>
                {entry && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Macro Tracker" subtitle="Balance your nutrients for optimal growth" />
      <div className="grid lg:grid-cols-3 gap-8">
        {['Protein', 'Carbs', 'Fats'].map((macro, i) => {
          const colors = ['#f87171', '#fbbf24', '#60a5fa'];
          const today = new Date().toISOString().split('T')[0];
          const key = macro.toLowerCase() === 'fats' ? 'fat' : macro.toLowerCase();
          const current = todayFood.reduce((acc, f) => acc + (f[key] || 0), 0);
          const goal = macro === 'Protein' ? 180 : macro === 'Carbs' ? 250 : 70; // Mock goals
          const percentage = Math.min(Math.round((current / (goal || 1)) * 100), 100);

          return (
            <div key={macro} className="glass p-8 rounded-[32px] flex flex-col items-center gap-4">
              <h3 className="text-lg font-bold">{macro}</h3>
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Current', value: current },
                        { name: 'Remaining', value: Math.max(goal - current, 0) }
                      ]}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill={colors[i]} />
                      <Cell fill="rgba(255,255,255,0.05)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold">{percentage}%</span>
                </div>
              </div>
              <span className="text-sm font-bold text-textMuted">{current}g / {goal}g</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBodyStats = () => {
    const bmiValue = parseFloat(stats.bmi);
    const getBMICategory = (val) => {
      if (val < 18.5) return { label: 'Underweight', color: '#60a5fa' };
      if (val < 25) return { label: 'Normal', color: '#34d399' };
      if (val < 30) return { label: 'Overweight', color: '#fbbf24' };
      return { label: 'Obese', color: '#f87171' };
    };
    const category = getBMICategory(bmiValue);
    const weightData = healthLogs.slice().reverse().map(h => ({
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: h.weight
    }));

    return (
      <div className="flex flex-col gap-10">
        <SectionHeader title="Body Stats & BMI" subtitle="Track your physical transformation" />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-[32px] flex flex-col gap-6">
            <h3 className="text-lg font-bold">Parameters</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Height (cm)</label>
                <input 
                  type="number" 
                  className="glass bg-transparent px-5 py-4 rounded-2xl border-none outline-none"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    localStorage.setItem('user_height', e.target.value);
                  }}
                />
              </div>
              <div className="p-6 rounded-2xl bg-surface/30 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Your BMI</span>
                <h4 className="text-4xl font-black" style={{ color: category.color }}>{stats.bmi}</h4>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                  {category.label}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass p-8 rounded-[32px]">
            <h3 className="text-lg font-bold mb-6">Weight Progress</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="weight" stroke="#a78bfa" strokeWidth={4} dot={{ r: 6, fill: '#a78bfa' }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAchievements = () => (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Achievements & PRs" subtitle="Your journey to greatness, visualized" />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[32px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="text-warning" /> PR Hall of Fame
          </h3>
          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {prs.length > 0 ? prs.map((pr, i) => (
              <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-surface/30 border border-border/50 group hover:border-accent transition-all">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-textMuted uppercase">{pr.date}</span>
                  <span className="text-lg font-bold">{pr.name}</span>
                </div>
                <div className="px-5 py-2 rounded-xl bg-accent text-white font-extrabold text-xl shadow-lg shadow-accent/20">
                  {pr.weight}kg
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-textMuted font-bold">No PRs recorded yet. Keep lifting!</div>
            )}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="text-accent" /> Badges Earned
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'First Workout', icon: Star, color: '#60a5fa', desc: 'Started the journey', earned: workouts.length >= 1 },
              { name: '7 Day Streak', icon: Zap, color: '#fbbf24', desc: 'One week strong', earned: stats.streak >= 7 },
              { name: 'PR Breaker', icon: Trophy, color: '#f87171', desc: 'Broke 5 personal bests', earned: prs.length >= 5 },
              { name: 'Early Bird', icon: Moon, color: '#a78bfa', desc: '5 workouts logged', earned: workouts.length >= 5 }
            ].map((badge, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-2xl flex flex-col items-center text-center gap-3 transition-all ${
                  badge.earned ? 'bg-surface/30 opacity-100' : 'bg-surface/10 opacity-40 grayscale'
                }`}
              >
                <div className="p-4 rounded-full" style={{ backgroundColor: `${badge.color}15`, color: badge.color }}>
                  <badge.icon size={32} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">{badge.name}</h4>
                  <p className="text-[10px] text-textMuted font-bold uppercase">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- Main Render ---

  if (loading) return (
    <div className="flex flex-col gap-10 font-sans pb-20">
      <div className="flex justify-between items-end">
        <div className="w-64 h-12 skeleton" />
        <div className="w-32 h-12 skeleton rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-[32px]" />
        ))}
      </div>
      <div className="h-[400px] skeleton rounded-[40px]" />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 flex flex-col gap-8">
        <div className="glass p-8 rounded-[40px] flex flex-col gap-6 sticky top-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <Dumbbell size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight">GYM<br/>TRACKER</h1>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'log', label: 'Log Workout', icon: ClipboardList },
              { id: 'body', label: 'Body Map', icon: Map },
              { id: 'supplements', label: 'Supplements', icon: Pill },
              { id: 'nutrition', label: 'Nutrition', icon: Utensils },
              { id: 'body-stats', label: 'Body Stats', icon: Scale },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'text-textMuted hover:bg-surface/50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
              <p className="text-[10px] font-black text-accent uppercase mb-2">Pro Tip</p>
              <p className="text-xs font-bold text-textMuted leading-relaxed">Consistency is key! Log every set to see real progress over time.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-textMuted font-medium">Welcome back, {user?.name || 'Athlete'}! 💪</p>
          </div>
          <div className="flex items-center gap-4 bg-glass border border-border/50 px-6 py-3 rounded-2xl">
            <Calendar className="text-accent" size={20} />
            <span className="font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'log' && renderLogWorkout()}
            {activeTab === 'body' && renderBodyMap()}
            {activeTab === 'supplements' && renderSupplements()}
            {activeTab === 'nutrition' && renderNutrition()}
            {activeTab === 'body-stats' && renderBodyStats()}
            {activeTab === 'achievements' && renderAchievements()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WorkoutsPage;
