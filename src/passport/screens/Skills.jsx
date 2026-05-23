import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Trash2, BookOpen, GraduationCap, Percent, BadgeAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export default function Skills() {
  const { currentUser, updateStudentData } = useAuth();
  const studentData = currentUser?.studentData || {};
  
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Technical');
  const [proficiency, setProficiency] = useState('Advanced');

  const [courseName, setCourseName] = useState('');
  const [courseGrade, setCourseGrade] = useState('A');
  const [courseType, setCourseType] = useState('AP');

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const newSkill = {
      id: Date.now(),
      name: skillName.trim(),
      category: skillCategory,
      proficiency,
    };

    const updatedSkills = [...(studentData.skills || []), newSkill];
    await updateStudentData({ skills: updatedSkills });
    setSkillName('');
  };

  const handleDeleteSkill = async (id) => {
    const updatedSkills = (studentData.skills || []).filter(s => s.id !== id);
    await updateStudentData({ skills: updatedSkills });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    const newCourse = {
      id: Date.now(),
      name: courseName.trim(),
      grade: courseGrade,
      type: courseType,
    };

    const updatedCourses = [...(studentData.courses || []), newCourse];
    
    // Calculate new GPA based on course grades
    const gpa = calculateGPA(updatedCourses);
    
    await updateStudentData({ 
      courses: updatedCourses,
      gpa: gpa.toFixed(2)
    });
    
    setCourseName('');
  };

  const handleDeleteCourse = async (id) => {
    const updatedCourses = (studentData.courses || []).filter(c => c.id !== id);
    const gpa = calculateGPA(updatedCourses);
    await updateStudentData({ 
      courses: updatedCourses,
      gpa: updatedCourses.length > 0 ? gpa.toFixed(2) : '0.00'
    });
  };

  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 4.0;
    let totalPoints = 0;
    courses.forEach(course => {
      let pts = GRADE_POINTS[course.grade] || 4.0;
      // Add weight for AP/IB honors classes (e.g. +0.5 or +1.0)
      if (course.type === 'AP' || course.type === 'IB') {
        pts += 1.0;
      } else if (course.type === 'Honors') {
        pts += 0.5;
      }
      totalPoints += pts;
    });
    return totalPoints / courses.length;
  };

  const skills = studentData.skills || [];
  const courses = studentData.courses || [];
  const computedGPA = calculateGPA(courses);

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--t1)', marginBottom: '8px' }}>
          Skills & Academic Courses
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
          Log your extracurricular skill profile and high school curriculum weight to optimize your academic rating.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Skills Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Award size={20} color="var(--accent-light)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Skill Portfolio</h2>
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              type="text" 
              value={skillName}
              onChange={e => setSkillName(e.target.value)}
              placeholder="Add skill (e.g., Python, Research Paper Writing)" 
              style={{
                flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
              }}
              required
            />
            <select 
              value={skillCategory} 
              onChange={e => setSkillCategory(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
              }}
            >
              <option value="Technical">Technical</option>
              <option value="Research">Research</option>
              <option value="Humanities">Humanities</option>
              <option value="Leadership">Leadership</option>
            </select>
            <select 
              value={proficiency} 
              onChange={e => setProficiency(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button type="submit" className="btn btn-primary btn-icon" style={{ width: '40px', height: '40px' }}>
              <Plus size={18} />
            </button>
          </form>

          {/* Skills List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="eyebrow" style={{ marginBottom: '4px' }}>Logged Skills ({skills.length})</div>
            {skills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', border: '1px dashed var(--line2)', borderRadius: '8px', color: 'var(--t3)' }}>
                No skills logged yet. Add your first skill above!
              </div>
            ) : (
              skills.map(skill => (
                <div 
                  key={skill.id} 
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line2)',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>{skill.name}</span>
                    <span className="badge" style={{ marginLeft: '8px', fontSize: '9px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-light)', border: 'none' }}>
                      {skill.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ 
                      fontSize: '11px', fontWeight: 700, 
                      color: skill.proficiency === 'Expert' ? '#ef4444' : skill.proficiency === 'Advanced' ? 'var(--accent-light)' : 'var(--t3)' 
                    }}>
                      {skill.proficiency}
                    </span>
                    <button 
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ border: 'none', background: 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={20} color="#3b82f6" />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>Course & GPA Sync</h2>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Weighted GPA</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#3b82f6' }}>
                {courses.length > 0 ? computedGPA.toFixed(2) : studentData.gpa || '4.00'}
              </div>
            </div>
          </div>

          <form onSubmit={handleAddCourse} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              type="text" 
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              placeholder="e.g. AP Calculus BC, Advanced Physics" 
              style={{
                flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
              }}
              required
            />
            <select 
              value={courseType} 
              onChange={e => setCourseType(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
              }}
            >
              <option value="AP">AP</option>
              <option value="IB">IB</option>
              <option value="Honors">Honors</option>
              <option value="Regular">Regular</option>
            </select>
            <select 
              value={courseGrade} 
              onChange={e => setCourseGrade(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line2)',
                borderRadius: '6px', padding: '10px 12px', color: 'var(--t1)', fontSize: '13px'
              }}
            >
              {Object.keys(GRADE_POINTS).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary btn-icon" style={{ width: '40px', height: '40px', background: '#3b82f6', borderColor: '#3b82f6' }}>
              <Plus size={18} />
            </button>
          </form>

          {/* Course List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="eyebrow" style={{ marginBottom: '4px' }}>Logged Courses ({courses.length})</div>
            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', border: '1px dashed var(--line2)', borderRadius: '8px', color: 'var(--t3)' }}>
                No courses logged yet. Log your high school classes to calculate weighted GPA!
              </div>
            ) : (
              courses.map(course => (
                <div 
                  key={course.id} 
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line2)',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>{course.name}</span>
                    <span className="badge" style={{ marginLeft: '8px', fontSize: '9px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'none' }}>
                      {course.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--t1)' }}>
                      Grade: <span style={{ color: '#3b82f6' }}>{course.grade}</span>
                    </span>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ border: 'none', background: 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}