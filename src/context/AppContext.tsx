import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, QuestionAttempt, SkillMastery, MockTestResult, WritingSubmission } from '../types';

interface StateContextType {
  profile: UserProfile;
  attempts: QuestionAttempt[];
  masteryList: SkillMastery[];
  writingHistory: WritingSubmission[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recordAttempt: (attempt: Omit<QuestionAttempt, 'id' | 'timestamp'>) => void;
  recordMockTest: (result: MockTestResult) => void;
  recordWritingSubmission: (submission: Omit<WritingSubmission, 'id' | 'timestamp'>) => void;
  completeBaseline: () => void;
  resetAllData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Candidate #310',
  baselineCompleted: false,
  targetScore: 310,
  estimatedScore: 245,
  rankTitle: 'Recruit',
  totalQuestionsCompleted: 0,
  overallAccuracy: 0,
  avgSolvingTimeSeconds: 0,
  currentStreakDays: 3,
  xp: 450,
  domainScores: {
    quantitative: 64,
    abstract: 68,
    reading: 72,
    writing: 65,
  },
  mockHistory: [
    {
      id: 'mock-0',
      date: '2026-10-01',
      totalScore: 258,
      performanceIndex: 258,
      domainScores: { quantitative: 62, abstract: 66, reading: 70, writing: 60 },
      timeManagementScore: 74,
      damagingMistakes: ['Rushed calculation in ratio multi-step', 'Misread passage logical assumption'],
      biggestImprovement: 'Abstract spatial rotation speed'
    }
  ]
};

const INITIAL_MASTERY: SkillMastery[] = [
  { skill: 'Numerical Transformations', domain: 'quantitative', accuracy: 74, totalAttempts: 18, avgTimeSeconds: 52, currentLevel: 5, status: 'Developing', lastPracticed: 'Today' },
  { skill: 'Ratio & Proportional Reasoning', domain: 'quantitative', accuracy: 71, totalAttempts: 14, avgTimeSeconds: 61, currentLevel: 6, status: 'Weakness', lastPracticed: 'Yesterday' },
  { skill: 'Mathematical Logic & Work Rates', domain: 'quantitative', accuracy: 65, totalAttempts: 12, avgTimeSeconds: 58, currentLevel: 5, status: 'Weakness', lastPracticed: '2 days ago' },
  { skill: 'Matrix & Transformation Rules', domain: 'abstract', accuracy: 78, totalAttempts: 22, avgTimeSeconds: 38, currentLevel: 7, status: 'Proficient', lastPracticed: 'Today' },
  { skill: 'Visual Sequences & Rotations', domain: 'abstract', accuracy: 62, totalAttempts: 25, avgTimeSeconds: 44, currentLevel: 6, status: 'Weakness', lastPracticed: 'Today' },
  { skill: 'Inference & Logical Assumptions', domain: 'reading', accuracy: 68, totalAttempts: 20, avgTimeSeconds: 59, currentLevel: 6, status: 'Weakness', lastPracticed: 'Today' },
  { skill: 'Author’s Purpose & Tone', domain: 'reading', accuracy: 82, totalAttempts: 15, avgTimeSeconds: 42, currentLevel: 7, status: 'Proficient', lastPracticed: '3 days ago' },
  { skill: 'Argument Construction & Persuasive Logic', domain: 'writing', accuracy: 75, totalAttempts: 10, avgTimeSeconds: 240, currentLevel: 6, status: 'Proficient', lastPracticed: 'Yesterday' }
];

const AppContext = createContext<StateContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gate310_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() => {
    const saved = localStorage.getItem('gate310_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [masteryList, setMasteryList] = useState<SkillMastery[]>(() => {
    const saved = localStorage.getItem('gate310_mastery');
    return saved ? JSON.parse(saved) : INITIAL_MASTERY;
  });

  const [writingHistory, setWritingHistory] = useState<WritingSubmission[]>(() => {
    const saved = localStorage.getItem('gate310_writing');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    localStorage.setItem('gate310_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('gate310_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('gate310_mastery', JSON.stringify(masteryList));
  }, [masteryList]);

  useEffect(() => {
    localStorage.setItem('gate310_writing', JSON.stringify(writingHistory));
  }, [writingHistory]);

  const recordAttempt = (newAttemptData: Omit<QuestionAttempt, 'id' | 'timestamp'>) => {
    const newAttempt: QuestionAttempt = {
      ...newAttemptData,
      id: `attempt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // Update Profile stats
    setProfile(prev => {
      const total = prev.totalQuestionsCompleted + 1;
      const correctCount = Math.round((prev.overallAccuracy / 100) * prev.totalQuestionsCompleted) + (newAttempt.isCorrect ? 1 : 0);
      const newAcc = Math.round((correctCount / total) * 100);
      const newAvgTime = Math.round(((prev.avgSolvingTimeSeconds * prev.totalQuestionsCompleted) + newAttempt.timeSpentSeconds) / total);
      
      // Calculate XP
      const addedXp = newAttempt.isCorrect ? (newAttempt.difficulty * 20) + 50 : 10;
      const newXp = prev.xp + addedXp;

      // Update Rank Title based on estimated score / XP
      let rank: UserProfile['rankTitle'] = 'Recruit';
      if (newXp > 3000) rank = '310+ READY';
      else if (newXp > 2200) rank = '310 Candidate';
      else if (newXp > 1600) rank = 'Elite';
      else if (newXp > 1100) rank = 'Advanced';
      else if (newXp > 700) rank = 'Strategist';
      else if (newXp > 350) rank = 'Analyst';

      // Domain score nudge
      const domainKey = newAttempt.domain;
      const currentDomScore = prev.domainScores[domainKey];
      const nudge = newAttempt.isCorrect ? 1.5 : -1;
      const updatedDomScore = Math.min(98, Math.max(40, Math.round(currentDomScore + nudge)));

      const estScore = Math.min(325, Math.round(200 + ((updatedDomScore + prev.domainScores.abstract + prev.domainScores.reading + prev.domainScores.writing) / 4) * 1.3));

      return {
        ...prev,
        totalQuestionsCompleted: total,
        overallAccuracy: newAcc,
        avgSolvingTimeSeconds: newAvgTime,
        xp: newXp,
        rankTitle: rank,
        estimatedScore: estScore,
        domainScores: {
          ...prev.domainScores,
          [domainKey]: updatedDomScore
        }
      };
    });

    // Update Mastery List
    setMasteryList(prev => {
      const idx = prev.findIndex(m => m.skill === newAttempt.skill);
      if (idx >= 0) {
        const item = prev[idx];
        const newTotal = item.totalAttempts + 1;
        const currentCorrect = Math.round((item.accuracy / 100) * item.totalAttempts);
        const newCorrect = currentCorrect + (newAttempt.isCorrect ? 1 : 0);
        const newAcc = Math.round((newCorrect / newTotal) * 100);

        let status: SkillMastery['status'] = 'Developing';
        if (newAcc >= 85 && newTotal >= 10) status = 'Mastered';
        else if (newAcc >= 72) status = 'Proficient';
        else if (newAcc < 65) status = 'Weakness';

        const updated = [...prev];
        updated[idx] = {
          ...item,
          accuracy: newAcc,
          totalAttempts: newTotal,
          avgTimeSeconds: Math.round((item.avgTimeSeconds * item.totalAttempts + newAttempt.timeSpentSeconds) / newTotal),
          status,
          lastPracticed: 'Just now'
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            skill: newAttempt.skill,
            domain: newAttempt.domain,
            accuracy: newAttempt.isCorrect ? 100 : 0,
            totalAttempts: 1,
            avgTimeSeconds: newAttempt.timeSpentSeconds,
            currentLevel: newAttempt.difficulty,
            status: newAttempt.isCorrect ? 'Developing' : 'Weakness',
            lastPracticed: 'Just now'
          }
        ];
      }
    });
  };

  const recordMockTest = (result: MockTestResult) => {
    setProfile(prev => ({
      ...prev,
      mockHistory: [result, ...prev.mockHistory],
      estimatedScore: Math.round((prev.estimatedScore + result.performanceIndex) / 2)
    }));
  };

  const recordWritingSubmission = (sub: Omit<WritingSubmission, 'id' | 'timestamp'>) => {
    const fullSub: WritingSubmission = {
      ...sub,
      id: `write-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setWritingHistory(prev => [fullSub, ...prev]);
  };

  const completeBaseline = () => {
    setProfile(prev => ({
      ...prev,
      baselineCompleted: true,
      estimatedScore: 268
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem('gate310_profile');
    localStorage.removeItem('gate310_attempts');
    localStorage.removeItem('gate310_mastery');
    localStorage.removeItem('gate310_writing');
    setProfile(DEFAULT_PROFILE);
    setAttempts([]);
    setMasteryList(INITIAL_MASTERY);
    setWritingHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        attempts,
        masteryList,
        writingHistory,
        activeTab,
        setActiveTab,
        recordAttempt,
        recordMockTest,
        recordWritingSubmission,
        completeBaseline,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
