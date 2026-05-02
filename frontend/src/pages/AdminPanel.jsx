import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Users, FileText, Clock, Heart, Trash2, Edit3, Shield, User as UserIcon } from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">Accessing control panel...</div>;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-syne font-extrabold mb-2">Admin Dashboard 🛡️</h1>
        <p className="text-textMuted font-medium">Platform-wide oversight and management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: stats.totalUsers, icon: Users, color: '#38bdf8' },
          { label: 'Health Logs', val: stats.totalLogs, icon: FileText, color: '#34d399' },
          { label: 'Pending Requests', val: stats.pendingRequests, icon: Clock, color: '#fbbf24' },
          { label: 'Volunteers', val: stats.totalVolunteers, icon: Heart, color: '#f87171' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[24px] flex items-center gap-6"
          >
            <div className="p-4 rounded-2xl" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              <s.icon size={28} />
            </div>
            <div>
              <span className="text-xs font-bold text-textMuted uppercase tracking-widest">{s.label}</span>
              <h3 className="text-2xl font-syne font-extrabold">{s.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-[40px] flex flex-col gap-8 overflow-hidden"
      >
        <h2 className="text-2xl font-syne font-extrabold">User Management</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 text-xs font-bold text-textMuted uppercase tracking-widest px-4">User</th>
                <th className="pb-4 text-xs font-bold text-textMuted uppercase tracking-widest px-4">Email</th>
                <th className="pb-4 text-xs font-bold text-textMuted uppercase tracking-widest px-4">Role</th>
                <th className="pb-4 text-xs font-bold text-textMuted uppercase tracking-widest px-4">Joined</th>
                <th className="pb-4 text-xs font-bold text-textMuted uppercase tracking-widest px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((u, i) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-accent/5 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                          <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-textMuted font-medium">{u.email}</td>
                    <td className="py-4 px-4">
                      <select 
                        className="bg-transparent border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-accent"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-textMuted">{new Date(u.joined).toLocaleDateString('en-IN')}</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-textMuted hover:text-danger transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
