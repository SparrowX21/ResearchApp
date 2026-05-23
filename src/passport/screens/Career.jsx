import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, TrendingUp, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CAREERS_DATA = {
  technology: [
    { title: 'Machine Learning Architect', salary: '$165,000', growth: '+32% (Very High)', path: 'BS in Computer Science/Data Science, Research in Deep Learning.', advice: 'Write an independent machine learning topic paper with our Socratic Research Coach.' },
    { title: 'Quantum Computing Scientist', salary: '$150,000', growth: '+28% (High)', path: 'BS in Physics/CS, MS/PhD in Quantum Information Science.', advice: 'Focus heavily on advanced calculus and honors physics.' }
  ],
  bioMedicine: [
    { title: 'Bioinformatics Researcher', salary: '$118,000', growth: '+22% (High)', path: 'BS in Computational Biology, MS in Biotech/Bioinformatics.', advice: 'Perform computational genomic analyses. Log Python and genetics skills!' },
    { title: 'Neurotechnology Specialist', salary: '$145,000', growth: '+25% (High)', path: 'BS in Cognitive Science/Neuroscience, Research in Brain-Computer Interfaces.', advice: 'Shortlist universities offering cognitive science labs.' }
  ],
  lawPolicy: [
    { title: 'Tech Ethics & Cyber Law Advocate', salary: '$135,000', growth: '+18% (Medium)', path: 'BA in Philosophy/Political Science, JD in Law (Cyber/AI concentration).', advice: 'Join debate, student government, or write research on digital privacy regulations.' },
    { title: 'Global Climate Policy Analyst', salary: '$96,000', growth: '+20% (High)', path: 'BA/BS in Environmental Studies, MS in Public Policy.', advice: 'Initiate a research draft on carbon pricing modeling.' }
  ],
  businessFinance: [
    { title: 'Quantitative FinTech Analyst', salary: '$175,000', growth: '+15% (Medium)', path: 'BS in Financial Engineering, Quantitative Finance.', advice: 'Build predictive stock models. Showcase programming skills in your portfolio!' },
    { title: 'Sustainable Enterprise Consultant', salary: '$108,000', growth: '+19% (High)', path: 'BS in Business Administration, concentrations in Sustainability.', advice: 'Form a community service recycling project.' }
  ]
};

export default function Career() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  
  const [selectedInterests, setSelectedInterests] = useState(studentData.interests || []);
  const [showAssessment, setShowAssessment] = useState(selectedInterests.length === 0);

  const toggleInterest = (interestKey) => {
    if (selectedInterests.includes(interestKey)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestKey));
    } else {
      setSelectedInterests([...selectedInterests, interestKey]);
    }
  };

  const handleSaveInterests = async () => {
    await updateStudentData({ interests: selectedInterests });
    setShowAssessment(false);
  };

  // Compile career matches based on selected interests
  const matchedCareers = [];
  selectedInterests.forEach(interest => {
    if (CAREERS_DATA[interest]) {
      matchedCareers.push(...CAREERS_DATA[interest]);
    }
  });

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          AI Career Pathway Mapping
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Map your academic interests and skills to high-growth, modern careers and outline your high school roadmap.
        </p>
      </div>

      {showAssessment ? (
        /* Interest Assessment View */
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <Compass size={42} color="var(--accent-light)" style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--t1)', marginBottom: '12px' }}>Identify Your Academic Passions</h2>
          <p style={{ color: 'var(--t3)', fontSize: '13px', lineHeight: '1.6', marginBottom: '28px' }}>
            Select the fields you are genuinely interested in. Our heuristic advisor will map your portfolio, skills, and research targets accordingly!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            {[
              { id: 'technology', label: 'AI, CS & Tech', icon: '💻' },
              { id: 'bioMedicine', label: 'Biotech & Medicine', icon: '🧬' },
              { id: 'lawPolicy', label: 'Tech Law & Policy', icon: '⚖️' },
              { id: 'businessFinance', label: 'FinTech & Quant Business', icon: '📈' }
            ].map(item => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  style={{
                    padding: '20px 16px', borderRadius: '12px', background: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(0,0,0,0.3)',
                    border: '1px solid', borderColor: isSelected ? 'var(--accent)' : 'var(--line2)',
                    color: isSelected ? 'var(--accent-light)' : 'var(--t2)', cursor: 'pointer',
                    fontSize: '14px', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleSaveInterests} 
            disabled={selectedInterests.length === 0}
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            Generate Career Roadmap
          </button>
        </motion.div>
      ) : (
        /* Careers Roadmap View */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '32px' }}>
          
          {/* Matched Careers List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="eyebrow">Matched Careers ({matchedCareers.length})</div>
              <button onClick={() => setShowAssessment(true)} className="btn btn-ghost btn-sm" style={{ textTransform: 'none', fontSize: '11px', letterSpacing: 0 }}>
                Retake Assessment
              </button>
            </div>

            {matchedCareers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--line2)', borderRadius: '8px', color: 'var(--t3)' }}>
                No interests selected. Retake the assessment to map your pathways!
              </div>
            ) : (
              matchedCareers.map((career, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                  style={{ padding: '24px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)' }}>{career.title}</h3>
                      <div style={{ fontSize: '11.5px', color: 'var(--accent-light)', fontWeight: 600, display: 'flex', gap: '16px', marginTop: '4px' }}>
                        <span>Salary: {career.salary}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><TrendingUp size={12} /> Job Growth: {career.growth}</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ color: 'var(--t2)', fontSize: '12.5px', lineHeight: '1.6', marginBottom: '14px' }}>
                    <strong>Suggested Major:</strong> {career.path}
                  </p>

                  <div style={{ background: 'rgba(99,102,241,0.02)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={14} color="var(--accent-light)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.4' }}>
                      <strong>Portfolio Action:</strong> {career.advice}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Quick Guidance Box */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '28px', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Compass size={18} color="var(--accent-light)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>College Target Major</h3>
            </div>
            
            <p style={{ color: 'var(--t2)', fontSize: '12.5px', lineHeight: '1.6', marginBottom: '20px' }}>
              Your matched pathways align closely with a target major in <strong>{studentData.targetMajor || 'an advanced technology or research field'}</strong>. Let's make sure your portfolio documents are properly prepared!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.4' }}>
                  Log advanced courses (AP Calculus, AP Physics) to demonstrate rigor.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.4' }}>
                  Log skills (Python, Data Science) to show proficiency in computational careers.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.4' }}>
                  Finalize your independent research paper in the <strong>Research Coach</strong> to upload a formal writing sample.
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}