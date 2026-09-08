import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';

// Pages (Placeholder components)
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import HealthLog from './pages/HealthLog';
import ProgressPage from './pages/ProgressPage';
import NutritionPage from './pages/NutritionPage';
import BadgesPage from './pages/BadgesPage';
import RequestsPage from './pages/RequestsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import AnalyticsPage from './pages/AnalyticsPage';
import WorkoutsPage from './pages/WorkoutsPage';
import MindfulnessPage from './pages/MindfulnessPage';
import CommunityPage from './pages/CommunityPage';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ParticleBackground from './components/ParticleBackground';
import AICoach from './components/AICoach';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center text-text font-sans">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans pb-mobile-nav">
      <ParticleBackground />
      <Navbar />
      <BottomNav />
      <AICoach />
      <main className="pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/log" element={<ProtectedRoute><HealthLog /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
            <Route path="/mindfulness" element={<ProtectedRoute><MindfulnessPage /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute roles={['admin']}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
