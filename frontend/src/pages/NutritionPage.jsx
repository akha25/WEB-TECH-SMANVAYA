import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Flame, Beef, Wheat, Droplets, Plus, Trash2, Clock, Utensils } from 'lucide-react';

const MacroProgress = ({ label, val = 0, goal = 1, color, icon: Icon }) => {
  const safeVal = Number(val) || 0;
  const safeGoal = Number(goal) > 0 ? Number(goal) : 1;
  const pct = Math.min((safeVal / safeGoal) * 100, 100) || 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-2 text-textMuted"><Icon size={14} /> {label}</span>
        <span>{safeVal.toFixed(1)}g / {safeGoal}g</span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

const NutritionPage = () => {
  const { user } = useAuth();
  const [foodLogs, setFoodLogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'Breakfast',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  const fetchFoodLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/food/logs', {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: new Date().toISOString().split('T')[0] }
      });
      setFoodLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/food/log', newFood, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      setNewFood({ ...newFood, name: '', calories: '', protein: '', carbs: '', fat: '' });
      fetchFoodLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/food/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFoodLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const totalCal = foodLogs.reduce((a, b) => a + b.calories, 0);
  const totalProtein = foodLogs.reduce((a, b) => a + b.protein, 0);
  const totalCarbs = foodLogs.reduce((a, b) => a + b.carbs, 0);
  const totalFat = foodLogs.reduce((a, b) => a + b.fat, 0);
  
  const goalCal = user?.dailyCalorieGoal || 2200;
  const strokeDash = 2 * Math.PI * 45;
  const offset = strokeDash - (Math.min(totalCal / goalCal, 1) * strokeDash);

  if (loading) return (
    <div className="flex flex-col gap-10 font-sans pb-20">
      <div className="flex justify-between items-end">
        <div className="w-64 h-12 skeleton" />
        <div className="w-48 h-12 skeleton rounded-2xl" />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="h-[400px] skeleton rounded-[40px]" />
        <div className="lg:col-span-2 h-[400px] skeleton rounded-[40px]" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 skeleton rounded-3xl" />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Animated Premium Background Layer */}
      <div className="fixed inset-0 z-[-1] bg-nutrition-gradient overflow-hidden transition-colors duration-500">
        <div className="absolute right-0 top-0 h-full w-full md:w-1/2 opacity-20 blur-[8px] animate-float-slow pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          <img 
            src="/nutrition-bg.jpg" 
            alt="Fruits Background" 
            className="w-full h-full object-cover scale-110"
            style={{ maskImage: 'linear-gradient(to left, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-10 font-sans relative z-10">
        <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Nutrition Dashboard 🍎</h1>
          <p className="text-textMuted font-medium">Track your macros and fuel your journey.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Add Food Item
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 glass p-10 rounded-[40px] flex flex-col items-center justify-center text-center gap-6"
        >
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="96" cy="96" r="85" className="stroke-surface fill-none" strokeWidth="12" />
              <motion.circle 
                cx="96" cy="96" r="85" 
                className="stroke-accent fill-none shadow-lg" 
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ strokeDasharray: strokeDash, strokeDashoffset: strokeDash }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold">{totalCal}</span>
              <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">KCAL EATEN</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Daily Goal: {goalCal} kcal</p>
            <p className={`text-sm font-bold uppercase tracking-widest ${totalCal > goalCal ? 'text-danger' : 'text-textMuted'}`}>
              {totalCal > goalCal ? `${totalCal - goalCal} kcal over` : `${goalCal - totalCal} kcal remaining`}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass p-10 rounded-[40px] flex flex-col gap-10"
        >
          <h2 className="text-2xl font-extrabold">Macronutrient Tracking</h2>
          <div className="flex flex-col gap-8">
            <MacroProgress label="Protein" val={totalProtein} goal={150} color="bg-danger" icon={Beef} />
            <MacroProgress label="Carbohydrates" val={totalCarbs} goal={250} color="bg-warning" icon={Wheat} />
            <MacroProgress label="Fats" val={totalFat} goal={80} color="bg-accent" icon={Droplets} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold">Daily Food Logs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {foodLogs.length > 0 ? foodLogs.map((meal, i) => (
              <motion.div 
                key={meal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-6 rounded-3xl card-float flex gap-6 items-center group"
              >
                <div className="text-2xl bg-surface w-12 h-12 rounded-xl flex items-center justify-center text-accent">
                  <Utensils size={24} />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{meal.name}</h4>
                      <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">{meal.mealType}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteFood(meal.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-danger hover:bg-danger/10 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex gap-3">
                      <span className="text-[10px] font-bold text-textMuted">P: {meal.protein}g</span>
                      <span className="text-[10px] font-bold text-textMuted">C: {meal.carbs}g</span>
                      <span className="text-[10px] font-bold text-textMuted">F: {meal.fat}g</span>
                    </div>
                    <span className="text-accent font-extrabold text-sm">{meal.calories} kcal</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center glass rounded-[40px] text-textMuted font-bold uppercase tracking-widest">
                No food items logged for today.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-[40px] max-w-lg w-full flex flex-col gap-8 shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold">Log Food Item 🥗</h2>
            <form onSubmit={handleAddFood} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Food Name</label>
                <input
                  type="text"
                  required
                  className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                  placeholder="e.g. Avocado Toast"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Meal Type</label>
                  <select
                    className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={newFood.mealType}
                    onChange={(e) => setNewFood({ ...newFood, mealType: e.target.value })}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Protein (g)</label>
                  <input
                    type="number"
                    className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Carbs (g)</label>
                  <input
                    type="number"
                    className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Fat (g)</label>
                  <input
                    type="number"
                    className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold">Log Food</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 glass py-4 rounded-2xl font-bold">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </div>
    </>
  );
};

export default NutritionPage;
