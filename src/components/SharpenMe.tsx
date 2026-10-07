import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question, Domain, Difficulty, ErrorCategory } from '../types';
import { adaptiveEngine } from '../data/adaptiveEngine';
import { ArrowRight, Lightbulb, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SharpenMe: React.FC = () => {
  const { recordAttempt } = useApp();

  const [currentDomain, setCurrentDomain] = useState<Domain>('quantitative');
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(5);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => 
    adaptiveEngine.getNextAdaptiveQuestion('quantitative', 5, 75)
  );

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintStage, setHintStage] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [diagnosis, setDiagnosis] = useState<{ title: string; desc: string } | null>(null);

  const loadNextQuestion = (nextDom?: Domain, nextDiff?: Difficulty) => {
    const d = nextDom || currentDomain;
    const diff = nextDiff || currentDifficulty;
    const nextQ = adaptiveEngine.getNextAdaptiveQuestion(d, diff, sessionStreak > 2 ? 90 : 60);
    setCurrentQuestion(nextQ);
    setSelectedOption(null);
    setShowExplanation(false);
    setHintStage(0);
    setDiagnosis(null);
    setStartTime(Date.now());
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    let errorCategory: ErrorCategory | undefined = undefined;

    if (isCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      setSessionStreak(prev => prev + 1);
      if (timeSpent < currentQuestion.estimatedTimeSeconds && currentDifficulty < 10) {
        setCurrentDifficulty(prev => (prev + 1) as Difficulty);
      }
      setDiagnosis({
        title: 'Diagnosis: Accurate Reasoning Execution',
        desc: `Solved in ${timeSpent}s (Estimated target: ${currentQuestion.estimatedTimeSeconds}s). Recognition speed verified.`
      });
    } else {
      setSessionStreak(0);
      if (timeSpent < 15) {
        errorCategory = 'rushed';
        setDiagnosis({
          title: 'Diagnosis: Rushed Execution Error',
          desc: `You submitted an answer in only ${timeSpent}s. Pattern recognition requires minimum structural verification.`
        });
      } else if (timeSpent > currentQuestion.estimatedTimeSeconds * 1.5) {
        errorCategory = 'overthought';
        setDiagnosis({
          title: 'Diagnosis: Overthinking & Time Sink',
          desc: `Took ${timeSpent}s. You got bogged down in intermediate steps instead of isolating the core transform rule.`
        });
      } else {
        errorCategory = 'pattern_not_recognised';
        setDiagnosis({
          title: 'Diagnosis: Pattern Recognition Error',
          desc: `Underlying skill [${currentQuestion.skill}] failed under current difficulty level ${currentDifficulty}.`
        });
      }

      if (currentDifficulty > 1) {
        setCurrentDifficulty(prev => (prev - 1) as Difficulty);
      }
    }

    recordAttempt({
      questionId: currentQuestion.id,
      domain: currentQuestion.domain,
      skill: currentQuestion.skill,
      difficulty: currentQuestion.difficulty,
      userAnswer: selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
      hintsUsed: hintStage,
      errorCategory
    });

    setShowExplanation(true);
  };

  const handleDomainChange = (dom: Domain) => {
    setCurrentDomain(dom);
    loadNextQuestion(dom, currentDifficulty);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crosshair size={20} color="var(--cyan-accent)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              SHARPEN ME <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>• Adaptive Weakness Hunter</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            System continuously adjusts problem depth based on live accuracy and response cadence.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Level</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
              Level {currentDifficulty} / 10
            </div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--cyan-accent)', textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {sessionStreak} 🔥
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['quantitative', 'abstract', 'reading', 'writing'] as const).map(dom => (
          <button
            key={dom}
            onClick={() => handleDomainChange(dom)}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: currentDomain === dom ? 700 : 500,
              textTransform: 'capitalize',
              border: currentDomain === dom ? '1px solid var(--cyan-accent)' : '1px solid var(--border-color)',
              background: currentDomain === dom ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.4)',
              color: currentDomain === dom ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {dom}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SKILL: {currentQuestion.skill}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Est Time: {currentQuestion.estimatedTimeSeconds}s
          </span>
        </div>

        {currentQuestion.passage && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderLeft: '3px solid var(--cyan-accent)', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {currentQuestion.passage}
          </div>
        )}

        {currentQuestion.visualPattern && (
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
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
            {hintStage === 1 && `Focus on the relationship between position n and operational modifiers.`}
            {hintStage === 2 && `Identify how common distractors attempt to trick you into skipping step 2.`}
            {hintStage === 3 && `Key Step: ${currentQuestion.explanation.split('\n')[0]}`}
          </div>
        )}

        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentQuestion.options.map((opt, idx) => {
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
                btnStyle.color = '#fff';
              }

              if (showExplanation) {
                if (opt === currentQuestion.correctAnswer) {
                  btnStyle.border = '1px solid var(--emerald-accent)';
                  btnStyle.background = 'rgba(16, 185, 129, 0.2)';
                  btnStyle.color = '#fff';
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
        ) : null}
      </div>

      {!showExplanation ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setHintStage(prev => Math.min(3, prev + 1))}
            className="btn-secondary"
            disabled={hintStage >= 3}
          >
            <Lightbulb size={16} color="var(--amber-accent)" /> Hint ({hintStage}/3)
          </button>

          <button
            onClick={handleConfirmAnswer}
            disabled={!selectedOption}
            className="btn-primary"
            style={{ opacity: selectedOption ? 1 : 0.5 }}
          >
            Confirm Choice <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: selectedOption === currentQuestion.correctAnswer ? '4px solid var(--emerald-accent)' : '4px solid var(--rose-accent)' }}>
          {diagnosis && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: selectedOption === currentQuestion.correctAnswer ? 'var(--emerald-accent)' : 'var(--rose-accent)' }}>
                {diagnosis.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {diagnosis.desc}
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {currentQuestion.explanation}
          </div>

          <button
            onClick={() => loadNextQuestion()}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Next Adaptive Challenge <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
