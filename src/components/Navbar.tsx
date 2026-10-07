import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Brain, 
  Zap, 
  Target, 
  BarChart3, 
  BookOpen, 
  PenTool, 
  Clock, 
  Flame, 
  Award,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, activeTab, setActiveTab, resetAllData } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'baseline', label: 'Baseline Test', icon: Target },
    { id: 'sharpen', label: 'Sharpen Me', icon: Brain },
    { id: 'machine', label: 'Machine Mode ⚡', icon: Zap },
    { id: 'weakness', label: 'Weakness Destroyer', icon: Target },
    { id: 'errorlab', label: 'Error Lab', icon: RotateCcw },
    { id: 'speedlab', label: 'Speed Lab', icon: Clock },
    { id: 'mocks', label: 'Mock Exams', icon: BookOpen },
    { id: 'coach', label: 'GATE Coach', icon: Sparkles },
    { id: 'writing', label: 'Writing Trainer', icon: PenTool },
  ];

  return (
    <nav className="glass-panel" style={{ borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: '0.75rem 1.5rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <Brain size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
              GATE <span style={{ color: 'var(--cyan-accent)' }}>310</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
              Cognitive Lab
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', padding: '0.25rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  border: isActive ? '1px solid var(--cyan-accent)' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--cyan-accent)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Quick Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Flame size={16} color="var(--amber-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber-accent)', fontFamily: 'var(--font-mono)' }}>
              {profile.currentStreakDays}d Streak
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(168, 85, 247, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <Award size={16} color="var(--purple-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
              {profile.rankTitle}
            </span>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset training history and baseline?')) resetAllData();
            }}
            title="Reset Data"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};
