# DiplomaPrep.AI — Complete REST API Specification

This document provides a production-ready, unambiguous REST API specification for **DiplomaPrep.AI** (MSBTE 'I' Scheme Examination Engine). It is fully derived from the application state, user flows, database models, and AI tutor features.

---

## Database Entity Relationship Overview

Before presenting the API endpoints, below are the core database entities referenced across the API specification:

```
[Users] 1 ──── 1 [UserStats]
  │
  ├─ 1 ──── N [TestSessions] 1 ──── N [SessionAnswers]
  ├─ 1 ──── N [UserBookmarks]
  ├─ 1 ──── N [QuestionFlags]
  └─ 1 ──── N [AIChatThreads] 1 ──── N [AIChatMessages]

[Subjects] 1 ──── N [Units] 1 ──── N [Questions] 1 ──── N [QuestionOptions]
```

### Entity Schemas:
1. **`Users`**: `id`, `name`, `email_or_enrollment`, `password_hash`, `branch`, `year`, `auth_provider`, `avatar_url`, `created_at`, `updated_at`
2. **`UserStats`**: `user_id`, `streak_days`, `solved_mcqs`, `attempted_mcqs`, `target_mcqs`, `correct_answers`, `overall_accuracy`, `weekly_growth`, `target_exam`, `updated_at`
3. **`Subjects`**: `id`, `code`, `title`, `branch`, `scheme`, `units_count`, `total_mcqs`, `created_at`
4. **`Units`**: `id`, `subject_id`, `unit_number`, `title`, `weightage_marks`, `total_questions`, `topics` (JSON array)
5. **`Questions`**: `id`, `code`, `subject_id`, `unit_id`, `topic`, `bloom_level`, `marks`, `source_paper`, `question_text`, `correct_option` ('A'|'B'|'C'|'D'), `why_correct`, `trap_warning`, `exam_tip`, `peer_correct_pct`, `peer_distractor_stats` (JSON)
6. **`QuestionOptions`**: `id`, `question_id`, `option_letter` ('A'|'B'|'C'|'D'), `text`, `description`
7. **`TestSessions`**: `id`, `user_id`, `subject_id`, `unit_id`, `total_questions`, `score`, `status` ('in_progress'|'completed'|'abandoned'), `time_remaining_seconds`, `started_at`, `completed_at`
8. **`SessionAnswers`**: `id`, `session_id`, `question_id`, `selected_option`, `is_correct`, `marked_for_review`, `time_spent_seconds`, `submitted_at`
9. **`UserBookmarks`**: `id`, `user_id`, `question_id`, `created_at`
10. **`QuestionFlags`**: `id`, `user_id`, `question_id`, `reason`, `comments`, `created_at`
11. **`AIChatThreads`**: `id`, `user_id`, `subject_id`, `question_id`, `created_at`
12. **`AIChatMessages`**: `id`, `thread_id`, `sender` ('user'|'tutor'), `text`, `timestamp`, `suggested_action`

---

## Group 1: Authentication & Account Management

### 1.1 Sign Up (Register Account)

1. **Name**: Register New Student Account
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/auth/signup`
4. **Purpose**: Register a new MSBTE student account using email or enrollment number and initialize their default performance statistics.
5. **Auth Requirement**: Public (No Auth Token required)
6. **Parameters**: None
7. **Request Body**:
```json
{
  "name": "Faiz Khan",
  "emailOrEnrollment": "faizu2611@gmail.com",
  "password": "SecurePassword123!",
  "branch": "Computer / IT Engineering",
  "year": "TY Diploma",
  "authProvider": "email"
}
```
8. **Validation**:
   - `name`: String, required, 2–100 chars.
   - `emailOrEnrollment`: String, required, valid email OR 10-digit MSBTE enrollment string.
   - `password`: String, required, min 6 chars.
   - `branch`: String, enum: `["Computer / IT Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"]`.
   - `year`: String, enum: `["FY Diploma", "SY Diploma", "TY Diploma"]`.
   - `authProvider`: String, enum: `["email", "google"]`.
9. **Success Response**:
   - **Status Code**: `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "jwt_eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "id": "acc_1742211900",
      "name": "Faiz Khan",
      "emailOrEnrollment": "faizu2611@gmail.com",
      "branch": "Computer / IT Engineering",
      "year": "TY Diploma",
      "avatarUrl": "https://api.dicebear.com/7.x/initials/svg?seed=Faiz%20Khan&backgroundColor=2563eb&textColor=ffffff",
      "authProvider": "email",
      "createdAt": "2026-09-17T10:18:12.000Z"
    },
    "userStats": {
      "streakDays": 1,
      "solvedMCQs": 0,
      "attemptedMCQs": 0,
      "targetMCQs": 1000,
      "correctAnswers": 0,
      "overallAccuracy": 0,
      "weeklyGrowth": 0,
      "targetExam": "Summer 2025"
    }
  }
}
```
10. **Errors**:
    - `400 Bad Request`: `{"success": false, "error": "VALIDATION_ERROR", "message": "Please enter a valid email or 10-digit MSBTE enrollment number."}`
    - `409 Conflict`: `{"success": false, "error": "ACCOUNT_EXISTS", "message": "An account with this email/enrollment already exists."}`
11. **HTTP Status Codes**: `201`, `400`, `409`, `500`
12. **Database Entities**: `Users`, `UserStats`

---

### 1.2 Sign In (Authenticate)

1. **Name**: Student Sign In
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/auth/signin`
4. **Purpose**: Authenticate existing student using credentials or OAuth token exchange and return JWT session token.
5. **Auth Requirement**: Public
6. **Parameters**: None
7. **Request Body**:
```json
{
  "emailOrEnrollment": "MSBTE-2023-IT-0482",
  "password": "demoPassword123"
}
```
8. **Validation**:
   - `emailOrEnrollment`: String, required.
   - `password`: String, required.
9. **Success Response**:
   - **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "jwt_eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "id": "demo-pooja",
      "name": "Pooja S.",
      "emailOrEnrollment": "MSBTE-2023-IT-0482",
      "branch": "Computer / IT Engineering",
      "year": "TY Diploma",
      "avatarUrl": "https://lh3.googleusercontent.com/aida-public/...",
      "authProvider": "email",
      "createdAt": "2024-01-10T00:00:00.000Z"
    },
    "userStats": {
      "streakDays": 5,
      "solvedMCQs": 342,
      "attemptedMCQs": 342,
      "targetMCQs": 1000,
      "correctAnswers": 278,
      "overallAccuracy": 81,
      "weeklyGrowth": 4,
      "targetExam": "Summer 2025"
    }
  }
}
```
10. **Errors**:
    - `401 Unauthorized`: `{"success": false, "error": "INVALID_CREDENTIALS", "message": "Invalid email/enrollment or password."}`
    - `404 Not Found`: `{"success": false, "error": "USER_NOT_FOUND", "message": "No account found matching this enrollment ID."}`
11. **HTTP Status Codes**: `200`, `401`, `404`, `500`
12. **Database Entities**: `Users`, `UserStats`

---

### 1.3 Get Current User Profile & Stats

1. **Name**: Get Active Profile
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/user/me`
4. **Purpose**: Retrieve current logged-in user details and aggregate statistics.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: None
7. **Request Body**: None
8. **Validation**: Header `Authorization: Bearer <token>`
9. **Success Response**:
   - **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "demo-pooja",
    "name": "Pooja S.",
    "emailOrEnrollment": "MSBTE-2023-IT-0482",
    "branch": "Computer / IT Engineering",
    "year": "TY Diploma",
    "avatarUrl": "https://lh3.googleusercontent.com/aida-public/...",
    "authProvider": "email",
    "userStats": {
      "streakDays": 5,
      "solvedMCQs": 342,
      "attemptedMCQs": 342,
      "targetMCQs": 1000,
      "correctAnswers": 278,
      "overallAccuracy": 81,
      "weeklyGrowth": 4,
      "targetExam": "Summer 2025"
    }
  }
}
```
10. **Errors**: `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`, `500`
12. **Database Entities**: `Users`, `UserStats`

---

## Group 2: Curriculum & Syllabus Map

### 2.1 List Enrolled Subjects

1. **Name**: List Subjects & Progress
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/subjects`
4. **Purpose**: Fetch all active curriculum subjects enrolled by the student along with unit-wise stats.
5. **Auth Requirement**: Bearer JWT (Optional/Public default available)
6. **Parameters**:
   - Query `branch` (string, optional): Filter by branch (e.g. `Computer / IT`).
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**:
   - **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "man-22509",
      "code": "22509",
      "title": "Management",
      "branch": "TY Diploma • Comp / IT",
      "scheme": "MSBTE 'I' Scheme",
      "unitsCount": 5,
      "totalMCQs": 1000,
      "completedCount": 195,
      "masteredCount": 195,
      "accuracyPercentage": 78,
      "statusBadge": "78% completed",
      "lastActive": "2 hrs ago",
      "units": [
        {
          "id": 1,
          "number": 1,
          "title": "Overview of Business",
          "topics": ["Types of business", "Globalization", "Industrial sectors", "Intellectual Property"],
          "totalQuestions": 200,
          "completedQuestions": 85,
          "masteryPercentage": 85,
          "accuracyPercentage": 88,
          "status": "Strong",
          "weightageMarks": 10
        },
        {
          "id": 2,
          "number": 2,
          "title": "Planning & Decision Making",
          "topics": ["Steps in planning", "Types of plans", "Decision making models", "Forecasting methods"],
          "totalQuestions": 200,
          "completedQuestions": 60,
          "masteryPercentage": 60,
          "accuracyPercentage": 52,
          "status": "Needs Practice",
          "weightageMarks": 14
        }
      ]
    }
  ]
}
```
10. **Errors**: `500 Internal Server Error`
11. **HTTP Status Codes**: `200`, `500`
12. **Database Entities**: `Subjects`, `Units`

---

### 2.2 Get Subject Details & Units

1. **Name**: Get Subject Details
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/subjects/:subjectId`
4. **Purpose**: Retrieve unit list, topic weightage marks, and overall accuracy for a single subject.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**:
   - Path `subjectId` (string, required): e.g. `man-22509` or `est-22447`.
7. **Request Body**: None
8. **Validation**: `subjectId` must exist in database.
9. **Success Response**: `200 OK` (Single subject object with unit array).
10. **Errors**:
    - `404 Not Found`: `{"success": false, "error": "SUBJECT_NOT_FOUND", "message": "Subject ID does not exist."}`
11. **HTTP Status Codes**: `200`, `404`, `500`
12. **Database Entities**: `Subjects`, `Units`

---

### 2.3 Get Syllabus Blueprint Specification

1. **Name**: Get Syllabus Blueprint
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/syllabus/blueprint`
4. **Purpose**: Retrieve the official MSBTE I-Scheme exam blueprint, theory/PA marks structure, and Bloom's cognitive taxonomy distribution (Remembering 20-25%, Understanding 40-45%, Application 30-35%).
5. **Auth Requirement**: Public
6. **Parameters**: None
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**:
   - **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": {
    "scheme": "MSBTE 'I' Scheme",
    "examPattern": {
      "theoryMarks": 70,
      "passingMarks": 28,
      "progressiveAssessmentMarks": 30,
      "durationMinutes": 120
    },
    "bloomsTaxonomy": {
      "remembering": "20-25% (Definitions, Terms, Formulas)",
      "understanding": "40-45% (Explanations, Differences, Diagrams)",
      "application": "30-35% (Case Studies, Calculations, Fault Diagnosis)"
    },
    "subjectsWeightage": [
      {
        "code": "22509",
        "title": "Management",
        "totalWeightage": 70,
        "units": [
          { "unitNumber": 1, "title": "Overview of Business", "marks": 10 },
          { "unitNumber": 2, "title": "Planning & Decision Making", "marks": 14 },
          { "unitNumber": 3, "title": "Organizing & Staffing", "marks": 14 },
          { "unitNumber": 4, "title": "Directing & Controlling", "marks": 16 },
          { "unitNumber": 5, "title": "Forms of Business Organization", "marks": 16 }
        ]
      }
    ]
  }
}
```
10. **Errors**: `500 Internal Server Error`
11. **HTTP Status Codes**: `200`, `500`
12. **Database Entities**: `Subjects`, `Units`

---

## Group 3: Question Bank & Bookmarks

### 3.1 Fetch Questions

1. **Name**: Fetch Questions by Filter
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/questions`
4. **Purpose**: Retrieve question items filtered by subject, unit, count, and bloom level for practice mode.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**:
   - Query `subjectId` (string, required): e.g., `man-22509`.
   - Query `unitId` (integer, optional): `0` for all units, or `1..5`.
   - Query `limit` (integer, optional, default: 20): Max number of questions (`10`, `20`, `50`).
   - Query `bloomLevel` (string, optional): Filter by cognitive level.
7. **Request Body**: None
8. **Validation**:
   - `limit`: Integer, min 1, max 100.
9. **Success Response**:
   - **Status Code**: `200 OK`
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": "q1",
      "code": "MSBTE-22509-U2-001",
      "subjectId": "man-22509",
      "unitId": 2,
      "unitName": "Planning & Decision Making",
      "topic": "Concept of Planning",
      "bloomLevel": "R1 (Remembering)",
      "marks": 2,
      "sourcePaper": "MSBTE Summer 2023",
      "question": "What is the primary purpose of planning in an engineering organization?",
      "options": [
        { "id": "A", "text": "To bridge the gap between where we are and where we want to be", "description": "Sets clear milestones and resource allocation." },
        { "id": "B", "text": "To punish underperforming staff members", "description": "Disciplinary action is not planning." },
        { "id": "C", "text": "To replace all operational human labor with automation", "description": "A technology choice." },
        { "id": "D", "text": "To terminate existing product manufacturing lines", "description": "A divestment decision." }
      ],
      "correctOption": "A",
      "explanation": {
        "whyCorrect": "According to Koontz and O’Donnell, planning bridges the gap from where we are to where we want to go.",
        "trapWarning": "Do not confuse strategic re-organization with the fundamental definition of planning.",
        "examTip": "Remember the mnemonic P-O-C-C-C from Henry Fayol.",
        "peerAccuracy": { "correctPct": 91, "distractorStats": { "B": 2, "C": 5, "D": 2 } }
      }
    }
  ]
}
```
10. **Errors**: `400 Bad Request`, `401 Unauthorized`, `500`
11. **HTTP Status Codes**: `200`, `400`, `401`, `500`
12. **Database Entities**: `Questions`, `QuestionOptions`

---

### 3.2 Bookmark / Unbookmark Question

1. **Name**: Toggle Question Bookmark
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/questions/:questionId/bookmark`
4. **Purpose**: Bookmark or unbookmark a specific question for quick revision later.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Path `questionId` (string, required).
7. **Request Body**:
```json
{ "bookmarked": true }
```
8. **Validation**: `bookmarked`: Boolean, required.
9. **Success Response**: `200 OK`
```json
{ "success": true, "message": "Question bookmarked successfully.", "questionId": "q1", "bookmarked": true }
```
10. **Errors**: `404 Not Found`, `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`, `404`
12. **Database Entities**: `UserBookmarks`

---

### 3.3 Report / Flag Question

1. **Name**: Report Question Error
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/questions/:questionId/flag`
4. **Purpose**: Allow students to report typos, incorrect answer keys, or missing explanations in questions.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Path `questionId` (string, required).
7. **Request Body**:
```json
{
  "reason": "incorrect_key",
  "comments": "Option A matches MSBTE model paper 2023, but text specifies Option B."
}
```
8. **Validation**: `reason` enum: `["incorrect_key", "typo", "ambiguous", "out_of_syllabus"]`.
9. **Success Response**: `201 Created`
```json
{ "success": true, "message": "Report logged for review.", "flagId": "flag_91823" }
```
10. **Errors**: `400 Bad Request`, `404 Not Found`
11. **HTTP Status Codes**: `201`, `400`, `404`
12. **Database Entities**: `QuestionFlags`

---

## Group 4: Test Sessions & Submissions

### 4.1 Start Test Session

1. **Name**: Initialize Practice Session
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/sessions/start`
4. **Purpose**: Create a new timed test session with randomized or targeted questions.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: None
7. **Request Body**:
```json
{
  "subjectId": "man-22509",
  "unitId": 2,
  "questionCount": 20
}
```
8. **Validation**:
   - `subjectId`: String, required.
   - `unitId`: Integer, required (`0` for all units).
   - `questionCount`: Integer, enum: `[10, 20, 50]`.
9. **Success Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_9812739182",
    "subjectId": "man-22509",
    "unitId": 2,
    "timeRemainingSeconds": 900,
    "totalQuestions": 20,
    "questions": [ /* Array of 20 Question Objects */ ]
  }
}
```
10. **Errors**: `400 Bad Request`, `401 Unauthorized`
11. **HTTP Status Codes**: `201`, `400`, `401`
12. **Database Entities**: `TestSessions`, `Questions`

---

### 4.2 Submit Question Answer

1. **Name**: Record Answer Submission
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/sessions/:sessionId/answers`
4. **Purpose**: Record selected option for a question, evaluate correctness immediately, update unit mastery and user statistics.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Path `sessionId` (string, required).
7. **Request Body**:
```json
{
  "questionId": "q1",
  "selectedOption": "A",
  "timeSpentSeconds": 24
}
```
8. **Validation**:
   - `questionId`: String, required.
   - `selectedOption`: String, enum: `["A", "B", "C", "D"]`.
   - `timeSpentSeconds`: Integer, min 0.
9. **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "questionId": "q1",
    "selectedOption": "A",
    "correctOption": "A",
    "isCorrect": true,
    "marksAwarded": 2,
    "explanation": {
      "whyCorrect": "According to Koontz and O’Donnell, planning bridges the gap...",
      "trapWarning": "Do not confuse strategic re-organization...",
      "examTip": "Remember the mnemonic P-O-C-C-C from Henry Fayol."
    },
    "updatedUserStats": {
      "attemptedMCQs": 343,
      "correctAnswers": 279,
      "solvedMCQs": 343,
      "overallAccuracy": 81
    }
  }
}
```
10. **Errors**: `400 Bad Request`, `404 Session/Question Not Found`
11. **HTTP Status Codes**: `200`, `400`, `404`
12. **Database Entities**: `SessionAnswers`, `UserStats`, `Units`, `Subjects`

---

### 4.3 Toggle Mark for Review

1. **Name**: Toggle Question Review Flag
2. **HTTP Method**: `PATCH`
3. **URL**: `/api/v1/sessions/:sessionId/review-flag`
4. **Purpose**: Flag or unflag a question for review during an active test session.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Path `sessionId` (string, required).
7. **Request Body**:
```json
{
  "questionId": "q3",
  "markedForReview": true
}
```
8. **Validation**: `markedForReview`: Boolean, required.
9. **Success Response**: `200 OK`
```json
{ "success": true, "questionId": "q3", "markedForReview": true }
```
10. **Errors**: `404 Not Found`
11. **HTTP Status Codes**: `200`, `404`
12. **Database Entities**: `SessionAnswers`

---

### 4.4 Finish & Complete Test Session

1. **Name**: Finalize Test Session
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/sessions/:sessionId/finish`
4. **Purpose**: Finalize session, calculate total score, accuracy, board percentile rank, and generate AI recommendations.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Path `sessionId` (string, required).
7. **Request Body**:
```json
{
  "totalTimeSpentSeconds": 765
}
```
8. **Validation**: `totalTimeSpentSeconds`: Integer, min 0.
9. **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_9812739182",
    "score": 16,
    "total": 20,
    "accuracyPercentage": 80,
    "grade": "Passed with Distinction",
    "timeSpent": "12m 45s",
    "avgSpeedPerQuestion": "38s/q",
    "boardPercentileRank": "Top 12%",
    "projectedBoardGrade": "O Grade (>85%)",
    "aiRecommendation": "You have a solid grasp of basic definitions, but tricky distinction questions between Strategic and Tactical plans cost you 2 marks. Review Unit 2 Section B.",
    "questionResults": [
      { "questionId": "q1", "num": 1, "isCorrect": true },
      { "questionId": "q4", "num": 4, "isCorrect": false }
    ]
  }
}
```
10. **Errors**: `404 Not Found`, `400 Already Completed`
11. **HTTP Status Codes**: `200`, `400`, `404`
12. **Database Entities**: `TestSessions`, `SessionAnswers`, `UserStats`

---

## Group 5: Analytics, Telemetry & Diagnostics

### 5.1 Get Overall Learning Progress

1. **Name**: Get Performance Analytics
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/analytics/progress`
4. **Purpose**: Provide high-level dashboard diagnostic metrics (attempted MCQs, accuracy, subject performance matrix).
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: None
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "coveragePercentage": 34,
    "accuracyPercentage": 81,
    "distinctionZone": true,
    "attemptedMCQs": 342,
    "targetMCQs": 1000,
    "correctAnswers": 278,
    "subjectMatrix": [
      {
        "code": "22509",
        "title": "Management",
        "accuracyPercentage": 78,
        "completedCount": 195,
        "totalMCQs": 250
      },
      {
        "code": "22447",
        "title": "Environmental Studies",
        "accuracyPercentage": 86,
        "completedCount": 215,
        "totalMCQs": 250
      }
    ]
  }
}
```
10. **Errors**: `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`
12. **Database Entities**: `UserStats`, `Subjects`, `Units`

---

### 5.2 Get 14-Day Accuracy Momentum

1. **Name**: Get Accuracy Momentum Trend
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/analytics/momentum`
4. **Purpose**: Retrieve historical 14-day daily accuracy trajectory data points for SVG chart rendering.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Query `days` (integer, optional, default: 14).
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "growthPercentage": 19,
    "consecutiveDays": 5,
    "projectedScore": 88,
    "points": [
      { "day": "Day 1", "date": "2026-09-01", "accuracy": 62, "count": 20 },
      { "day": "Day 4", "date": "2026-09-04", "accuracy": 71, "count": 45 },
      { "day": "Day 8", "date": "2026-09-08", "accuracy": 76, "count": 50 },
      { "day": "Day 11", "date": "2026-09-11", "accuracy": 80, "count": 65 },
      { "day": "Today", "date": "2026-09-14", "accuracy": 81, "count": 35 }
    ]
  }
}
```
10. **Errors**: `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`
12. **Database Entities**: `SessionAnswers`, `TestSessions`

---

### 5.3 Get Weak Topics Diagnostic

1. **Name**: Get Weak Topics Priority List
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/analytics/weak-topics`
4. **Purpose**: Identify top 3 curriculum units where the student's first-attempt accuracy is lowest.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: None
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "weak-1",
      "subjectCode": "22509",
      "subjectName": "Management",
      "unitNumber": 2,
      "unitName": "Planning & Decision Making",
      "accuracy": 52,
      "questionsMissed": 18,
      "estimatedMinutes": 8,
      "recommendedQuestions": 15
    },
    {
      "id": "weak-2",
      "subjectCode": "22447",
      "subjectName": "Environmental Studies",
      "unitNumber": 3,
      "unitName": "Environmental Pollution",
      "accuracy": 59,
      "questionsMissed": 14,
      "estimatedMinutes": 10,
      "recommendedQuestions": 20
    }
  ]
}
```
10. **Errors**: `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`
12. **Database Entities**: `SessionAnswers`, `Units`

---

## Group 6: AI Tutor Doubt Solver Engine

### 6.1 Send Prompt to AI Tutor

1. **Name**: Ask AI Tutor Question
2. **HTTP Method**: `POST`
3. **URL**: `/api/v1/ai-tutor/chat`
4. **Purpose**: Interact with the 24/7 AI Tutor to get instant contextual explanations, MSBTE model answer definitions, or exam format comparisons.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: None
7. **Request Body**:
```json
{
  "subjectCode": "22509",
  "questionId": "q7",
  "message": "Explain planning in simple language with a real-life engineering college example."
}
```
8. **Validation**:
   - `message`: String, required, min 2 chars, max 1000 chars.
   - `subjectCode`: String, required.
9. **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg-1742211990",
      "sender": "user",
      "text": "Explain planning in simple language with a real-life engineering college example.",
      "timestamp": "11:43 AM"
    },
    "tutorMessage": {
      "id": "msg-1742211992",
      "sender": "tutor",
      "text": "Planning simply means **thinking before acting**...\n\n### 🎓 Engineering College Example: Capstone Project\n...",
      "timestamp": "11:43 AM",
      "suggestedAction": "Generate practice question on Planning Steps"
    }
  }
}
```
10. **Errors**:
    - `400 Bad Request`: Invalid message payload.
    - `429 Too Many Requests`: Rate limit exceeded (max 30 requests/min).
11. **HTTP Status Codes**: `200`, `400`, `429`, `500`
12. **Database Entities**: `AIChatThreads`, `AIChatMessages`

---

### 6.2 Get Chat History

1. **Name**: Retrieve AI Chat Thread
2. **HTTP Method**: `GET`
3. **URL**: `/api/v1/ai-tutor/history`
4. **Purpose**: Retrieve prior message exchange history for active context thread.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Query `questionId` (string, optional).
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**: `200 OK` (Array of ChatMessage objects).
10. **Errors**: `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`
12. **Database Entities**: `AIChatThreads`, `AIChatMessages`

---

### 6.3 Reset Chat Thread

1. **Name**: Reset AI Conversation
2. **HTTP Method**: `DELETE`
3. **URL**: `/api/v1/ai-tutor/reset`
4. **Purpose**: Clear active AI Tutor chat messages and restore initial welcome state.
5. **Auth Requirement**: Bearer JWT Required
6. **Parameters**: Query `questionId` (string, optional).
7. **Request Body**: None
8. **Validation**: None
9. **Success Response**: `200 OK`
```json
{ "success": true, "message": "AI Tutor chat history reset successfully." }
```
10. **Errors**: `401 Unauthorized`
11. **HTTP Status Codes**: `200`, `401`
12. **Database Entities**: `AIChatMessages`, `AIChatThreads`

---

## Global HTTP Error Schema Standard

All non-2xx responses follow a strict error contract:

```json
{
  "success": false,
  "error": "ERROR_CODE_IDENTIFIER",
  "message": "Human readable explanation of the error",
  "details": [
    { "field": "emailOrEnrollment", "issue": "Invalid format" }
  ]
}
```

### Standard Status Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Missing/malformed payload parameters.
- `401 Unauthorized`: Token missing or invalid.
- `403 Forbidden`: Resource not owned by requesting user.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Resource (e.g. user enrollment) already exists.
- `429 Too Many Requests`: Rate limit hit.
- `500 Internal Server Error`: Unhandled server exception.
