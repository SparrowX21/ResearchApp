import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, Heart, ShieldAlert, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Community() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  
  const [org, setOrg] = useState('');
  const [hours, setHours] = useState('10');
  const [description, setDescription] = useState('');

  const handleAddHours = async (e) => {
    e.preventDefault();
    if (!org.trim()) return;

    const newLog = {
      id: Date.now(),
      organization: org.trim(),
      hours: parseFloat(hours) || 0,
      description: description.trim(),
      loggedAt: new Date().toLocaleDateString()
    };

    const updatedLogs = [...(studentData.volunteerLogs || []), newLog];
    
    // Update achievements count when reaching milestones
    const cumulativeHours = updatedLogs.reduce((sum, log) => sum + log.hours, 0);
    let achievements = studentData.achievements || 0;
    if (cumulativeHours >= 100 && (!studentData.volunteerLogs || studentData.volunteerLogs.reduce((sum, log) => sum + log.hours, 0) < 100)) {
      achievements += 1; // Earned PVSA Bronze
    }

    await updateStudentData({ 
      volunteerLogs: updatedLogs,
      achievements
    });

    setOrg('');
    setHours('10');
    setDescription('');
  };

  const handleDeleteLog = async (id) => {
    const updatedLogs = (studentData.volunteerLogs || []).filter(l => l.id !== id);
    await updateStudentData({ volunteerLogs: updatedLogs });
  };

  const logs = studentData.volunteerLogs || [];
  const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);

  // Compute President's Volunteer Service Award (PVSA) Category for Young Adults (16-25)
  const getPVSACategory = (hrs) => {
    if (hrs >= 250) return { title: 'PVSA Gold Award', color: '#f59e0b', next: 'Maximum Level!' };
    if (hrs >= 175) return { title: 'PVSA Silver Award', color: '#94a3b8', next: `${250 - hrs} hrs to Gold` };
    if (hrs >= 100) return { title: 'PVSA Bronze Award', color: '#b45309', next: `${175 - hrs} hrs to Silver` };
    return { title: 'Active Volunteer', color: 'var(--t3)', next: `${100 - hrs} hrs to Bronze Award` };
  };

  const pvsa = getPVSACategory(totalHours);

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Community Service & Social Impact
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Log your volunteering hours, map community leadership, and track Presidential Volunteer Service Award indicators.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Volunteer logs list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* PVSA Status Card */}
          <div className="card" style={{ padding: '24px', background: 'linear-gradient(145deg, rgba(245,158,11,0.02), rgba(0,0,0,0.3))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Award size={36} color={pvsa.color} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t1)' }}>{pvsa.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>{pvsa.next}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cumulative Hours</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: pvsa.color }}>{totalHours} <span style={{ fontSize: '13px', color: 'var(--t3)' }}>hrs</span></div>
            </div>
          </div>

          <div className="eyebrow">Service Logs ({logs.length})</div>

          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--line2)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🤝</div>
              <div style={{ color: 'var(--t2)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No volunteer logs recorded yet.</div>
              <div style={{ color: 'var(--t3)', fontSize: '12px' }}>Log your community service hours above to unlock PVSA milestones!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {logs.map(log => (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                  style={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>{log.organization}</h3>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Logged on {log.loggedAt}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green)', border: 'none', fontSize: '11px', fontWeight: 700 }}>
                        +{log.hours} Hours
                      </span>
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ border: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ color: 'var(--t2)', fontSize: '12.5px', lineHeight: '1.6' }}>
                    {log.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Hours Form */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Plus size={20} color="var(--accent-light)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Log Service Hours</h2>
          </div>

          <form onSubmit={handleAddHours} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Organization / Project Name</label>
              <div style={{ position: 'relative' }}>
                <Users size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--t3)' }} />
                <input 
                  type="text" 
                  value={org} 
                  onChange={e => setOrg(e.target.value)} 
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px 10px 34px', color: 'var(--t1)', fontSize: '13px'
                  }}
                  placeholder="e.g. Red Cross, Food Bank, STEM Tutoring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Service Hours Contributed</label>
              <input 
                type="number" 
                min="0.5" 
                max="500" 
                step="0.5"
                value={hours} 
                onChange={e => setHours(e.target.value)} 
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                }}
                required
              />
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Description of Service & Impact</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px',
                  lineHeight: '1.6', resize: 'vertical'
                }}
                placeholder="What community problem did you address? Quantify the scope (e.g. tutored 12 middle schoolers, raised $400)."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              Log Hours
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}