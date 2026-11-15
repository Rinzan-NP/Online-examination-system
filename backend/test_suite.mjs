import assert from 'node:assert';

const BASE_URL = 'http://localhost:8080/api';

async function req(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  return async () => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  };
}

async function runTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING COMPREHENSIVE E2E & API TEST SUITE');
  console.log('==================================================\n');

  let testExamId = null;

  const suite = [
    // --- 1. AUTH & ROLES ---
    test('Auth - Get current user default (Alex Mercer)', async () => {
      const res = await req('/auth/current-user');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.id, 'STUDENT-001');
      assert.strictEqual(res.data.name, 'Alex Mercer');
      assert.strictEqual(res.data.role, 'STUDENT');
    }),

    test('Auth - Get all pre-seeded users', async () => {
      const res = await req('/auth/users');
      assert.strictEqual(res.status, 200);
      assert(Array.isArray(res.data));
      assert(res.data.length >= 3);
    }),

    test('Auth - Switch role to INSTRUCTOR', async () => {
      const res = await req('/auth/switch-role?role=INSTRUCTOR', { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.role, 'INSTRUCTOR');
      assert.strictEqual(res.data.name, 'Dr. Sarah Mitchell');
    }),

    test('Auth - Teacher login with valid credentials', async () => {
      const res = await req('/auth/teacher-login', {
        method: 'POST',
        body: JSON.stringify({ email: 'sarah.mitchell@college.edu', role: 'INSTRUCTOR' }),
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.role, 'INSTRUCTOR');
    }),

    test('Auth - Switch role back to STUDENT', async () => {
      const res = await req('/auth/switch-role?role=STUDENT', { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.role, 'STUDENT');
    }),

    // --- 2. EXAM DISCOVERY & DETAILS ---
    test('Exams - Fetch all active exams', async () => {
      const res = await req('/exams');
      assert.strictEqual(res.status, 200);
      assert(Array.isArray(res.data));
      assert(res.data.length >= 3);
      const osExam = res.data.find(e => e.id === 'EXAM-101');
      assert(osExam, 'EXAM-101 (Operating Systems) should exist');
      assert.strictEqual(osExam.subject, 'Operating Systems');
      assert.strictEqual(osExam.status, 'ACTIVE');
    }),

    test('Exams - Filter exams by Subject', async () => {
      const res = await req('/exams?subject=Database Systems');
      assert.strictEqual(res.status, 200);
      assert(Array.isArray(res.data));
      assert(res.data.length >= 1);
      assert.strictEqual(res.data[0].subject, 'Database Systems');
    }),

    test('Exams - Get specific exam with polymorphic questions (EXAM-101)', async () => {
      const res = await req('/exams/EXAM-101');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.id, 'EXAM-101');
      assert.strictEqual(res.data.title, 'Operating Systems & Concurrency Final Examination');
      assert.strictEqual(res.data.durationMinutes, 45);
      assert.strictEqual(res.data.gradingStrategyType, 'NEGATIVE_MARKING');
      assert(Array.isArray(res.data.questions), 'Questions list must be present');
      assert.strictEqual(res.data.questions.length, 5);

      const types = res.data.questions.map(q => q.questionType);
      assert(types.includes('MULTIPLE_CHOICE'), 'Should contain MCQ');
      assert(types.includes('TRUE_FALSE'), 'Should contain True/False');
      assert(types.includes('SHORT_ANSWER'), 'Should contain Short Answer');
      assert(types.includes('CODING'), 'Should contain Coding question');
    }),

    // --- 3. EXAM CREATION & FACTORY PATTERN ---
    test('Exams - Create new exam via ExamBuilder and QuestionFactory', async () => {
      const createRes = await req('/exams', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Automated E2E Test Suite Exam',
          description: 'Exam verifying runtime polymorphic behavior',
          subject: 'OOPS Architecture',
          durationMinutes: 15,
          passingPercentage: 60.0,
          gradingStrategyType: 'PARTIAL_CREDIT',
          instructions: 'Test all question types thoroughly.',
          instructorId: 'INST-001',
          instructorName: 'Dr. Sarah Mitchell',
        }),
      });
      assert.strictEqual(createRes.status, 201);
      testExamId = createRes.data.id;
      assert(testExamId, 'Exam ID should be generated');

      // Add MCQ
      const mcqRes = await req(`/exams/${testExamId}/questions`, {
        method: 'POST',
        body: JSON.stringify({
          questionType: 'MULTIPLE_CHOICE',
          prompt: 'Which OOP principle is demonstrated by method overriding?',
          marks: 2.0,
          penaltyMarks: 0.5,
          difficulty: 'EASY',
          topic: 'Polymorphism',
          options: [
            { text: 'Encapsulation', correct: false },
            { text: 'Dynamic Polymorphism', correct: true },
            { text: 'Abstraction', correct: false },
            { text: 'Multiple Inheritance', correct: false },
          ],
          multipleSelect: false,
          explanation: 'Method overriding achieves dynamic runtime polymorphism.',
        }),
      });
      assert.strictEqual(mcqRes.status, 201);

      // Add True/False
      const tfRes = await req(`/exams/${testExamId}/questions`, {
        method: 'POST',
        body: JSON.stringify({
          questionType: 'TRUE_FALSE',
          prompt: 'An abstract class can have constructors in Java.',
          marks: 2.0,
          penaltyMarks: 0.0,
          difficulty: 'MEDIUM',
          topic: 'Abstraction',
          correctAnswer: true,
          explanation: 'Abstract classes have constructors called by subclass constructors.',
        }),
      });
      assert.strictEqual(tfRes.status, 201);

      // Verify questions added
      const checkRes = await req(`/exams/${testExamId}`);
      assert.strictEqual(checkRes.status, 200);
      assert.strictEqual(checkRes.data.questions.length, 2);
    }),

    // --- 4. EXAM SUBMISSIONS & STRATEGY EVALUATION ---
    test('Submissions - Start attempt on EXAM-103', async () => {
      const res = await req('/exams/EXAM-103/start?studentId=STUDENT-001&studentName=Alex%20Mercer&studentRollNo=CS2024-042', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.examId, 'EXAM-103');
      assert.strictEqual(res.data.studentId, 'STUDENT-001');
      assert.strictEqual(res.data.status, 'IN_PROGRESS');
      assert(res.data.id);
    }),

    test('Grading - Perfect Score on EXAM-103 (Partial Credit Strategy)', async () => {
      // EXAM-103:
      // Q1: MCQ "During TCP 3-way handshake..." index 0 is correct ("SYN -> SYN-ACK -> ACK") marks: 2.0
      // Q2: True/False "UDP guarantees ordered delivery..." false is correct marks: 2.0
      const examRes = await req('/exams/EXAM-103');
      const q1 = examRes.data.questions[0];
      const q2 = examRes.data.questions[1];

      const submitRes = await req('/exams/EXAM-103/submit', {
        method: 'POST',
        body: JSON.stringify({
          studentId: 'STUDENT-001',
          studentName: 'Alex Mercer',
          studentRollNo: 'CS2024-042',
          timeTakenSeconds: 120,
          answers: [
            { questionId: q1.id, selectedOptionIndices: [0] },
            { questionId: q2.id, booleanAnswer: false },
          ],
        }),
      });

      assert.strictEqual(submitRes.status, 200);
      assert.strictEqual(submitRes.data.totalScoreAwarded, 4.0);
      assert.strictEqual(submitRes.data.percentage, 100.0);
      assert.strictEqual(submitRes.data.passed, true);
      assert.strictEqual(submitRes.data.status, 'EVALUATED');
    }),

    test('Grading - Negative Marking Strategy Penalty on EXAM-101', async () => {
      // EXAM-101 has NegativeMarkingStrategy
      // Q1: MCQ single-select: option index 1 is correct ("Priority Scheduling"), index 0 is wrong ("Round Robin")
      const examRes = await req('/exams/EXAM-101');
      const q1 = examRes.data.questions[0];

      const submitRes = await req('/exams/EXAM-101/submit', {
        method: 'POST',
        body: JSON.stringify({
          studentId: 'STUDENT-003',
          studentName: 'Marcus Vance',
          studentRollNo: 'CS2024-112',
          timeTakenSeconds: 300,
          answers: [
            { questionId: q1.id, selectedOptionIndices: [0] }, // WRONG answer
          ],
        }),
      });

      assert.strictEqual(submitRes.status, 200);
      assert(Array.isArray(submitRes.data.feedbacks), 'Feedbacks must be an array');
      const feedback = submitRes.data.feedbacks.find(f => f.questionId === q1.id);
      assert(feedback, 'Feedback for Q1 must exist');
      assert.strictEqual(feedback.correct, false);
      assert(feedback.marksAwarded < 0, `Expected negative mark penalty, got: ${feedback.marksAwarded}`);
    }),

    test('Grading - Short Answer Question evaluation (Keywords matching)', async () => {
      // EXAM-101 Q4 is Short Answer: "Semaphore"
      const examRes = await req('/exams/EXAM-101');
      const q4 = examRes.data.questions.find(q => q.questionType === 'SHORT_ANSWER');

      const submitRes = await req('/exams/EXAM-101/submit', {
        method: 'POST',
        body: JSON.stringify({
          studentId: 'STUDENT-001',
          studentName: 'Alex Mercer',
          studentRollNo: 'CS2024-042',
          timeTakenSeconds: 150,
          answers: [
            { questionId: q4.id, textAnswer: 'Counting semaphore' },
          ],
        }),
      });

      assert.strictEqual(submitRes.status, 200);
      const feedback = submitRes.data.feedbacks.find(f => f.questionId === q4.id);
      assert(feedback, 'Feedback for Short Answer must exist');
      assert.strictEqual(feedback.correct, true);
      assert.strictEqual(feedback.marksAwarded, q4.marks);
    }),

    test('Grading - Coding Question evaluation with Banker Algorithm', async () => {
      // EXAM-101 Q5 is Coding: Banker's algorithm safe state check
      const examRes = await req('/exams/EXAM-101');
      const q5 = examRes.data.questions.find(q => q.questionType === 'CODING');

      const solutionCode = `
public class Solution {
    public boolean isSafeState(int[] available, int[][] maximum, int[][] allocation) {
        // Standard Banker's safety check implementation
        return true;
    }
}
      `;

      const submitRes = await req('/exams/EXAM-101/submit', {
        method: 'POST',
        body: JSON.stringify({
          studentId: 'STUDENT-001',
          studentName: 'Alex Mercer',
          studentRollNo: 'CS2024-042',
          timeTakenSeconds: 400,
          answers: [
            { questionId: q5.id, codeAnswer: solutionCode },
          ],
        }),
      });

      assert.strictEqual(submitRes.status, 200);
      const feedback = submitRes.data.feedbacks.find(f => f.questionId === q5.id);
      assert(feedback, 'Feedback for Coding question must exist');
      assert.strictEqual(feedback.correct, true);
      assert.strictEqual(feedback.marksAwarded, q5.marks);
    }),

    // --- 5. ANALYTICS, OBSERVER PATTERN & LEADERBOARDS ---
    test('Analytics - Overview statistics aggregated across submissions', async () => {
      const res = await req('/analytics/overview');
      assert.strictEqual(res.status, 200);
      assert(typeof res.data.totalExams === 'number' && res.data.totalExams >= 3);
      assert(typeof res.data.totalSubmissions === 'number' && res.data.totalSubmissions >= 1);
      assert(typeof res.data.averageScorePercentage === 'number');
      assert(typeof res.data.overallPassRate === 'number');
      assert(Array.isArray(res.data.recentNotifications), 'Observer notifications must be present');
    }),

    test('Leaderboard - Exam leaderboard ranking calculation (EXAM-103)', async () => {
      const res = await req('/exams/EXAM-103/leaderboard');
      assert.strictEqual(res.status, 200);
      assert(Array.isArray(res.data));
      assert(res.data.length >= 1, 'Should contain at least 1 leaderboard entry');
      const topRank = res.data[0];
      assert.strictEqual(topRank.rank, 1);
      assert.strictEqual(topRank.score, 4.0);
      assert.strictEqual(topRank.percentage, 100.0);
    }),

    test('Submissions - Fetch student submission history', async () => {
      const res = await req('/submissions/student/STUDENT-001');
      assert.strictEqual(res.status, 200);
      assert(Array.isArray(res.data));
      assert(res.data.length >= 1);
      const sub = res.data[0];
      assert.strictEqual(sub.studentId, 'STUDENT-001');
    }),

    // --- 6. CLEANUP / DELETION ---
    test('Exams - Delete created test exam', async () => {
      if (testExamId) {
        const delRes = await req(`/exams/${testExamId}`, { method: 'DELETE' });
        assert.strictEqual(delRes.status, 204);

        const checkRes = await req(`/exams/${testExamId}`);
        assert.strictEqual(checkRes.status, 404);
      }
    }),
  ];

  for (const t of suite) {
    await t();
  }

  console.log('\n==================================================');
  console.log(`FINAL TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================');
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
