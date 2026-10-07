import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  Brain, 
  Zap, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile, masteryList, setActiveTab } = useApp();

  const weaknesses = masteryList.filter(m => m.status === 'Weakness');

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Top Banner / Hero Header */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '0.5rem' }}>
              COGNITIVE REASONING LAB • YEAR 9 ASET
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
              TRAIN FOR <span style={{ color: 'var(--cyan-accent)', textShadow: '0 0 20px rgba(56,189,248,0.4)' }}>310+</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px' }}>
              Sharpen your reasoning. Increase your speed. Eliminate your weaknesses.
            </p>
          </div>

          {/* Large Score Gauge */}
          <div className="glass-panel-active" style={{ padding: '1.25rem 2rem', textAlign: 'center', minWidth: '220px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              ESTIMATED INDEX
            </div>
            <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {profile.estimatedScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>/ 350</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--emerald-accent)', fontWeight: 600, marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <TrendingUp size={14} /> Target 310+ Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Questions Solved</span>
            <Brain size={18} color="var(--cyan-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {profile.totalQuestionsCompleted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Across 4 ASET domains
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Overall Accuracy</span>
            <CheckCircle2 size={18} color="var(--emerald-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-accent)', fontFamily: 'var(--font-mono)' }}>
            {profile.overallAccuracy}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Target accuracy: 88%+
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Avg Response Speed</span>
            <Clock size={18} color="var(--purple-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
            {profile.avgSolvingTimeSeconds || 48}s
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Target: &lt;45s / question
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Candidate Title</span>
            <Award size={18} color="var(--amber-accent)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--amber-accent)', marginTop: '0.25rem' }}>
            {profile.rankTitle}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            XP: {profile.xp} PTS
          </div>
        </div>
      </div>

      {/* Domain Performance Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--cyan-accent)" /> ASET Domain Mastery Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>Quantitative Reasoning</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-accent)', fontWeight: 700 }}>{profile.domainScores.quantitative}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profile.domainScores.quantitative}%`, background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>Abstract Reasoning</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple-accent)', fontWeight: 700 }}>{profile.domainScores.abstract}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profile.domainScores.abstract}%`, background: 'linear-gradient(90deg, #9333ea, #c084fc)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>Reading Comprehension</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-accent)', fontWeight: 700 }}>{profile.domainScores.reading}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profile.domainScores.reading}%`, background: 'linear-gradient(90deg, #059669, #34d399)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>Written Communication</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber-accent)', fontWeight: 700 }}>{profile.domainScores.writing}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profile.domainScores.writing}%`, background: 'linear-gradient(90deg, #d97706, #fbbf24)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Mission & Quick Launch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel-active" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', letterSpacing: '1px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                RECOMMENDED ACTION
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                {profile.baselineCompleted ? 'Launch Sharpen Me Training' : 'Take Baseline Assessment'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {profile.baselineCompleted
                  ? 'Adaptive session targeting high-impact weaknesses in Abstract & Quantitative reasoning.'
                  : 'Establish your initial score baseline across all 4 ASET exam domains.'}
              </p>
            </div>
            
            <button
              onClick={() => setActiveTab(profile.baselineCompleted ? 'sharpen' : 'baseline')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {profile.baselineCompleted ? 'Start Adaptive Session' : 'Begin Baseline Test'} <ChevronRight size={18} />
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <Zap size={22} color="var(--rose-accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Machine Mode ⚡</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Strict timed high-pressure drill</div>
            </div>
            <button
              onClick={() => setActiveTab('machine')}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              Enter
            </button>
          </div>
        </div>
      </div>

      {/* Weakness Destroyer Preview */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="var(--rose-accent)" /> Detected Cognitive Weaknesses
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System identifies skill gaps requiring immediate repetition</p>
          </div>
          <button 
            onClick={() => setActiveTab('weakness')}
            style={{ background: 'transparent', border: 'none', color: 'var(--cyan-accent)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            View All in Weakness Destroyer <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {weaknesses.slice(0, 3).map((w, idx) => (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{w.skill}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--rose-accent)', fontWeight: 700 }}>{w.accuracy}%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Domain: <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{w.domain}</span> • Avg {w.avgTimeSeconds}s
              </div>
              <button
                onClick={() => setActiveTab('weakness')}
                className="btn-secondary"
                style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
              >
                Target Skill
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
