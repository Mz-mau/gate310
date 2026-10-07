import { Question, Domain, Difficulty } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';

const SKILLS_BY_DOMAIN: Record<Domain, string[]> = {
  quantitative: [
    'Numerical Transformations',
    'Ratio & Proportional Reasoning',
    'Mathematical Logic & Work Rates',
    'Sequences & Multi-step Patterns',
    'Arithmetic & Estimation Reasoning',
    'Modular Arithmetic & Cyclic Codes'
  ],
  abstract: [
    'Matrix & Transformation Rules',
    'Visual Sequences & Rotations',
    'Shape Classification & Spatial Analogy',
    'Pattern Overlays & Structural Folding',
    '3D Net Projection & Spatial Rotation'
  ],
  reading: [
    'Inference & Implied Meaning',
    'Author’s Purpose & Tone',
    'Evidence Evaluation & Premise Analysis',
    'Vocabulary in Context',
    'Logical Deduction & Assumptions'
  ],
  writing: [
    'Argument Construction & Persuasive Logic',
    'Conceptual Clarity & Cohesion',
    'Vocabulary Control & Nuance',
    'Thesis Refutation & Counter-Arguments'
  ]
};

const PAST_YEAR9_GATE_SCENARIOS = {
  quantitative: [
    {
      template: (d: number) => {
        const base = Math.floor(Math.random() * 8) + 3;
        const mult = Math.floor(Math.random() * 3) + 2;
        const sub = Math.floor(Math.random() * 6) + 1;
        const correct = (base * mult * mult) - sub;
        return {
          passage: undefined,
          prompt: `[WA ASET Quantitative Pattern] A non-routine numerical transformation rule applies: Term(n) = ${mult} * Term(n-1) - ${sub}. Given Term(1) = ${base}, compute the value of Term(3).`,
          correctAnswer: `${correct}`,
          options: [`${correct}`, `${correct + sub}`, `${correct - mult}`, `${(base * mult) - sub}`].sort(() => Math.random() - 0.5),
          explanation: `Step 1: Term(1) = ${base}.\nStep 2: Term(2) = (${base} * ${mult}) - ${sub} = ${(base * mult) - sub}.\nStep 3: Term(3) = (${(base * mult) - sub} * ${mult}) - ${sub} = ${correct}.`
        };
      }
    }
  ],
  abstract: [
    {
      template: (d: number) => {
        const borderCount = 2 + (d % 3);
        return {
          passage: undefined,
          visualPattern: `SCHEMA: [Grid Matrix 3x3 - Border Layer Increments by +1 per Row, Color Inverts along Diagonal]`,
          prompt: `[WA ASET Spatial Matrix] Cell [1,1] has a single-line shaded square. If the row rule adds +1 border layer per step and the diagonal rule inverts primary accent color, what is the exact layout of cell [3,3]?`,
          correctAnswer: `Solid square with ${borderCount + 1} outer border rings and inverted accent background`,
          options: [
            `Solid square with ${borderCount + 1} outer border rings and inverted accent background`,
            `Single hollow circle with dotted cross-hatch`,
            `Rotated square with 1 border ring and standard background`,
            `Dual circle with vertical symmetry`
          ].sort(() => Math.random() - 0.5),
          explanation: `Cell [3,3] is 2 steps along the row (adding 2 border rings) and lies on the main diagonal (triggering color inversion).`
        };
      }
    }
  ],
  reading: [
    {
      template: (d: number) => {
        return {
          passage: `NARRATIVE / STATEMENT:\n"The proliferation of automated decision metrics in secondary selection tests often yields a paradoxical result. While standardized scores reduce subjective evaluator variance, they risk elevating narrow, test-specific test-taking heuristics over genuine critical intuition. True academic aptitude encompasses nuanced reasoning that cannot always be compressed into timed multiple-choice indices."`,
          prompt: `[WA ASET Reading Comprehension] Which option best captures the author's primary implicit claim regarding standardized selection metrics?`,
          correctAnswer: `Standardized metrics reduce evaluator bias but may favor narrow test-taking tactics over deeper critical reasoning.`,
          options: [
            `Standardized metrics reduce evaluator bias but may favor narrow test-taking tactics over deeper critical reasoning.`,
            `Multiple-choice tests are completely invalid for measuring student intelligence.`,
            `Subjective human evaluation is superior to numerical metrics in every context.`,
            `Secondary selection tests should be eliminated entirely.`
          ].sort(() => Math.random() - 0.5),
          explanation: `The author highlights a "paradoxical result": standardized scores reduce subjective variance but risk elevating narrow test heuristics over genuine intuition.`
        };
      }
    }
  ],
  writing: [
    {
      template: (d: number) => {
        return {
          passage: `WRITING PROMPT / STIMULUS STATEMENT:\n"Technological acceleration makes human emotional and ethical reasoning more crucial, not less. Discuss."`,
          prompt: `[WA ASET Written Communication] Draft a high-impact persuasive response (150-250 words) taking a clear stance. Focus on thesis strength, vocabulary control, and counter-argument refutation.`,
          correctAnswer: `High-scoring response requires defining how technical speed requires human ethical oversight, addressing counter-arguments, and providing logical premises.`,
          options: [],
          explanation: `Evaluated across 4 WA ASET criteria: Argument Cohesion, Conceptual Clarity, Vocabulary Precision, and Thesis Refutation.`
        };
      }
    }
  ]
};

export class AdaptiveEngine {
  private questions: Question[] = [...INITIAL_QUESTIONS];

  public getQuestionsForDomain(domain: Domain): Question[] {
    return this.questions.filter(q => q.domain === domain);
  }

  public getNextAdaptiveQuestion(
    domain: Domain,
    currentLevel: Difficulty,
    recentAccuracy: number
  ): Question {
    let targetDiff = currentLevel;
    if (recentAccuracy > 80 && currentLevel < 10) {
      targetDiff = (currentLevel + 1) as Difficulty;
    } else if (recentAccuracy < 50 && currentLevel > 1) {
      targetDiff = (currentLevel - 1) as Difficulty;
    }

    return this.generateDynamicQuestion(domain, targetDiff);
  }

  public generateDynamicQuestion(domain: Domain, difficulty: Difficulty): Question {
    const skills = SKILLS_BY_DOMAIN[domain];
    const skill = skills[Math.floor(Math.random() * skills.length)];
    const id = `${domain}-gen-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const domainTemplates = PAST_YEAR9_GATE_SCENARIOS[domain];
    const selectedTemplate = domainTemplates[Math.floor(Math.random() * domainTemplates.length)];
    const generated: any = selectedTemplate.template(difficulty);

    return {
      id,
      domain,
      skill,
      difficulty,
      reasoningType: 'WA ASET Standard Reasoning',
      estimatedTimeSeconds: domain === 'writing' ? 300 : 50,
      prompt: generated.prompt,
      passage: generated.passage,
      visualPattern: generated.visualPattern,
      options: generated.options,
      correctAnswer: generated.correctAnswer,
      explanation: generated.explanation,
      commonTrap: 'Failing to verify distractor options or misreading structural prompt bounds.',
      distractorAnalysis: {}
    };
  }
}

export const adaptiveEngine = new AdaptiveEngine();
