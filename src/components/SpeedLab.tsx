import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { adaptiveEngine } from '../data/adaptiveEngine';
import { Clock, Zap, Target, Gauge, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SpeedLab: React.FC = () => {
  const { recordAttempt } = useApp();

  const [mode, setMode] = useState<'accuracy' | 'controlled' | 'race' | 'exam'>('controlled');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [activeQuestion, setActiveQuestion] = useState<Question>(() => adaptiveEngine.generateDynamicQuestion('quantitative', 5));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [streak, setStreak] = useState(0);
  const [bestSpeed, setBestSpeed] = useState(99);

  useEffect(() => {
    let limit = 30;
    if (mode === 'accuracy') limit = 0; // unlimited
    if (mode === 'controlled') limit = 45;
    if (mode === 'race') limit = 15;
    if (mode === 'exam') limit = 30;
    setTimeLeft(limit);
  }, [mode]);

  useEffect(() => {
    let timer: any = null;
    if (timeLeft > 0 && mode !== 'accuracy') {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, mode]);

  const handleAnswerSelect = (opt: string) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = opt === activeQuestion.correctAnswer;

    if (isCorrect) {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
      setStreak(s => s + 1);
      if (timeSpent < bestSpeed) setBestSpeed(timeSpent);
    } else {
      setStreak(0);
    }

    recordAttempt({
      questionId: activeQuestion.id,
      domain: activeQuestion.domain,
      skill: activeQuestion.skill,
      difficulty: activeQuestion.difficulty,
      userAnswer: opt,
      isCorrect,
      timeSpentSeconds: timeSpent,
      hintsUsed: 0
    });

    // Advance immediately to next speed challenge
    const nextQ = adaptiveEngine.generateDynamicQuestion('quantitative', (Math.min(10, 4 + Math.floor(streak / 2))) as any);
    setActiveQuestion(nextQ);
    setSelectedOption(null);
    setStartTime(Date.now());
    if (mode === 'controlled') setTimeLeft(45);
    if (mode === 'race') setTimeLeft(15);
    if (mode === 'exam') setTimeLeft(30);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={24} color="var(--cyan-accent)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              SPEED LAB • STRUCTURE RECOGNITION
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            "Fast because you recognise the structure — not because you rush."
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best Speed</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
              {bestSpeed === 99 ? '--' : `${bestSpeed}s`}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Speed Streak</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--amber-accent)', fontFamily: 'var(--font-mono)' }}>
              {streak} 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Speed Mode Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'accuracy', name: 'Accuracy First', desc: 'No time pressure' },
          { id: 'controlled', name: 'Controlled Speed', desc: 'Moderate 45s timer' },
          { id: 'race', name: 'Race Mode', desc: 'Aggressive 15s timer' },
          { id: 'exam', name: 'Exam Pressure', desc: 'Realistic 30s pace' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={mode === m.id ? 'glass-panel-active' : 'glass-panel'}
            style={{ padding: '0.85rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{m.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            DOMAIN: {activeQuestion.domain.toUpperCase()} • Level {activeQuestion.difficulty}
          </span>

          {mode !== 'accuracy' && (
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: timeLeft <= 5 ? 'var(--rose-accent)' : 'var(--cyan-accent)' }}>
              ⏱ {timeLeft}s
            </span>
          )}
        </div>

        <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {activeQuestion.prompt}
        </div>

        {activeQuestion.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(opt)}
                className="glass-panel"
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontWeight: 700, marginRight: '0.75rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
