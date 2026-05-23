import React from 'react';

/** Circular score ring with animated fill */
export function ScoreRing({ percentage, grade, size = 140 }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-light)" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>
          {grade}
        </span>
        <span style={{ fontSize: size * 0.1, color: 'var(--t3)', fontWeight: 600, marginTop: 4 }}>
          {percentage}/100
        </span>
      </div>
    </div>
  );
}

/** Horizontal bar chart for score breakdown dimensions */
export function BreakdownBars({ breakdown }) {
  const entries = Object.entries(breakdown);

  return (
    <div className="breakdown-bars" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {entries.map(([key, data]) => {
        const pct = data.max > 0 ? (data.score / data.max) * 100 : 0;
        return (
          <div key={key}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '11px',
              }}
            >
              <span style={{ color: 'var(--t2)', fontWeight: 600, textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span style={{ color: 'var(--t3)', fontWeight: 500 }}>
                {data.score}/{data.max}
              </span>
            </div>
            <div className="meter-track" style={{ height: '6px', borderRadius: '3px' }}>
              <div
                className="meter-fill"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Radar-style polygon chart for profile dimensions */
export function ProfileRadar({ breakdown, size = 200 }) {
  const entries = Object.entries(breakdown);
  const n = entries.length;
  if (n < 3) return null;

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i, ratio) => {
    const r = maxR * Math.min(ratio, 1);
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = entries.map(([, data], i) => {
    const ratio = data.max > 0 ? data.score / data.max : 0;
    return point(i, ratio);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridLevels.map((level) => {
          const pts = entries.map((_, i) => point(i, level));
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
          return (
            <path
              key={level}
              d={d}
              fill="none"
              stroke="var(--line2)"
              strokeWidth="1"
            />
          );
        })}
        {entries.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line2)" strokeWidth="1" />;
        })}
        <path
          d={dataPath}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="var(--accent-light)"
          strokeWidth="2"
        />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--accent-light)" />
        ))}
      </svg>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 12px',
          justifyContent: 'center',
          maxWidth: size + 40,
        }}
      >
        {entries.map(([key]) => (
          <span key={key} style={{ fontSize: '9px', color: 'var(--t4)', textTransform: 'capitalize' }}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}
