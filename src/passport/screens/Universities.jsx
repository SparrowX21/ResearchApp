import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Percent, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { calculateAIScore } from '../utils/aiScoring';
import { getAdmissionProbability } from '../utils/university';

const POPULAR_COLLEGES = [
  // Reach — Elite
  { name: 'Massachusetts Institute of Technology (MIT)', gpa: 4.0, sat: 1540, type: 'Reach' },
  { name: 'Stanford University', gpa: 3.96, sat: 1520, type: 'Reach' },
  { name: 'Harvard University', gpa: 3.96, sat: 1530, type: 'Reach' },
  { name: 'Princeton University', gpa: 3.95, sat: 1530, type: 'Reach' },
  { name: 'Yale University', gpa: 3.95, sat: 1520, type: 'Reach' },
  { name: 'Columbia University', gpa: 3.94, sat: 1520, type: 'Reach' },
  { name: 'University of Chicago', gpa: 3.95, sat: 1530, type: 'Reach' },
  { name: 'Duke University', gpa: 3.94, sat: 1510, type: 'Reach' },
  { name: 'Caltech', gpa: 3.97, sat: 1550, type: 'Reach' },
  { name: 'Northwestern University', gpa: 3.92, sat: 1500, type: 'Reach' },
  { name: 'Johns Hopkins University', gpa: 3.92, sat: 1510, type: 'Reach' },
  { name: 'Carnegie Mellon University', gpa: 3.91, sat: 1500, type: 'Reach' },
  { name: 'Brown University', gpa: 3.93, sat: 1505, type: 'Reach' },
  { name: 'Cornell University', gpa: 3.90, sat: 1490, type: 'Reach' },
  { name: 'Rice University', gpa: 3.91, sat: 1510, type: 'Reach' },
  { name: 'University of Pennsylvania', gpa: 3.93, sat: 1510, type: 'Reach' },

  // Match — Competitive
  { name: 'UC Berkeley', gpa: 3.89, sat: 1460, type: 'Match' },
  { name: 'UCLA', gpa: 3.90, sat: 1450, type: 'Match' },
  { name: 'University of Michigan', gpa: 3.86, sat: 1430, type: 'Match' },
  { name: 'Georgia Institute of Technology', gpa: 3.82, sat: 1420, type: 'Match' },
  { name: 'University of Virginia', gpa: 3.85, sat: 1420, type: 'Match' },
  { name: 'NYU', gpa: 3.70, sat: 1400, type: 'Match' },
  { name: 'Boston University', gpa: 3.72, sat: 1390, type: 'Match' },
  { name: 'UIUC', gpa: 3.78, sat: 1380, type: 'Match' },
  { name: 'UT Austin', gpa: 3.80, sat: 1390, type: 'Match' },
  { name: 'University of Wisconsin-Madison', gpa: 3.78, sat: 1370, type: 'Match' },
  { name: 'UC San Diego', gpa: 3.82, sat: 1380, type: 'Match' },
  { name: 'UC Davis', gpa: 3.78, sat: 1330, type: 'Match' },
  { name: 'University of Washington', gpa: 3.76, sat: 1370, type: 'Match' },
  { name: 'University of Maryland', gpa: 3.76, sat: 1360, type: 'Match' },

  // Safety — Strong Options
  { name: 'Purdue University', gpa: 3.74, sat: 1350, type: 'Safety' },
  { name: 'Penn State', gpa: 3.60, sat: 1280, type: 'Safety' },
  { name: 'Ohio State University', gpa: 3.65, sat: 1300, type: 'Safety' },
  { name: 'Arizona State University', gpa: 3.50, sat: 1250, type: 'Safety' },
  { name: 'University of Florida', gpa: 3.70, sat: 1340, type: 'Safety' },
  { name: 'Michigan State University', gpa: 3.55, sat: 1240, type: 'Safety' },
  { name: 'Indiana University', gpa: 3.50, sat: 1220, type: 'Safety' },
  { name: 'University of Minnesota', gpa: 3.60, sat: 1300, type: 'Safety' },
  { name: 'University of Colorado Boulder', gpa: 3.55, sat: 1260, type: 'Safety' },
  { name: 'Virginia Tech', gpa: 3.65, sat: 1310, type: 'Safety' },
];

export default function Universities() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  const aiScore = calculateAIScore(studentData);

  const [colleges, setColleges] = useState(studentData.colleges || []);
  const [selectedPreset, setSelectedPreset] = useState(POPULAR_COLLEGES[0].name);
  const [customName, setCustomName] = useState('');
  const [customGPA, setCustomGPA] = useState('3.8');
  const [customSAT, setCustomSAT] = useState('1400');
  const [customType, setCustomType] = useState('Match');
  const [presetFilter, setPresetFilter] = useState('All');

  const filteredPresets = presetFilter === 'All' 
    ? POPULAR_COLLEGES 
    : POPULAR_COLLEGES.filter(c => c.type === presetFilter);

  const computeProbability = (college) => getAdmissionProbability(college, studentData, aiScore);

  const handleAddCollege = async (name, avgGPA, avgSAT, type) => {
    if (colleges.some(c => c.name === name)) return;
    const newCollege = { id: Date.now(), name, avgGPA: parseFloat(avgGPA) || 3.8, avgSAT: parseInt(avgSAT) || 1400, type };
    const updatedColleges = [...colleges, newCollege];
    setColleges(updatedColleges);
    await updateStudentData({ colleges: updatedColleges });
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    handleAddCollege(customName.trim(), customGPA, customSAT, customType);
    setCustomName('');
  };

  const handleAddPreset = () => {
    const preset = POPULAR_COLLEGES.find(c => c.name === selectedPreset);
    if (preset) handleAddCollege(preset.name, preset.gpa, preset.sat, preset.type);
  };

  const handleDeleteCollege = async (id) => {
    const updatedColleges = colleges.filter(c => c.id !== id);
    setColleges(updatedColleges);
    await updateStudentData({ colleges: updatedColleges });
  };

  /* shared input style */
  const fieldStyle = {
    width: '100%', background: 'var(--bg2)', border: '1px solid var(--line2)',
    borderRadius: '8px', padding: '9px 12px', color: 'var(--t1)', fontSize: '13px',
    fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ paddingBottom: '60px', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--t1)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
          University Shortlist
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '14px', lineHeight: 1.5 }}>
          Build your safety / target / reach list and see AI-powered admission probability estimates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '28px' }}>
        
        {/* Shortlist Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <div className="eyebrow">Shortlisted ({colleges.length})</div>

          {colleges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed var(--line2)', borderRadius: '10px', background: 'var(--bg1)' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🏛️</div>
              <div style={{ color: 'var(--t2)', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>No colleges shortlisted yet</div>
              <div style={{ color: 'var(--t4)', fontSize: '11.5px' }}>Use the panel on the right to add universities.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {colleges.map(college => {
                const probability = computeProbability(college);
                const probColor = probability >= 75 ? 'var(--green)' : probability >= 40 ? 'var(--amber)' : 'var(--red)';
                return (
                  <motion.div 
                    key={college.id} 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{ padding: '18px 20px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '14.5px', fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{college.name}</h3>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span className="badge" style={{ 
                            background: college.type === 'Reach' ? 'var(--red-dim)' : college.type === 'Match' ? 'var(--accent-dim)' : 'var(--green-dim)', 
                            color: college.type === 'Reach' ? 'var(--red)' : college.type === 'Match' ? 'var(--accent-light)' : 'var(--green)',
                            border: `1px solid ${college.type === 'Reach' ? 'rgba(239,68,68,0.15)' : college.type === 'Match' ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.15)'}`,
                          }}>
                            {college.type}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--t3)' }}>
                            GPA {college.avgGPA} · SAT {college.avgSAT}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteCollege(college.id)}
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ border: 'none', flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Probability Gauge */}
                    <div style={{ background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Percent size={16} color={probColor} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--t3)', fontWeight: 500 }}>Admission Probability</span>
                          <span style={{ color: probColor, fontWeight: 800 }}>{probability}%</span>
                        </div>
                        <div style={{ height: '3px', background: 'var(--line2)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: probColor, width: `${probability}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          
          {/* Preset Adder */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <GraduationCap size={16} color="var(--accent-light)" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Popular Universities</h3>
              <span style={{ fontSize: '10px', color: 'var(--t4)', marginLeft: 'auto', fontWeight: 600 }}>{POPULAR_COLLEGES.length} schools</span>
            </div>

            {/* Type filter chips */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {['All', 'Reach', 'Match', 'Safety'].map(t => (
                <button
                  key={t}
                  onClick={() => { setPresetFilter(t); setSelectedPreset(t === 'All' ? POPULAR_COLLEGES[0].name : (POPULAR_COLLEGES.find(c => c.type === t)?.name || POPULAR_COLLEGES[0].name)); }}
                  style={{
                    padding: '4px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '12px',
                    border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                    textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif',
                    ...(presetFilter === t
                      ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                      : { background: 'transparent', color: 'var(--t4)', borderColor: 'var(--line2)' })
                  }}
                >{t}</button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                value={selectedPreset}
                onChange={e => setSelectedPreset(e.target.value)}
                style={{ ...fieldStyle, flex: 1, appearance: 'none', paddingRight: '32px', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                {filteredPresets.map(c => (
                  <option key={c.name} value={c.name} style={{ background: '#14141d', color: '#e2e8f0' }}>{c.name} ({c.type})</option>
                ))}
              </select>
              <button onClick={handleAddPreset} className="btn btn-primary" style={{ padding: '9px 14px', borderRadius: '8px', flexShrink: 0 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </motion.div>

          {/* Custom Adder */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Plus size={16} color="var(--accent-light)" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Custom University</h3>
            </div>

            <form onSubmit={handleAddCustom} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Name</label>
                <input 
                  type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                  style={fieldStyle} placeholder="e.g. Cornell University" required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '4px' }}>GPA</label>
                  <input type="text" value={customGPA} onChange={e => setCustomGPA(e.target.value)} style={fieldStyle} required />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '4px' }}>SAT</label>
                  <input type="number" value={customSAT} onChange={e => setCustomSAT(e.target.value)} style={fieldStyle} required />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Tier</label>
                  <select value={customType} onChange={e => setCustomType(e.target.value)} style={{ ...fieldStyle, appearance: 'none' }}>
                    <option value="Reach" style={{ background: '#14141d', color: '#e2e8f0' }}>Reach</option>
                    <option value="Match" style={{ background: '#14141d', color: '#e2e8f0' }}>Match</option>
                    <option value="Safety" style={{ background: '#14141d', color: '#e2e8f0' }}>Safety</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn" style={{ justifyContent: 'center', width: '100%', padding: '9px 14px', borderRadius: '8px' }}>
                Add to Shortlist
              </button>
            </form>
          </motion.div>

          {/* AI Advisor */}
          <div className="card" style={{ padding: '16px 20px', background: 'rgba(99,102,241,0.03)', borderColor: 'rgba(99,102,241,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={13} color="var(--accent-light)" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t1)', letterSpacing: '0.3px' }}>AI Insight</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--t2)', lineHeight: '1.55' }}>
              {aiScore.percentage < 60
                ? '⚠️ Your profile score is below average for top-tier Reach schools. Strengthen your research, extracurriculars, and skills to improve your odds.'
                : '✨ Strong profile! You\'re well-positioned for competitive schools. Finalizing your independent research paper will solidify your academic index.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}