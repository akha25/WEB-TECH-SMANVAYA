import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Send, Heart, MessageSquare, Share2, Award, Lightbulb, Utensils, Zap, Plus, Filter, CheckCircle2 } from 'lucide-react';

const PostCard = ({ post, onReact, delay }) => {
  const reactionEmojis = ['❤️', '👏', '💪', '🔥', '✨'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-8 rounded-[40px] flex flex-col gap-6"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
            <img src={post.userAvatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">{post.userName}</h4>
            <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
          post.type === 'Achievement' ? 'bg-success/10 text-success' :
          post.type === 'Tip' ? 'bg-accent/10 text-accent' :
          post.type === 'Recipe' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
        }`}>
          {post.type === 'Achievement' && <Award size={12} />}
          {post.type === 'Tip' && <Lightbulb size={12} />}
          {post.type === 'Recipe' && <Utensils size={12} />}
          {post.type === 'Motivation' && <Zap size={12} />}
          {post.type}
        </div>
      </div>

      <p className="text-text leading-relaxed">{post.content}</p>

      {post.metricAttachment && (
        <div className="bg-surface/50 border border-border/50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-xs font-bold text-textMuted uppercase tracking-widest">Goal Milestone</span>
          </div>
          <span className="text-sm font-extrabold text-accent">{post.metricAttachment.value} {post.metricAttachment.type}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
        {reactionEmojis.map(emoji => {
          const reactions = typeof post.reactions === 'string'
            ? (() => { try { return JSON.parse(post.reactions); } catch { return {}; } })()
            : (post.reactions || {});
          return (
            <button
              key={emoji}
              onClick={() => onReact(post.id, emoji)}
              className="flex items-center gap-2 px-4 py-2 glass rounded-full hover:bg-accent/10 transition-all group"
            >
              <span className="group-hover:scale-125 transition-transform">{emoji}</span>
              <span className="text-xs font-bold text-textMuted">{reactions[emoji] || 0}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', type: 'Tip' });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/posts', newPost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCompose(false);
      setNewPost({ content: '', type: 'Tip' });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (id, emoji) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/posts/${id}/react`, { reaction: emoji }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const postTypes = ['Achievement', 'Tip', 'Recipe', 'Motivation'];
  const filteredPosts = posts.filter(p => filter === 'All' || p.type === filter);

  if (loading) return <div className="text-center py-20 font-sans">Connecting to the community...</div>;

  return (
    <div className="flex flex-col gap-10 font-sans pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Community Feed 🌐</h1>
          <p className="text-textMuted font-medium">Share your journey and inspire others towards harmony.</p>
        </div>
        <button 
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Create Post
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {['All', ...postTypes].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === t ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'glass text-textMuted hover:bg-accent/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, i) => (
            <PostCard key={post.id} post={post} onReact={handleReact} delay={i * 0.1} />
          ))}
        </AnimatePresence>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-[40px] max-w-lg w-full flex flex-col gap-8 shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold">Share Something ✨</h2>
            <form onSubmit={handleCreatePost} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Post Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {postTypes.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewPost({ ...newPost, type: t })}
                      className={`py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        newPost.type === t ? 'bg-accent/10 border-accent text-accent' : 'glass border-transparent text-textMuted'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Your Message</label>
                <textarea 
                  required
                  className="glass bg-transparent p-6 rounded-[32px] border-border focus:border-accent outline-none min-h-[150px] text-sm leading-relaxed"
                  placeholder="Share a health tip, a new recipe, or just some motivation..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-accent text-white py-5 rounded-[24px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-3">
                  <Send size={20} /> Post to Feed
                </button>
                <button type="button" onClick={() => setShowCompose(false)} className="flex-1 glass py-5 rounded-[24px] font-extrabold uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
