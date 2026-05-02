import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import MiniLineChart from '../components/charts/MiniLineChart';
import BarChart from '../components/charts/BarChart';
import GoalWizard from '../components/GoalWizard';
import CircularProgress from '../components/CircularProgress';
import ProgressGallery from '../components/ProgressGallery';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import { 
  Activity, Flame, Calendar, Trophy, Droplets, Moon, Heart, 
  Edit2, Check, X, TrendingUp, Clock, Plus, Target, Scale, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Zap, Save
} from 'lucide-react';

const SkeletonCard = () => (
  <div className="glass p-6 rounded-[24px] flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <div className="w-12 h-12 skeleton rounded-2xl" />
      <div className="w-16 h-6 skeleton" />
    </div>
    <div className="w-24 h-4 skeleton" />
    <div className="w-32 h-10 skeleton" />
  </div>
);

const EditableGoal = ({ label, value, unit, icon: Icon, color, onSave, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(field, tempValue);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl glass hover:bg-accent/5 transition-all group">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 text-[10px] font-bold text-textMuted uppercase tracking-widest">
          <Icon size={14} /> {label}
        </span>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent/10 rounded-lg text-accent"
        >
          {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="bg-transparent border-b border-accent text-lg font-bold w-20 outline-none text-text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
            />
            <button onClick={() => { setIsEditing(false); setTempValue(value); }} className="text-danger">
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="text-xl font-extrabold">{value}</span>
        )}
        <span className="text-[10px] font-bold text-textMuted uppercase">{unit}</span>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, trend, icon: Icon, color, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className={`glass p-6 rounded-[24px] card-float relative overflow-hidden group ${onClick ? 'cursor-pointer hover:border-accent/50 transition-colors' : ''}`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20`} style={{ backgroundColor: color }} />
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={24} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trend >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-textMuted text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold">
        <CountUp end={parseFloat(value.toString().replace(/,/g, ''))} separator="," duration={2} />
      </span>
      <span className="text-textMuted text-[10px] font-bold uppercase tracking-widest">{unit}</span>
    </div>
  </motion.div>
);

const MetricInsight = ({ label, value, unit, icon: Icon, color }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest flex items-center gap-1">
      <Icon size={12} /> {label}
    </span>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-extrabold">{value}</span>
      <span className="text-[8px] font-bold text-textMuted uppercase">{unit}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [logs, setLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [selectedProgressMetric, setSelectedProgressMetric] = useState('steps');
  const [editingStat, setEditingStat] = useState(null);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FF87', '#0066FF', '#FF0080']
    });
  }, []);

  const progressMetrics = [
    { id: 'steps', label: 'Steps', icon: Activity, color: '#00FF87', unit: 'steps' },
    { id: 'calories', label: 'Calories', icon: Flame, color: '#f87171', unit: 'kcal' },
    { id: 'weight', label: 'Weight', icon: Scale, color: '#0066FF', unit: 'kg' },
    { id: 'water', label: 'Water', icon: Droplets, color: '#60a5fa', unit: 'L' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: '#c084fc', unit: 'h' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [logsRes, goalsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/health/logs', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/goals', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setLogs(logsRes.data);
      setGoals(goalsRes.data);
      
      // Check if any goal reached 100% today
      const todayLog = logsRes.data[0];
      if (todayLog) {
        const stepGoal = user?.dailyStepGoal || 8000;
        if (todayLog.steps >= stepGoal && localStorage.getItem('lastConfetti') !== todayLog.date) {
          triggerConfetti();
          localStorage.setItem('lastConfetti', todayLog.date);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleUpdateGoal = async (field, value) => {
    try {
      await updateProfile({ [field]: Number(value) });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatSave = async () => {
    if (!editingStat) return;
    try {
      const token = localStorage.getItem('token');
      const date = new Date().toISOString().split('T')[0];
      
      const payload = { date, [editingStat.type]: Number(editingStat.value) };
      
      await axios.post('http://localhost:5000/api/health/log', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingStat(null);
      fetchData(); // Refresh UI
    } catch (error) {
      console.error("Error saving stat:", error);
    }
  };

  const todayStr = currentTime.toISOString().split('T')[0];
  const today = currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const todayLog = logs.find(l => l.date === todayStr) || {
    steps: 0, calories: 0, water: 0, sleep: 0, heartRate: 0, weight: user?.weight || 0
  };

  const currentMetricLogs = [...logs].reverse().map(l => l[selectedProgressMetric] || 0);
  const currentMetricLabels = [...logs].reverse().map(l => new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
  const metricInfo = progressMetrics.find(m => m.id === selectedProgressMetric);

  const avg = currentMetricLogs.length ? (currentMetricLogs.reduce((a, b) => a + b, 0) / currentMetricLogs.length).toFixed(1) : 0;
  const max = currentMetricLogs.length ? Math.max(...currentMetricLogs) : 0;
  const min = currentMetricLogs.length ? Math.min(...currentMetricLogs) : 0;

  if (loading) return (
    <div className="flex flex-col gap-10 font-sans pb-20">
      <div className="flex flex-col gap-2">
        <div className="w-64 h-10 skeleton" />
        <div className="w-48 h-4 skeleton" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[500px] skeleton rounded-[40px]" />
        <div className="h-[500px] skeleton rounded-[40px]" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 font-sans pb-20 relative">
      <GoalWizard isOpen={showGoalWizard} onClose={() => setShowGoalWizard(false)} onGoalCreated={fetchData} />
      
      <AnimatePresence>
        {editingStat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingStat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-8 rounded-[32px] flex flex-col gap-6 max-w-sm w-full border-accent/20"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-extrabold capitalize flex items-center gap-2">
                <Edit2 size={20} className="text-accent" /> Edit {editingStat.type}
              </h3>
              <input
                type="number"
                className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none text-2xl font-black text-center"
                value={editingStat.value}
                onChange={e => setEditingStat({ ...editingStat, value: e.target.value })}
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingStat(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-textMuted hover:bg-surface/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatSave}
                  className="flex-1 py-4 rounded-2xl font-bold bg-accent text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 flex justify-center items-center gap-2"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold"
          >
            {greeting}, {user?.name?.split(' ')[0]} 💪
          </motion.h1>
          <div className="flex items-center gap-4 text-textMuted font-medium">
            <span className="flex items-center gap-2"><Calendar size={16} /> {today}</span>
            <span className="flex items-center gap-2 text-accent font-bold"><Clock size={16} /> {timeStr}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <EditableGoal 
            label="Daily Steps" 
            value={user?.dailyStepGoal || 8000} 
            unit="steps" 
            icon={Activity} 
            field="dailyStepGoal"
            onSave={handleUpdateGoal}
          />
          <EditableGoal 
            label="Calorie Goal" 
            value={user?.dailyCalorieGoal || 2200} 
            unit="kcal" 
            icon={Flame} 
            field="dailyCalorieGoal"
            onSave={handleUpdateGoal}
          />
        </div>
      </header>

      {/* Main Stats with Streak - Horizontal Scroll on Mobile */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 scrollbar-hide snap-x snap-mandatory">
        <div className="flex-shrink-0 w-[85%] md:w-full mr-4 md:mr-0 snap-center">
          <StatCard title="Today's Steps" value={todayLog.steps} unit="steps" trend={12} icon={Activity} color="var(--accent)" delay={0.1} onClick={() => setEditingStat({ type: 'steps', value: todayLog.steps })} />
        </div>
        <div className="flex-shrink-0 w-[85%] md:w-full mr-4 md:mr-0 snap-center">
          <StatCard title="Calories Eaten" value={todayLog.calories} unit="kcal" trend={-5} icon={Flame} color="var(--danger)" delay={0.2} onClick={() => setEditingStat({ type: 'calories', value: todayLog.calories })} />
        </div>
        <div className="flex-shrink-0 w-[85%] md:w-full mr-4 md:mr-0 snap-center">
          <StatCard title="Water Intake" value={todayLog.water} unit="L" trend={8} icon={Droplets} color="var(--accentAlt)" delay={0.3} onClick={() => setEditingStat({ type: 'water', value: todayLog.water })} />
        </div>
        <div className="flex-shrink-0 w-[85%] md:w-full snap-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-[24px] bg-gradient-to-br from-accent/10 to-accentAlt/10 flex flex-col justify-center items-center gap-2 border-accent/20 h-full"
          >
            <div className="flex items-center gap-3">
              <Zap className="text-accent fill-accent" size={32} />
              <h3 className="text-4xl font-black italic">
                <CountUp end={7} duration={2} />
              </h3>
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Day Streak 🔥</span>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass p-8 rounded-[40px] flex flex-col gap-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Health Trends</h2>
              <p className="text-textMuted text-[10px] font-bold uppercase tracking-widest">Analyze your growth over time</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {progressMetrics.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedProgressMetric(m.id)}
                  className={`p-3 rounded-2xl transition-all ${
                    selectedProgressMetric === m.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'glass hover:bg-accent/5 text-textMuted'
                  }`}
                  title={m.label}
                >
                  <m.icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <MetricInsight label="Average" value={avg} unit={metricInfo.unit} icon={TrendingUp} />
            <MetricInsight label="Peak" value={max} unit={metricInfo.unit} icon={Trophy} />
            <MetricInsight label="Lowest" value={min} unit={metricInfo.unit} icon={Scale} />
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="h-[200px]">
              <BarChart data={currentMetricLogs.slice(-10)} labels={currentMetricLabels.slice(-10)} color={metricInfo.color} height={200} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass p-8 rounded-[40px] flex flex-col gap-8"
        >
          <h2 className="text-2xl font-extrabold">Goals Progress</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10">
            <CircularProgress 
              label="Steps" 
              value={todayLog.steps} 
              goal={user?.dailyStepGoal || 8000} 
              color="var(--accent)" 
              icon={Activity} 
              size={110}
            />
            <CircularProgress 
              label="Calories" 
              value={todayLog.calories} 
              goal={user?.dailyCalorieGoal || 2200} 
              color="var(--danger)" 
              icon={Flame} 
              size={110}
            />
            <CircularProgress 
              label="Water" 
              value={todayLog.water} 
              goal={user?.dailyWaterGoal || 3} 
              color="var(--accentAlt)" 
              icon={Droplets} 
              size={110}
            />
            <CircularProgress 
              label="Sleep" 
              value={todayLog.sleep} 
              goal={user?.dailySleepGoal || 8} 
              color="#c084fc" 
              icon={Moon} 
              size={110}
            />
          </div>
        </motion.div>
      </div>

      {/* Progress Gallery Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <ProgressGallery />
      </motion.div>
    </div>
  );
};

export default Dashboard;
