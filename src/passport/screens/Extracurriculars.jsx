import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Trash2, ShieldCheck, HeartHandshake, Award, Timer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Extracurriculars() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('Member');
  const [hoursPerWeek, setHoursPerWeek] = useState('3');
  const [weeksPerYear, setWeeksPerYear] = useState('36');
  const [description, setDescription] = useState('');

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newActivity = {
      id: Date.now(),
      name: name.trim(),
      role,
      hoursPerWeek: parseFloat(hoursPerWeek) || 0,
      weeksPerYear: parseFloat(weeksPerYear) || 0,
      description: description.trim()
    };

    const updatedActs = [...(studentData.extracurriculars || []), newActivity];
    await updateStudentData({ extracurriculars: updatedActs });

    setName('');
    setHoursPerWeek('3');
    setWeeksPerYear('36');
    setDescription('');
  };

  const handleDeleteActivity = async (id) => {
    const updatedActs = (studentData.extracurriculars || []).filter(a => a.id !== id);
    await updateStudentData({ extracurriculars: updatedActs });
  };

  const activities = studentData.extracurriculars || [];
  const totalAnnualHours = activities.reduce((sum, act) => sum + (act.hoursPerWeek * act.weeksPerYear), 0);
  const averageHoursPerWeek = activities.reduce((sum, act) => sum + act.hoursPerWeek, 0);
  const leadershipCount = activities.filter(act => ['Founder', 'President', 'Captain', 'Officer', 'Lead'].includes(act.role)).length;

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Extracurricular Activities Log
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Document your leadership roles, volunteering, athletics, and internship hours to maximize your collegiate profile rating.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Activities List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Timer size={20} color="var(--accent-light)" />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t1)' }}>{totalAnnualHours} hrs</div>
                <div style={{ fontSize: '10px', color: 'var(--t3)' }}>Total Annual Hours</div>
              </div>
            </div>
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HeartHandshake size={20} color="#3b82f6" />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#3b82f6' }}>{averageHoursPerWeek} hrs/wk</div>
                <div style={{ fontSize: '10px', color: 'var(--t3)' }}>Combined Weekly Commitment</div>
              </div>
            </div>
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={20} color="var(--green)" />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green)' }}>{leadershipCount}</div>
                <div style={{ fontSize: '10px', color: 'var(--t3)' }}>Leadership Roles</div>
              </div>
            </div>
          </div>

          <div className="eyebrow" style={{ marginTop: '8px' }}>Active Pursuits ({activities.length})</div>

          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--line2)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏃‍♂️</div>
              <div style={{ color: 'var(--t2)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No activities logged yet.</div>
              <div style={{ color: 'var(--t3)', fontSize: '12px' }}>Log your athletics, student clubs, or volunteering to calculate your weekly commitment!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activities.map(act => (
                <motion.div 
                  key={act.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                  style={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>{act.name}</h3>
                      <div style={{ fontSize: '11px', color: 'var(--accent-light)', fontWeight: 600, marginTop: '2px' }}>
                        {act.role}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)', fontSize: '10.5px', color: 'var(--t2)' }}>
                        {act.hoursPerWeek} hrs/wk • {act.weeksPerYear} wks
                      </span>
                      <button 
                        onClick={() => handleDeleteActivity(act.id)}
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
                    {act.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Activity Form */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Plus size={20} color="var(--accent-light)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Add Activity</h2>
          </div>

          <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Activity Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                }}
                placeholder="e.g. Science Olympiad, Varsity Soccer"
                required
              />
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Leadership Role / Position</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                }}
              >
                <option value="Founder">Founder</option>
                <option value="President">President</option>
                <option value="Captain">Captain</option>
                <option value="Officer / Board Member">Officer / Board Member</option>
                <option value="Lead Competitor">Lead Competitor</option>
                <option value="Volunteer Coordinator">Volunteer Coordinator</option>
                <option value="Active Member">Active Member</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Hours Per Week</label>
                <input 
                  type="number" 
                  min="0.5" 
                  max="80" 
                  step="0.5"
                  value={hoursPerWeek} 
                  onChange={e => setHoursPerWeek(e.target.value)} 
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                  required
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Weeks Per Year</label>
                <input 
                  type="number" 
                  min="1" 
                  max="52"
                  value={weeksPerYear} 
                  onChange={e => setWeeksPerYear(e.target.value)} 
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Key Responsibilities & Impact</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px',
                  lineHeight: '1.6', resize: 'vertical'
                }}
                placeholder="Detail your responsibilities, leadership milestones, and community impacts. Try to quantify achievements!"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              Add Activity
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}