import React, { useState } from 'react';
import { Search, MapPin, Calendar, Trophy, Bookmark, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { competitionsData, competitionCategories, competitionLevels } from '../../data/competitionsData';

export default function Competitions() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [saved, setSaved] = useState([]);

  const filtered = competitionsData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    const matchLevel = level === 'All Levels' || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="page-title">Competitions</h1>
        <p className="page-subtitle">
          Discover {competitionsData.length} high-impact academic competitions across STEM, humanities, arts, and more.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--t4)" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {competitionCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={category === cat ? 'chip chip-active' : 'chip'}
              style={{ fontSize: '11px', fontWeight: 600 }}
            >
              {cat}
            </button>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'var(--line2)', margin: '0 6px' }} />
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="select"
            style={{ width: 'auto', minWidth: '140px', padding: '6px 32px 6px 12px', fontSize: '11px' }}
          >
            {competitionLevels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '16px', fontSize: '11px', color: 'var(--t4)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
        {filtered.length} competition{filtered.length !== 1 ? 's' : ''} found
        {saved.length > 0 && <span style={{ marginLeft: '12px', color: 'var(--accent-light)' }}>· {saved.length} saved</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        <AnimatePresence>
          {filtered.map((comp, i) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px', minWidth: 0 }}>
                <h3 className="text-clamp-2" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)', lineHeight: 1.35, flex: 1, minWidth: 0 }}>
                  {comp.name}
                </h3>
                <button
                  onClick={() => toggleSave(comp.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                  aria-label={saved.includes(comp.id) ? 'Remove bookmark' : 'Save competition'}
                >
                  <Bookmark size={18} fill={saved.includes(comp.id) ? 'var(--accent-light)' : 'none'} color={saved.includes(comp.id) ? 'var(--accent-light)' : 'var(--t4)'} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{comp.category}</span>
                <span className="badge badge-amber">{comp.level}</span>
              </div>

              <p style={{ color: 'var(--t2)', fontSize: '12.5px', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                {comp.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '11.5px', color: 'var(--t3)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} /> {comp.deadline}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}><MapPin size={13} style={{ flexShrink: 0 }} /> <span className="text-truncate">{comp.location}</span></span>
              </div>

              <div style={{
                background: 'var(--bg2)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', minWidth: 0,
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--t4)', letterSpacing: '0.5px', fontWeight: 700 }}>Prize</div>
                  <div className="text-truncate" style={{
                    display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--amber)',
                    fontWeight: 600, fontSize: '12.5px', marginTop: '2px',
                  }}>
                    <Trophy size={12} style={{ flexShrink: 0 }} /> {comp.prize}
                  </div>
                </div>
                <button
                  onClick={() => window.open(comp.url, '_blank')}
                  className="btn btn-primary btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  <ExternalLink size={12} /> Details
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <div style={{ color: 'var(--t2)', fontSize: '14px', fontWeight: 600 }}>No competitions match your filters.</div>
          <div style={{ color: 'var(--t4)', fontSize: '12px', marginTop: '4px' }}>Try adjusting your search or category.</div>
        </div>
      )}
    </div>
  );
}
