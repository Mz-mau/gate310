import { Question, Domain, Difficulty } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';

const SKILLS_BY_DOMAIN: Record<Domain, string[]> = {
  quantitative: [
    'Numerical Transformations',
    'Ratio & Proportional Reasoning',
    'Mathematical Logic & Work Rates',
    'Sequences & Multi-step Patterns',
    'Arithmetic & Estimation Reasoning'
  ],
  abstract: [
    'Matrix & Transformation Rules',
    'Visual Sequences & Rotations',
    'Shape Classification & Spatial Analogy',
    'Pattern Overlays & Structural Folding'
  ],
  reading: [
    'Inference & Logical Assumptions',
    'Author’s Purpose & Tone',
    'Evidence Evaluation & Premise Analysis',
    'Vocabulary in Context'
  ],
  writing: [
    'Argument Construction & Persuasive Logic',
    'Conceptual Clarity & Cohesion',
    'Vocabulary Control & Nuance'
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
    const domainQuestions = this.getQuestionsForDomain(domain);
    
    // Select question close to current target difficulty
    let targetDiff = currentLevel;
    if (recentAccuracy > 80 && currentLevel < 10) {
      targetDiff = (currentLevel + 1) as Difficulty;
    } else if (recentAccuracy < 50 && currentLevel > 1) {
      targetDiff = (currentLevel - 1) as Difficulty;
    }

    const matched = domainQuestions.find(q => Math.abs(q.difficulty - targetDiff) <= 1);
    if (matched) return matched;

    // Fallback or dynamically generated question mock
    return this.generateDynamicQuestion(domain, targetDiff);
  }

  public generateDynamicQuestion(domain: Domain, difficulty: Difficulty): Question {
    const skills = SKILLS_BY_DOMAIN[domain];
    const skill = skills[Math.floor(Math.random() * skills.length)];
    const id = `${domain}-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (domain === 'quantitative') {
      const num1 = Math.floor(Math.random() * 20) + 5;
      const factor = Math.floor(Math.random() * 4) + 2;
      const sub = Math.floor(Math.random() * 5) + 1;
      const correctVal = (num1 * factor) - sub;
      const options = [
        `${correctVal}`,
        `${correctVal + sub}`,
        `${correctVal - factor}`,
        `${num1 * factor + sub}`
      ].sort(() => Math.random() - 0.5);

      return {
        id,
        domain: 'quantitative',
        skill,
        difficulty,
        reasoningType: 'Algorithmic Sequence & Transformation',
        estimatedTimeSeconds: 45,
        prompt: `If a sequence term T(n) is defined as T(n) = ${factor} * T(n-1) - ${sub}, and T(1) = ${num1}, what is the precise value of T(2)?`,
        options,
        correctAnswer: `${correctVal}`,
        explanation: `Step 1: Identify initial value T(1) = ${num1}.\nStep 2: Apply multiplier ${factor} -> ${num1 * factor}.\nStep 3: Subtract offset ${sub} -> ${correctVal}.`,
        commonTrap: 'Adding the offset instead of subtracting, or misinterpreting order of operations.',
        distractorAnalysis: {
          [`${correctVal + sub}`]: 'Added the offset instead of subtracting.',
          [`${correctVal - factor}`]: 'Subtracted factor from result prematurely.',
          [`${num1 * factor + sub}`]: 'Inverted the operational sign.'
        }
      };
    }

    if (domain === 'abstract') {
      return {
        id,
        domain: 'abstract',
        skill,
        difficulty,
        reasoningType: 'Spatial Rotation & Grid Matrix',
        estimatedTimeSeconds: 40,
        prompt: `A matrix of 4 symbols rotates 90° clockwise per column step while inverting primary accent colors. If cell [1,1] is a top-left shaded square, what is the exact configuration of cell [1,3]?`,
        visualPattern: `Grid Pattern [3x3 Node System - Level ${difficulty}]`,
        options: [
          'Bottom-left shaded square with inverted accent border',
          'Top-right hollow square with double cross-hatch',
          'Center shaded circle with vertical symmetry',
          'Bottom-right solid diamond with dot matrix'
        ],
        correctAnswer: 'Bottom-left shaded square with inverted accent border',
        explanation: 'Two step 90° clockwise rotation shifts top-left to bottom-right, but color inversion swaps primary accent background.',
        commonTrap: 'Performing only a 90° rotation instead of 180° across two steps.',
        distractorAnalysis: {
          'Top-right hollow square with double cross-hatch': 'Applied anti-clockwise step.',
          'Center shaded circle with vertical symmetry': 'Changed core geometry invalidly.',
          'Bottom-right solid diamond with dot matrix': 'Confused square polygon with diamond transformation.'
        }
      };
    }

    if (domain === 'reading') {
      return {
        id,
        domain: 'reading',
        skill,
        difficulty,
        reasoningType: 'Inference & Logical Deduction',
        estimatedTimeSeconds: 60,
        passage: `The widespread adoption of predictive heuristic models in decision-making often creates a false sense of mathematical certainty. While models process high volumes of historical data, they remain inherently vulnerable to edge-case anomalies and shifts in contextual premises that fall outside their training distribution.`,
        prompt: 'Which statement aligns most accurately with the author’s primary argument regarding predictive heuristic models?',
        options: [
          'High volumes of data completely prevent algorithmic errors in normal operating conditions.',
          'Apparent statistical certainty can mask underlying vulnerabilities to novel contextual scenarios.',
          'Predictive models should be restricted exclusively to historical analysis.',
          'Edge-case anomalies are irrelevant to long-term decision making.'
        ],
        correctAnswer: 'Apparent statistical certainty can mask underlying vulnerabilities to novel contextual scenarios.',
        explanation: 'The passage highlights that predictive models create a "false sense of certainty" because they fail when faced with "edge-case anomalies and shifts in contextual premises".',
        commonTrap: 'Selecting an option that makes an extreme claim unsupported by the text.',
        distractorAnalysis: {
          'High volumes of data completely prevent algorithmic errors in normal operating conditions.': 'Unfounded absolute statement.',
          'Predictive models should be restricted exclusively to historical analysis.': 'Prescriptive leap beyond author text.',
          'Edge-case anomalies are irrelevant to long-term decision making.': 'Contradicts central passage warning.'
        }
      };
    }

    // Default Writing
    return {
      id,
      domain: 'writing',
      skill,
      difficulty,
      reasoningType: 'Persuasive Reasoning & Thesis Framing',
      estimatedTimeSeconds: 300,
      prompt: `Prompt: "Knowledge without critical evaluation is more dangerous than ignorance."\n\nTask: Draft a concise, high-impact persuasive paragraph (120-200 words) defining your position on this claim. Incorporate counter-argument refutation.`,
      options: [],
      correctAnswer: 'High-scoring response requires defining how unexamined knowledge turns into uncritical dogma, whereas ignorance leaves space for inquiry.',
      explanation: 'Evaluated on depth of logic, precision of language, structural flow, and effective counter-argument positioning.',
      commonTrap: 'Summarizing general facts rather than constructing a clear, reasoned argument.',
      distractorAnalysis: {}
    };
  }
}

export const adaptiveEngine = new AdaptiveEngine();
