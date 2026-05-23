import React, { useState, useEffect } from 'react';
import IconRail from '../../components/IconRail';
import StagePanel from '../../components/StagePanel';
import Workspace from '../../components/Workspace';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, Cloud, Check } from 'lucide-react';

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
  thesisScores: { clarity: 0, arguability: 0, specificity: 0, sophistication: 0, feedback: '' },
  researchPlan: null,
  sources: [],
  outline: [],
  draft: '',
  revisionFeedback: null,
};

export default function ResearchCoach() {
  const { currentUser, updateResearchState, cloudStatus } = useAuth();
  
  // Local state initialized from currentUser's synced researchState or INITIAL_STATE
  const [appState, setAppState] = useState(() => {
    return currentUser?.researchState || INITIAL_STATE;
  });
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'

  // Effect to sync local state with currentUser's state if updated externally
  useEffect(() => {
    if (currentUser?.researchState) {
      // Deep check to prevent infinite loop
      if (JSON.stringify(currentUser.researchState) !== JSON.stringify(appState)) {
        setAppState(currentUser.researchState);
      }
    }
  }, [currentUser?.researchState]);

  // Debounced Auto-Save to Cloud
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Only save if different from stored state
      if (JSON.stringify(appState) !== JSON.stringify(currentUser?.researchState)) {
        setSaveStatus('saving');
        try {
          await updateResearchState(appState);
          setSaveStatus('saved');
        } catch (error) {
          console.error("Auto-save failed:", error);
          setSaveStatus('error');
        }
      }
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(delayDebounceFn);
  }, [appState]);

  const handleStageComplete = (stageData) => {
    setAppState(prev => {
      const nextStage = prev.currentStage + 1;
      const updated = {
        ...prev,
        ...stageData,
        completedStages: [...new Set([...prev.completedStages, STAGES[prev.currentStage].id])],
        currentStage: nextStage < STAGES.length ? nextStage : prev.currentStage
      };
      return updated;
    });
  };

  const handleStageNavigate = (stageIndex) => {
    if (stageIndex <= appState.completedStages.length) {
      setAppState(prev => ({ ...prev, currentStage: stageIndex }));
    }
  };

  const handleReset = async () => {
    setAppState(INITIAL_STATE);
    setSaveStatus('saving');
    try {
      await updateResearchState(INITIAL_STATE);
      setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('error');
    }
    setShowResetConfirm(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%', 
      width: '100%',
      background: 'var(--bg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Dynamic Saving Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '24px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--line2)',
        borderRadius: '20px',
        padding: '4px 10px',
        fontSize: '11px',
        pointerEvents: 'none'
      }}>
        {saveStatus === 'saving' && (
          <>
            <span className="typing-dots" style={{ width: '12px' }}><span></span><span></span><span></span></span>
            <span style={{ color: 'var(--t3)' }}>Cloud syncing...</span>
          </>
        )}
        {saveStatus === 'saved' && (
          <>
            <Check size={12} color="var(--green)" />
            <span style={{ color: 'var(--green)' }}>
              {cloudStatus.mode === 'cloud' ? 'Saved to cloud' : 'Saved locally'}
            </span>
          </>
        )}
        {saveStatus === 'error' && (
          <>
            <Cloud size={12} color="var(--red)" />
            <span style={{ color: 'var(--red)' }}>Save failed</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>
        {showResetConfirm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{
              background: 'var(--bg1)', border: '1px solid var(--line)', padding: '24px',
              maxWidth: '400px', width: '100%', margin: '16px', borderRadius: '12px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px', color: 'var(--t1)' }}>Reset Research Coach?</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--t2)', marginBottom: '16px', lineHeight: 1.75 }}>
                This will delete all stages, thesis progress, outline, sources and draft. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowResetConfirm(false)} className="btn" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleReset} className="btn btn-danger" style={{ flex: 1 }}>Reset</button>
              </div>
            </div>
          </div>
        )}

        <IconRail onReset={() => setShowResetConfirm(true)} />
        <StagePanel 
          stages={STAGES} 
          currentStage={appState.currentStage} 
          completedStages={appState.completedStages} 
          onStageNavigate={handleStageNavigate} 
          appState={appState} 
        />
        <Workspace 
          currentStage={STAGES[appState.currentStage]} 
          appState={appState} 
          onStageComplete={handleStageComplete} 
        />
      </div>
    </div>
  );
}
