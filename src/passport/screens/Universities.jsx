import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Percent, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { calculateAIScore } from '../utils/aiScoring';
import { getAdmissionProbability } from '../utils/university';
import { POPULAR_COLLEGES } from '../../data/universitiesData';

export default function Universities() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  const aiScore = calculateAIScore(studentData);

  const [colleges, setColleges] = useState(studentData.colleges || []);
  const [selectedPreset, setSelectedPreset] = useState(POPULAR_COLLEGES[0]?.name || '');
  const [customName, setCustomName] = useState('');
  const [customGPA, setCustomGPA] = useState('3.8');
  const [customSAT, setCustomSAT] = useState('1400');
  const [customType, setCustomType] = useState('Match');
  const [presetFilter, setPresetFilter] = useState('All');

  const filteredPresets = presetFilter === 'All'
    ? POPULAR_COLLEGES
    : POPULAR_COLLEGES.filter(c => c.type === presetFilter);

  useEffect(() => {
    if (filteredPresets.length) {
      setSelectedPreset(filteredPresets[0].name);
    }
  }, [presetFilter]);

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

  const tierBadgeStyle = (type) => ({
    background: type === 'Reach' ? 'var(--red-dim)' : type === 'Match' ? 'var(--accent-dim)' : 'var(--green-dim)',
    color: type === 'Reach' ? 'var(--red)' : type === 'Match' ? 'var(--accent-light)' : 'var(--green)',
    border: `1px solid ${type === 'Reach' ? 'rgba(239,68,68,0.2)' : type === 'Match' ? 'rgba(99,102,241,0.2)' : 'rgba(34,197,94,0.2)'}`,
  });

  return (
    <div style={{ paddingBottom: '60px', overflowX: 'hidden', maxWidth: '100%' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="page-title">University Shortlist</h1>
        <p className="page-subtitle">
          Build your safety, match, and reach list with AI-powered admission probability estimates across {POPULAR_COLLEGES.length}+ schools.
        </p>
      </div>

      <div className="page-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, overflow: 'hidden' }}>
          <div className="eyebrow">Shortlisted ({colleges.length})</div>

          {colleges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed var(--line2)', borderRadius: 'var(--radius-lg)', background: 'var(--bg2)' }}>
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
                    style={{ padding: '18px 20px', overflow: 'hidden' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px', minWidth: 0 }}>
                      <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <h3 className="text-truncate" style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3 }} title={college.name}>
                          {college.name}
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span className="badge" style={tierBadgeStyle(college.type)}>{college.type}</span>
                          <span style={{ fontSize: '11px', color: 'var(--t3)' }}>
                            GPA {college.avgGPA} · SAT {college.avgSAT}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCollege(college.id)}
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ border: 'none', flexShrink: 0 }}
                        aria-label="Remove from shortlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{ background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <Percent size={16} color={probColor} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--t3)', fontWeight: 500 }}>Admission Probability</span>
                          <span style={{ color: probColor, fontWeight: 800 }}>{probability}%</span>
                        </div>
                        <div className="meter-track" style={{ height: '4px' }}>
                          <div className="meter-fill" style={{ width: `${probability}%`, background: probColor, borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0, overflow: 'hidden' }}>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', minWidth: 0 }}>
              <GraduationCap size={16} color="var(--accent-light)" style={{ flexShrink: 0 }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)', flexShrink: 0 }}>Popular Universities</h3>
              <span style={{ fontSize: '10px', color: 'var(--t4)', marginLeft: 'auto', fontWeight: 600, flexShrink: 0 }}>{filteredPresets.length} shown</span>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['All', 'Reach', 'Match', 'Safety'].map(t => (
                <button
                  key={t}
                  onClick={() => setPresetFilter(t)}
                  className={presetFilter === t ? 'chip chip-active' : 'chip'}
                  style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '5px 12px' }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', minWidth: 0 }}>
              <select
                value={selectedPreset}
                onChange={e => setSelectedPreset(e.target.value)}
                className="select field-select"
                style={{ flex: 1, minWidth: 0 }}
                title={selectedPreset}
              >
                {filteredPresets.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
              <button onClick={handleAddPreset} className="btn btn-primary" style={{ flexShrink: 0, padding: '10px 14px' }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Plus size={16} color="var(--accent-light)" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>Custom University</h3>
            </div>

            <form onSubmit={handleAddCustom} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Name</label>
                <input
                  type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                  className="input" placeholder="e.g. Cornell University" required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                <div style={{ minWidth: 0 }}>
                  <label className="label" style={{ display: 'block', marginBottom: '6px' }}>GPA</label>
                  <input type="text" value={customGPA} onChange={e => setCustomGPA(e.target.value)} className="input" required />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label className="label" style={{ display: 'block', marginBottom: '6px' }}>SAT</label>
                  <input type="number" value={customSAT} onChange={e => setCustomSAT(e.target.value)} className="input" required />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Tier</label>
                  <select value={customType} onChange={e => setCustomType(e.target.value)} className="select field-select">
                    <option value="Reach">Reach</option>
                    <option value="Match">Match</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                Add to Shortlist
              </button>
            </form>
          </motion.div>

          <div className="tip-card">
            <Sparkles size={14} className="tip-icon" style={{ color: 'var(--accent-light)' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t1)', marginBottom: '4px' }}>AI Insight</div>
              <p className="tip-text" style={{ color: 'var(--t2)' }}>
                {aiScore.percentage < 60
                  ? 'Your profile score is below average for top-tier reach schools. Strengthen research, extracurriculars, and skills to improve your odds.'
                  : 'Strong profile — you\'re well-positioned for competitive schools. Finalizing your research paper will solidify your academic index.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
