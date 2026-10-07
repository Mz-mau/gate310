import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';
import { ShieldCheck, ArrowRight, Lightbulb, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BaselineTest: React.FC = () => {
  const { recordAttempt, completeBaseline, setActiveTab, profile } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('medium');
  const [hintStage, setHintStage] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const baselineQuestions = INITIAL_QUESTIONS;
  const currentQuestion: Question = baselineQuestions[currentIndex];

  const handleOptionSelect = (opt: string) => {
    if (showExplanation) return;
    setSelectedOption(opt);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }

    recordAttempt({
      questionId: currentQuestion.id,
      domain: currentQuestion.domain,
      skill: currentQuestion.skill,
      difficulty: currentQuestion.difficulty,
      userAnswer: selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
      confidence,
      hintsUsed: hintStage,
      errorCategory: isCorrect ? undefined : 'pattern_not_recognised'
    });

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < baselineQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setHintStage(0);
      setStartTime(Date.now());
    } else {
      completeBaseline();
      setTestFinished(true);
    }
  };

  if (testFinished || profile.baselineCompleted) {
    return (
      <div style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel-active" style={{ padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', border: '1px solid var(--pink-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShieldCheck size={36} color="var(--pink-accent)" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
            Baseline Assessment Complete
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1rem', maxWidth: '550px', margin: '0 auto 2rem' }}>
            Your GATE Performance Profile has been generated and saved.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--pink-light)' }}>Current Estimated Index</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--pink-accent)', fontFamily: 'var(--font-mono)' }}>
                {profile.estimatedScore} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ 350</span>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--pink-light)' }}>Target Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
                310+ READY
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
          >
            Go to Executive Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pink-accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            BASELINE ASSESSMENT • QUESTION {currentIndex + 1} OF {baselineQuestions.length}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            {currentQuestion.domain.toUpperCase()} • {currentQuestion.skill}
          </h2>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid var(--border-color)', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--pink-accent)', fontFamily: 'var(--font-mono)' }}>
          Difficulty: {currentQuestion.difficulty}/10
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        {/* NARRATIVE / STATEMENT BOX */}
        {currentQuestion.passage && (
          <div style={{ background: 'rgba(26, 16, 38, 0.9)', borderLeft: '4px solid var(--pink-accent)', padding: '1.25rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.95rem', color: '#fff', lineHeight: 1.6 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--pink-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              📖 READING PASSAGE / STATEMENT NARRATIVE
            </div>
            {currentQuestion.passage}
          </div>
        )}

        {currentQuestion.visualPattern && (
          <div style={{ background: 'rgba(38, 20, 54, 0.8)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              VISUAL REASONING SCHEMA
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {currentQuestion.visualPattern}
            </div>
          </div>
        )}

        <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {currentQuestion.prompt}
        </div>

        {hintStage > 0 && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#fef3c7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--amber-accent)', marginBottom: '0.25rem' }}>
              <Lightbulb size={16} /> Hint Level {hintStage}:
            </div>
            {hintStage === 1 && `Directional Clue: Pay attention to the transformation rule of position n.`}
            {hintStage === 2 && `Concept Clue: Skill involved is ${currentQuestion.skill}. Break down step by step.`}
            {hintStage === 3 && `First Step: ${currentQuestion.explanation.split('\n')[0]}`}
          </div>
        )}

        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentQuestion.options.map((opt, idx) => {
              let btnStyle: React.CSSProperties = {
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(26, 16, 38, 0.6)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              };

              if (selectedOption === opt) {
                btnStyle.border = '1px solid var(--pink-accent)';
                btnStyle.background = 'rgba(236, 72, 153, 0.2)';
                btnStyle.color = '#fff';
              }

              if (showExplanation) {
                if (opt === currentQuestion.correctAnswer) {
                  btnStyle.border = '1px solid var(--emerald-accent)';
                  btnStyle.background = 'rgba(16, 185, 129, 0.25)';
                  btnStyle.color = '#fff';
                } else if (selectedOption === opt) {
                  btnStyle.border = '1px solid var(--rose-accent)';
                  btnStyle.background = 'rgba(244, 63, 94, 0.25)';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
                  style={btnStyle}
                >
                  <span style={{ fontWeight: 700, marginRight: '0.75rem', color: 'var(--pink-accent)', fontFamily: 'var(--font-mono)' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        ) : null}

        {!showExplanation && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pink-light)' }}>Confidence Level:</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['low', 'medium', 'high'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setConfidence(level)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    border: confidence === level ? '1px solid var(--pink-accent)' : '1px solid var(--border-color)',
                    background: confidence === level ? 'rgba(236, 72, 153, 0.25)' : 'transparent',
                    color: confidence === level ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!showExplanation ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setHintStage(prev => Math.min(3, prev + 1))}
            className="btn-secondary"
            disabled={hintStage >= 3}
          >
            <Lightbulb size={16} color="var(--amber-accent)" /> Request Hint ({hintStage}/3)
          </button>

          <button
            onClick={handleConfirmAnswer}
            disabled={!selectedOption}
            className="btn-primary"
            style={{ opacity: selectedOption ? 1 : 0.5 }}
          >
            Confirm Reasoning Path <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: selectedOption === currentQuestion.correctAnswer ? '4px solid var(--emerald-accent)' : '4px solid var(--rose-accent)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: selectedOption === currentQuestion.correctAnswer ? 'var(--emerald-accent)' : 'var(--rose-accent)', marginBottom: '0.5rem' }}>
            {selectedOption === currentQuestion.correctAnswer ? 'Diagnosis: Correct Reasoning' : 'Diagnosis: Pattern Recognition Error'}
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {currentQuestion.explanation}
          </div>

          {currentQuestion.commonTrap && (
            <div style={{ fontSize: '0.8rem', color: 'var(--amber-accent)', background: 'rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <strong>Common Trap:</strong> {currentQuestion.commonTrap}
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Continue to Next Question <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
