import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, Circle, Award, Target, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TIMELINE_MILESTONES = {
  'Freshman Year (9th)': [
    { id: 'freshman_gpa', text: 'Set GPA goals and choose rigorous core courses' },
    { id: 'freshman_skills', text: 'Log your first 3 technical or academic skills' },
    { id: 'freshman_acts', text: 'Join at least 2 high school student clubs or sports' }
  ],
  'Sophomore Year (10th)': [
    { id: 'sophomore_comp', text: 'Register and prep for an academic competition (e.g. AMC, USACO)' },
    { id: 'sophomore_hours', text: 'Log 25+ community service hours in your Social Impact tab' },
    { id: 'sophomore_colleges', text: 'Shortlist 3 initial Match or Safety universities' }
  ],
  'Junior Year (11th)': [
    { id: 'junior_research', text: 'Initiate your first independent research paper draft in the Research Coach' },
    { id: 'junior_ap', text: 'Log at least 3 AP/IB rigorous courses in your academic log' },
    { id: 'junior_resume', text: 'Fill out your Target Major and Personal Bio in your Profile' }
  ],
  'Senior Year (12th)': [
    { id: 'senior_upload', text: 'Upload your finished research paper PDF to your Document Vault' },
    { id: 'senior_reaches', text: 'Finalize your Reach universities list with 80%+ Admissions Probability' },
    { id: 'senior_apply', text: 'Complete essays and submit applications via Early Action/Decision' }
  ]
};

export default function CollegeGuide() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  
  const [completedMilestones, setCompletedMilestones] = useState(
    studentData.completedMilestones || []
  );

  const handleToggleMilestone = async (id) => {
    let updated;
    if (completedMilestones.includes(id)) {
      updated = completedMilestones.filter(mId => mId !== id);
    } else {
      updated = [...completedMilestones, id];
    }
    
    setCompletedMilestones(updated);
    
    // Dynamically update achievements in studentData
    const totalMilestonesCount = Object.values(TIMELINE_MILESTONES).flat().length;
    const achievementsEarned = Math.floor(updated.length / 3);

    await updateStudentData({ 
      completedMilestones: updated,
      achievements: achievementsEarned
    });
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Collegiate Admissions Timeline
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Follow this grade-by-grade milestones roadmap designed by admissions experts, and track your achievements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Timeline Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Object.entries(TIMELINE_MILESTONES).map(([year, milestones]) => (
            <motion.div 
              key={year}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
              style={{ padding: '24px' }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={16} /> {year} Roadmap
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {milestones.map(m => {
                  const isChecked = completedMilestones.includes(m.id);
                  return (
                    <div 
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '12px', background: isChecked ? 'rgba(99,102,241,0.02)' : 'rgba(0,0,0,0.1)',
                        border: '1px solid', borderColor: isChecked ? 'rgba(99,102,241,0.2)' : 'var(--line2)',
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        if (!isChecked) e.currentTarget.style.borderColor = 'var(--line3)';
                      }}
                      onMouseLeave={e => {
                        if (!isChecked) e.currentTarget.style.borderColor = 'var(--line2)';
                      }}
                    >
                      {isChecked ? (
                        <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      ) : (
                        <Circle size={16} color="var(--t3)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      )}
                      <span style={{ fontSize: '12.5px', color: isChecked ? 'var(--t2)' : 'var(--t1)', textDecoration: isChecked ? 'line-through' : 'none', lineHeight: '1.4' }}>
                        {m.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Milestone Statistics Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Compass size={18} color="var(--accent-light)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>Roadmap Progress</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--t2)' }}>Completed Milestones</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-light)' }}>
                {completedMilestones.length} <span style={{ color: 'var(--t3)', fontWeight: 500 }}>/ 12</span>
              </span>
            </div>

            <div style={{ height: '6px', background: 'var(--line2)', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ height: '100%', background: 'var(--accent)', width: `${(completedMilestones.length / 12) * 100}%`, transition: 'width 0.4s ease' }} />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Award size={18} color="var(--green)" />
              <span style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.4' }}>
                Earn 1 profile portfolio achievement award for every <strong>3 milestones</strong> you check off on your roadmap.
              </span>
            </div>
          </motion.div>

          <div className="card" style={{ padding: '24px', background: 'rgba(99,102,241,0.02)', borderColor: 'rgba(99,102,241,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={14} color="var(--accent-light)" />
              <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--t1)' }}>AI Portfolio Boost</h4>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--t2)', lineHeight: '1.5' }}>
              Ticking off roadmap milestones helps you optimize your collegiate profile. The <strong>AI Profile Scoring System</strong> evaluates milestone completion as a metric for admissions readiness!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}