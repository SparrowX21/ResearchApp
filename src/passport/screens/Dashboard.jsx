import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, BookOpen, Target, Lightbulb, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { calculateAIScore } from '../utils/aiScoring';
import { ScoreRing, BreakdownBars, ProfileRadar } from '../../components/ProfileScoreVisual';

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

  const statCards = [
    { label: 'Profile strength', val: `${aiScore.percentage}%`, icon: Target, c: 'var(--accent)' },
    { label: 'Skills tracked', val: studentData.skills?.length || 0, icon: BookOpen, c: 'var(--accent-light)' },
    { label: 'Awards', val: studentData.achievements || 0, icon: Sparkles, c: 'var(--amber)' },
    { label: 'Competitions', val: studentData.competitions || 0, icon: Trophy, c: 'var(--red)' },
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title" style={{ fontSize: '1.75rem' }}>
          Welcome, {studentData.name || 'Student'}
        </h1>
        <p className="page-subtitle">Your journey overview and AI-driven readiness insights</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated glow-accent"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 200, height: 200,
              background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={18} color="var(--accent-light)" />
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--t1)' }}>AI Profile Score</h2>
                <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>Collegiate readiness evaluation</p>
              </div>
            </div>

            <div className="profile-visual-grid" style={{ marginBottom: '28px' }}>
              <ScoreRing percentage={aiScore.percentage} grade={aiScore.grade} size={148} />
              <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-light)', letterSpacing: '-0.03em' }}>
                    {aiScore.score}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--t3)', fontWeight: 500 }}>/ 100 points</span>
                </div>
                <BreakdownBars breakdown={aiScore.breakdown} />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              padding: '20px 0',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  Dimension map
                </span>
                <ProfileRadar breakdown={aiScore.breakdown} size={180} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '10px',
                alignContent: 'center',
              }}>
                {Object.entries(aiScore.breakdown).map(([key, data]) => (
                  <div key={key} style={{
                    background: 'var(--bg2)', borderRadius: 'var(--radius-md)',
                    padding: '12px', border: '1px solid var(--line)',
                  }}>
                    <div style={{ fontSize: '10px', textTransform: 'capitalize', color: 'var(--t4)', marginBottom: '4px' }}>{key}</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>
                      <span style={{ color: 'var(--accent-light)' }}>{data.score}</span>
                      <span style={{ color: 'var(--t4)', fontWeight: 500 }}>/{data.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Zap size={16} color="var(--amber)" />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>AI Insights</div>
                </div>
                {aiScore.insights.slice(0, 2).map((insight, idx) => (
                  <p key={idx} style={{ fontSize: '12.5px', color: 'var(--t2)', marginBottom: '8px', lineHeight: 1.55 }}>
                    {insight}
                  </p>
                ))}
              </div>

              <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Lightbulb size={16} color="var(--green)" />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Next Steps</div>
                </div>
                {aiScore.recommendations.slice(0, 2).map((rec, idx) => (
                  <p key={idx} style={{ fontSize: '12.5px', color: 'var(--t2)', marginBottom: '8px', lineHeight: 1.55 }}>
                    {rec}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {statCards.map(s => (
              <div key={s.label} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
                <s.icon size={22} color={s.c} style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '6px', textAlign: 'center' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>Top Career Matches</h3>
              <span className="badge badge-accent">AI Powered</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {careerMatches.map((career, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                      <span className="text-truncate" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)' }}>{career.title}</span>
                      {career.trending && (
                        <span className="badge" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: 'none', flexShrink: 0 }}>
                          <TrendingUp size={10} style={{ marginRight: 2 }} /> Hot
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-light)', flexShrink: 0 }}>{career.match}%</span>
                  </div>
                  <div className="meter-track" style={{ height: '5px' }}>
                    <div className="meter-fill" style={{ width: `${career.match}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-light))' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)', marginBottom: '14px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <BookOpen size={16} /> Log a new skill
              </button>
              <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <Trophy size={16} /> Find competitions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
