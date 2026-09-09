# StudyLens — Smart Study Materials Platform (Backend & Full-Stack Integration)

A comprehensive, production-grade learning management platform tailored for college students, faculty educators, and institutional administrators. StudyLens transforms course notes into an active study workflow:
1. **Learn → Notes**
2. **Practice → Examples**
3. **Speak → Viva**
4. **Test → Quiz**
5. **Discuss → Group Study**
6. **Revise → Flashcards**

---

## 1. Backend Stack & Architecture

- **Runtime**: Node.js (v20+) with TypeScript
- **Web Framework**: Express.js
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with role-based access control (RBAC)
- **Security**: Bcrypt password hashing, CORS whitelist, parameter validation, centralized error handling
- **Frontend**: React with Vite & Tailwind CSS

```
backend/
├── src/
│   ├── config/              # Centralized environment and secret configs
│   ├── controllers/         # Request handling for Auth, Notes, Examples, Viva, Quiz, Groups, Flashcards, Progress
│   ├── middleware/          # JWT authentication & Role guards (STUDENT, TEACHER, ADMIN), Error handler
│   ├── routes/              # Express API routers
│   ├── services/            # Database store & Prisma ORM service abstractions
│   ├── utils/               # JWT sign/verify, Bcrypt password hash, Response formatters
│   ├── validators/          # Input sanity and email validators
│   ├── app.ts               # Express app creation & middleware assembly
│   └── server.ts            # Standalone backend server runner
├── prisma/
│   ├── schema.prisma        # Complete PostgreSQL relational schema with foreign keys
│   └── seed.ts              # Seeding script for demo curriculum and users
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 2. Demo Login Credentials

| Role | Name | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Alex Chen | `student@studylens.edu` | `Student@123` | Read notes, practice examples, take viva, take quizzes, review flashcards, join study groups |
| **Teacher** | Dr. Sarah Jenkins | `teacher@studylens.edu` | `Teacher@123` | Upload & edit notes, create examples, configure viva questions, publish quizzes, manage flashcards |
| **Admin** | Marcus Vance | `admin@studylens.edu` | `Admin@123` | Oversee subjects, curriculum units, manage student/faculty rosters, view audit logs |

---

## 3. Database Models & Prisma Relationships

Defined in `prisma/schema.prisma`:
- **User**: `STUDENT`, `TEACHER`, `ADMIN` with relations to Notes, Quizzes, Flashcards, Progress, and Study Groups.
- **Subject**: Academic subjects (e.g., Data Structures, Operating Systems).
- **Unit**: Curriculum units linked to Subjects via foreign key `subjectId`.
- **Topic**: Topics linked to Units via foreign key `unitId`.
- **Note**: Content documents authored by Teachers (`createdBy`) with full Markdown support.
- **Example**: Solved examples and practice problems categorized by difficulty (`EASY`, `MEDIUM`, `HARD`).
- **VivaQuestion & VivaAttempt**: Conceptual interview questions and score tracking. Correct answers are kept hidden from students before submission.
- **Quiz, QuizQuestion & QuizAttempt**: Multi-choice diagnostic tests. Scoring and percentage calculations are computed server-side with anti-leak protection.
- **Flashcard & FlashcardReview**: Active recall flashcards with per-student review timestamps.
- **StudyGroup, GroupMember & GroupMessage**: Collaborative peer study rooms with messaging.
- **StudentProgress**: Granular learning progress tracking completion across notes, practice, viva, quizzes, and flashcards.

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js >= 20.x
- npm >= 9.x
- PostgreSQL instance (optional locally; backend includes built-in persistent fallback store if Postgres is not running)

### Step 1: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` as required:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/studylens?schema=public"
JWT_SECRET="studylens-hackathon-super-secret-jwt-key-2026"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="*"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Prisma Migration & Client Generation
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 4: Seed Demo Data
```bash
npx tsx prisma/seed.ts
```

### Step 5: Start Development Server
To run the unified full-stack application (Express API + React Frontend together on port 3000):
```bash
npm run dev
```

Or to run the backend as a standalone service:
```bash
cd backend
npm run dev
```

---

## 5. API Reference

All responses follow a consistent JSON envelope:
- **Success**: `{ "success": true, "data": { ... } }`
- **Error**: `{ "success": false, "message": "Error description" }`

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register student or faculty member.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile.

### Learn → Notes (`/api/notes`, `/api/subjects`, `/api/units`, `/api/topics`)
- `GET /api/subjects` — List all subjects.
- `GET /api/subjects/:subjectId/units` — List units in a subject.
- `GET /api/units/:unitId/topics` — List topics in a unit.
- `GET /api/topics/:topicId/notes` — Get notes for a topic.
- `GET /api/notes/:noteId` — Retrieve single note.
- `POST /api/notes` — *(Teacher/Admin only)* Create new note.
- `PUT /api/notes/:id` — *(Teacher/Admin only)* Update note.
- `DELETE /api/notes/:id` — *(Teacher/Admin only)* Delete note.

### Practice → Examples (`/api/examples`, `/api/topics`)
- `GET /api/topics/:topicId/examples` — List examples by topic (filter by `?difficulty=EASY|MEDIUM|HARD`).
- `GET /api/examples/:id` — View single example with solution.
- `POST /api/examples` — *(Teacher/Admin only)* Add practice problem.
- `PUT /api/examples/:id` — *(Teacher/Admin only)* Edit problem or solution.
- `DELETE /api/examples/:id` — *(Teacher/Admin only)* Delete example.

### Speak → Viva (`/api/viva`, `/api/topics`, `/api/students`)
- `GET /api/topics/:topicId/viva` — Get viva questions (expected answers masked for students).
- `POST /api/viva/attempts` — Submit verbal/text viva response for semantic keyword scoring.
- `GET /api/students/:studentId/viva-attempts` — View student viva history and scores.
- `POST /api/viva` — *(Teacher/Admin only)* Create new viva question with rubric.

### Test → Quiz (`/api/quizzes`, `/api/topics`)
- `GET /api/topics/:topicId/quizzes` — List quizzes for a topic.
- `GET /api/quizzes/:quizId` — Get quiz with questions (correct answers masked for students).
- `POST /api/quizzes/:quizId/attempt` — Submit answers, receive instant score, percentage, and detailed feedback.
- `POST /api/quizzes` — *(Teacher/Admin only)* Create quiz.
- `PUT /api/quizzes/:quizId` — *(Teacher/Admin only)* Update quiz.
- `DELETE /api/quizzes/:quizId` — *(Teacher/Admin only)* Delete quiz.

### Discuss → Group Study (`/api/groups`)
- `GET /api/groups` — List available study groups and member counts.
- `POST /api/groups` — Create a new study group.
- `GET /api/groups/:groupId` — View group details and participant roster.
- `POST /api/groups/:groupId/join` — Join a study group.
- `POST /api/groups/:groupId/leave` — Leave a study group.
- `GET /api/groups/:groupId/messages` — Fetch group discussion chat thread.
- `POST /api/groups/:groupId/messages` — Post message into group chat.

### Revise → Flashcards (`/api/flashcards`, `/api/topics`, `/api/students`)
- `GET /api/topics/:topicId/flashcards` — Fetch flashcards with review indicators.
- `GET /api/flashcards/:id` — View single flashcard.
- `POST /api/flashcards/:id/review` — Record student review session.
- `GET /api/students/:studentId/flashcard-progress` — View student flashcard mastery metrics.
- `POST /api/flashcards` — *(Teacher/Admin only)* Add flashcard.
- `PUT /api/flashcards/:id` — *(Teacher/Admin only)* Edit flashcard.
- `DELETE /api/flashcards/:id` — *(Teacher/Admin only)* Delete flashcard.

### Student Progress (`/api/students`)
- `GET /api/students/:studentId/progress` — Topic-by-topic mastery stats.
- `GET /api/students/:studentId/dashboard` — Aggregated dashboard statistics (quizzes, viva, notes, flashcards).
- `PUT /api/students/:studentId/progress/:topicId` — Update notes and practice completion status.
