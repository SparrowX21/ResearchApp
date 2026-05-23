import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'stages',  icon: '◫', label: 'Stages' },
  { id: 'sources', icon: '⊞',  label: 'Sources' },
  { id: 'outline', icon: '≡',  label: 'Outline' },
  { id: 'draft',   icon: '⊟',  label: 'Draft' },
];

function IconRail({ onReset }) {
  const [activeNav, setActiveNav] = useState('stages');
  const [showTooltip, setShowTooltip] = useState(null);

  return (
    <div style={{
      width: 48, height: '100vh',
      background: 'var(--bg)', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '10px 0 12px', gap: 4,
      flexShrink: 0, position: 'relative', zIndex: 10,
    }}>

      {/* Logo */}
      <div style={{
        width: 28, height: 28,
        background: 'var(--accent)', borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, flexShrink: 0,
        boxShadow: '0 0 10px var(--accent-dim)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>RP</span>
      </div>

      {/* Nav icons */}
      {NAV_ITEMS.map(item => {
        const isActive = activeNav === item.id;
        return (
          <div key={item.id} style={{ position: 'relative' }}
            onMouseEnter={() => setShowTooltip(item.id)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => setActiveNav(item.id)}
              style={{
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                cursor: 'pointer', color: isActive ? 'var(--accent-light)' : 'var(--t3)',
                fontSize: 16, borderRadius: 6,
                transition: 'all 0.15s',
              }}
              title={item.label}
            >
              {item.icon}
            </button>
            {/* Tooltip */}
            {showTooltip === item.id && (
              <div style={{
                position: 'absolute', left: 42, top: '50%', transform: 'translateY(-50%)',
                background: 'var(--bg3)', border: '1px solid var(--line2)',
                padding: '4px 10px', borderRadius: 4,
                fontSize: 11, color: 'var(--t2)', whiteSpace: 'nowrap',
                zIndex: 100, pointerEvents: 'none',
              }}>
                {item.label}
              </div>
            )}
          </div>
        );
      })}

      {/* Divider */}
      <div style={{ width: 24, height: 1, background: 'var(--line)', margin: '4px 0' }} />

      {/* Help */}
      <div style={{ position: 'relative' }}
        onMouseEnter={() => setShowTooltip('help')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <button style={{
          width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none',
          cursor: 'pointer', color: 'var(--t3)', fontSize: 14, borderRadius: 6,
          transition: 'all 0.15s',
        }} title="Help">?</button>
        {showTooltip === 'help' && (
          <div style={{
            position: 'absolute', left: 42, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--bg3)', border: '1px solid var(--line2)',
            padding: '4px 10px', borderRadius: 4,
            fontSize: 11, color: 'var(--t2)', whiteSpace: 'nowrap', zIndex: 100,
          }}>Help</div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Reset */}
      <div style={{ position: 'relative' }}
        onMouseEnter={() => setShowTooltip('reset')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <button
          onClick={onReset}
          style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--t3)', fontSize: 13, borderRadius: 6,
            transition: 'all 0.15s',
          }}
          title="Reset Progress"
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
        >
          ↺
        </button>
        {showTooltip === 'reset' && (
          <div style={{
            position: 'absolute', left: 42, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--bg3)', border: '1px solid var(--red)',
            padding: '4px 10px', borderRadius: 4,
            fontSize: 11, color: 'var(--red)', whiteSpace: 'nowrap', zIndex: 100,
          }}>Reset Progress</div>
        )}
      </div>
    </div>
  );
}

export default IconRail;
