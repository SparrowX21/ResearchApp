import React, { useState, useEffect } from 'react';
import IconRail from './components/IconRail';
import StagePanel from './components/StagePanel';
import Workspace from './components/Workspace';

const STAGES = [
  { id: 'topic', name: 'Topic Discovery', shortName: 'Topic' },
  { id: 'thesis', name: 'Thesis Builder', shortName: 'Thesis' },
  { id: 'planning', name: 'Research Planning', shortName: 'Planning' },
  { id: 'sources', name: 'Source Tracker', shortName: 'Sources' },
  { id: 'outline', name: 'Outline Builder', shortName: 'Outline' },
  { id: 'drafting', name: 'Drafting Coach', shortName: 'Drafting' },
  { id: 'revision', name: 'Revision Checklist', shortName: 'Revision' },
];

const INITIAL_STATE = {
  currentStage: 0,
  completedStages: [],
  topic: '',
  researchQuestion: '',
  thesis: '',
  thesisScores: { specificity: 0, arguability: 0, clarity: 0 },
  researchPlan: null,
  sources: [],
  outline: [],
  draft: '',
  revisionFeedback: null,
};

function App() {
  const [appState, setAppState] = useState(INITIAL_STATE);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('researchPathState');
    
    if (savedState) {
      setAppState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('researchPathState', JSON.stringify(appState));
  }, [appState]);

  const handleStageComplete = (stageData) => {
    setAppState(prev => ({
      ...prev,
      ...stageData,
      completedStages: [...new Set([...prev.completedStages, STAGES[prev.currentStage].id])],
      currentStage: prev.currentStage + 1
    }));
  };

  const handleStageNavigate = (stageIndex) => {
    if (stageIndex <= appState.completedStages.length) {
      setAppState(prev => ({ ...prev, currentStage: stageIndex }));
    }
  };

  const handleReset = () => {
    setAppState(INITIAL_STATE);
    setShowResetConfirm(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'var(--bg)',
      overflow: 'hidden'
    }}>
      {showResetConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg1)',
            border: '1px solid var(--line)',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            margin: '16px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 500,
              marginBottom: '12px',
              color: 'var(--t1)'
            }}>Reset Your Progress?</h2>
            <p style={{
              fontSize: '12.5px',
              color: 'var(--t2)',
              marginBottom: '16px',
              lineHeight: 1.75
            }}>
              This will delete all your work. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <IconRail
        onReset={() => setShowResetConfirm(true)}
      />

      <StagePanel
        stages={STAGES}
        currentStage={appState.currentStage}
        completedStages={appState.completedStages}
        onStageNavigate={handleStageNavigate}
      />

      <Workspace
        currentStage={STAGES[appState.currentStage]}
        appState={appState}
        onStageComplete={handleStageComplete}
      />
    </div>
  );
}

export default App;
