import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Moon, Cloud, TreePine, Droplets, Zap, Smile } from 'lucide-react';

const MindfulnessPage = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathingPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(300); // 5 min default
  const [selectedSound, setSelectedDurationSound] = useState('OM');
  const [isMuted, setIsMuted] = useState(false);
  const [moodValue, setMoodValue] = useState(7);

  // Breathing Guide Logic
  useEffect(() => {
    let interval;
    if (isBreathing) {
      const phases = [
        { name: 'Inhale', duration: 4000 },
        { name: 'Hold', duration: 4000 },
        { name: 'Exhale', duration: 6000 },
        { name: 'Hold', duration: 2000 },
      ];
      let currentPhaseIdx = 0;

      const runPhase = () => {
        const phase = phases[currentPhaseIdx];
        setBreathingPhase(phase.name);
        interval = setTimeout(() => {
          currentPhaseIdx = (currentPhaseIdx + 1) % phases.length;
          runPhase();
        }, phase.duration);
      };

      runPhase();
    }
    return () => clearTimeout(interval);
  }, [isBreathing]);

  // Meditation Timer Logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sounds = [
    { name: 'Rain', icon: Cloud },
    { name: 'Forest', icon: TreePine },
    { name: 'Ocean', icon: Droplets },
    { name: 'OM', icon: Moon },
  ];

  return (
    <div className="flex flex-col gap-12 font-sans pb-20">
      <header>
        <h1 className="text-4xl font-extrabold mb-2">Mindfulness 🧘‍♂️</h1>
        <p className="text-textMuted font-medium">Reconnect with your inner peace and harmony.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Breathing Guide */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 rounded-[48px] flex flex-col items-center text-center gap-10 min-h-[500px] justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none opacity-10">
             <Wind size={400} className="absolute -bottom-20 -right-20 rotate-12" />
          </div>
          
          <div>
            <h2 className="text-2xl font-extrabold mb-2">Breathing Guide</h2>
            <p className="text-textMuted text-xs font-bold uppercase tracking-widest">Box Breathing Technique</p>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <motion.div
              animate={isBreathing ? {
                scale: breathPhase === 'Inhale' ? 1.5 : breathPhase === 'Exhale' ? 1 : breathPhase === 'Hold' && breathPhase === 'Hold' ? (breathPhase === 'Inhale' ? 1.5 : 1) : 1,
                backgroundColor: breathPhase === 'Inhale' ? 'var(--accent)' : 'var(--accentAlt)',
                boxShadow: breathPhase === 'Inhale' ? '0 0 50px var(--glow)' : '0 0 20px var(--glow)',
              } : { scale: 1 }}
              transition={{ duration: breathPhase === 'Inhale' ? 4 : breathPhase === 'Exhale' ? 6 : 0, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full flex items-center justify-center relative z-10"
            >
              <span className="text-white font-extrabold uppercase tracking-widest text-xs">
                {isBreathing ? breathPhase : 'Ready'}
              </span>
            </motion.div>
            
            {/* Background Rings */}
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={isBreathing ? { scale: [1, 2], opacity: [0.3, 0] } : {}}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                className="absolute w-32 h-32 border-2 border-accent rounded-full"
              />
            ))}
          </div>

          <button
            onClick={() => setIsBreathing(!isBreathing)}
            className={`px-10 py-4 rounded-2xl font-extrabold uppercase tracking-widest transition-all ${
              isBreathing ? 'bg-surface text-text' : 'bg-accent text-white shadow-lg shadow-accent/20'
            }`}
          >
            {isBreathing ? 'Stop Session' : 'Start Breathing'}
          </button>
        </motion.div>

        {/* Meditation Timer */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-10 rounded-[48px] flex flex-col gap-10"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold mb-2">Meditation Timer</h2>
              <p className="text-textMuted text-xs font-bold uppercase tracking-widest">Find Your Focus</p>
            </div>
            <button onClick={() => setIsMuted(!isMuted)} className="p-3 glass rounded-2xl text-textMuted hover:text-accent transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-7xl font-extrabold font-mono tracking-tighter">
              {isTimerRunning ? formatTime(timer) : formatTime(selectedDuration)}
            </span>
            <div className="flex gap-2">
              {[300, 600, 900, 1800].map(d => (
                <button
                  key={d}
                  onClick={() => { setSelectedDuration(d); setTimer(d); setIsTimerRunning(false); }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedDuration === d ? 'bg-accent/10 text-accent border border-accent/20' : 'glass border border-transparent'
                  }`}
                >
                  {d/60}m
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {sounds.map(s => (
              <button
                key={s.name}
                onClick={() => setSelectedDurationSound(s.name)}
                className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                  selectedSound === s.name ? 'bg-accent/10 border-accent scale-105' : 'glass border-transparent'
                }`}
              >
                <s.icon size={24} className={selectedSound === s.name ? 'text-accent' : 'text-textMuted'} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted">{s.name}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (!isTimerRunning && timer === 0) setTimer(selectedDuration);
                setIsTimerRunning(!isTimerRunning);
              }}
              className="flex-1 bg-accent text-white py-5 rounded-[24px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20"
            >
              {isTimerRunning ? <><Pause size={24} /> Pause</> : <><Play size={24} /> Start Meditation</>}
            </button>
            <button 
              onClick={() => { setIsTimerRunning(false); setTimer(selectedDuration); }}
              className="p-5 glass rounded-[24px] text-textMuted hover:text-accent transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mood Journal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-10 rounded-[48px] flex flex-col gap-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-2xl font-extrabold mb-2">Daily Mood Journal</h2>
            <p className="text-textMuted text-xs font-bold uppercase tracking-widest">Reflect on your emotional harmony</p>
          </div>
          <div className="flex items-center gap-4 glass px-6 py-3 rounded-2xl">
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Current Streak</span>
            <div className="flex items-center gap-2 text-accent">
              <Zap size={18} fill="currentColor" />
              <span className="text-xl font-extrabold">7 Days</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
               <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Rate your day</span>
               <span className="text-3xl">
                 {moodValue > 8 ? '😄' : moodValue > 6 ? '🙂' : moodValue > 4 ? '😐' : '😞'}
               </span>
            </div>
            <input 
              type="range" 
              min="1" max="10" 
              value={moodValue}
              onChange={(e) => setMoodValue(parseInt(e.target.value))}
              className="w-full h-2 bg-surface rounded-full appearance-none accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-textMuted uppercase tracking-widest">
              <span>Restless</span>
              <span>Balanced</span>
              <span>Ecstatic</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest ml-1">Notes for yourself</label>
            <textarea 
              className="glass bg-transparent p-6 rounded-[32px] border-border focus:border-accent outline-none min-h-[150px] text-sm leading-relaxed"
              placeholder="What made you feel harmonious today? What can you improve tomorrow?"
            />
          </div>

          <button className="bg-accent text-white py-5 rounded-[24px] font-extrabold uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-lg shadow-accent/20">
            <Smile size={20} /> Save Reflection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MindfulnessPage;
