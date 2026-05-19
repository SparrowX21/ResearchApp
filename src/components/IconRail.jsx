import React from 'react';

function IconRail({ onReset }) {
  const icons = [
    { name: 'Stages', icon: '▤' },
    { name: 'Sources', icon: '▦' },
    { name: 'Outline', icon: '◧' },
    { name: 'Draft', icon: '◨' },
  ];

  return (
    <div style={{
      width: '48px',
      height: '100vh',
      background: 'var(--bg)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0',
      gap: '8px'
    }}>
      {/* Logo */}
      <div style={{
        width: '26px',
        height: '26px',
        background: 'var(--t1)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: '9px',
          fontWeight: 700,
          color: 'var(--bg)'
        }}>RP</span>
      </div>

      {/* Navigation Icons */}
      {icons.map((item, index) => (
        <button
          key={index}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--t3)',
            fontSize: '16px',
            position: 'relative'
          }}
          title={item.name}
        >
          {item.icon}
        </button>
      ))}

      {/* Separator */}
      <div style={{
        width: '24px',
        height: '1px',
        background: 'var(--line)',
        margin: '4px 0'
      }} />

      {/* Help Icon */}
      <button
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--t3)',
          fontSize: '16px'
        }}
        title="Help"
      >
        ?
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Profile Icon */}
      <button
        onClick={onReset}
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--t3)',
          fontSize: '16px'
        }}
        title="Reset"
      >
        ○
      </button>
    </div>
  );
}

export default IconRail;
