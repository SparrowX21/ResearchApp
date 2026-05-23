import React, { useState, useEffect, useRef } from 'react';
import {
  callAI, evaluateThesis, evaluateSource,
  evaluateParagraph, generateRevisionChecklist,
  formatCitation, getSmartTip
} from '../utils/aiService';

// ─── SIMPLE MARKDOWN RENDERER ────────────────────────────────────────────────
function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i}>{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(<li key={i}><InlineMarkdown text={lines[i].slice(2)} /></li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i}><InlineMarkdown text={lines[i].replace(/^\d+\.\s/, '')} /></li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i}><InlineMarkdown text={line.slice(2)} /></blockquote>);
    } else if (line.startsWith('---') || line.startsWith('***')) {
      elements.push(<hr key={i} />);
    } else if (line.trim() === '') {
      // skip blank
    } else {
      elements.push(<p key={i}><InlineMarkdown text={line} /></p>);
    }
    i++;
  }
  return <div className="ai-message">{elements}</div>;
}

function InlineMarkdown({ text }) {
  // Process **bold**, *italic*, `code`
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const codeMatch = remaining.match(/`(.+?)`/);

    const matches = [
      boldMatch && { type: 'bold', match: boldMatch },
      italicMatch && { type: 'italic', match: italicMatch },
      codeMatch && { type: 'code', match: codeMatch },
    ].filter(Boolean).sort((a, b) => a.match.index - b.match.index);

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const { type, match } = matches[0];
    if (match.index > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, match.index)}</span>);
    }
    if (type === 'bold') parts.push(<strong key={key++}>{match[1]}</strong>);
    else if (type === 'italic') parts.push(<em key={key++}>{match[1]}</em>);
    else if (type === 'code') parts.push(<code key={key++}>{match[1]}</code>);
    remaining = remaining.slice(match.index + match[0].length);
  }
  return <>{parts}</>;
}

// ─── SCORE BAR ───────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max = 10 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="eyebrow">{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{value}/{max}</span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }} className="fade-in">
      <AvatarBubble />
      <div style={{
        background: 'var(--bg1)', border: '1px solid var(--line)',
        padding: '10px 14px', borderRadius: '4px 12px 12px 4px',
      }}>
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function AvatarBubble() {
  return (
    <div style={{
      width: 26, height: 26, background: 'var(--accent-dim)',
      border: '1px solid var(--accent)', borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent-light)' }}>AI</span>
    </div>
  );
}

// ─── SMART TIP COMPONENT ─────────────────────────────────────────────────────
function SmartTip({ stage, appState }) {
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setTip(null);
    setLoading(true);
    getSmartTip(stage, appState).then(t => {
      if (!cancelled) { setTip(t); setLoading(false); }
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [stage]);

  if (!tip && !loading) return null;

  return (
    <div className="tip-card fade-in" style={{ marginBottom: 12 }}>
      <span className="tip-icon">💡</span>
      <div>
        <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--accent)' }}>Pro Tip</div>
        <div className="tip-text">{loading ? 'Loading tip…' : tip}</div>
      </div>
    </div>
  );
}

// ─── THESIS CARD ─────────────────────────────────────────────────────────────
function ThesisCard({ thesis, scores }) {
  if (!thesis) return null;
  const overall = Math.round((scores.clarity + scores.arguability + scores.specificity + (scores.sophistication || 0)) / 4 * 10) / 10;
  const tierColor = overall >= 7 ? 'var(--green)' : overall >= 5 ? 'var(--amber)' : 'var(--red)';
  const tier = overall >= 7 ? 'Strong' : overall >= 5 ? 'Developing' : 'Needs Work';

  return (
    <div className="card fade-in" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="eyebrow">Thesis Draft</span>
        <span className="badge" style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}` }}>
          {tier} · {overall}/10
        </span>
      </div>
      <div style={{
        fontStyle: 'italic', color: 'var(--t2)', fontSize: 12.5,
        lineHeight: 1.75, marginBottom: 12, padding: '8px 0',
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'
      }}>
        "{thesis}"
      </div>
      <div>
        {[
          { label: 'Clarity', value: scores.clarity },
          { label: 'Arguability', value: scores.arguability },
          { label: 'Specificity', value: scores.specificity },
          { label: 'Sophistication', value: scores.sophistication || 0 },
        ].map(m => <ScoreBar key={m.label} label={m.label} value={m.value} />)}
        {scores.feedback && (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>
            {scores.feedback}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SOURCE CARD ─────────────────────────────────────────────────────────────
function SourceCard({ source, index, onRemove, onFormat }) {
  const [expanded, setExpanded] = useState(false);
  const [citations, setCitations] = useState(null);
  const [formatting, setFormatting] = useState(false);
  const color = source.evaluation?.credibility >= 7 ? 'var(--green)'
              : source.evaluation?.credibility >= 5 ? 'var(--amber)' : 'var(--red)';

  const handleFormat = async () => {
    setFormatting(true);
    const result = await formatCitation(source);
    setCitations(result);
    onFormat(index, result);
    setFormatting(false);
  };

  return (
    <div className="card card-sm fade-in" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--t1)', marginBottom: 2 }}>
            {source.title || 'Untitled Source'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)' }}>
            {source.author} {source.publicationDate && `· ${source.publicationDate}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {source.evaluation && (
            <span style={{ fontSize: 11, fontWeight: 700, color }}>{source.evaluation.credibility}/10</span>
          )}
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setExpanded(e => !e)} title="Details">
            {expanded ? '▴' : '▾'}
          </button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onRemove(index)} title="Remove">✕</button>
        </div>
      </div>

      {expanded && source.evaluation && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 8 }}>{source.evaluation.feedback}</div>
          {source.evaluation.strengths?.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              {source.evaluation.strengths.map((s, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--green)', display: 'flex', gap: 6 }}>
                  <span>✓</span><span>{s}</span>
                </div>
              ))}
            </div>
          )}
          {source.evaluation.concerns?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {source.evaluation.concerns.map((c, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--amber)', display: 'flex', gap: 6 }}>
                  <span>⚠</span><span>{c}</span>
                </div>
              ))}
            </div>
          )}

          {citations ? (
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Citations</div>
              {['mla', 'apa', 'chicago'].map(style => (
                <div key={style} style={{ marginBottom: 6 }}>
                  <div className="eyebrow" style={{ marginBottom: 3, fontSize: 8 }}>{style.toUpperCase()}</div>
                  <div className="citation-block">{citations[style]}</div>
                </div>
              ))}
            </div>
          ) : (
            <button className="btn btn-sm" onClick={handleFormat} disabled={formatting}>
              {formatting ? 'Formatting…' : '📋 Format Citations'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── REVISION PANEL ──────────────────────────────────────────────────────────
function RevisionPanel({ checklist }) {
  if (!checklist) return null;
  const categories = [
    { key: 'argumentStrength', label: 'Argument', weight: '30%' },
    { key: 'evidenceQuality',  label: 'Evidence',  weight: '25%' },
    { key: 'structure',        label: 'Structure',  weight: '20%' },
    { key: 'writingClarity',   label: 'Writing',    weight: '15%' },
    { key: 'citations',        label: 'Citations',  weight: '10%' },
  ];
  const priorityColor = { Critical: 'var(--red)', Important: 'var(--amber)', Polish: 'var(--green)' };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Overall Score</div>
          <ScoreBar label="Paper Quality" value={checklist.overallScore} />
        </div>
      </div>
      {checklist.encouragement && (
        <div className="tip-card" style={{ marginBottom: 12 }}>
          <span className="tip-icon">🎉</span>
          <div className="tip-text">{checklist.encouragement}</div>
        </div>
      )}
      {checklist.topPriority && (
        <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 4, padding: '8px 12px', marginBottom: 12 }}>
          <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 4 }}>Top Priority Fix</div>
          <div style={{ fontSize: 12, color: 'var(--t2)' }}>{checklist.topPriority}</div>
        </div>
      )}
      {categories.map(cat => {
        const data = checklist[cat.key];
        if (!data) return null;
        const pc = priorityColor[data.priority] || 'var(--t3)';
        return (
          <div key={cat.key} className="card card-sm" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 12 }}>{cat.label}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)', marginLeft: 6 }}>{cat.weight}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: pc }}>{data.priority}</span>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{data.score}/10</span>
              </div>
            </div>
            <div className="meter-track" style={{ marginBottom: 8 }}>
              <div className="meter-fill" style={{ width: `${data.score * 10}%`, background: data.score >= 7 ? 'var(--green)' : data.score >= 5 ? 'var(--amber)' : 'var(--red)' }} />
            </div>
            {data.improvements?.map((imp, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--t3)', display: 'flex', gap: 6, marginTop: 3 }}>
                <span style={{ color: pc }}>→</span><span>{imp}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── EXPORT FUNCTION ──────────────────────────────────────────────────────────
function exportPaper(appState) {
  const lines = [
    `# Research Paper Export`,
    ``,
    `**Research Question:** ${appState.researchQuestion || 'Not set'}`,
    ``,
    `**Thesis:** ${appState.thesis || 'Not set'}`,
    ``,
    `---`,
    ``,
    `## Draft`,
    ``,
    appState.draft || '*(No draft yet)*',
    ``,
    `---`,
    ``,
    `## Sources (${(appState.sources || []).length})`,
    ``,
    ...(appState.sources || []).map((s, i) =>
      `${i + 1}. **${s.title}** — ${s.author} (${s.publicationDate})\n   ${s.url || ''}\n   ${s.citations?.mla || ''}`
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'research-paper.md'; a.click();
  URL.revokeObjectURL(url);
}

// ─── STAGE CONFIGS ────────────────────────────────────────────────────────────
const QUICK_REPLIES = {
  topic: ['Climate & environment', 'AI & society', 'Mental health', 'Criminal justice', 'Economic inequality', 'Global health'],
  thesis: ['Evaluate my thesis', 'Make it more specific', 'Is it arguable enough?', 'Help me add nuance'],
  planning: ['Generate full research plan', 'What databases should I use?', 'Suggest search terms', 'Help me narrow my focus'],
  sources: [],
  outline: ['Build outline from my thesis', 'Review my structure', 'Add a counterargument section', 'Strengthen my intro'],
  drafting: ['Evaluate this paragraph', 'Help with my intro', 'Check my conclusion', 'Improve transitions'],
  revision: ['Run full revision check', 'Check argument strength', 'Review citations', 'Improve writing clarity'],
};

const INITIAL_MESSAGES = {
  topic: `**Hello! I'm Dr. Morgan**, your research mentor. 👋\n\nI'm here to help you discover a killer research question — one that's focused, arguable, and genuinely interesting to you.\n\nWhat broad subject are you drawn to? Don't worry about being specific yet — just tell me what excites you.`,
  thesis: `**Hi, I'm Professor Chen.** Let's build a thesis that makes an argument worth making.\n\nShare what you have — even if it's rough — and I'll give you honest, specific feedback on clarity, arguability, and sophistication.`,
  planning: `**I'm Dr. Rivera**, your research planning expert. 📚\n\nTell me your research question and I'll build you a complete research roadmap — with specific databases, search terms, source types, and a timeline.`,
  sources: `**I'm Dr. Kim**, your source credibility expert. 🔍\n\nAdd sources below and I'll evaluate them using SIFT + CRAAP methodology. I'll also auto-format citations in MLA, APA, and Chicago.`,
  outline: `**I'm Professor Williams.** A great paper starts with a great skeleton.\n\nDescribe your argument structure, or ask me to build an outline from your thesis. I'll make sure every section earns its place.`,
  drafting: `**I'm Maya**, your writing coach. ✍️\n\nPaste a paragraph and I'll give you specific, line-level feedback using the PEEL framework. We'll work through it section by section.`,
  revision: `**I'm Dr. Taylor**, your editor. 📝\n\nPaste your full draft below and I'll run a comprehensive revision analysis across argument, evidence, structure, writing clarity, and citations.`,
};

// ─── MAIN WORKSPACE ──────────────────────────────────────────────────────────
function Workspace({ currentStage, appState, onStageComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thesisScores, setThesisScores] = useState(appState.thesisScores || { clarity: 0, arguability: 0, specificity: 0, sophistication: 0 });
  const [activeTab, setActiveTab] = useState('chat');
  const [sources, setSources] = useState(appState.sources || []);
  const [newSource, setNewSource] = useState({ title: '', author: '', url: '', publicationDate: '', type: 'Website' });
  const [addingSource, setAddingSource] = useState(false);
  const [revisionChecklist, setRevisionChecklist] = useState(appState.revisionFeedback || null);
  const [runningRevision, setRunningRevision] = useState(false);
  const [draft, setDraft] = useState(appState.draft || '');
  const chatEndRef = useRef(null);
  const stageId = currentStage.id;

  // Scroll chat to bottom
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  // Reset on stage change
  useEffect(() => {
    setMessages([{ role: 'assistant', content: INITIAL_MESSAGES[stageId] || 'Let\'s get started.' }]);
    setActiveTab('chat');
    if (stageId === 'thesis' && appState.thesis) evaluateThesisScores(appState.thesis);
    if (stageId === 'sources') setSources(appState.sources || []);
    if (stageId === 'revision') setRevisionChecklist(appState.revisionFeedback || null);
    if (stageId === 'drafting') setDraft(appState.draft || '');
  }, [stageId]);

  const evaluateThesisScores = async (thesis) => {
    try {
      const result = await evaluateThesis(thesis);
      const scores = {
        clarity: result.clarity || 0,
        arguability: result.arguability || 0,
        specificity: result.specificity || 0,
        sophistication: result.sophistication || 0,
        feedback: result.feedback,
      };
      setThesisScores(scores);
      return scores;
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let prompt = userMessage;
      if (stageId === 'thesis') {
        // If looks like a thesis statement, kick off evaluation too
        if (userMessage.length > 30 && !userMessage.endsWith('?')) {
          evaluateThesisScores(userMessage).then(scores => {
            if (scores) {
              onStageComplete({ thesis: userMessage, thesisScores: scores });
            }
          });
        }
      }
      if (stageId === 'drafting' && draft) {
        prompt = `Thesis: "${appState.thesis}"\n\nParagraph to evaluate:\n${userMessage}`;
      }

      const response = await callAI(stageId, prompt, messages.slice(-8));
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Auto-detect research question
      if (stageId === 'topic') {
        const rqMatch = response.match(/[Rr]esearch question:\s*"([^"]+)"/);
        if (rqMatch) {
          onStageComplete({ researchQuestion: rqMatch[1], topic: userMessage });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection issue. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSource.title.trim()) return;
    setAddingSource(true);
    const evaluation = await evaluateSource(newSource);
    const sourceWithEval = { ...newSource, evaluation, id: Date.now() };
    const updated = [...sources, sourceWithEval];
    setSources(updated);
    onStageComplete({ sources: updated });
    setNewSource({ title: '', author: '', url: '', publicationDate: '', type: 'Website' });
    setAddingSource(false);
    setActiveTab('sources');
  };

  const handleRemoveSource = (index) => {
    const updated = sources.filter((_, i) => i !== index);
    setSources(updated);
    onStageComplete({ sources: updated });
  };

  const handleFormatCitation = (index, citations) => {
    const updated = sources.map((s, i) => i === index ? { ...s, citations } : s);
    setSources(updated);
    onStageComplete({ sources: updated });
  };

  const handleRunRevision = async () => {
    if (!draft.trim()) return;
    setRunningRevision(true);
    const checklist = await generateRevisionChecklist(draft, appState.thesis || '');
    setRevisionChecklist(checklist);
    onStageComplete({ revisionFeedback: checklist, draft });
    setRunningRevision(false);
  };

  const handleSaveDraft = () => {
    onStageComplete({ draft });
  };

  // ─── TABS: which tabs show per stage ────────────────────────────────────────
  const getTabs = () => {
    const tabs = [{ id: 'chat', label: 'Coach' }];
    if (stageId === 'thesis') tabs.push({ id: 'scores', label: 'Scores' });
    if (stageId === 'sources') tabs.push({ id: 'sources', label: `Sources (${sources.length})` }, { id: 'add', label: '+ Add' });
    if (stageId === 'drafting') tabs.push({ id: 'draft', label: 'Draft' });
    if (stageId === 'revision') tabs.push({ id: 'revision', label: 'Checklist' }, { id: 'draft', label: 'Draft' });
    return tabs;
  };

  // ─── PANEL CONTENT ───────────────────────────────────────────────────────────
  const renderPanelContent = () => {
    if (activeTab === 'chat') return renderChat();
    if (activeTab === 'scores') return (
      <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
        <ThesisCard thesis={appState.thesis} scores={thesisScores} />
        <div style={{ marginTop: 8 }}>
          <SmartTip stage={stageId} appState={appState} />
        </div>
      </div>
    );
    if (activeTab === 'sources') return (
      <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
        {sources.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--t3)', marginTop: 40 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
            <div>No sources yet. Use "Add" tab to log your first source.</div>
          </div>
        ) : sources.map((s, i) => (
          <SourceCard key={s.id || i} source={s} index={i}
            onRemove={handleRemoveSource} onFormat={handleFormatCitation} />
        ))}
      </div>
    );
    if (activeTab === 'add') return (
      <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
        <SmartTip stage={stageId} appState={appState} />
        <div className="card">
          <div className="section-header">
            <span className="eyebrow">Add New Source</span>
          </div>
          {[
            { field: 'title', label: 'Title *', placeholder: 'Article or book title' },
            { field: 'author', label: 'Author', placeholder: 'Last, First' },
            { field: 'url', label: 'URL', placeholder: 'https://...' },
            { field: 'publicationDate', label: 'Date', placeholder: '2024' },
          ].map(f => (
            <div key={f.field} style={{ marginBottom: 10 }}>
              <div className="label" style={{ marginBottom: 4 }}>{f.label}</div>
              <input className="input" placeholder={f.placeholder}
                value={newSource[f.field]}
                onChange={e => setNewSource(prev => ({ ...prev, [f.field]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 4 }}>Source Type</div>
            <select className="select" value={newSource.type}
              onChange={e => setNewSource(prev => ({ ...prev, type: e.target.value }))}>
              {['Website', 'Journal Article', 'Book', 'News Article', 'Government Report', 'Documentary', 'Interview'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddSource} disabled={addingSource || !newSource.title}>
            {addingSource ? '⏳ Evaluating…' : '✓ Add & Evaluate Source'}
          </button>
        </div>
      </div>
    );
    if (activeTab === 'draft') return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, gap: 10, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="eyebrow">Paper Draft</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" onClick={handleSaveDraft}>Save</button>
            <button className="btn btn-sm" onClick={() => exportPaper({ ...appState, draft, sources })}>
              ↓ Export
            </button>
          </div>
        </div>
        <textarea
          className="textarea"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Write your paper here…"
          style={{ flex: 1, minHeight: 400, resize: 'none', fontFamily: 'Georgia, serif', fontSize: 13.5, lineHeight: 1.9 }}
        />
        {stageId === 'revision' && (
          <button className="btn btn-primary" onClick={handleRunRevision} disabled={runningRevision || !draft.trim()}>
            {runningRevision ? '⏳ Analyzing…' : '🔍 Run Full Revision Analysis'}
          </button>
        )}
      </div>
    );
    if (activeTab === 'revision') return (
      <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
        {revisionChecklist ? (
          <RevisionPanel checklist={revisionChecklist} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--t3)', marginTop: 40 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
            <div style={{ marginBottom: 16 }}>No revision analysis yet.</div>
            <button className="btn btn-primary" onClick={handleRunRevision} disabled={runningRevision || !draft.trim()}>
              {runningRevision ? '⏳ Analyzing…' : 'Run Revision Analysis'}
            </button>
            {!draft.trim() && <div style={{ color: 'var(--amber)', fontSize: 11, marginTop: 8 }}>Add your draft in the Draft tab first</div>}
          </div>
        )}
      </div>
    );
    return renderChat();
  };

  // ─── CHAT ────────────────────────────────────────────────────────────────────
  const renderChat = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {stageId === 'thesis' && appState.thesis && activeTab === 'chat' && (
        <ThesisCard thesis={appState.thesis} scores={thesisScores} />
      )}

      {messages.map((msg, i) => (
        <div key={i} style={{
          display: 'flex',
          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end', gap: 8,
        }} className="fade-in">
          {msg.role === 'assistant' && <AvatarBubble />}
          <div style={{
            maxWidth: '75%', padding: '10px 14px',
            background: msg.role === 'assistant' ? 'var(--bg1)' : 'var(--accent-dim)',
            border: `1px solid ${msg.role === 'assistant' ? 'var(--line)' : 'var(--accent)'}`,
            borderRadius: msg.role === 'assistant' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
            fontSize: 12.5, lineHeight: 1.75,
          }}>
            {msg.role === 'assistant' ? <MarkdownText text={msg.content} /> : (
              <span style={{ color: 'var(--t1)' }}>{msg.content}</span>
            )}
          </div>
        </div>
      ))}

      {isLoading && <TypingIndicator />}

      {/* Quick replies */}
      {!isLoading && QUICK_REPLIES[stageId]?.length > 0 && messages.length < 3 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
          {QUICK_REPLIES[stageId].map((r, i) => (
            <button key={i} className="chip" onClick={() => setInputValue(r)}>{r}</button>
          ))}
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );

  // ─── STAGE COMPLETE BUTTON ────────────────────────────────────────────────────
  const canAdvance = () => {
    if (stageId === 'topic') return !!appState.researchQuestion;
    if (stageId === 'thesis') return !!appState.thesis;
    if (stageId === 'sources') return sources.length >= 1;
    if (stageId === 'drafting') return draft.length > 100;
    return messages.length > 2;
  };

  const handleAdvance = () => {
    const data = {};
    if (stageId === 'drafting') data.draft = draft;
    if (stageId === 'sources') data.sources = sources;
    onStageComplete(data);
  };

  const tabs = getTabs();

  return (
    <div style={{ flex: 1, height: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{
        height: 46, borderBottom: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="badge badge-accent">Stage {String(Object.keys(INITIAL_MESSAGES).indexOf(stageId) + 1).padStart(2, '0')}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{currentStage.name}</span>
          {appState.researchQuestion && (
            <span style={{ fontSize: 11, color: 'var(--t3)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              · {appState.researchQuestion}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => exportPaper({ ...appState, draft, sources })} title="Export paper">↓ Export</button>
          {canAdvance() && (
            <button className="btn btn-primary btn-sm" onClick={handleAdvance}>Next Stage →</button>
          )}
        </div>
      </div>

      {/* ── Tab bar ── */}
      {tabs.length > 1 && (
        <div className="tab-bar" style={{ flexShrink: 0, padding: '0 16px' }}>
          {tabs.map(t => (
            <div key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </div>
          ))}
        </div>
      )}

      {/* ── Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderPanelContent()}
      </div>

      {/* ── Input bar (only for chat tab) ── */}
      {activeTab === 'chat' && (
        <div style={{
          borderTop: '1px solid var(--line)', padding: '10px 16px',
          display: 'flex', gap: 10, background: 'var(--bg1)', flexShrink: 0,
        }}>
          <input
            className="input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder={stageId === 'thesis' ? 'Paste or type your thesis statement…' : stageId === 'drafting' ? 'Paste a paragraph to evaluate…' : 'Message your coach…'}
            style={{ flex: 1, height: 38 }}
            disabled={isLoading}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{ height: 38, padding: '0 18px' }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default Workspace;
