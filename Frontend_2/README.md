# ILES Frontend 2

Internship Logging and Evaluation System – React frontend built with Vite.

## Setup

```bash
npm install
npm run dev
```

## Demo Accounts

| Username    | Password  | Role                  |
|-------------|-----------|------------------------|
| student1    | pass123   | Student                |
| student2    | pass123   | Student                |
| academic1   | pass123   | Academic Supervisor    |
| supervisor1 | pass123   | Internship Supervisor  |
| admin       | admin123  | Admin                  |

## Tech Stack

- Vite + React 18 (functional components + hooks)
- React Router v6
- localStorage for data persistence (mock API)
- Pastel CSS theme via CSS variables

---

## Backend (Node.js / Express)

A real backend lives under `backend/`.  The frontend falls back to its
localStorage mock API when the backend is not configured.

### Quick start

```bash
# 1. Install dependencies
cd Frontend_2/backend
npm install

# 2. Copy and edit the environment file
cp .env.example .env
# Edit .env – at minimum set JWT_SECRET to something random

# 3. Start the dev server (auto-restarts on file changes)
npm run dev
# → http://localhost:4000
```

### Environment variables (`.env`)

| Variable        | Default                    | Description                              |
|-----------------|----------------------------|------------------------------------------|
| `PORT`          | `4000`                     | Port the API listens on                  |
| `CORS_ORIGIN`   | `http://localhost:5173`    | Comma-separated allowed origins          |
| `JWT_SECRET`    | `change_me_in_production`  | Secret used to sign JWT tokens           |
| `JWT_EXPIRES_IN`| `7d`                       | Token lifetime (e.g. `1h`, `7d`)         |
| `DATA_STORE`    | `memory`                   | `memory` (lost on restart) or `file`     |
| `DATA_DIR`      | `./data`                   | Directory for JSON files (file store)    |

### Pointing the frontend at the backend

Create `Frontend_2/.env.local` (ignored by git):

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Then restart the Vite dev server.  All API calls will now go to the
backend; if you remove / unset this variable the app silently falls
back to localStorage.

### API routes

| Method | Path                                          | Auth required | Description                    |
|--------|-----------------------------------------------|---------------|--------------------------------|
| POST   | `/api/auth/signin`                            | –             | Sign in, returns JWT           |
| POST   | `/api/auth/signup`                            | –             | Register a new account         |
| GET    | `/api/auth/me`                                | ✓             | Current user from token        |
| GET    | `/api/admin/users`                            | admin         | List all users                 |
| POST   | `/api/admin/users`                            | admin         | Create user (any role)         |
| PATCH  | `/api/admin/users/:username/toggle-disable`   | admin         | Enable / disable user          |
| GET    | `/api/students/:username/logs`                | ✓             | Get logs for a student         |
| POST   | `/api/students/:username/logs`                | student       | Create a log entry             |
| PUT    | `/api/students/:username/logs/:id`            | student       | Update a log entry             |
| DELETE | `/api/students/:username/logs/:id`            | student       | Delete a log entry             |
| GET    | `/api/students/:username/timesheets`          | ✓             | Get timesheets for a student   |
| POST   | `/api/students/:username/timesheets`          | student       | Create a timesheet entry       |
| PUT    | `/api/students/:username/timesheets/:id`      | student       | Update a timesheet entry       |
| DELETE | `/api/students/:username/timesheets/:id`      | student       | Delete a timesheet entry       |
| GET    | `/api/academic/reviews`                       | academic      | Get reviews by this academic   |
| POST   | `/api/academic/reviews`                       | academic      | Submit a review                |
| GET    | `/api/academic/students/:username/logs`       | academic      | Get a student's logs for review|
| GET    | `/api/supervisors/students`                   | supervisor    | List student accounts          |
| GET    | `/api/supervisors/verifications`              | supervisor    | Get my verifications           |
| POST   | `/api/supervisors/verifications`              | supervisor    | Submit a verification          |
| GET    | `/api/health`                                 | –             | Health check                   |

### Example requests

**Sign in**
```bash
curl -X POST http://localhost:4000/api/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{"username":"student1","password":"pass123","role":"student"}'
```

**Create a log (use the token from sign-in)**
```bash
curl -X POST http://localhost:4000/api/students/student1/logs \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
    "weekNumber": 1,
    "logDate": "2024-01-15",
    "company": "Acme Corp",
    "activities": "Implemented new feature",
    "challenges": "Debugging async code",
    "learningOutcomes": "Learned about React hooks",
    "hoursWorked": 8,
    "status": "Draft"
  }'
```

### Data stores

- **memory** (default) – data lives in-process; resets on restart.  Great for quick testing.
- **file** – each collection is persisted as a JSON file in `DATA_DIR`.
  Equivalent to localStorage but server-side; easy to inspect and edit.

Swapping to a real database requires only replacing the methods in
`backend/src/services/store/` – the service layer and routes are fully
decoupled from the persistence mechanism.
