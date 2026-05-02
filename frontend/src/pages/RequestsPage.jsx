import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MessageSquare, Plus, CheckCircle2, Clock, Filter, Send } from 'lucide-react';

const RequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [newRequest, setNewRequest] = useState({ type: 'Diet Plan', message: '', priority: 'Medium' });
  const [resolvingId, setResolvingId] = useState(null);
  const [response, setResponse] = useState('');

  const isUser = user?.role === 'user';

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isUser ? '/requests/my' : '/requests/all';
      const res = await axios.get(`http://localhost:5000/api${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', newRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewRequest({ type: 'Diet Plan', message: '', priority: 'Medium' });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/requests/${id}/resolve`, { response }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResolvingId(null);
      setResponse('');
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter(r => filter === 'All' || r.status === filter);

  if (loading) return <div className="text-center py-20">Loading requests...</div>;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-syne font-extrabold mb-2">Health Requests 💬</h1>
          <p className="text-textMuted font-medium">Connect with our wellness experts for guidance.</p>
        </div>
        {isUser && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            <Plus size={20} /> New Request
          </button>
        )}
      </header>

      <div className="flex gap-4 border-b border-border pb-4">
        {['All', 'Pending', 'Resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f ? 'bg-accent/10 text-accent' : 'text-textMuted hover:text-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`glass p-8 rounded-[32px] border-l-8 ${
                r.priority === 'High' ? 'border-l-danger' : r.priority === 'Medium' ? 'border-l-warning' : 'border-l-success'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-textMuted">{r.type}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      r.status === 'Resolved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {r.status === 'Resolved' ? <><CheckCircle2 size={10} className="inline mr-1" /> Resolved</> : <><Clock size={10} className="inline mr-1" /> Pending</>}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{isUser ? 'Your Request' : `From: ${r.userName}`}</h3>
                  <p className="text-xs text-textMuted font-medium">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <p className="text-text leading-relaxed mb-6">{r.message}</p>

              {r.status === 'Resolved' ? (
                <div className="bg-success/5 border border-success/10 p-6 rounded-2xl">
                  <h4 className="text-success font-bold text-xs uppercase tracking-widest mb-2">Expert Response:</h4>
                  <p className="text-sm italic text-textMuted">{r.response}</p>
                </div>
              ) : !isUser && (
                <div className="flex flex-col gap-4">
                  {resolvingId === r.id ? (
                    <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                      <textarea
                        className="glass bg-transparent p-4 rounded-xl border-border focus:border-accent outline-none text-sm min-h-[100px]"
                        placeholder="Write your professional response here..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleResolve(r.id)}
                          className="bg-success text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                          <Send size={16} /> Submit Response
                        </button>
                        <button 
                          onClick={() => setResolvingId(null)}
                          className="glass px-6 py-2 rounded-xl text-sm font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setResolvingId(r.id)}
                      className="bg-accent text-white px-6 py-2 rounded-xl text-sm font-bold w-fit"
                    >
                      Respond to Request
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-[40px] max-w-lg w-full flex flex-col gap-8 shadow-2xl"
          >
            <h2 className="text-3xl font-syne font-extrabold">New Request ✨</h2>
            <form onSubmit={handleSubmitRequest} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Request Type</label>
                <select 
                  className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none"
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                >
                  <option value="Diet Plan">Diet Plan</option>
                  <option value="Workout Advice">Workout Advice</option>
                  <option value="Mental Wellness">Mental Wellness</option>
                  <option value="Medical Query">Medical Query</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Priority</label>
                <div className="flex gap-4">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewRequest({ ...newRequest, priority: p })}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                        newRequest.priority === p 
                          ? (p === 'High' ? 'bg-danger/10 border-danger text-danger' : p === 'Medium' ? 'bg-warning/10 border-warning text-warning' : 'bg-success/10 border-success text-success')
                          : 'glass border-transparent text-textMuted'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  className="glass bg-transparent px-5 py-4 rounded-2xl border-border focus:border-accent outline-none min-h-[150px]"
                  placeholder="Describe your health query in detail..."
                  value={newRequest.message}
                  onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold">Submit Request</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 glass py-4 rounded-2xl font-bold">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
