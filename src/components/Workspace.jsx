import React, { useState, useEffect } from 'react';
import { callAI, evaluateThesis } from '../utils/aiService';

function Workspace({ currentStage, appState, onStageComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thesisScores, setThesisScores] = useState(appState.thesisScores || { specificity: 0, arguability: 0, clarity: 0 });

  useEffect(() => {
    if (currentStage.id === 'thesis' && appState.thesis) {
      evaluateThesisScore(appState.thesis);
    }
  }, [currentStage.id, appState.thesis]);

  const evaluateThesisScore = async (thesis) => {
    try {
      const result = await evaluateThesis(thesis);
      setThesisScores({
        specificity: Math.round((result.specificity / 10) * 100),
        arguability: Math.round((result.arguability / 10) * 100),
        clarity: Math.round((result.clarity / 10) * 100)
      });
    } catch (error) {
      console.error('Evaluation error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let prompt = userMessage;
      
      if (currentStage.id === 'topic' && !appState.researchQuestion) {
        prompt = `I want to research ${userMessage}. Help me narrow this down to a focused research question.`;
      } else if (currentStage.id === 'thesis') {
        prompt = `Here's my thesis: "${userMessage}". Evaluate it and give me feedback.`;
      }

      const response = await callAI(currentStage.id, prompt, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Auto-complete topic stage if AI suggests a research question
      if (currentStage.id === 'topic' && response.includes('research question')) {
        // Extract the research question from the response
        const questionMatch = response.match(/"([^"]+)"/);
        if (questionMatch) {
          onStageComplete({ researchQuestion: questionMatch[1], topic: userMessage });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
  };

  const getStageTitle = () => {
    const titles = {
      topic: 'Topic Discovery',
      thesis: 'Thesis Builder',
      planning: 'Research Planning',
      sources: 'Source Tracker',
      outline: 'Outline Builder',
      drafting: 'Drafting Coach',
      revision: 'Revision Checklist'
    };
    return titles[currentStage.id] || currentStage.name;
  };

  const getStageNumber = () => {
    const stageNumbers = {
      topic: '01',
      thesis: '02',
      planning: '03',
      sources: '04',
      outline: '05',
      drafting: '06',
      revision: '07'
    };
    return stageNumbers[currentStage.id] || '01';
  };

  const renderThesisCard = () => {
    if (currentStage.id !== 'thesis' || !appState.thesis) return null;

    return (
      <div style={{
        background: 'var(--bg1)',
        border: '1px solid var(--line)',
        marginBottom: '16px'
      }}>
        {/* Header */}
        <div style={{
          height: '38px',
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 12px'
        }}>
          <span className="eyebrow">THESIS DRAFT</span>
          <div style={{
            background: 'var(--bg3)',
            border: '1px solid var(--line2)',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--t1)'
          }}>
            {Math.round((thesisScores.specificity + thesisScores.arguability + thesisScores.clarity) / 3)} / 100
          </div>
        </div>

        {/* Quote body */}
        <div style={{
          padding: '12px',
          fontStyle: 'italic',
          color: 'var(--t2)',
          fontSize: '12.5px',
          lineHeight: 1.75
        }}>
          {appState.thesis}
        </div>

        {/* Meters */}
        <div style={{ padding: '12px', paddingTop: '0' }}>
          {[
            { label: 'Specificity', value: thesisScores.specificity },
            { label: 'Arguability', value: thesisScores.arguability },
            { label: 'Clarity', value: thesisScores.clarity }
          ].map((metric) => (
            <div key={metric.label} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span className="eyebrow" style={{ width: '80px' }}>{metric.label}</span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'var(--line)',
                position: 'relative',
                margin: '0 8px'
              }}>
                <div style={{
                  height: '1px',
                  background: metric.value >= 70 ? 'var(--t1)' : 'var(--t3)',
                  width: `${metric.value}%`
                }} />
                <div style={{
                  position: 'absolute',
                  right: `${100 - metric.value}%`,
                  top: '-2px',
                  width: '5px',
                  height: '5px',
                  background: metric.value >= 70 ? 'var(--t1)' : 'var(--t3)'
                }} />
              </div>
              <span style={{ fontSize: '10px', color: 'var(--t3)', minWidth: '30px', textAlign: 'right' }}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuickReplies = () => {
    if (currentStage.id === 'topic') {
      return [
        'Climate change',
        'Social media',
        'Artificial intelligence',
        'Mental health'
      ];
    }
    if (currentStage.id === 'thesis') {
      return [
        'Help me improve my thesis',
        'Is my thesis specific enough?',
        'Does my thesis make an argument?'
      ];
    }
    return [];
  };

  const getInitialMessage = () => {
    const initialMessages = {
      topic: "What subject area would you like to research? Tell me about a broad topic that interests you.",
      thesis: "Share your thesis statement, and I'll help you evaluate and improve it.",
      planning: "Let me generate a research plan based on your research question.",
      sources: "Log your sources here, and I'll help evaluate their credibility.",
      outline: "Let's build an outline for your paper together.",
      drafting: "Start writing your paper. I'll give you feedback on each paragraph.",
      revision: "I'll evaluate your draft against a rubric and provide revision suggestions."
    };
    return initialMessages[currentStage.id] || "Let's get started.";
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: getInitialMessage() }]);
    }
  }, [currentStage.id]);

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top bar */}
      <div style={{
        height: '46px',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            border: '1px solid var(--line)',
            padding: '4px 8px',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--t3)'
          }}>
            Stage {getStageNumber()}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--t1)'
          }}>
            {getStageTitle()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            width: '28px',
            height: '28px',
            border: '1px solid var(--line)',
            background: 'transparent',
            color: 'var(--t3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ○
          </button>
          <button style={{
            width: '28px',
            height: '28px',
            border: '1px solid var(--line)',
            background: 'transparent',
            color: 'var(--t3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ○
          </button>
          <button style={{
            width: '28px',
            height: '28px',
            border: '1px solid var(--line)',
            background: 'transparent',
            color: 'var(--t3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ○
          </button>
        </div>
      </div>

      {/* Chat feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {renderThesisCard()}

        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            {message.role === 'assistant' && (
              <div style={{
                width: '22px',
                height: '22px',
                background: 'var(--bg1)',
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '8px',
                  fontWeight: 700,
                  color: 'var(--t3)'
                }}>RP</span>
              </div>
            )}

            <div style={{
              maxWidth: '70%',
              background: message.role === 'assistant' ? 'var(--bg1)' : 'var(--bg2)',
              border: message.role === 'assistant' ? '1px solid var(--line)' : '1px solid var(--line2)',
              padding: '12px',
              fontSize: '12.5px',
              lineHeight: 1.75,
              color: 'var(--t2)'
            }}>
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{
              width: '22px',
              height: '22px',
              background: 'var(--bg1)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: '8px',
                fontWeight: 700,
                color: 'var(--t3)'
              }}>RP</span>
            </div>
            <div style={{
              background: 'var(--bg1)',
              border: '1px solid var(--line)',
              padding: '12px',
              fontSize: '12.5px',
              color: 'var(--t3)'
            }}>
              Thinking...
            </div>
          </div>
        )}

        {/* Quick replies */}
        {renderQuickReplies().length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {renderQuickReplies().map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="chip"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        height: '54px',
        background: 'var(--bg1)',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="input"
          style={{
            height: '34px',
            flex: 1
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="btn btn-primary"
          style={{
            height: '34px',
            padding: '0 16px',
            background: 'var(--t1)',
            border: '1px solid var(--t1)',
            color: 'var(--bg)'
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default Workspace;
