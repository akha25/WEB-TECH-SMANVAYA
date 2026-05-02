import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import YogaSVG from '../components/YogaSVG';
import { Shield, Heart, Zap, BarChart, Users, Star, Activity, Moon, Smile } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass p-8 rounded-3xl card-float group"
  >
    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-textMuted text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const MetricPill = ({ icon: Icon, text, delay, orbitRadius, duration }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 1,
      rotate: 360,
    }}
    transition={{ 
      opacity: { duration: 1, delay },
      rotate: { duration, repeat: Infinity, ease: "linear" }
    }}
    className="absolute pointer-events-none"
    style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
  >
    <motion.div 
      className="glass px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap shadow-xl border-accent/20"
      animate={{ rotate: -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{ width: 'fit-content' }}
    >
      <Icon size={14} className="text-accent" />
      <span className="text-[10px] font-bold uppercase tracking-widest">{text}</span>
    </motion.div>
  </motion.div>
);

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    { icon: Zap, title: "Smart Health Tracking", desc: "Monitor vitals, steps, and calories with precision and ease.", delay: 0.1 },
    { icon: Heart, title: "Holistic Wellness", desc: "Balance your physical and mental health through guided insights.", delay: 0.2 },
    { icon: Users, title: "Community Support", desc: "Connect with volunteers and experts for personalized advice.", delay: 0.3 },
    { icon: Star, title: "Gamified Progress", desc: "Earn badges and celebrate milestones on your health journey.", delay: 0.4 },
    { icon: BarChart, title: "Nutrition Insights", desc: "Deep dive into your macro and micro nutrient intake.", delay: 0.5 },
    { icon: Shield, title: "Private & Secure", desc: "Your health data is encrypted and strictly confidential.", delay: 0.6 },
  ];

  const title = "Harmony in Every Heartbeat";

  return (
    <div className="flex flex-col gap-32 py-12 relative">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-12 min-h-[90vh] justify-center overflow-visible">
        <motion.div style={{ y: y1, opacity }} className="relative flex items-center justify-center">
          {/* Morphing Blob Background */}
          <motion.div
            animate={{
              borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
              ],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-[120%] h-[120%] bg-accent/10 blur-2xl z-0"
          />
          
          <YogaSVG />

          {/* Orbiting Metric Pills */}
          <MetricPill icon={Activity} text="Steps: 10,234" delay={0.5} orbitRadius={180} duration={20} />
          <MetricPill icon={Moon} text="Sleep: 8.2h" delay={0.7} orbitRadius={220} duration={25} />
          <MetricPill icon={Smile} text="Mood: 😄" delay={0.9} orbitRadius={150} duration={18} />
        </motion.div>
        
        <motion.div
          style={{ y: y2 }}
          className="flex flex-col gap-6 max-w-4xl z-10"
        >
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight">
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
                className={char === " " ? "inline-block w-4" : "inline-block bg-gradient-to-r from-accent via-accentAlt to-success bg-clip-text text-transparent"}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-xl text-textMuted font-medium max-w-2xl mx-auto"
          >
            Samanvaya 2.0 brings ancient wisdom and modern science together for your holistic wellness journey. Experience the ultimate harmony of technology and health.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex flex-col gap-8 items-center z-10"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/auth?mode=register"
              className="px-10 py-5 rounded-full bg-accent text-white font-black text-lg hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,255,135,0.4)] active:scale-95 group relative overflow-hidden"
            >
              <span className="relative z-10">Begin Your Journey →</span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              />
            </Link>
            <Link 
              to="/auth?mode=login"
              className="px-10 py-5 rounded-full glass font-bold text-lg hover:bg-accent/5 transition-all border-accent/20"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {features.map((f, i) => <FeatureCard key={i} {...f} />)}
      </section>

      {/* Extra Polish: Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </div>
  );
};

export default LandingPage;
