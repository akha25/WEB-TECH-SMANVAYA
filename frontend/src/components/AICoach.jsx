import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SEVA_SYSTEM_PROMPT = `You are SEVA, an AI wellness coach for SAMANVAYA. 
You give personalized, warm, actionable advice. Keep responses concise. 
Use emojis. Never give medical diagnoses. 
The name SAMANVAYA means "harmony" in Sanskrit.`;

const AICoach = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('seva_chat_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'bot', text: 'Namaste! I am SEVA, your personal wellness guide. How can I help you find harmony today? 🙏' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('seva_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response for now (Mocking Claude API)
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('analyze') || lowerInput.includes('week')) {
        botResponse = "Based on your last 7 days, your consistency in step count is wonderful! 👟 However, I noticed your sleep average is 6.5h. Let's aim for 7.5h tonight to restore your energy. 🌿";
      } else if (lowerInput.includes('meal') || lowerInput.includes('eat')) {
        botResponse = "How about a high-protein Quinoa Bowl with roasted chickpeas and fresh greens? 🥗 It's light, nutritious, and perfect for maintaining your energy levels! ✨";
      } else if (lowerInput.includes('motivate')) {
        botResponse = "Remember, harmony is not a destination, but a journey. Every small step you take today is a seed for a healthier tomorrow. You've got this! 💪🔥";
      } else {
        botResponse = "That's an interesting point! Focusing on balance in your daily routine is key to long-term wellness. Is there a specific goal you'd like to work on together? 🧘‍♂️";
      }

      const botMessage = { id: Date.now() + 1, type: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    "Analyze my week",
    "Suggest a meal",
    "Motivate me",
    "Sleep tips"
  ];

  if (!user) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[380px] h-[550px] glass rounded-[32px] shadow-2xl flex flex-col overflow-hidden border-accent/20"
          >
            {/* Header */}
            <div className="p-6 bg-accent/10 border-b border-border/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">SEVA AI Coach</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-bold text-success uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface rounded-xl text-textMuted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scroll-smooth"
            >
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.type === 'user' ? 'bg-accent/20' : 'bg-surface border border-border'}`}>
                      {m.type === 'user' ? <User size={16} /> : <Bot size={16} className="text-accent" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.type === 'user' 
                        ? 'bg-accent text-white rounded-tr-none shadow-lg' 
                        : 'glass rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center glass p-4 rounded-2xl rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-accent" />
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">SEVA is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-surface/50">
              {messages.length < 5 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickActions.map(action => (
                    <button
                      key={action}
                      onClick={() => { setInput(action); }}
                      className="px-3 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-widest hover:bg-accent/10 hover:text-accent transition-colors border-accent/10"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  placeholder="Ask SEVA anything..."
                  className="w-full glass bg-transparent pl-5 pr-12 py-4 rounded-2xl border-border focus:border-accent outline-none text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/40 relative group"
      >
        <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 group-hover:opacity-40" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};

export default AICoach;
