import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question, MockTestResult } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';
import { BookOpen, ShieldCheck, Award, ArrowRight, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MockExams: React.FC = () => {
  const { recordMockTest, profile } = useApp();

  const [inExam, setInExam] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [examFinished, setExamFinished] = useState(false);
  const [lastResult, setLastResult] = useState<MockTestResult | null>(null);

  const mockQuestions = INITIAL_QUESTIONS;

  const startExam = () => {
    setInExam(true);
    setCurrentIdx(0);
    setUserAnswers({});
    setExamFinished(false);
  };

  const handleSelectOption = (opt: string) => {
    setUserAnswers(prev => ({ ...prev, [mockQuestions[currentIdx].id]: opt }));
  };

  const handleNext = () => {
    if (currentIdx < mockQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setInExam(false);
    setExamFinished(true);

    let correct = 0;
    mockQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });

    const perfIndex = Math.round(220 + (correct / mockQuestions.length) * 110);

    const result: MockTestResult = {
      id: `mock-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      totalScore: perfIndex,
      performanceIndex: perfIndex,
      domainScores: {
        quantitative: 72,
        abstract: 76,
        reading: 80,
        writing: 70
      },
      timeManagementScore: 82,
      damagingMistakes: ['Rushed ratio transformation step', 'Misinterpreted passage scope'],
      biggestImprovement: 'Abstract spatial reasoning cadence'
    };

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    recordMockTest(result);
    setLastResult(result);
  };

  if (!inExam && !examFinished) {
    return (
      <div style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--cyan-accent)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            FULL SIMULATED ASET MOCK EXAM
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '550px', margin: '0 auto 2rem' }}>
            Realistic test endurance evaluation across Quantitative, Abstract, Reading, and Writing sections. Produces a comprehensive Performance Index score.
          </p>

          <button
            onClick={startExam}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
          >
            Launch Full Mock Examination <ArrowRight size={20} />
          </button>
        </div>

        {/* History */}
        {profile.mockHistory.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Past Mock Exam History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profile.mockHistory.map((m, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>Mock Session #{idx + 1} ({m.date})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Improvement: {m.biggestImprovement}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
                      {m.performanceIndex} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/ 350 INDEX</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (examFinished && lastResult) {
    return (
      <div style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div className="glass-panel-active" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <ShieldCheck size={48} color="var(--emerald-accent)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            ASET PERFORMANCE INDEX REPORT
          </h2>

          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)', margin: '1rem 0' }}>
            {lastResult.performanceIndex} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 350 INDEX</span>
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Target Range: 310+ for elite GATE entry placement.
          </p>

          <button
            onClick={() => setExamFinished(false)}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Return to Mock Hub <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const q = mockQuestions[currentIdx];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
            SIMULATED ASET EXAM • QUESTION {currentIdx + 1} OF {mockQuestions.length}
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {q.domain.toUpperCase()} • {q.skill}
          </h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {q.prompt}
        </div>

        {q.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, idx) => {
              const selected = userAnswers[q.id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '8px',
                    border: selected ? '1px solid var(--cyan-accent)' : '1px solid var(--border-color)',
                    background: selected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontWeight: 700, marginRight: '0.75rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={!userAnswers[q.id]}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', opacity: userAnswers[q.id] ? 1 : 0.5 }}
      >
        {currentIdx === mockQuestions.length - 1 ? 'Submit Mock Exam' : 'Next Question'} <ArrowRight size={18} />
      </button>
    </div>
  );
};
