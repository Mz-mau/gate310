import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_QUESTIONS } from '../data/questions';
import { RotateCcw, AlertTriangle, Brain, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export const ErrorLab: React.FC = () => {
  const { attempts, setActiveTab } = useApp();

  const failedAttempts = attempts.filter(a => !a.isCorrect);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={24} color="var(--purple-accent)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              ERROR LAB & REPETITION ENGINE
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Permanent repository of recorded mistakes. Do not repeat mistakes — analyse and dismantle them.
          </p>
        </div>

        <div className="glass-panel-active" style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mistakes Logged</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rose-accent)', fontFamily: 'var(--font-mono)' }}>
            {failedAttempts.length}
          </div>
        </div>
      </div>

      {failedAttempts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={48} color="var(--emerald-accent)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Mistakes Recorded Yet</h3>
          <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Complete Baseline or Sharpen Me sessions. Any incorrect responses will be stored here with automatic error classification.
          </p>
          <button
            onClick={() => setActiveTab('sharpen')}
            className="btn-primary"
            style={{ margin: '0 auto' }}
          >
            Launch Sharpen Me <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {failedAttempts.map((attempt, idx) => {
            const questionMatch = INITIAL_QUESTIONS.find(q => q.id === attempt.questionId);
            return (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--rose-accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rose-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      ERROR CATEGORY: {attempt.errorCategory ? attempt.errorCategory.replace('_', ' ').toUpperCase() : 'PATTERN ERROR'}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                      {attempt.domain.toUpperCase()} • {attempt.skill}
                    </h4>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    Time Spent: {attempt.timeSpentSeconds}s • Diff Level {attempt.difficulty}
                  </div>
                </div>

                {questionMatch && (
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Question Context:</strong> {questionMatch.prompt}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--rose-accent)', fontWeight: 700 }}>Your Response:</span> {attempt.userAnswer}
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--emerald-accent)', fontWeight: 700 }}>Correct Pathway:</span> {questionMatch ? questionMatch.correctAnswer : 'See Explanation'}
                  </div>
                </div>

                {questionMatch && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'rgba(30, 41, 59, 0.4)', padding: '0.75rem', borderRadius: '6px' }}>
                    <strong>Root Cause Analysis:</strong> {questionMatch.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
