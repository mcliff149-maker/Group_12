# ILES — Internship Logging & Evaluation System

ILES is a full-stack internship management platform. The system supports four
roles — **student**, **supervisor**, **academic**, and **admin** — and includes
weekly logs, timesheets, supervisor verifications, academic reviews, and
weighted grade computation.

---

## Repository layout

| Directory | Description |
|-----------|-------------|
| `backend/` | **Combined Django backend** (REST API + Django admin/template views) |
| `Frontend_2/` | **Combined React frontend** (Vite, role-based routing) |
| `Backend2/` | Legacy FastAPI service (archived — functionality merged into `backend/`) |
| `frontend/` | Legacy plain-HTML + React prototype (archived) |

---

## Running locally (recommended setup)

### Prerequisites

| Tool | Minimum version |
|------|----------------|
| Python | 3.10+ |
| Node.js | 18+ |
| pip | latest |
| npm | latest |

---

### 1 — Start the Django backend

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows (PowerShell):
# .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# (Optional) Create a Django admin superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver 8000
```

The API is now available at **`http://localhost:8000`**.

Interactive API docs provided by Django admin: `http://localhost:8000/admin/`

---

### 2 — Start the React frontend

Open a **second terminal**:

```bash
cd Frontend_2

# Install dependencies
npm install

# Create the environment file that points to the Django backend
cp .env.local.example .env.local
# (The file already contains VITE_API_BASE_URL=http://localhost:8000/api)

# Start Vite dev server
npm run dev
```

The app is now at **`http://localhost:5173`**.

---

### 3 — Create your first account

Visit `http://localhost:5173/signup` and create an account with your chosen role.

> **Tip:** create at least one account for each role (student, supervisor, academic, admin)
> to explore the full feature set.

---

## API overview

The Django backend exposes both session-based HTML views and a JWT REST API.

### JWT REST API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signin` | — | Sign in → `{user, token}` |
| POST | `/api/auth/signup` | — | Register a new user |
| GET  | `/api/auth/me` | ✓ | Current user |
| GET  | `/api/admin/users` | admin | List all users |
| POST | `/api/admin/users` | admin | Create a user |
| PATCH | `/api/admin/users/:username/toggle-disable` | admin | Enable/disable user |
| GET  | `/api/students/:username/logs` | student/academic/admin | List logs |
| POST | `/api/students/:username/logs` | student | Create log |
| PUT  | `/api/students/:username/logs/:id` | student | Update log |
| DELETE | `/api/students/:username/logs/:id` | student | Delete log |
| GET  | `/api/students/:username/timesheets` | student/academic/admin | List timesheets |
| POST | `/api/students/:username/timesheets` | student | Create timesheet entry |
| PUT  | `/api/students/:username/timesheets/:id` | student | Update timesheet entry |
| DELETE | `/api/students/:username/timesheets/:id` | student | Delete timesheet entry |
| GET  | `/api/supervisors/students` | supervisor/admin | List students |
| GET  | `/api/supervisors/verifications` | supervisor/admin | List verifications |
| POST | `/api/supervisors/verifications` | supervisor/admin | Create verification |
| GET  | `/api/academic/reviews` | academic/admin | List reviews |
| POST | `/api/academic/reviews` | academic/admin | Create review |
| GET  | `/api/academic/students/:username/logs` | academic/admin | View student logs |

All protected endpoints require an `Authorization: Bearer <token>` header.

---

## Environment variables

### Backend (`backend/`)

Django reads settings from environment variables or the defaults in `settings.py`.

| Variable | Default | Description |
|----------|---------|-------------|
| `DJANGO_SECRET_KEY` | insecure dev key | Set a strong random value in production |
| `DJANGO_DEBUG` | `True` | Set to `False` for production |
| `DJANGO_ALLOWED_HOSTS` | `*` | Comma-separated allowed hosts |

### Frontend (`Frontend_2/`)

Create `Frontend_2/.env.local` (copy from `.env.local.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | *(unset — localStorage mode)* | Set to `http://localhost:8000/api` to use the Django backend |

> When `VITE_API_BASE_URL` is **not set**, the frontend runs fully in-browser using localStorage (no backend required).

---

## Django admin & template views

Classic Django views (session-based, server-rendered) are still available at:

- `http://localhost:8000/admin/` — Django admin panel  
- `http://localhost:8000/login/` — Login  
- `http://localhost:8000/dashboard/` — Role-based dashboard redirect  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError: djangorestframework` | Run `pip install -r requirements.txt` inside the `backend/` directory |
| CORS errors in browser | Ensure the backend is running on port 8000 and `VITE_API_BASE_URL` in `.env.local` matches |
| 401 on every API call | Check that `Authorization: Bearer <token>` is being sent; token is stored in `localStorage` under `iles_f2_session` |
| Port already in use | Change the port: `python manage.py runserver 8001` and update `VITE_API_BASE_URL` accordingly |
| Stale localStorage data | Open browser DevTools → Application → Storage → clear `iles_f2_*` keys |

