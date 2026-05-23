import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Percent } from 'lucide-react';

/**
 * CollegeCard component renders a single college entry with probability gauge.
 * Props:
 * - college: { id, name, avgGPA, avgSAT, type }
 * - probability: number (0-100)
 * - onDelete: function to remove the college
 */
export default function CollegeCard({ college, probability, onDelete }) {
  const probColor = probability >= 75 ? 'var(--green)' : probability >= 40 ? 'var(--amber)' : 'var(--red)';

  return (
    <motion.div
      className="card"
      style={{ padding: '24px' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)' }}>{college.name}</h3>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span className="badge" style={{
              background: college.type === 'Reach' ? 'rgba(239,68,68,0.1)' : college.type === 'Match' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
              color: college.type === 'Reach' ? 'var(--red)' : college.type === 'Match' ? '#60a5fa' : 'var(--green)',
              border: 'none', fontSize: '9.5px', fontWeight: 700
            }}>
              {college.type}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--t3)', display: 'flex', alignItems: 'center' }}>
              Avg GPA: {college.avgGPA} • Avg SAT: {college.avgSAT}
            </span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="btn btn-ghost btn-sm btn-icon"
          style={{ border: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--t2)')}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Probability Gauge */}
      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--line2)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Percent size={20} color={probColor} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11.5px' }}>
            <span style={{ color: 'var(--t2)', fontWeight: 500 }}>AI Admissions Probability</span>
            <span style={{ color: probColor, fontWeight: 800 }}>{probability}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--line2)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: probColor, width: `${probability}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
