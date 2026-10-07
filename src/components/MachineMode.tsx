import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { adaptiveEngine } from '../data/adaptiveEngine';
import { Zap, Timer, Flame, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export const MachineMode: React.FC = () => {
  const { recordAttempt } = useApp();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15s per rapid question
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    adaptiveEngine.generateDynamicQuestion('quantitative', 6)
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sessionFinished, setSessionFinished] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && !sessionFinished) {
      if (timeLeft > 0) {
        timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      } else {
        // Time expired for this question -> auto record as fail & advance
        handleAnswer(null, true);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, sessionFinished]);

  const startMachineSession = () => {
    setIsRunning(true);
    setQuestionCount(0);
    setCorrectCount(0);
    setSessionFinished(false);
    setTimeLeft(15);
    setCurrentQuestion(adaptiveEngine.generateDynamicQuestion('quantitative', 6));
  };

  const handleAnswer = (option: string | null, timedOut = false) => {
    const isCorrect = !timedOut && option === currentQuestion.correctAnswer;
    const timeSpent = 15 - timeLeft;

    recordAttempt({
      questionId: currentQuestion.id,
      domain: currentQuestion.domain,
      skill: currentQuestion.skill,
      difficulty: currentQuestion.difficulty,
      userAnswer: option || 'TIMEOUT',
      isCorrect,
      timeSpentSeconds: timeSpent > 0 ? timeSpent : 15,
      hintsUsed: 0,
      errorCategory: timedOut ? 'time_pressure' : isCorrect ? undefined : 'rushed'
    });

    if (isCorrect) setCorrectCount(prev => prev + 1);

    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    if (nextCount >= 10) {
      setIsRunning(false);
      setSessionFinished(true);
    } else {
      // Pick random domain for mixed machine pressure
      const domains = ['quantitative', 'abstract', 'reading'] as const;
      const randomDom = domains[Math.floor(Math.random() * domains.length)];
      const nextDiff = (Math.min(10, 5 + Math.floor(nextCount / 2))) as any;
      setCurrentQuestion(adaptiveEngine.generateDynamicQuestion(randomDom, nextDiff));
      setSelectedOption(null);
      setTimeLeft(12); // Speed up timer as questions progress!
    }
  };

  if (!isRunning && !sessionFinished) {
    return (
      <div style={{ maxWidth: '750px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--rose-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Zap size={36} color="var(--rose-accent)" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
            MACHINE MODE ⚡
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '550px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            High-velocity cognitive pressure drill. Strict 12-15s timer per problem. Mixed domains. No immediate feedback until session completion.
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ color: 'var(--rose-accent)', fontWeight: 700, marginBottom: '0.25rem' }}>⚡ MACHINE PROTOCOL RULES:</div>
            • 10 Rapid Sequential Problems<br />
            • Dynamic Decreasing Timers (15s down to 10s)<br />
            • Immediate penalty on timeout<br />
            • Performance diagnostic generated at end
          </div>

          <button
            onClick={startMachineSession}
            className="btn-danger"
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', letterSpacing: '1px' }}
          >
            ENGAGE MACHINE MODE <Zap size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (sessionFinished) {
    const accuracy = Math.round((correctCount / 10) * 100);
    return (
      <div style={{ maxWidth: '750px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel-active" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
            MACHINE MODE DRILL COMPLETE
          </h2>

          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: accuracy >= 70 ? 'var(--emerald-accent)' : 'var(--rose-accent)', fontFamily: 'var(--font-mono)', margin: '1rem 0' }}>
            {accuracy}% <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>ACCURACY</span>
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Score: {correctCount} / 10 questions under high velocity pressure.
          </p>

          <button
            onClick={startMachineSession}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            Re-engage Drill <Zap size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Top Header Timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rose-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            MACHINE DRILL • QUESTION {questionCount + 1} OF 10
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {currentQuestion.domain.toUpperCase()} • Level {currentQuestion.difficulty}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: timeLeft <= 5 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.8)', padding: '0.6rem 1.25rem', borderRadius: '8px', border: timeLeft <= 5 ? '1px solid var(--rose-accent)' : '1px solid var(--border-color)' }}>
          <Timer size={22} color={timeLeft <= 5 ? 'var(--rose-accent)' : 'var(--cyan-accent)'} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: timeLeft <= 5 ? 'var(--rose-accent)' : '#fff' }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {currentQuestion.prompt}
        </div>

        {currentQuestion.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="glass-panel"
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease'
                }}
              >
                <span style={{ fontWeight: 700, marginRight: '0.75rem', color: 'var(--rose-accent)', fontFamily: 'var(--font-mono)' }}>
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
