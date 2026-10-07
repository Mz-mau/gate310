export type Domain = 'quantitative' | 'abstract' | 'reading' | 'writing';

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ErrorCategory =
  | 'misunderstood_question'
  | 'calculation_error'
  | 'pattern_not_recognised'
  | 'rushed'
  | 'overthought'
  | 'vocabulary_issue'
  | 'logical_assumption'
  | 'missed_detail'
  | 'weak_strategy'
  | 'careless_mistake'
  | 'time_pressure';

export interface Question {
  id: string;
  domain: Domain;
  skill: string;
  difficulty: Difficulty;
  reasoningType: string;
  estimatedTimeSeconds: number;
  prompt: string;
  passage?: string; // For reading comprehension or complex prompts
  visualPattern?: string; // Code/SVG descriptor or visual schema for abstract reasoning
  options?: string[];
  correctAnswer: string; // The correct option string or full answer text
  explanation: string;
  commonTrap: string;
  distractorAnalysis: Record<string, string>; // Why each incorrect option is wrong
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  domain: Domain;
  skill: string;
  difficulty: Difficulty;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  confidence?: 'high' | 'medium' | 'low';
  errorCategory?: ErrorCategory;
  timestamp: string;
  hintsUsed: number;
}

export interface SkillMastery {
  skill: string;
  domain: Domain;
  accuracy: number; // 0 - 100
  totalAttempts: number;
  avgTimeSeconds: number;
  currentLevel: Difficulty;
  status: 'Weakness' | 'Developing' | 'Proficient' | 'Mastered';
  lastPracticed: string;
}

export interface UserProfile {
  name: string;
  baselineCompleted: boolean;
  targetScore: number;
  estimatedScore: number; // e.g. 265 -> target 310
  rankTitle: 'Recruit' | 'Analyst' | 'Strategist' | 'Advanced' | 'Elite' | '310 Candidate' | '310+ READY';
  totalQuestionsCompleted: number;
  overallAccuracy: number;
  avgSolvingTimeSeconds: number;
  currentStreakDays: number;
  xp: number;
  domainScores: {
    quantitative: number; // 0 - 100 or rating index
    abstract: number;
    reading: number;
    writing: number;
  };
  mockHistory: MockTestResult[];
}

export interface MockTestResult {
  id: string;
  date: string;
  totalScore: number;
  performanceIndex: number; // Rating out of 350
  domainScores: {
    quantitative: number;
    abstract: number;
    reading: number;
    writing: number;
  };
  timeManagementScore: number;
  damagingMistakes: string[];
  biggestImprovement: string;
}

export interface WritingSubmission {
  id: string;
  prompt: string;
  userText: string;
  timestamp: string;
  feedback: {
    overallScore: number; // out of 100
    argumentScore: number;
    clarityScore: number;
    vocabularyScore: number;
    originalityScore: number;
    critique: string;
    strengths: string[];
    improvements: string[];
    revisedSample: string;
  };
}
