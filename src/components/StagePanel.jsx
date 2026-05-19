import React from 'react';

function StagePanel({ stages, currentStage, completedStages, onStageNavigate }) {
  const getStageStatus = (index) => {
    if (index < currentStage) return 'done';
    if (index === currentStage) return 'active';
    return 'locked';
  };

  const getNodeStyle = (status) => {
    switch (status) {
      case 'done':
        return {
          width: '7px',
          height: '7px',
          background: 'var(--t1)',
          border: '1px solid var(--t1)'
        };
      case 'active':
        return {
          width: '7px',
          height: '7px',
          background: 'var(--t1)',
          border: '2px solid var(--t1)',
          outline: '2px solid var(--bg)',
          outlineOffset: '2px'
        };
      default:
        return {
          width: '7px',
          height: '7px',
          background: 'var(--bg1)',
          border: '1px solid var(--t4)'
        };
    }
  };

  return (
    <div style={{
      width: '232px',
      height: '100vh',
      background: 'var(--bg1)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div className="eyebrow" style={{ marginBottom: '8px' }}>
          Active paper
        </div>
        <div style={{
          fontSize: '12.5px',
          fontWeight: 500,
          color: 'var(--t1)'
        }}>
          Research Paper
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Thread line */}
        <div style={{
          position: 'absolute',
          left: '3px',
          top: '0',
          bottom: '0',
          width: '1px',
          background: 'var(--line)'
        }} />

        <div style={{ position: 'relative', paddingLeft: '16px' }}>
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            const isClickable = status !== 'locked';

            return (
              <div
                key={stage.id}
                onClick={() => isClickable && onStageNavigate(index)}
                style={{
                  marginBottom: index < stages.length - 1 ? '20px' : '0',
                  cursor: isClickable ? 'pointer' : 'default'
                }}
              >
                {/* Node */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '6px',
                    ...getNodeStyle(status)
                  }}
                />

                {/* Stage name */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: status === 'active' ? 'var(--t1)' : 'var(--t3)',
                  marginBottom: '2px'
                }}>
                  {stage.shortName}
                </div>

                {/* Status hint */}
                <div style={{
                  fontSize: '10px',
                  color: 'var(--t4)'
                }}>
                  {status === 'done' ? 'Completed' : status === 'active' ? 'In progress' : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Progress */}
      <div style={{ marginTop: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span className="eyebrow">Progress</span>
          <span className="eyebrow">
            {currentStage + 1} / {stages.length} stages
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '1px',
          background: 'var(--line)',
          position: 'relative'
        }}>
          <div style={{
            height: '1px',
            background: 'var(--t1)',
            width: `${((currentStage + 1) / stages.length) * 100}%`
          }} />
        </div>
      </div>
    </div>
  );
}

export default StagePanel;
