import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Brain, ArrowRight, MessageSquare, Bot } from 'lucide-react';

export const GateCoach: React.FC = () => {
  const { profile, masteryList } = useApp();

  const [activeQuestionQuery, setActiveQuestionQuery] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'coach'; text: string }>>([
    {
      sender: 'coach',
      text: `DIRECT COGNITIVE DIAGNOSIS:\nYour estimated index is ${profile.estimatedScore}/350. You are performing solidly in Abstract matrix transformations (78%), but losing excessive accuracy (62%) in visual sequence overlays and inverse work rates. You solve medium quantitative questions correctly but take 40% longer than ideal cadence. Today's priority: Attack speed cadence in Speed Lab.`
    }
  ]);

  const presetQuestions = [
    'What should I study today?',
    'Why am I getting visual sequences wrong?',
    'What is my weakest skill right now?',
    'Am I on track for 310+?'
  ];

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user' as const, text: queryText };
    let coachReply = '';

    if (queryText.includes('study today')) {
      coachReply = `TODAY'S MISSION:\n1. 10 mins Weakness Destroyer (Visual Sequences & Inverse Work Rates)\n2. 5 mins Speed Lab (Controlled 45s Mode)\n3. 15 mins Sharpen Me Adaptive Session. Focus on eliminating rushed calculation errors.`;
    } else if (queryText.includes('visual sequences')) {
      coachReply = `DIAGNOSIS:\nYou are rushing frame overlays without applying XOR logic step-by-step. Stop combining shapes mentally in one jump. Separate outer vertex movements from inner line cancellations.`;
    } else if (queryText.includes('weakest skill')) {
      const w = masteryList.find(m => m.status === 'Weakness') || masteryList[0];
      coachReply = `WEAKEST SKILL DETECTED:\n${w.skill} (${w.accuracy}% accuracy, ${w.avgTimeSeconds}s avg time). You are overthinking intermediate steps. Practice 5 targeted variations in Weakness Destroyer.`;
    } else if (queryText.includes('310+')) {
      coachReply = `STATUS EVALUATION:\nCurrently estimated at ${profile.estimatedScore}/350. To reach 310+ READY, your overall accuracy must hit 88%+ with avg solving speed under 45s across all 4 domains. Keep pushing.`;
    } else {
      coachReply = `COGNITIVE COACH RESPONSE:\nTo achieve 310+, eliminate assumptions. Analyze distractor strategies before choosing answers. Focus today on your lowest accuracy domains.`;
    }

    setChatLog(prev => [...prev, userMsg, { sender: 'coach', text: coachReply }]);
    setCustomQuery('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '4px solid var(--purple-accent)' }}>
        <Bot size={32} color="var(--purple-accent)" />
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            GATE COACH • AI COGNITIVE LAB CONSULTANT
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Brutally honest performance analysis. Zero fluff. Pure data-driven strategy.
          </p>
        </div>
      </div>

      {/* Preset Action Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(pq)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Chat Display Area */}
      <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '350px', maxHeight: '500px', overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              background: msg.sender === 'user' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.8)',
              border: msg.sender === 'user' ? '1px solid var(--cyan-accent)' : '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'var(--cyan-accent)' : 'var(--purple-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '0.25rem' }}>
              {msg.sender === 'user' ? 'CANDIDATE' : 'GATE AI COACH'}
            </div>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={customQuery}
          onChange={e => setCustomQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk(customQuery)}
          placeholder="Ask GATE Coach (e.g., What is my weakest skill?)"
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#fff',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button
          onClick={() => handleAsk(customQuery)}
          className="btn-primary"
        >
          Consult Coach <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
