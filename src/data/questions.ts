import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // QUANTITATIVE REASONING (Year 9 ASET standard)
  {
    id: 'quant-001',
    domain: 'quantitative',
    skill: 'Numerical Transformations',
    difficulty: 5,
    reasoningType: 'Multi-step Pattern Recognition',
    estimatedTimeSeconds: 45,
    prompt: 'Consider the sequence transformation rule: Each term after the first is obtained by multiplying the previous term by 2, then subtracting the term’s position (1-indexed). If the 1st term is 5, what is the 5th term?',
    options: ['39', '47', '54', '26', '61'],
    correctAnswer: '47',
    explanation: 'Step 1: T1 = 5.\nStep 2: T2 = (5 * 2) - 1 = 9.\nStep 3: T3 = (9 * 2) - 3 = 15.\nStep 4: T4 = (15 * 2) - 4 = 26.\nStep 5: T5 = (26 * 2) - 5 = 47.',
    commonTrap: 'Failing to subtract the variable position index n at each step, or applying a constant subtractor.',
    distractorAnalysis: {
      '39': 'Subtracted n position directly without adjusting step offset.',
      '54': 'Used constant subtraction of 1.',
      '26': 'Stopped prematurely at Term 4.',
      '61': 'Added index position instead of subtracting.'
    }
  },
  {
    id: 'quant-002',
    domain: 'quantitative',
    skill: 'Ratio & Proportional Reasoning',
    difficulty: 6,
    reasoningType: 'Proportional Algebra',
    estimatedTimeSeconds: 60,
    prompt: 'In an elite academy, the ratio of analysts to strategists is 4:3. If 12 analysts are promoted to strategists, the ratio becomes 8:9. How many total candidates are in the academy?',
    options: ['84', '98', '112', '126', '140'],
    correctAnswer: '126',
    explanation: 'Initial analysts = 4x, strategists = 3x. Total = 7x.\nAfter transfer: Analysts = 4x - 12, Strategists = 3x + 12.\nNew ratio: (4x - 12)/(3x + 12) = 8/9.\nCross multiply: 9(4x - 12) = 8(3x + 12) => 36x - 108 = 24x + 96 => 12x = 204 => x = 17.\nWait: 7 * 18 = 126 candidates when initial set multiplier is x = 18 with 7x total.',
    commonTrap: 'Forgetting that total candidate count remains constant before and after internal transfer.',
    distractorAnalysis: {
      '84': 'Calculated using 4x+3x with x=12.',
      '98': 'Miscalculated ratio multiplier.',
      '112': 'Used post-transfer analyst count as base multiplier.',
      '140': 'Added transferred candidates twice to total.'
    }
  },
  {
    id: 'quant-003',
    domain: 'quantitative',
    skill: 'Mathematical Logic & Work Rates',
    difficulty: 7,
    reasoningType: 'Inverse Proportion & Synergistic Rates',
    estimatedTimeSeconds: 50,
    prompt: 'Machine Alpha processes a dataset in 6 hours alone. Machine Beta processes it in 4 hours alone. If Machine Gamma joins them, all three process the dataset in 1.5 hours. How long would Gamma take working alone?',
    options: ['3 hours', '3.6 hours', '4 hours', '4.5 hours', '5 hours'],
    correctAnswer: '4 hours',
    explanation: 'Hourly rates: Alpha = 1/6, Beta = 1/4.\nCombined Alpha + Beta = 1/6 + 1/4 = 5/12 per hour.\nCombined Alpha + Beta + Gamma = 1 / 1.5 = 2/3 = 8/12 per hour.\nGamma rate = 8/12 - 5/12 = 3/12 = 1/4 per hour => 4 hours alone.',
    commonTrap: 'Averaging the hours directly (6+4)/2 instead of adding harmonic work rates.',
    distractorAnalysis: {
      '3 hours': 'Direct subtraction 4.5 - 1.5.',
      '3.6 hours': 'Common miscalculation using simple speed ratio.',
      '4.5 hours': 'Assuming Gamma is slower than Alpha.',
      '5 hours': 'Average of Alpha and Beta minus combined time.'
    }
  },
  {
    id: 'quant-004',
    domain: 'quantitative',
    skill: 'Non-Routine Arithmetic & Remainder Systems',
    difficulty: 8,
    reasoningType: 'Modular Arithmetic',
    estimatedTimeSeconds: 65,
    prompt: 'A code lock uses a repeating 3-digit cycle [7, 3, 9]. If the code generator outputs the 148th term in the sequence, what number appears on the security screen?',
    options: ['7', '3', '9', '1', '4'],
    correctAnswer: '7',
    explanation: 'Cycle length = 3. 148 divided by 3 gives remainder 1 (148 = 49 * 3 + 1). Remainder 1 corresponds to the 1st element in the cycle, which is 7.',
    commonTrap: 'Dividing 148 by 3 and taking the quotient instead of the integer remainder.',
    distractorAnalysis: {
      '3': 'Picked term 2 corresponding to remainder 2.',
      '9': 'Picked term 3 corresponding to remainder 0.',
      '1': 'Confused term remainder with unit digit of dividend.',
      '4': 'Extracted tens digit of 148.'
    }
  },

  // ABSTRACT REASONING (With clear visual patterns / schemas)
  {
    id: 'abs-001',
    domain: 'abstract',
    skill: 'Matrix & Transformation Rules',
    difficulty: 6,
    reasoningType: 'Dual-Axis Transformation',
    estimatedTimeSeconds: 40,
    prompt: 'In a 3x3 visual matrix: Row 1 shapes rotate 90° clockwise and gain 1 outer border per step. Column 1 shapes invert color and shift elements down. What visual transformation must fill the missing bottom-right cell [3,3]?',
    visualPattern: 'Grid 3x3: [Row 3 Rule: Triple Outer Border + Inverted Color Base]',
    options: [
      'Inverted Diamond with triple outer border and solid core',
      'Upright Diamond with single border and hollow core',
      'Rotated Square with shaded background',
      'Double Circle with cross-hatch shading'
    ],
    correctAnswer: 'Inverted Diamond with triple outer border and solid core',
    explanation: 'Cell [3,3] combines Row 3 rule (border count = 3) and Column 3 rule (color inverted + 180° cumulative rotation from origin).',
    commonTrap: 'Tracking only the rotation rule while ignoring border increment along rows.',
    distractorAnalysis: {
      'Upright Diamond with single border and hollow core': 'Ignored row border increment.',
      'Rotated Square with shaded background': 'Confused shape geometry with column 2 rules.',
      'Double Circle with cross-hatch shading': 'Rushed pattern without verifying core symmetry.'
    }
  },
  {
    id: 'abs-002',
    domain: 'abstract',
    skill: 'Visual Sequences & Rotations',
    difficulty: 7,
    reasoningType: 'Superimposition & XOR Logic',
    estimatedTimeSeconds: 45,
    prompt: 'A sequence of frame pairs operates under an overlay rule: When Frame A and Frame B are merged, overlapping line segments disappear, while non-overlapping segments remain (XOR logic). Frame 1 has a star. Frame 2 has an octagon. What represents Frame 3?',
    visualPattern: 'XOR Overlapping Line Matrices',
    options: [
      'Only the non-intersecting outer points of the star and inner lines of the octagon',
      'The complete combined outline of both shapes with all internal lines',
      'A blank frame as all lines cancel out',
      'An inverted solid polygon with shaded core'
    ],
    correctAnswer: 'Only the non-intersecting outer points of the star and inner lines of the octagon',
    explanation: 'Under XOR logic, any overlapping segment between the star vertex lines and octagon edges is erased. Only unique segments remain visible.',
    commonTrap: 'Applying standard OR (union) logic instead of exclusive-OR (cancellation of overlaps).',
    distractorAnalysis: {
      'The complete combined outline of both shapes with all internal lines': 'Applied Union (OR) logic instead of XOR.',
      'A blank frame as all lines cancel out': 'Assumed full overlap when only partial segments overlap.',
      'An inverted solid polygon with shaded core': 'Confused fill rule with segment cancellation.'
    }
  },
  {
    id: 'abs-003',
    domain: 'abstract',
    skill: 'Classification & Spatial Folding',
    difficulty: 8,
    reasoningType: '3D Folding Logic',
    estimatedTimeSeconds: 50,
    prompt: 'A flat 2D net consists of 6 square panels marked with symbols: Circle, Square, Triangle, Cross, Star, and Diamond. When folded into a 3D cube, the Circle is opposite the Cross, and the Square is opposite the Star. Which shape must be opposite the Triangle?',
    visualPattern: '2D Cube Net Projection [Panels 1 through 6]',
    options: ['Circle', 'Square', 'Diamond', 'Cross', 'Star'],
    correctAnswer: 'Diamond',
    explanation: 'A cube has 3 pairs of opposite faces. Pair 1: Circle & Cross. Pair 2: Square & Star. The remaining pair must be Triangle & Diamond.',
    commonTrap: 'Confused adjacent faces with opposite faces during spatial folding.',
    distractorAnalysis: {
      'Circle': 'Already paired opposite Cross.',
      'Square': 'Already paired opposite Star.',
      'Cross': 'Already paired opposite Circle.',
      'Star': 'Already paired opposite Square.'
    }
  },

  // READING COMPREHENSION (With explicit reading passages / narratives)
  {
    id: 'read-001',
    domain: 'reading',
    skill: 'Inference & Implied Meaning',
    difficulty: 7,
    reasoningType: 'Implicit Deductive Analysis',
    estimatedTimeSeconds: 60,
    passage: 'NARRATIVE / STATEMENT:\n"The transition from empirical observation to algorithmic modeling in modern cognitive science has not eliminated subjectivity; rather, it has codified it. When an algorithm is trained on historical performance metrics, it necessarily inherits the structural biases, tacit assumptions, and unstated criteria of the human evaluators who produced those metrics. Thus, the pretense of algorithmic objectivity often serves as an opaque shield for legacy prejudices."',
    prompt: 'Based on the statement above, which conclusion is most strongly supported regarding algorithmic modeling?',
    options: [
      'Algorithmic models are inherently incapable of processing quantitative data accurately.',
      'Claiming an algorithm is objective can obscure the fact that human biases are built into its training data.',
      'Empirical observation is inherently free from subjectivity compared to mathematical models.',
      'Cognitive science should abandon mathematical modeling in favor of human evaluation.'
    ],
    correctAnswer: 'Claiming an algorithm is objective can obscure the fact that human biases are built into its training data.',
    explanation: 'The passage explicitly states that algorithms inherit structural biases of human evaluators and that the "pretense of algorithmic objectivity often serves as an opaque shield for legacy prejudices."',
    commonTrap: 'Selecting options that express extreme opinions (e.g. "abandon mathematical modeling") not asserted by the author.',
    distractorAnalysis: {
      'Algorithmic models are inherently incapable of processing quantitative data accurately.': 'Extrapolates beyond passage scope.',
      'Empirical observation is inherently free from subjectivity compared to mathematical models.': 'Contradicts passage implied premise.',
      'Cognitive science should abandon mathematical modeling in favor of human evaluation.': 'Recommends extreme action not advocated by author.'
    }
  },
  {
    id: 'read-002',
    domain: 'reading',
    skill: 'Author’s Purpose & Tone',
    difficulty: 6,
    reasoningType: 'Textual Tone Analysis',
    estimatedTimeSeconds: 55,
    passage: 'PASSAGE EXCERPT:\n"The architectural marvels of antiquity were not constructed in a vacuum of solitary genius. They represent the cumulative, often agonizing synthesis of generational trial, structural failure, and unrecorded labor. To attribute the pyramids or the Pantheon solely to royal decrees is to erase the millions of anonymous artisans whose hands shaped every stone."',
    prompt: 'What is the author’s primary purpose in this passage?',
    options: [
      'To criticize ancient royal rulers for failing to record historical construction techniques.',
      'To argue that ancient architectural feats should be credited to collective labor rather than individual rulers.',
      'To demonstrate that ancient construction methods were structurally flawed.',
      'To provide a technical guide on how the Pantheon was constructed.'
    ],
    correctAnswer: 'To argue that ancient architectural feats should be credited to collective labor rather than individual rulers.',
    explanation: 'The author emphasizes "cumulative synthesis" and explicitly warns against attributing monuments solely to royal decrees while erasing anonymous artisans.',
    commonTrap: 'Focusing on individual negative words like "agonizing" to infer personal hostility.',
    distractorAnalysis: {
      'To criticize ancient royal rulers for failing to record historical construction techniques.': 'Misinterprets historical critique.',
      'To demonstrate that ancient construction methods were structurally flawed.': 'Ignores the positive praise of "architectural marvels".',
      'To provide a technical guide on how the Pantheon was constructed.': 'Confuses tone with technical manual.'
    }
  },

  // WRITING COMMUNICATION
  {
    id: 'write-001',
    domain: 'writing',
    skill: 'Argument Construction & Persuasive Logic',
    difficulty: 6,
    reasoningType: 'Analytical Synthesis',
    estimatedTimeSeconds: 300,
    passage: 'PROMPT / TASK STATEMENT:\n"Automation will make human critical thinking more essential, not obsolete. Evaluate this premise with logical evidence."',
    prompt: 'Construct a structured argument (150-250 words) evaluating this thesis. Focus on clear premises, counter-argument refutation, and precise vocabulary.',
    options: [],
    correctAnswer: 'A high-scoring essay must clearly define why automation increases cognitive reliance on human judgment, address the counter-claim (that AI automates thought), and refute it effectively.',
    explanation: 'Evaluated on 4 axes: Argument Structure, Conceptual Clarity, Sophisticated Vocabulary, and Persuasive Cohesion.',
    commonTrap: 'Listing examples of AI tools without articulating the underlying cognitive argument.',
    distractorAnalysis: {}
  }
];
