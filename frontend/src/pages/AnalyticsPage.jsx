import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import BarChart from '../components/charts/BarChart';
import { Activity, Flame, Moon, FileText, Smile, Meh, Frown, Laugh } from 'lucide-react';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock delay for analytics processing
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <div className="text-center py-20">Crunching platform data...</div>;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-syne font-extrabold mb-2">Platform Analytics 📊</h1>
        <p className="text-textMuted font-medium">Global health trends and user engagement metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Daily Steps', val: '7,842', icon: Activity, color: '#38bdf8' },
          { label: 'Avg Calories', val: '2,045', icon: Flame, color: '#f87171' },
          { label: 'Avg Sleep', val: '7.2h', icon: Moon, color: '#818cf8' },
          { label: 'Total Logs', val: '1,248', icon: FileText, color: '#34d399' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[24px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                <s.icon size={24} />
              </div>
            </div>
            <h3 className="text-textMuted text-xs font-bold uppercase tracking-widest mb-1">{s.label}</h3>
            <span className="text-3xl font-syne font-extrabold">{s.val}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 rounded-[40px] flex flex-col gap-8"
        >
          <h2 className="text-2xl font-syne font-extrabold">Step Distribution</h2>
          <BarChart 
            data={[4500, 6200, 8100, 7400, 9200, 8800, 7100]} 
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} 
            color="#38bdf8" 
            title="PLATFORM-WIDE DAILY STEPS (AVERAGE)" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-[40px] flex flex-col gap-8"
        >
          <h2 className="text-2xl font-syne font-extrabold">Mood Distribution</h2>
          <div className="flex flex-col gap-8">
            {[
              { icon: Laugh, label: 'Great', val: 45, color: 'bg-success' },
              { icon: Smile, label: 'Good', val: 32, color: 'bg-accent' },
              { icon: Meh, label: 'Okay', val: 15, color: 'bg-warning' },
              { icon: Frown, label: 'Bad', val: 8, color: 'bg-danger' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-bold"><m.icon size={18} className="text-textMuted" /> {m.label}</span>
                  <span className="text-xs font-bold text-textMuted">{m.val}%</span>
                </div>
                <div className="h-3 bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${m.val}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full ${m.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
