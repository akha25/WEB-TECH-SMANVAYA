import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MiniLineChart from '../components/charts/MiniLineChart';
import BarChart from '../components/charts/BarChart';
import { Activity, Flame, Scale, Droplets, Moon } from 'lucide-react';

const ProgressPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('steps');
  const [loading, setLoading] = useState(true);

  const metrics = [
    { id: 'steps', label: 'Steps', icon: Activity, color: '#38bdf8', unit: 'steps' },
    { id: 'calories', label: 'Calories', icon: Flame, color: '#f87171', unit: 'kcal' },
    { id: 'weight', label: 'Weight', icon: Scale, color: '#818cf8', unit: 'kg' },
    { id: 'water', label: 'Water', icon: Droplets, color: '#60a5fa', unit: 'L' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: '#c084fc', unit: 'h' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/health/logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentMetricData = logs.map(l => l[selectedMetric] || 0);
  const labels = logs.map(l => new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
  const metricInfo = metrics.find(m => m.id === selectedMetric);

  const avg = currentMetricData.length ? (currentMetricData.reduce((a, b) => a + b, 0) / currentMetricData.length).toFixed(1) : 0;
  const max = currentMetricData.length ? Math.max(...currentMetricData) : 0;
  const min = currentMetricData.length ? Math.min(...currentMetricData) : 0;

  if (loading) return <div className="text-center py-20">Analyzing your progress...</div>;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-syne font-extrabold mb-2">Progress Tracker 📈</h1>
        <p className="text-textMuted font-medium">Visualize your journey towards balance and harmony.</p>
      </header>

      <div className="flex flex-wrap gap-4">
        {metrics.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMetric(m.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              selectedMetric === m.id 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'glass text-textMuted hover:text-text hover:bg-accent/5'
            }`}
          >
            <m.icon size={20} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Average', val: avg },
          { label: 'Best', val: max },
          { label: 'Lowest', val: min },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-textMuted uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-syne font-extrabold">{stat.val}</span>
              <span className="text-sm font-bold text-textMuted uppercase">{metricInfo.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          key={`line-${selectedMetric}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-[32px] flex flex-col gap-6"
        >
          <h3 className="text-lg font-bold">Timeline View</h3>
          <MiniLineChart data={currentMetricData} color={metricInfo.color} height={250} />
        </motion.div>

        <motion.div 
          key={`bar-${selectedMetric}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-[32px] flex flex-col gap-6"
        >
          <h3 className="text-lg font-bold">Daily Breakdown</h3>
          <BarChart data={currentMetricData} labels={labels} color={metricInfo.color} height={250} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;
