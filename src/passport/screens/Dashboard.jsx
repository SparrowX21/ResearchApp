import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, BookOpen, Target, Lightbulb, Hexagon, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { calculateAIScore } from '../utils/aiScoring';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const studentData = currentUser?.studentData || {};
  const aiScore = calculateAIScore(studentData);

  const careerMatches = [
    { title: 'AI/ML Engineer', match: 92, trending: true },
    { title: 'Data Scientist', match: 88, trending: true },
    { title: 'Software Developer', match: 85, trending: false },
    { title: 'Research Scientist', match: 82, trending: false },
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Welcome, {studentData.name || 'Student'}!
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>Your journey overview & AI-driven insights</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
        
        {/* Main AI Score Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.02))',
              border: '1px solid rgba(37,99,235,0.3)', borderRadius: '16px', padding: '24px',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.1, pointerEvents: 'none' }}>
              <Hexagon size={200} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={20} color="#3b82f6" />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>AI Profile Score</h2>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--t3)' }}>Proprietary collegiate readiness evaluation</p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1, color: '#3b82f6', textShadow: '0 0 20px rgba(59,130,246,0.5)' }}>
                  {aiScore.grade}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t2)', marginTop: '4px' }}>
                  {aiScore.score}<span style={{ color: 'var(--t3)' }}>/100</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {Object.entries(aiScore.breakdown).map(([key, data]) => (
                <div key={key} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '12px', border: '1px solid var(--line2)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'capitalize', color: 'var(--t3)', marginBottom: '4px' }}>{key}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)' }}>
                    <span style={{ color: '#3b82f6' }}>{data.score}</span><span style={{ color: 'var(--t3)' }}>/{data.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Zap size={16} color="#f59e0b" />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>AI Insights</div>
                </div>
                {aiScore.insights.slice(0, 2).map((insight, idx) => (
                  <p key={idx} style={{ fontSize: '12.5px', color: 'var(--t2)', marginBottom: '8px', lineHeight: 1.5 }}>
                    • {insight}
                  </p>
                ))}
              </div>

              <div style={{ flex: 1, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Lightbulb size={16} color="#22c55e" />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Next Steps</div>
                </div>
                {aiScore.recommendations.slice(0, 2).map((rec, idx) => (
                  <p key={idx} style={{ fontSize: '12.5px', color: 'var(--t2)', marginBottom: '8px', lineHeight: 1.5 }}>
                    • {rec}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Strength', val: `${aiScore.percentage}%`, icon: Target, c: '#3b82f6' },
              { label: 'Skills tracked', val: studentData.skills?.length || 0, icon: BookOpen, c: '#8b5cf6' },
              { label: 'Awards', val: studentData.achievements || 0, icon: Sparkles, c: '#f59e0b' },
              { label: 'Competitions', val: studentData.competitions || 0, icon: Trophy, c: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
                <s.icon size={24} color={s.c} style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)' }}>Top Career Matches</h3>
              <div className="badge badge-accent">AI Powered</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {careerMatches.map((career, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t2)' }}>{career.title}</span>
                      {career.trending && <div className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none' }}>Trending</div>}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#3b82f6' }}>{career.match}%</span>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: `${career.match}%`, background: '#3b82f6' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <BookOpen size={16} /> Log a new skill
              </button>
              <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <Trophy size={16} /> Find Competitions
              </button>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
