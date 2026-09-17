import bcrypt from 'bcryptjs';
import { db, initDatabase } from './database.js';

export function seedDatabase() {
  initDatabase();

  // 1. Seed Demo User
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get('demo-pooja');
  if (!existingUser) {
    const passwordHash = bcrypt.hashSync('demoPassword123', 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email_or_enrollment, password_hash, branch, year, auth_provider, avatar_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'demo-pooja',
      'Pooja S.',
      'MSBTE-2023-IT-0482',
      passwordHash,
      'Computer / IT Engineering',
      'TY Diploma',
      'email',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTN05U3XOdXsNgEwwzk_BGdgtlCmjVROULRIYiR2hT7tKk2yuDfoQmjSomfpvKZotu6kRNNKEgd0PW2kJmAZtDp2lQN8OpybDMlOhzklY4lgZ-9xVBTjbyVF_7UeWrwqXO-U-TuvLyt7ObVaSAn4BWCJH05R6b6e50mJNLcFaByp_2UYpscuu9lNuAxTdhou1VV0vapnXRhpvwuoR7RWa512SLuYiDYxsIp8TBPEqx8pszpO6Xyqq',
      '2024-01-10T00:00:00.000Z',
      now
    );

    db.prepare(`
      INSERT INTO user_stats (user_id, streak_days, solved_mcqs, attempted_mcqs, target_mcqs, correct_answers, overall_accuracy, weekly_growth, target_exam, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'demo-pooja',
      5,
      342,
      342,
      1000,
      278,
      81,
      4,
      'Summer 2025',
      now
    );
  }

  // 2. Seed Subjects
  const subjectsData = [
    {
      id: 'man-22509',
      code: '22509',
      title: 'Management',
      branch: 'TY Diploma • Comp / IT',
      scheme: "MSBTE 'I' Scheme",
      unitsCount: 5,
      totalMCQs: 1000,
      units: [
        { id: 1, number: 1, title: 'Overview of Business', weightageMarks: 10, totalQuestions: 200, topics: ['Types of business', 'Globalization', 'Industrial sectors', 'Intellectual Property'] },
        { id: 2, number: 2, title: 'Planning & Decision Making', weightageMarks: 14, totalQuestions: 200, topics: ['Steps in planning', 'Types of plans', 'Decision making models', 'Forecasting methods'] },
        { id: 3, number: 3, title: 'Organizing & Staffing', weightageMarks: 14, totalQuestions: 200, topics: ['Organizational structures', 'Span of control', 'Recruitment & training', 'Delegation of authority'] },
        { id: 4, number: 4, title: 'Directing & Controlling', weightageMarks: 16, totalQuestions: 200, topics: ['Leadership styles', 'Maslow hierarchy', 'Communication barriers', 'Quality control tools'] },
        { id: 5, number: 5, title: 'Forms of Business Organization', weightageMarks: 16, totalQuestions: 200, topics: ['Sole proprietorship', 'Joint stock company', 'Government public sector', 'Co-operatives'] },
      ],
    },
    {
      id: 'est-22447',
      code: '22447',
      title: 'Environmental Studies',
      branch: 'Common to all branches',
      scheme: "MSBTE 'I' Scheme",
      unitsCount: 5,
      totalMCQs: 1000,
      units: [
        { id: 1, number: 1, title: 'Environment & Ecosystems', weightageMarks: 12, totalQuestions: 200, topics: ['Food chains & webs', 'Ecological pyramids', 'Abiotic components', 'Biodiversity hotspots'] },
        { id: 2, number: 2, title: 'Natural Resources & Energy', weightageMarks: 14, totalQuestions: 200, topics: ['Renewable vs non-renewable', 'Water conservation', 'Solar & wind energy', 'Deforestation'] },
        { id: 3, number: 3, title: 'Environmental Pollution', weightageMarks: 16, totalQuestions: 200, topics: ['Air & water pollution acts', 'E-waste disposal', 'Solid waste management', 'Noise thresholds'] },
        { id: 4, number: 4, title: 'Social Issues & Environmental Laws', weightageMarks: 14, totalQuestions: 200, topics: ['Water Act 1974', 'Air Act 1981', 'Environmental Protection Act 1986', 'Disaster management'] },
        { id: 5, number: 5, title: 'Human Population & Environment', weightageMarks: 14, totalQuestions: 200, topics: ['Population explosion', 'Women and child welfare', 'HIV/AIDS education', 'Environmental ethics'] },
      ],
    },
  ];

  const now = new Date().toISOString();

  for (const s of subjectsData) {
    const exists = db.prepare('SELECT id FROM subjects WHERE id = ?').get(s.id);
    if (!exists) {
      db.prepare(`
        INSERT INTO subjects (id, code, title, branch, scheme, units_count, total_mcqs, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(s.id, s.code, s.title, s.branch, s.scheme, s.unitsCount, s.totalMCQs, now);

      for (const u of s.units) {
        db.prepare(`
          INSERT INTO units (id, subject_id, number, title, weightage_marks, total_questions, topics)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(u.id, s.id, u.number, u.title, u.weightageMarks, u.totalQuestions, JSON.stringify(u.topics));
      }
    }
  }

  // 3. Seed Sample Questions
  const questionsData = [
    {
      id: 'q1',
      code: 'MSBTE-22509-U2-001',
      subjectId: 'man-22509',
      unitId: 2,
      unitName: 'Planning & Decision Making',
      topic: 'Concept of Planning',
      bloomLevel: 'R1 (Remembering)',
      marks: 2,
      sourcePaper: 'MSBTE Summer 2023',
      question: 'What is the primary purpose of planning in an engineering organization?',
      options: [
        { id: 'A', text: 'To bridge the gap between where we are and where we want to be', description: 'Sets clear milestones and resource allocation.' },
        { id: 'B', text: 'To punish underperforming staff members', description: 'Disciplinary action is not planning.' },
        { id: 'C', text: 'To replace all operational human labor with automation', description: 'A technology choice.' },
        { id: 'D', text: 'To terminate existing product manufacturing lines', description: 'A divestment decision.' },
      ],
      correctOption: 'A',
      explanation: {
        whyCorrect: 'According to Koontz and O’Donnell, planning bridges the gap from where we are to where we want to go.',
        trapWarning: 'Do not confuse strategic re-organization with the fundamental definition of planning.',
        examTip: 'Remember the mnemonic P-O-C-C-C from Henry Fayol.',
        peerAccuracy: { correctPct: 91, distractorStats: { B: 2, C: 5, D: 2 } },
      },
    },
    {
      id: 'q2',
      code: 'MSBTE-22509-U2-002',
      subjectId: 'man-22509',
      unitId: 2,
      unitName: 'Planning & Decision Making',
      topic: 'Steps in Planning',
      bloomLevel: 'U2 (Understanding)',
      marks: 2,
      sourcePaper: 'MSBTE Winter 2023',
      question: 'Which is the very FIRST step in the systematic planning process?',
      options: [
        { id: 'A', text: 'Formulating derivative plans', description: 'Sub-plans come later.' },
        { id: 'B', text: 'Awareness of opportunity and setting objectives', description: 'Identification of goals provides the target for all subsequent steps.' },
        { id: 'C', text: 'Evaluating alternative courses of action', description: 'Evaluation happens after generating alternatives.' },
        { id: 'D', text: 'Allocating financial budgets', description: 'Budgeting is a supporting step.' },
      ],
      correctOption: 'B',
      explanation: {
        whyCorrect: 'Setting objectives specifies the results expected and indicates the end points of what is to be done.',
        trapWarning: 'Students often select "Formulating budget" thinking money comes first, but objectives must be set first.',
        examTip: 'Sequence: Objectives -> Premises -> Alternatives -> Evaluation -> Selection -> Derivative plans.',
        peerAccuracy: { correctPct: 84, distractorStats: { A: 6, C: 7, D: 3 } },
      },
    },
    {
      id: 'q3',
      code: 'MSBTE-22509-U2-003',
      subjectId: 'man-22509',
      unitId: 2,
      unitName: 'Planning & Decision Making',
      topic: 'Types of Plans',
      bloomLevel: 'U2 (Understanding)',
      marks: 2,
      sourcePaper: 'MSBTE Summer 2024',
      question: 'A standing plan that provides detailed guidelines on how to carry out a specific chronological sequence of actions is called a:',
      options: [
        { id: 'A', text: 'Policy', description: 'General guide to thinking, not sequential steps.' },
        { id: 'B', text: 'Procedure', description: 'A standardized step-by-step chronological sequence for repeated operations.' },
        { id: 'C', text: 'Rule', description: 'Definite statement of what can or cannot be done.' },
        { id: 'D', text: 'Strategy', description: 'Broad blueprint for competitive advantage.' },
      ],
      correctOption: 'B',
      explanation: {
        whyCorrect: 'Procedures are chronological sequences of required actions.',
        trapWarning: 'Policy is a guideline for decision-making; Procedure is a sequence of steps.',
        examTip: 'MSBTE Question 2(c) frequently asks the difference between Policy and Procedure.',
        peerAccuracy: { correctPct: 76, distractorStats: { A: 14, C: 6, D: 4 } },
      },
    },
    {
      id: 'q7',
      code: 'MSBTE-22509-U2-047',
      subjectId: 'man-22509',
      unitId: 2,
      unitName: 'Planning & Decision Making',
      topic: 'Functions of Management',
      bloomLevel: 'R1 (Remembering)',
      marks: 2,
      sourcePaper: 'MSBTE Winter 2022',
      question: 'Which of the following is a fundamental function of management that involves setting objectives and determining in advance the appropriate course of action to achieve them?',
      options: [
        { id: 'A', text: 'Planning', description: 'Primary managerial step prior to organizing and execution.' },
        { id: 'B', text: 'Gaming', description: 'Interactive entertainment activity.' },
        { id: 'C', text: 'Sleeping', description: 'Physiological resting state.' },
        { id: 'D', text: 'None of these', description: 'Absence of the listed managerial principles.' },
      ],
      correctOption: 'A',
      explanation: {
        whyCorrect: 'Planning is the foremost function of management.',
        trapWarning: 'Distinguish planning from execution: Planning sets the path, while Directing and Controlling steer execution.',
        examTip: 'Henry Fayol identified POCCC: Planning, Organizing, Commanding, Coordinating, Controlling.',
        peerAccuracy: { correctPct: 82, distractorStats: { B: 11, C: 5, D: 2 } },
      },
    },
    {
      id: 'est-u3-q1',
      code: 'MSBTE-22447-U3-001',
      subjectId: 'est-22447',
      unitId: 3,
      unitName: 'Environmental Pollution',
      topic: 'Acid Rain Precursors',
      bloomLevel: 'U2 (Understanding)',
      marks: 2,
      sourcePaper: 'MSBTE Summer 2024',
      question: 'Which pair of gaseous air pollutants is predominantly responsible for the formation of Acid Rain (pH < 5.6)?',
      options: [
        { id: 'A', text: 'Sulfur dioxide (SO2) and Nitrogen oxides (NOx)', description: 'React with atmospheric moisture to produce sulfuric acid and nitric acid.' },
        { id: 'B', text: 'Methane (CH4) and Argon (Ar)', description: 'Non-acidic greenhouse gas and inert noble gas.' },
        { id: 'C', text: 'Chlorofluorocarbons (CFCs) and Carbon monoxide (CO)', description: 'Cause ozone depletion and toxic poisoning.' },
        { id: 'D', text: 'Oxygen (O2) and Water vapor (H2O)', description: 'Normal atmospheric constituents.' },
      ],
      correctOption: 'A',
      explanation: {
        whyCorrect: 'SO2 from thermal plants and NOx from vehicular engines oxidize in cloud droplets to form dilute H2SO4 and HNO3.',
        trapWarning: 'CFCs cause stratospheric ozone depletion, NOT acid rain!',
        examTip: 'Key chemical reactions: SO2 + H2O -> H2SO3; 2NO2 + H2O -> HNO2 + HNO3.',
        peerAccuracy: { correctPct: 82, distractorStats: { B: 3, C: 12, D: 3 } },
      },
    },
  ];

  for (const q of questionsData) {
    const exists = db.prepare('SELECT id FROM questions WHERE id = ?').get(q.id);
    if (!exists) {
      db.prepare(`
        INSERT INTO questions (id, code, subject_id, unit_id, unit_name, topic, bloom_level, marks, source_paper, question_text, correct_option, why_correct, trap_warning, exam_tip, peer_accuracy_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        q.id,
        q.code,
        q.subjectId,
        q.unitId,
        q.unitName,
        q.topic,
        q.bloomLevel,
        q.marks,
        q.sourcePaper,
        q.question,
        q.correctOption,
        q.explanation.whyCorrect,
        q.explanation.trapWarning,
        q.explanation.examTip,
        JSON.stringify(q.explanation.peerAccuracy)
      );

      for (const opt of q.options) {
        db.prepare(`
          INSERT INTO question_options (question_id, option_letter, option_text, description)
          VALUES (?, ?, ?, ?)
        `).run(q.id, opt.id, opt.text, opt.description || null);
      }
    }
  }
}

// Execute seed if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
  console.log('✅ SQLite Database seeded successfully.');
}
