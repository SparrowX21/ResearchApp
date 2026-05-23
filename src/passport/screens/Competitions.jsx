import React, { useState } from 'react';
import { Search, MapPin, Calendar, Trophy, Bookmark, ExternalLink, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const competitionsData = [
  // Computer Science
  { id: 1, name: 'USACO', category: 'Computer Science', deadline: 'Dec 15, 2026', location: 'Online', level: 'National', prize: 'Top ranking + college recognition', description: 'USA Computing Olympiad — the premier high school algorithmic programming contest with Bronze through Platinum divisions.', url: 'https://usaco.org' },
  { id: 2, name: 'Google Code Jam', category: 'Computer Science', deadline: 'Apr 1, 2026', location: 'Online', level: 'International', prize: 'Up to $15,000', description: 'Google\'s legendary algorithmic coding competition open to programmers worldwide.', url: 'https://codingcompetitions.withgoogle.com' },
  { id: 3, name: 'Google Solution Challenge', category: 'Computer Science', deadline: 'Mar 31, 2026', location: 'Online', level: 'International', prize: 'Up to $3,000 + mentorship', description: 'Build solutions using Google technologies for UN Sustainable Development Goals.', url: 'https://developers.google.com/community/gdsc-solution-challenge' },
  { id: 4, name: 'Congressional App Challenge', category: 'Computer Science', deadline: 'Nov 1, 2026', location: 'USA', level: 'National', prize: 'Congressional recognition + display in Capitol', description: 'Students create an app on a topic of their choice and submit it to their local Congressional district.', url: 'https://www.congressionalappchallenge.us' },
  { id: 5, name: 'MIT Battlecode', category: 'Computer Science', deadline: 'Jan 10, 2026', location: 'Online / Cambridge, MA', level: 'International', prize: 'Prizes + MIT campus finals', description: 'AI programming competition where you code a bot to compete in a real-time strategy game.', url: 'https://battlecode.org' },
  { id: 6, name: 'Codeforces Global Rounds', category: 'Computer Science', deadline: 'Rolling', location: 'Online', level: 'International', prize: 'Rating + prizes', description: 'Competitive programming rounds on the world\'s largest CP platform, with rated divisions.', url: 'https://codeforces.com' },
  { id: 7, name: 'PClassic', category: 'Computer Science', deadline: 'Nov 15, 2026', location: 'Philadelphia, PA', level: 'Regional', prize: 'Trophies + prizes', description: 'University of Pennsylvania\'s biannual high school programming contest.', url: 'https://pclassic.org' },

  // Science
  { id: 8, name: 'Regeneron ISEF', category: 'Science', deadline: 'Feb 1, 2026', location: 'Dallas, TX', level: 'International', prize: 'Up to $75,000', description: 'The world\'s largest pre-college STEM competition — Regeneron International Science & Engineering Fair.', url: 'https://www.societyforscience.org/isef/' },
  { id: 9, name: 'Science Olympiad', category: 'Science', deadline: 'Oct 1, 2026', location: 'Regional → National', level: 'National', prize: 'Medals + scholarships', description: 'Team-based STEM tournament with 23 events spanning biology, chemistry, physics, and engineering.', url: 'https://scioly.org' },
  { id: 10, name: 'Regeneron STS', category: 'Science', deadline: 'Nov 15, 2026', location: 'Washington, D.C.', level: 'National', prize: 'Up to $250,000', description: 'The nation\'s most prestigious pre-college science competition — Regeneron Science Talent Search.', url: 'https://www.societyforscience.org/regeneron-sts/' },
  { id: 11, name: 'USABO', category: 'Science', deadline: 'Feb 15, 2026', location: 'Online → National', level: 'National', prize: 'IBO team selection + recognition', description: 'USA Biology Olympiad — pathway to representing the US at the International Biology Olympiad.', url: 'https://www.usabo-trc.org' },
  { id: 12, name: 'Chemistry Olympiad (USNCO)', category: 'Science', deadline: 'Mar 1, 2026', location: 'Online → National', level: 'National', prize: 'IChO team selection', description: 'US National Chemistry Olympiad with local, national, and study camp rounds.', url: 'https://www.acs.org/education/olympiad.html' },
  { id: 13, name: 'Physics Olympiad (USAPhO)', category: 'Science', deadline: 'Jan 31, 2026', location: 'Online → National', level: 'National', prize: 'IPhO team selection', description: 'USA Physics Olympiad — the premier physics competition for US high schoolers.', url: 'https://www.aapt.org/Programs/contests/usapho.cfm' },
  { id: 14, name: 'Siemens Competition', category: 'Science', deadline: 'Sep 20, 2026', location: 'USA', level: 'National', prize: 'Up to $100,000', description: 'Research competition for individual and team projects in STEM fields.', url: 'https://www.siemens-foundation.org' },

  // Mathematics
  { id: 15, name: 'AMC / AIME / USAMO', category: 'Mathematics', deadline: 'Nov 1, 2026', location: 'Schools nationwide', level: 'National', prize: 'IMO team selection + recognition', description: 'The AMC pathway: AMC 10/12 → AIME → USAMO → IMO team selection. The gold standard of math competitions.', url: 'https://www.maa.org/math-competitions' },
  { id: 16, name: 'MATHCOUNTS', category: 'Mathematics', deadline: 'Dec 15, 2026', location: 'Regional → National', level: 'National', prize: 'Scholarships + trophies', description: 'Middle school math competition with sprint, target, team, and countdown rounds.', url: 'https://www.mathcounts.org' },
  { id: 17, name: 'HMMT / PUTnam', category: 'Mathematics', deadline: 'Nov 10, 2026', location: 'Cambridge, MA', level: 'National', prize: 'Prestige + prizes', description: 'Harvard-MIT Mathematics Tournament — one of the most prestigious math competitions in the US.', url: 'https://www.hmmt.org' },
  { id: 18, name: 'Mu Alpha Theta', category: 'Mathematics', deadline: 'Rolling', location: 'USA', level: 'National', prize: 'Scholarships + honor society', description: 'National math honor society with regional and national competitions.', url: 'https://mualphatheta.org' },

  // Engineering
  { id: 19, name: 'FIRST Robotics (FRC)', category: 'Engineering', deadline: 'Jan 5, 2026', location: 'Regional → Houston, TX', level: 'International', prize: 'Scholarships + Dean\'s List', description: 'Build a 120-lb robot with your team and compete in alliance-based matches. The Super Bowl of STEM.', url: 'https://www.firstinspires.org/robotics/frc' },
  { id: 20, name: 'VEX Robotics', category: 'Engineering', deadline: 'Rolling', location: 'Regional → World Championship', level: 'International', prize: 'World Championship + scholarships', description: 'Design, build, and program robots to compete in game-based engineering challenges.', url: 'https://www.vexrobotics.com' },
  { id: 21, name: 'TSA (Technology Student Association)', category: 'Engineering', deadline: 'Oct 15, 2026', location: 'State → National', level: 'National', prize: 'Scholarships + recognition', description: 'Competitive events in engineering, technology, and design for middle and high school students.', url: 'https://tsaweb.org' },

  // Writing & Humanities
  { id: 22, name: 'Scholastic Art & Writing Awards', category: 'Writing & Humanities', deadline: 'Dec 1, 2026', location: 'USA', level: 'National', prize: 'Gold/Silver Keys + scholarships', description: 'The longest-running and most prestigious recognition program for creative teens in the US.', url: 'https://www.artandwriting.org' },
  { id: 23, name: 'National History Day', category: 'Writing & Humanities', deadline: 'Mar 1, 2026', location: 'Regional → National', level: 'National', prize: 'Scholarships + recognition', description: 'Students conduct research and present historical projects as papers, exhibits, documentaries, or performances.', url: 'https://www.nhd.org' },
  { id: 24, name: 'National Speech & Debate', category: 'Writing & Humanities', deadline: 'Rolling', location: 'Regional → National', level: 'National', prize: 'Scholarships + trophies', description: 'The largest academic competition in the US — covering policy, Lincoln-Douglas, public forum, and speech events.', url: 'https://www.speechanddebate.org' },

  // Business & Economics
  { id: 25, name: 'DECA', category: 'Business & Economics', deadline: 'Nov 1, 2026', location: 'Regional → International', level: 'International', prize: 'Scholarships + trophies', description: 'Business case study competitions in marketing, finance, hospitality, and entrepreneurship.', url: 'https://www.deca.org' },
  { id: 26, name: 'FBLA', category: 'Business & Economics', deadline: 'Dec 1, 2026', location: 'State → National', level: 'National', prize: 'Scholarships + recognition', description: 'Future Business Leaders of America — competitive events in accounting, economics, tech, and leadership.', url: 'https://www.fbla.org' },
  { id: 27, name: 'National Economics Challenge', category: 'Business & Economics', deadline: 'Feb 1, 2026', location: 'Online → NYC', level: 'National', prize: 'Scholarships + prizes', description: 'Quiz-bowl style economics competition organized by the Council for Economic Education.', url: 'https://www.councilforeconed.org/national-economics-challenge/' },
  { id: 28, name: 'Diamond Challenge', category: 'Business & Economics', deadline: 'Jan 15, 2026', location: 'Online → University of Delaware', level: 'International', prize: 'Up to $20,000 + mentorship', description: 'University of Delaware\'s entrepreneurship competition for high school students with business or social venture tracks.', url: 'https://diamondchallenge.org' },
];

const categoriesList = ['All', 'Computer Science', 'Science', 'Mathematics', 'Engineering', 'Writing & Humanities', 'Business & Economics'];
const levelsList = ['All Levels', 'International', 'National', 'Regional'];

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
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--t1)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
          Competitions
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '14px', lineHeight: 1.5 }}>Discover {competitionsData.length} high-impact academic competitions across disciplines.</p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--t4)" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '40px', height: '42px', fontSize: '13px', background: 'var(--bg1)', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 14px', fontSize: '11.5px', fontWeight: 600, borderRadius: '20px',
                border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif', letterSpacing: '0.1px',
                ...(category === cat 
                  ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } 
                  : { background: 'transparent', color: 'var(--t3)', borderColor: 'var(--line2)' })
              }}
              onMouseEnter={e => { if (category !== cat) { e.currentTarget.style.borderColor = 'var(--line3)'; e.currentTarget.style.color = 'var(--t2)'; }}}
              onMouseLeave={e => { if (category !== cat) { e.currentTarget.style.borderColor = 'var(--line2)'; e.currentTarget.style.color = 'var(--t3)'; }}}
            >
              {cat}
            </button>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'var(--line2)', margin: '0 4px' }} />
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="select"
            style={{ fontSize: '11.5px', padding: '6px 10px', borderRadius: '20px' }}
          >
            {levelsList.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '16px', fontSize: '11px', color: 'var(--t4)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {filtered.length} competition{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        <AnimatePresence>
          {filtered.map((comp, i) => (
            <motion.div 
              key={comp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: i * 0.03 }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}
            >
              {/* Title + Bookmark */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3, minWidth: 0, wordBreak: 'break-word' }}>{comp.name}</h3>
                <button 
                  onClick={() => toggleSave(comp.id)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                >
                  <Bookmark size={18} fill={saved.includes(comp.id) ? 'var(--accent-light)' : 'none'} color={saved.includes(comp.id) ? 'var(--accent-light)' : 'var(--t4)'} />
                </button>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.15)' }}>{comp.category}</span>
                <span className="badge" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.15)' }}>{comp.level}</span>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--t2)', fontSize: '12.5px', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                {comp.description}
              </p>

              {/* Meta */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '11.5px', color: 'var(--t3)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} /> {comp.deadline}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={13} /> {comp.location}</span>
              </div>

              {/* Footer */}
              <div style={{ 
                background: 'var(--bg2)', padding: '12px 14px', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--t4)', letterSpacing: '0.6px', fontWeight: 700 }}>Prize</div>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--amber)', 
                    fontWeight: 600, fontSize: '12.5px', marginTop: '2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    <Trophy size={12} style={{ flexShrink: 0 }} /> {comp.prize}
                  </div>
                </div>
                <button 
                  onClick={() => window.open(comp.url, '_blank')}
                  className="btn btn-primary" 
                  style={{ padding: '7px 14px', fontSize: '10.5px', borderRadius: '6px', flexShrink: 0, gap: '4px' }}
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
