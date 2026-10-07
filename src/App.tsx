import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BaselineTest } from './components/BaselineTest';
import { SharpenMe } from './components/SharpenMe';
import { MachineMode } from './components/MachineMode';
import { WeaknessDestroyer } from './components/WeaknessDestroyer';
import { ErrorLab } from './components/ErrorLab';
import { SpeedLab } from './components/SpeedLab';
import { MockExams } from './components/MockExams';
import { GateCoach } from './components/GateCoach';
import { WritingTrainer } from './components/WritingTrainer';

const MainAppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'baseline' && <BaselineTest />}
        {activeTab === 'sharpen' && <SharpenMe />}
        {activeTab === 'machine' && <MachineMode />}
        {activeTab === 'weakness' && <WeaknessDestroyer />}
        {activeTab === 'errorlab' && <ErrorLab />}
        {activeTab === 'speedlab' && <SpeedLab />}
        {activeTab === 'mocks' && <MockExams />}
        {activeTab === 'coach' && <GateCoach />}
        {activeTab === 'writing' && <WritingTrainer />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '3rem' }}>
        GATE 310 • Elite Year 9 ASET Cognitive Preparation Lab • Single-Player Performance Engine
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
