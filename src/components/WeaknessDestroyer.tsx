import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillMastery, Question } from '../types';
import { adaptiveEngine } from '../data/adaptiveEngine';
import { Target, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WeaknessDestroyer: React.FC = () => {
  const { masteryList, recordAttempt } = useApp();
  const weaknesses = masteryList.filter(m => m.status === 'Weakness' || m.accuracy < 75);

  const [selectedSkill, setSelectedSkill] = useState<SkillMastery | null>(weaknesses[0] || null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const startTargetedPractice = (skillItem: SkillMastery) => {
    setSelectedSkill(skillItem);
    const q = adaptiveEngine.generateDynamicQuestion(skillItem.domain, skillItem.currentLevel);
    setActiveQuestion(q);
    setSelectedOption(null);
    setShowExplanation(false);
    setStartTime(Date.now());
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || !activeQuestion || !selectedSkill) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = selectedOption === activeQuestion.correctAnswer;

    if (isCorrect) {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    }

    recordAttempt({
      questionId: activeQuestion.id,
      domain: activeQuestion.domain,
      skill: selectedSkill.skill,
      difficulty: activeQuestion.difficulty,
      userAnswer: selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
      hintsUsed: 0
    });

    setShowExplanation(true);
  };

  const handleNextTargetedQuestion = () => {
    if (!selectedSkill) return;
    const q = adaptiveEngine.generateDynamicQuestion(selectedSkill.domain, selectedSkill.currentLevel);
    setActiveQuestion(q);
    setSelectedOption(null);
    setShowExplanation(false);
    setStartTime(Date.now());
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', borderLeft: '4px solid var(--rose-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Target size={28} color="var(--rose-accent)" />
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              WEAKNESS DESTROYER
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Targeted skill isolation: <span style={{ color: 'var(--rose-accent)', fontWeight: 700 }}>Diagnose → Teach → Practise → Retest → Master</span>
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="var(--rose-accent)" /> Priority Target List
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {weaknesses.map((w, idx) => {
              const isSelected = selectedSkill?.skill === w.skill;
              return (
                <div
                  key={idx}
                  onClick={() => startTargetedPractice(w)}
                  className={isSelected ? 'glass-panel-active' : 'glass-panel'}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{w.skill}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--rose-accent)', fontWeight: 700 }}>
                      {w.accuracy}%
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>Domain: {w.domain}</span>
                    <span>Attempts: {w.totalAttempts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {activeQuestion && selectedSkill ? (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--rose-accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  TARGETING WEAKNESS: {selectedSkill.skill}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Level {activeQuestion.difficulty}/10
                </span>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--cyan-accent)' }}>Core Skill Protocol:</strong> Isolate the underlying transformation rule. Verify every distractor before selecting your final path.
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {activeQuestion.prompt}
              </div>

              {activeQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {activeQuestion.options.map((opt, idx) => {
                    let btnStyle: React.CSSProperties = {
                      padding: '1rem 1.25rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    };

                    if (selectedOption === opt) {
                      btnStyle.border = '1px solid var(--cyan-accent)';
                      btnStyle.background = 'rgba(56, 189, 248, 0.15)';
                    }

                    if (showExplanation) {
                      if (opt === activeQuestion.correctAnswer) {
                        btnStyle.border = '1px solid var(--emerald-accent)';
                        btnStyle.background = 'rgba(16, 185, 129, 0.2)';
                      } else if (selectedOption === opt) {
                        btnStyle.border = '1px solid var(--rose-accent)';
                        btnStyle.background = 'rgba(244, 63, 94, 0.2)';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !showExplanation && setSelectedOption(opt)}
                        style={btnStyle}
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

              {!showExplanation ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOption}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Verify Skill Execution <ArrowRight size={18} />
                </button>
              ) : (
                <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: selectedOption === activeQuestion.correctAnswer ? '4px solid var(--emerald-accent)' : '4px solid var(--rose-accent)' }}>
                  <div style={{ fontWeight: 700, color: selectedOption === activeQuestion.correctAnswer ? 'var(--emerald-accent)' : 'var(--rose-accent)', marginBottom: '0.5rem' }}>
                    {selectedOption === activeQuestion.correctAnswer ? 'Target Hit: Correct Logic' : 'Target Missed: Pattern Error'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                    {activeQuestion.explanation}
                  </div>
                  <button
                    onClick={handleNextTargetedQuestion}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Retest Skill with New Problem <RefreshCw size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a target skill from the list on the left to launch focused drill practice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
