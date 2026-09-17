# DiplomaPrep.AI — Backend API Server

Production-grade Express + TypeScript + SQLite REST API server for DiplomaPrep.AI (MSBTE 'I' Scheme Examination Engine).

---

## Technical Features

- **Framework**: Express.js with TypeScript (`tsx` dev runner)
- **Database**: SQLite3 via `better-sqlite3` (WAL mode enabled, foreign key constraints active)
- **Authentication**: JWT Bearer token authentication & bcrypt password hashing
- **Validation**: Schema-based validation using Zod
- **Database Seeding**: Automatic DB initialization & seeding on launch (Subjects, Units, Question Bank with options & explanations)

---

## Quick Start

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Setup
The `.env` file is pre-configured for local development:
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=diplomaprep_super_secret_jwt_key_2026
DATABASE_PATH=database.sqlite
CORS_ORIGIN=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```

Server will launch at `http://localhost:4000`.

### 4. Run Automated API Verification Suite
```bash
npm run test:api
```

---

## Core Endpoint Reference

Base URL: `http://localhost:4000/api/v1`

| Module | Method | Endpoint | Description | Auth |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/signup` | Register new student account | Public |
| **Auth** | `POST` | `/auth/signin` | Sign in & acquire JWT | Public |
| **Auth** | `GET` | `/user/me` | Fetch active user profile & stats | Bearer |
| **Curriculum** | `GET` | `/subjects` | List subjects & unit completion stats | Public |
| **Curriculum** | `GET` | `/subjects/:subjectId` | Get detailed unit breakdown | Bearer |
| **Curriculum** | `GET` | `/syllabus/blueprint` | Get MSBTE exam blueprint | Public |
| **Questions** | `GET` | `/questions` | Query question bank by filters | Bearer |
| **Questions** | `POST` | `/questions/:id/bookmark` | Toggle question bookmark | Bearer |
| **Questions** | `POST` | `/questions/:id/flag` | Report question error | Bearer |
| **Sessions** | `POST` | `/sessions/start` | Initialize practice session | Bearer |
| **Sessions** | `POST` | `/sessions/:id/answers` | Submit question answer & evaluate | Bearer |
| **Sessions** | `PATCH` | `/sessions/:id/review-flag` | Flag question for review | Bearer |
| **Sessions** | `POST` | `/sessions/:id/finish` | Finalize session & get score report | Bearer |
| **Analytics** | `GET` | `/analytics/progress` | Get dashboard telemetry | Bearer |
| **Analytics** | `GET` | `/analytics/momentum` | Get 14-day momentum trend | Bearer |
| **Analytics** | `GET` | `/analytics/weak-topics` | Get weak priority units | Bearer |
| **AI Tutor** | `POST` | `/ai-tutor/chat` | Send prompt to AI Tutor | Bearer |
| **AI Tutor** | `GET` | `/ai-tutor/history` | Get conversation thread history | Bearer |
| **AI Tutor** | `DELETE` | `/ai-tutor/reset` | Reset chat thread history | Bearer |
