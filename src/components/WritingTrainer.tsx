import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PenTool, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WritingTrainer: React.FC = () => {
  const { recordWritingSubmission, writingHistory } = useApp();

  const [prompt, setPrompt] = useState('Prompt: "Automation will make human critical thinking more essential, not obsolete."');
  const [userText, setUserText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    setEvaluating(true);

    setTimeout(() => {
      const fb = {
        overallScore: 84,
        argumentScore: 86,
        clarityScore: 88,
        vocabularyScore: 82,
        originalityScore: 80,
        critique: 'Strong, articulate thesis. Excellent premise development linking technological reliance to high-order cognitive evaluation.',
        strengths: [
          'Defined clear causal link between AI output and human verification',
          'Used precise vocabulary ("codified", "algorithmic premise", "heuristic")'
        ],
        improvements: [
          'Strengthen the counter-argument refutation in sentence 3',
          'Ensure conclusion leaves a lasting analytical impact'
        ],
        revisedSample: 'While automated systems execute computational routines with speed, they lack contextual discernment. Consequently, critical thinking becomes not redundant, but the primary filter for algorithmic truth.'
      };

      setFeedback(fb);
      setEvaluating(false);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });

      recordWritingSubmission({
        prompt,
        userText,
        feedback: fb
      });
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '4px solid var(--amber-accent)' }}>
        <PenTool size={28} color="var(--amber-accent)" />
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            WRITTEN COMMUNICATION TRAINER
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Argument Construction, Vocabulary Control & Structural Cohesion for ASET Writing.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Writing Box */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--amber-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '0.5rem' }}>
            PERSUASIVE PROMPT
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', lineHeight: 1.4 }}>
            {prompt}
          </div>

          <textarea
            value={userText}
            onChange={e => setUserText(e.target.value)}
            placeholder="Draft your structured argument (150-250 words). Focus on clear thesis, logical premises, and refutation..."
            rows={12}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1rem',
              color: '#fff',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              marginBottom: '1rem'
            }}
          />

          <button
            onClick={handleEvaluate}
            disabled={evaluating || !userText.trim()}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {evaluating ? 'Analyzing Argument Structure...' : 'Submit for Evaluation'} <ArrowRight size={18} />
          </button>
        </div>

        {/* Right Evaluation Result */}
        <div>
          {feedback ? (
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--emerald-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>AI Evaluation Breakdown</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--amber-accent)', fontFamily: 'var(--font-mono)' }}>
                  {feedback.overallScore}/100
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  Argument: <strong>{feedback.argumentScore}/100</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  Clarity: <strong>{feedback.clarityScore}/100</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                <strong>Critique:</strong> {feedback.critique}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--emerald-accent)', marginBottom: '0.75rem' }}>
                <strong>Strengths:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                  {feedback.strengths.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                </ul>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--rose-accent)', marginBottom: '1rem' }}>
                <strong>Areas to Refine:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                  {feedback.improvements.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                </ul>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Exemplar Refinement:</strong> "{feedback.revisedSample}"
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Write your response and submit to receive instant AI evaluation on argument structure, clarity, and vocabulary sophistication.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
