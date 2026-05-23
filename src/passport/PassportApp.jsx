import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Award, Layers, CheckCircle, BookOpen, 
  Briefcase, Users, Lightbulb, Compass, User, Sparkles, LogOut, ShieldCheck,
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';

// Import our 11 screens
import Dashboard from './screens/Dashboard';
import ResearchCoach from './screens/ResearchCoach';
import Skills from './screens/Skills';
import Projects from './screens/Projects';
import Competitions from './screens/Competitions';
import Extracurriculars from './screens/Extracurriculars';
import Universities from './screens/Universities';
import Career from './screens/Career';
import Community from './screens/Community';
import CollegeGuide from './screens/CollegeGuide';
import Profile from './screens/Profile';

const ROUTES = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, component: Dashboard },
  { id: 'research', label: 'Research Coach', icon: Sparkles, component: ResearchCoach },
  { id: 'skills', label: 'Skills & Courses', icon: Award, component: Skills },
  { id: 'projects', label: 'Projects Portfolio', icon: Layers, component: Projects },
  { id: 'competitions', label: 'Competitions', icon: CheckCircle, component: Competitions },
  { id: 'extracurriculars', label: 'Activities Log', icon: Lightbulb, component: Extracurriculars },
  { id: 'universities', label: 'Universities', icon: BookOpen, component: Universities },
  { id: 'career', label: 'Career Pathways', icon: Briefcase, component: Career },
  { id: 'community', label: 'Community Service', icon: Users, component: Community },
  { id: 'collegeGuide', label: 'Admissions Guide', icon: Compass, component: CollegeGuide },
  { id: 'profile', label: 'Profile & Vault', icon: User, component: Profile },
];

export default function PassportApp() {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const { currentUser, logout, cloudStatus } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const ActiveComponent = ROUTES.find(r => r.id === currentRoute)?.component || Dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg)', overflow: 'hidden' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ 
        width: '248px', background: 'var(--bg1)', borderRight: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0
      }}>
        
        {/* Brand Header */}
        <div style={{ 
          padding: '20px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          borderBottom: '1px solid var(--line)'
        }}>
          <div style={{
            width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: '#fff', fontWeight: 800,
            boxShadow: '0 4px 12px var(--accent-dim)',
          }}>E</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>
              EduSuite<span style={{ color: 'var(--accent-light)' }}>.ai</span>
            </span>
            <div style={{
              fontSize: '9px',
              color: cloudStatus.mode === 'cloud' ? 'var(--green)' : 'var(--t4)',
              display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, marginTop: '2px',
            }}>
              <ShieldCheck size={10} />
              {cloudStatus.mode === 'cloud'
                ? 'Cloud sync active'
                : cloudStatus.firebase
                  ? 'Local backup mode'
                  : 'Demo mode'}
            </div>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <div className="eyebrow" style={{ padding: '0 12px', marginBottom: '8px' }}>
            Passport & Coach
          </div>
          
          {ROUTES.map(route => {
            const isActive = currentRoute === route.id;
            const Icon = route.icon;
            
            // Accent highlight specifically for Research Coach
            const isResearch = route.id === 'research';
            const activeBg = isResearch
              ? 'var(--accent-dim)'
              : 'var(--accent-dim)';
            const activeBorder = isResearch ? 'rgba(99,102,241,0.35)' : 'rgba(99,102,241,0.2)';
            const activeColor = 'var(--accent-light)';
            
            return (
              <button
                key={route.id}
                onClick={() => setCurrentRoute(route.id)}
                style={{
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-md)', 
                  background: isActive ? activeBg : 'transparent',
                  border: '1px solid', 
                  borderColor: isActive ? activeBorder : 'transparent',
                  color: isActive ? activeColor : 'var(--t2)', 
                  cursor: 'pointer',
                  textAlign: 'left', 
                  marginBottom: '4px', 
                  transition: 'all 0.2s ease',
                  fontSize: '13px', 
                  fontWeight: isActive ? 600 : 500
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.color = 'var(--t1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--t2)';
                  }
                }}
              >
                <Icon size={16} color={isActive ? activeColor : 'inherit'} />
                {route.label}
              </button>
            )
          })}
        </nav>

        {/* User Profile Footer */}
        {currentUser && (
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid var(--line)', 
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={currentUser.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'} 
                alt="Profile" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--line2)' }} 
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t1)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--t3)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {currentUser.email}
                </div>
              </div>
            </div>

            <button 
              onClick={logout}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center', gap: '8px', fontSize: '10px' }}
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        )}

      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        overflowY: currentRoute === 'research' ? 'hidden' : 'auto', 
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ 
              flex: 1,
              minHeight: currentRoute === 'research' ? '100%' : 'auto', 
              height: currentRoute === 'research' ? '100%' : 'auto',
              padding: currentRoute === 'research' ? '0' : '28px 40px',
              maxWidth: currentRoute === 'research' ? 'none' : '1280px',
              margin: currentRoute === 'research' ? '0' : '0 auto',
              width: '100%',
              overflow: currentRoute === 'research' ? 'hidden' : 'visible'
            }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
