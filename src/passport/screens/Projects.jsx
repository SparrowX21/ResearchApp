import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Trash2, Award, ExternalLink, Calendar, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Projects() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  const researchState = currentUser?.researchState || {};
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Research');
  const [status, setStatus] = useState('In Progress');
  const [skills, setSkills] = useState('');

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: new Date().toLocaleDateString()
    };

    const updatedProjects = [...(studentData.projects || []), newProject];
    await updateStudentData({ projects: updatedProjects });
    
    setName('');
    setDescription('');
    setSkills('');
  };

  const handleLinkResearch = async () => {
    if (!researchState.topic && !researchState.researchQuestion) {
      alert("No active research coach draft found! Go to the Research Coach tab to start writing.");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: researchState.researchQuestion || researchState.topic || "Independent Research Paper",
      description: researchState.thesis ? `Thesis: ${researchState.thesis}. Comprehensive academic research paper developed step-by-step with the Socratic Research Coach.` : "Academic research paper initiated with the Socratic Research Coach.",
      category: 'Research',
      status: researchState.completedStages?.includes('revision') ? 'Completed' : 'In Progress',
      skills: ['Academic Writing', 'Research Methods', 'Source Verification', researchState.topic || 'Independent Study'].filter(Boolean),
      createdAt: new Date().toLocaleDateString(),
      isLinkedResearch: true
    };

    const updatedProjects = [...(studentData.projects || []), newProject];
    await updateStudentData({ projects: updatedProjects });
  };

  const handleDeleteProject = async (id) => {
    const updatedProjects = (studentData.projects || []).filter(p => p.id !== id);
    await updateStudentData({ projects: updatedProjects });
  };

  const projects = studentData.projects || [];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Projects & Portfolio
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Showcase your independent coding projects, humanities papers, or scientific research.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Projects List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow">Logged Projects ({projects.length})</div>
            
            {researchState.topic && (
              <button 
                onClick={handleLinkResearch}
                className="btn btn-ghost btn-sm"
                style={{ 
                  background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                  color: 'var(--accent-light)', textTransform: 'none', letterSpacing: '0',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Sparkles size={12} /> Sync Research Coach Draft
              </button>
            )}
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--line2)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>💻</div>
              <div style={{ color: 'var(--t2)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No projects in your portfolio yet.</div>
              <div style={{ color: 'var(--t3)', fontSize: '12px' }}>Add a new project or sync your Research Coach draft to get started.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map(project => (
                <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                  style={{ 
                    padding: '24px',
                    background: project.isLinkedResearch ? 'linear-gradient(145deg, rgba(99,102,241,0.03), rgba(0,0,0,0.4))' : 'var(--bg1)',
                    borderColor: project.isLinkedResearch ? 'rgba(99,102,241,0.3)' : 'var(--line)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)' }}>{project.name}</h3>
                        {project.isLinkedResearch && (
                          <span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-light)', border: 'none', fontSize: '9px', fontWeight: 600 }}>
                            Linked Coach Draft
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '11px', color: 'var(--t3)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {project.createdAt}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={12} /> {project.category}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge" style={{ 
                        background: project.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', 
                        color: project.status === 'Completed' ? 'var(--green)' : 'var(--amber)',
                        border: 'none', fontSize: '10px', fontWeight: 700
                      }}>
                        {project.status}
                      </span>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ border: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ color: 'var(--t2)', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                    {project.description}
                  </p>

                  {project.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {project.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="badge" 
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line2)', color: 'var(--t2)', fontSize: '10px' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Project Form Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Plus size={20} color="var(--accent-light)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Add Portfolio Project</h2>
          </div>

          <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Project Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                }}
                placeholder="e.g. Bioinformatics DNA Matcher"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                >
                  <option value="Research">Research</option>
                  <option value="Software">Software</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Social Impact">Social Impact</option>
                </select>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Skills Used (comma-separated)</label>
              <input 
                type="text" 
                value={skills} 
                onChange={e => setSkills(e.target.value)} 
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                }}
                placeholder="e.g. Python, Genomic Analysis, Bio-py"
              />
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Project Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px',
                  lineHeight: '1.6', resize: 'vertical'
                }}
                placeholder="Describe your project, methodology, and direct personal impact."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              Add Project
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}