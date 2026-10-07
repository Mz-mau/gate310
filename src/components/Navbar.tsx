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
  RotateCcw,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, activeTab, setActiveTab, resetAllData } = useApp();

  const navGroups = [
    {
      title: 'CORE EVALUATION',
      items: [
        { id: 'baseline', label: '1. Diagnostic Baseline', icon: Target },
        { id: 'dashboard', label: '2. Executive Dashboard', icon: BarChart3 },
      ]
    },
    {
      title: 'ADAPTIVE TRAINING LABS',
      items: [
        { id: 'sharpen', label: 'Sharpen Me Hunter', icon: Brain },
        { id: 'machine', label: 'Machine Mode ⚡', icon: Zap },
        { id: 'weakness', label: 'Weakness Destroyer', icon: Compass },
        { id: 'speedlab', label: 'Speed Cadence Lab', icon: Clock },
      ]
    },
    {
      title: 'ANALYTICS & EXAMS',
      items: [
        { id: 'errorlab', label: 'Error Vault', icon: RotateCcw },
        { id: 'mocks', label: 'ASET Mock Exam', icon: BookOpen },
        { id: 'writing', label: 'Written Trainer', icon: PenTool },
        { id: 'coach', label: 'GATE AI Coach', icon: Sparkles },
      ]
    }
  ];

  return (
    <header className="glass-panel" style={{ borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: '0.85rem 1.5rem', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(11, 7, 17, 0.92)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #ec4899 0%, #c084fc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
            }}>
              <Brain size={26} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>
                GATE <span style={{ color: 'var(--pink-accent)' }}>310</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--pink-light)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
                WA Year 9 ASET Cognitive Facility
              </div>
            </div>
          </div>

          {/* Quick Stats & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(236, 72, 153, 0.15)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              <Flame size={16} color="var(--pink-accent)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pink-accent)', fontFamily: 'var(--font-mono)' }}>
                {profile.currentStreakDays}d Streak
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(192, 132, 252, 0.15)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
              <Award size={16} color="var(--purple-accent)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
                {profile.rankTitle} ({profile.estimatedScore}/350)
              </span>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset training history and baseline?')) resetAllData();
              }}
              title="Reset Saved Data"
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--rose-accent)',
                cursor: 'pointer',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Categorized Easy-Nav Navigation Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem', borderTop: '1px solid rgba(244, 114, 182, 0.15)', paddingTop: '0.5rem' }}>
          {navGroups.map((group, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(244, 114, 182, 0.6)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginRight: '0.25rem' }}>
                {group.title}:
              </div>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#fff' : 'var(--text-main)',
                      background: isActive ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.4) 0%, rgba(192, 132, 252, 0.3) 100%)' : 'rgba(26, 16, 38, 0.5)',
                      border: isActive ? '1px solid var(--pink-accent)' : '1px solid rgba(244, 114, 182, 0.15)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} color={isActive ? '#fff' : 'var(--pink-light)'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </header>
  );
};
