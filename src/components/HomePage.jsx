import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ShieldCheck, Compass } from 'lucide-react';

const STATS = [
  { value: 'AI', label: 'Admissions Engine' },
  { value: '11', label: 'Cohesive Modules' },
];

export default function HomePage() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Background particles for high-end aesthetic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.a})`;
        ctx.fill();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = 0.05 * (1 - dist / 90);
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    await loginWithGoogle();
    setIsLoggingIn(false);
  };

  return (
    <div style={{
      position: 'relative', height: '100vh', width: '100vw',
      background: 'var(--bg)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      <header style={{
        position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '24px 40px', borderBottom: '1px solid var(--line)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: '#fff', fontWeight: 800,
          }}>E</div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--t1)', letterSpacing: '0.5px' }}>
            EduSuite<span style={{ color: 'var(--accent-light)' }}>.ai</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-light)', lineHeight: 1.1 }}>{s.value}</div>
              <div className="eyebrow" style={{ marginTop: '2px', fontSize: '8px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', position: 'relative', zIndex: 5 }}>
        
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: '640px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '20px', padding: '6px 14px', marginBottom: '24px'
            }}>
              <Sparkles size={12} color="var(--accent-light)" />
              <span className="eyebrow" style={{ color: 'var(--accent-light)', letterSpacing: '1px', fontSize: '8.5px' }}>
                All-in-One Career & College Ecosystem
              </span>
            </div>

            <h1 style={{ 
              fontSize: '44px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.5px', color: 'var(--t1)', marginBottom: '20px' 
            }}>
              The Only Tool a Student Needs for<br/>
              <span style={{ background: 'linear-gradient(90deg, var(--accent-light), #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Futuristic Career Planning.
              </span>
            </h1>
            
            <p style={{ fontSize: '15px', color: 'var(--t2)', lineHeight: 1.7, marginBottom: '40px', padding: '0 20px' }}>
              Architect your dream career roadmap. Track achievements, sync AP coursework, log extracurriculars, evaluate college admissions odds, and write publication-ready independent research—all inside one cohesive ecosystem.
            </p>
            
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              style={{
                background: '#fff', color: '#000', border: 'none', borderRadius: '8px',
                padding: '14px 28px', fontSize: '13px', fontWeight: 700, display: 'inline-flex',
                alignItems: 'center', gap: '12px', cursor: isLoggingIn ? 'wait' : 'pointer',
                boxShadow: '0 4px 20px rgba(99,102,241,0.15)', transition: 'all 0.2s',
                transform: isLoggingIn ? 'none' : 'scale(1)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isLoggingIn ? (
                <span className="typing-dots"><span></span><span></span><span></span></span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign In with Google
                </>
              )}
            </button>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--green)' }}>
              <ShieldCheck size={13} /> Active SSL cloud encryption enabled
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
