import React from 'react';

const STAGE_ICONS = {
  topic:    '🔭',
  thesis:   '✍️',
  planning: '🗺️',
  sources:  '📚',
  outline:  '🗂️',
  drafting: '✒️',
  revision: '🔍',
};

const STAGE_DESC = {
  topic:    'Find your research question',
  thesis:   'Craft an arguable claim',
  planning: 'Map your research strategy',
  sources:  'Evaluate & cite sources',
  outline:  'Structure your argument',
  drafting: 'Write with feedback',
  revision: 'Polish to perfection',
};

function StagePanel({ stages, currentStage, completedStages, onStageNavigate, appState }) {
  const progress = Math.round(((currentStage) / stages.length) * 100);
  const sourcesCount = (appState?.sources || []).length;

  return (
    <div style={{
      width: 220, height: '100vh', background: 'var(--bg1)',
      borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--line)' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Research Path</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 10 }}>
          {appState?.researchQuestion
            ? <span style={{ color: 'var(--t2)', fontSize: 11, lineHeight: 1.5, display: 'block' }}>{appState.researchQuestion}</span>
            : <span style={{ color: 'var(--t3)', fontSize: 11 }}>No research question yet</span>
          }
        </div>
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span className="eyebrow">Progress</span>
          <span className="eyebrow" style={{ color: 'var(--accent-light)' }}>{progress}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--line)', borderRadius: 2 }}>
          <div style={{
            height: 3, background: 'var(--accent)', borderRadius: 2,
            width: `${progress}%`, transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* ── Stage list ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {stages.map((stage, index) => {
          const isDone = index < currentStage;
          const isActive = index === currentStage;
          const isLocked = index > currentStage;
          const isClickable = !isLocked;

          return (
            <div
              key={stage.id}
              onClick={() => isClickable && onStageNavigate(index)}
              style={{
                padding: '10px 16px', cursor: isClickable ? 'pointer' : 'default',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--accent)' : isDone ? 'var(--green)' : 'transparent'}`,
                transition: 'all 0.15s',
                opacity: isLocked ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (isClickable && !isActive) e.currentTarget.style.background = 'var(--bg2)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{STAGE_ICONS[stage.id]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: isActive ? 'var(--accent-light)' : isDone ? 'var(--t2)' : 'var(--t3)',
                    }}>
                      {stage.shortName}
                    </span>
                    {isDone && <span style={{ fontSize: 9, color: 'var(--green)' }}>✓</span>}
                    {isActive && <span style={{ fontSize: 9, color: 'var(--accent)' }}>●</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>
                    {STAGE_DESC[stage.id]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer stats ── */}
      <div style={{ padding: 12, borderTop: '1px solid var(--line)' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Session Stats</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--line)',
            borderRadius: 4, padding: '6px 10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>
              {currentStage}
            </div>
            <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 1 }}>Done</div>
          </div>
          <div style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--line)',
            borderRadius: 4, padding: '6px 10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>
              {sourcesCount}
            </div>
            <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 1 }}>Sources</div>
          </div>
          <div style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--line)',
            borderRadius: 4, padding: '6px 10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: appState?.thesis ? 'var(--green)' : 'var(--t3)' }}>
              {appState?.thesis ? '✓' : '—'}
            </div>
            <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 1 }}>Thesis</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StagePanel;
