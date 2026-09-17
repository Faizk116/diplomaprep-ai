import http from 'http';

const BASE_URL = 'http://localhost:4000/api/v1';

async function request(path: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  const payload = options.body ? JSON.stringify(options.body) : null;

  return new Promise<{ status: number; body: any }>((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload).toString() } : {}),
          ...options.headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 500, body: data ? JSON.parse(data) : {} });
          } catch (e) {
            resolve({ status: res.statusCode || 500, body: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runVerification() {
  console.log('🔍 Starting DiplomaPrep.AI Backend API Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('/../../health');
    assert(health.status === 200 && health.body.status === 'ok', 'Health Check Endpoint (/health)');

    // 2. Auth Sign In (Demo User)
    const signin = await request('/auth/signin', {
      method: 'POST',
      body: { emailOrEnrollment: 'MSBTE-2023-IT-0482', password: 'demoPassword123' },
    });
    assert(signin.status === 200 && !!signin.body.data?.token, 'Auth Sign In (/auth/signin)');

    const token = signin.body.data?.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Auth Sign Up (New Account)
    const testEnrollment = `test_${Date.now()}@gmail.com`;
    const signup = await request('/auth/signup', {
      method: 'POST',
      body: {
        name: 'Automated Test Student',
        emailOrEnrollment: testEnrollment,
        password: 'password123',
        branch: 'Computer / IT Engineering',
        year: 'TY Diploma',
      },
    });
    assert(signup.status === 201 && !!signup.body.data?.token, 'Auth Sign Up (/auth/signup)');

    // 4. Get Current User Profile
    const me = await request('/user/me', { headers: authHeaders });
    assert(me.status === 200 && me.body.data?.name === 'Pooja S.', 'Get Profile (/user/me)');

    // 5. Curriculum - Subjects List
    const subjects = await request('/subjects');
    assert(subjects.status === 200 && Array.isArray(subjects.body.data), 'Get Subjects List (/subjects)');

    // 6. Curriculum - Subject Details
    const subjectDetail = await request('/subjects/man-22509', { headers: authHeaders });
    assert(subjectDetail.status === 200 && subjectDetail.body.data?.code === '22509', 'Get Subject Detail (/subjects/man-22509)');

    // 7. Curriculum - Blueprint
    const blueprint = await request('/syllabus/blueprint');
    assert(blueprint.status === 200 && blueprint.body.data?.scheme === "MSBTE 'I' Scheme", 'Get Blueprint (/syllabus/blueprint)');

    // 8. Questions - Fetch
    const questions = await request('/questions?subjectId=man-22509&unitId=2&limit=5', { headers: authHeaders });
    assert(questions.status === 200 && questions.body.count > 0, 'Fetch Questions (/questions)');

    const sampleQId = questions.body.data[0]?.id || 'q1';

    // 9. Questions - Bookmark
    const bookmark = await request(`/questions/${sampleQId}/bookmark`, {
      method: 'POST',
      headers: authHeaders,
      body: { bookmarked: true },
    });
    assert(bookmark.status === 200 && bookmark.body.bookmarked === true, 'Toggle Bookmark (/questions/:id/bookmark)');

    // 10. Questions - Flag Report
    const flag = await request(`/questions/${sampleQId}/flag`, {
      method: 'POST',
      headers: authHeaders,
      body: { reason: 'typo', comments: 'Minor spelling mistake in distractor C.' },
    });
    assert(flag.status === 201 && !!flag.body.flagId, 'Flag Question (/questions/:id/flag)');

    // 11. Sessions - Start
    const startSess = await request('/sessions/start', {
      method: 'POST',
      headers: authHeaders,
      body: { subjectId: 'man-22509', unitId: 2, questionCount: 5 },
    });
    assert(startSess.status === 201 && !!startSess.body.data?.sessionId, 'Start Session (/sessions/start)');

    const sessionId = startSess.body.data?.sessionId;

    // 12. Sessions - Submit Answer
    const submitAns = await request(`/sessions/${sessionId}/answers`, {
      method: 'POST',
      headers: authHeaders,
      body: { questionId: sampleQId, selectedOption: 'A', timeSpentSeconds: 15 },
    });
    assert(submitAns.status === 200 && typeof submitAns.body.data?.isCorrect === 'boolean', 'Submit Answer (/sessions/:id/answers)');

    // 13. Sessions - Toggle Review Flag
    const reviewFlag = await request(`/sessions/${sessionId}/review-flag`, {
      method: 'PATCH',
      headers: authHeaders,
      body: { questionId: sampleQId, markedForReview: true },
    });
    assert(reviewFlag.status === 200 && reviewFlag.body.markedForReview === true, 'Toggle Review Flag (/sessions/:id/review-flag)');

    // 14. Sessions - Finish Session
    const finishSess = await request(`/sessions/${sessionId}/finish`, {
      method: 'POST',
      headers: authHeaders,
      body: { totalTimeSpentSeconds: 120 },
    });
    assert(finishSess.status === 200 && !!finishSess.body.data?.grade, 'Finish Session (/sessions/:id/finish)');

    // 15. Analytics - Progress
    const progress = await request('/analytics/progress', { headers: authHeaders });
    assert(progress.status === 200 && typeof progress.body.data?.accuracyPercentage === 'number', 'Get Progress (/analytics/progress)');

    // 16. Analytics - Momentum
    const momentum = await request('/analytics/momentum', { headers: authHeaders });
    assert(momentum.status === 200 && Array.isArray(momentum.body.data?.points), 'Get Momentum (/analytics/momentum)');

    // 17. Analytics - Weak Topics
    const weak = await request('/analytics/weak-topics', { headers: authHeaders });
    assert(weak.status === 200 && Array.isArray(weak.body.data), 'Get Weak Topics (/analytics/weak-topics)');

    // 18. AI Tutor - Chat
    const chat = await request('/ai-tutor/chat', {
      method: 'POST',
      headers: authHeaders,
      body: { subjectCode: '22509', questionId: sampleQId, message: 'Explain planning in simple language' },
    });
    assert(chat.status === 200 && !!chat.body.data?.tutorMessage?.text, 'AI Tutor Chat (/ai-tutor/chat)');

    // 19. AI Tutor - History
    const history = await request('/ai-tutor/history', { headers: authHeaders });
    assert(history.status === 200 && Array.isArray(history.body.data), 'AI Tutor History (/ai-tutor/history)');

    // 20. AI Tutor - Reset
    const reset = await request('/ai-tutor/reset', { method: 'DELETE', headers: authHeaders });
    assert(reset.status === 200 && reset.body.success === true, 'AI Tutor Reset (/ai-tutor/reset)');

  } catch (err) {
    console.error('❌ Verification suite execution error:', err);
  }

  console.log(`\n========================================`);
  console.log(`📊 API Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification();
