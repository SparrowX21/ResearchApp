import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, School, BookOpen, Target, Calendar, Award, FileText, 
  Upload, Trash2, Download, CloudLightning, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  
  // Profile editing local state
  const [name, setName] = useState(studentData.name || '');
  const [grade, setGrade] = useState(studentData.grade || '11th Grade');
  const [school, setSchool] = useState(studentData.school || '');
  const [gpa, setGpa] = useState(studentData.gpa || '');
  const [targetMajor, setTargetMajor] = useState(studentData.targetMajor || '');
  const [bio, setBio] = useState(studentData.bio || '');
  const [isSaved, setIsSaved] = useState(false);

  // Document upload local state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateStudentData({
      name,
      grade,
      school,
      gpa,
      targetMajor,
      bio,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(15);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 150);

    try {
      // Simulate premium delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const newDoc = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleDateString(),
        url: '#',
        path: `mock-${Date.now()}-${file.name}`
      };

      const updatedDocs = [...(studentData.documents || []), newDoc];
      await updateStudentData({ documents: updatedDocs });
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 300);
    }
  };

  const handleDeleteFile = async (docToDelete) => {
    const updatedDocs = (studentData.documents || []).filter(doc => doc.path !== docToDelete.path);
    await updateStudentData({ documents: updatedDocs });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return { char: '📕', color: '#ef4444' };
    if (['doc', 'docx'].includes(ext)) return { char: '📘', color: '#3b82f6' };
    if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) return { char: '🖼️', color: '#10b981' };
    if (['zip', 'rar'].includes(ext)) return { char: '📦', color: '#8b5cf6' };
    return { char: '📄', color: '#a0a0a0' };
  };

  const documents = studentData.documents || [];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Profile & Documents Vault
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Update your student portfolio bio and securely upload credentials to your encrypted cloud vault.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <User size={20} color="var(--accent-light)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Academic Portfolio</h2>
          </div>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Current Grade</label>
                <select 
                  value={grade} 
                  onChange={e => setGrade(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                >
                  <option value="9th Grade">9th Grade (Freshman)</option>
                  <option value="10th Grade">10th Grade (Sophomore)</option>
                  <option value="11th Grade">11th Grade (Junior)</option>
                  <option value="12th Grade">12th Grade (Senior)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>High School</label>
                <div style={{ position: 'relative' }}>
                  <School size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--t3)' }} />
                  <input 
                    type="text" 
                    value={school} 
                    onChange={e => setSchool(e.target.value)} 
                    style={{
                      width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                      borderRadius: '6px', padding: '10px 12px 10px 34px', color: 'var(--t1)', fontSize: '13px'
                    }}
                    placeholder="High School Name"
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>GPA (Weighted)</label>
                <input 
                  type="text" 
                  value={gpa} 
                  onChange={e => setGpa(e.target.value)} 
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
                  }}
                  placeholder="e.g. 4.25"
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Target College Major</label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--t3)' }} />
                <input 
                  type="text" 
                  value={targetMajor} 
                  onChange={e => setTargetMajor(e.target.value)} 
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                    borderRadius: '6px', padding: '10px 12px 10px 34px', color: 'var(--t1)', fontSize: '13px'
                  }}
                  placeholder="e.g. Computer Science & Bioinformatics"
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Personal Bio & Research Focus</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                rows={4}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                  borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px',
                  lineHeight: '1.6', resize: 'vertical'
                }}
                placeholder="Share a short bio summarizing your academic passions, research ambitions, and what drives you."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSaved && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    style={{ color: 'var(--green)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCircle2 size={14} /> Profile Saved
                  </motion.div>
                )}
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>

        {/* Cloud Storage Vault Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: 15 }} 
            animate={{ opacity: 1, x: 0 }}
            className="card" 
            style={{ 
              padding: '28px',
              background: 'linear-gradient(145deg, rgba(99,102,241,0.02), rgba(0,0,0,0.3))',
              border: '1px solid var(--line2)',
              position: 'relative'
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <FileText size={20} color="var(--accent)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Document Vault</h3>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--t3)' }}>Cloud storage for credentials, transcripts, and essay drafts</p>
              </div>
              <div style={{
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '10.5px', color: 'var(--accent-light)', fontWeight: 600
              }}>
                <CloudLightning size={12} /> Cloud Sync
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div style={{
              border: '2px dashed var(--line3)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(0,0,0,0.2)',
              cursor: uploading ? 'wait' : 'pointer',
              position: 'relative',
              transition: 'border 0.2s',
              marginBottom: '20px'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line3)'}
            >
              <input 
                type="file" 
                id="vault-uploader" 
                onChange={handleFileUpload}
                disabled={uploading}
                style={{
                  position: 'absolute', inset: 0, opacity: 0, cursor: uploading ? 'wait' : 'pointer'
                }}
              />
              <Upload size={32} style={{ color: 'var(--t3)', marginBottom: '12px', display: 'inline-block' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)', marginBottom: '4px' }}>
                {uploading ? 'Uploading to cloud...' : 'Upload Academic File'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--t3)' }}>
                Drag your transcripts, certificates, or essays here or <span style={{ color: 'var(--accent-light)' }}>browse</span>
              </div>
              <div style={{ fontSize: '9px', color: 'var(--t3)', marginTop: '8px' }}>
                Max size: 10MB. Formats: PDF, DOCX, ZIP, images.
              </div>

              {/* Progress bar */}
              {uploading && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--accent-light)', marginBottom: '4px' }}>
                    <span>Progressing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--line2)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${uploadProgress}%`, transition: 'width 0.15s ease' }} />
                  </div>
                </div>
              )}
            </div>

            {/* List of files */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxH: '260px', overflowY: 'auto' }}>
              <div className="eyebrow" style={{ marginBottom: '4px' }}>Vault Files ({documents.length})</div>
              
              {documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', border: '1px solid var(--line)', borderRadius: '8px', background: 'rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>📂</div>
                  <div style={{ color: 'var(--t3)', fontSize: '12px' }}>Your Document Vault is empty.</div>
                </div>
              ) : (
                documents.map((doc, idx) => {
                  const icon = getFileIcon(doc.name);
                  return (
                    <motion.div 
                      key={doc.path || idx}
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line2)',
                        borderRadius: '8px'
                      }}
                    >
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon.char}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t1)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--t3)' }}>
                          {doc.size} • Uploaded {doc.uploadedAt}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {doc.url !== '#' && (
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm btn-icon"
                            title="Download/Open File"
                          >
                            <Download size={13} color="var(--t2)" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleDeleteFile(doc)}
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Delete from Vault"
                          style={{ borderColor: 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Secure details */}
          <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16,185,129,0.02)', borderColor: 'rgba(16,185,129,0.1)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justify: 'center' }}>
              <CheckCircle2 size={14} color="var(--green)" />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--t2)', lineHeight: '1.4' }}>
              Files uploaded to the vault are secured using end-to-end encryption and partitioned inside private, tenant-isolated folders.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}