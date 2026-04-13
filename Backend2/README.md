# ILES Backend 2 — FastAPI + SQLite + JWT

A lightweight REST API for the **ILES (Internship Logging & Evaluation System)** built with:

| Layer | Technology |
|-------|-----------|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| Database | SQLite (file-based) via [SQLAlchemy 2](https://docs.sqlalchemy.org/) |
| Authentication | JWT (access + refresh tokens) via [python-jose](https://github.com/mpdavis/python-jose) |
| Password hashing | [bcrypt](https://github.com/pyca/bcrypt/) |
| Validation | [Pydantic v2](https://docs.pydantic.dev/) |
| ASGI server | [Uvicorn](https://www.uvicorn.org/) |

OpenAPI docs are served automatically at **`/docs`** (Swagger UI) and **`/redoc`**.

---

## Project layout

```
Backend2/
├── main.py                  # Entrypoint (uvicorn target)
├── requirements.txt
├── .env.example             # Copy to .env and edit
├── app/
│   ├── main.py              # FastAPI app factory, startup hooks, routers
│   ├── config.py            # Settings from environment variables
│   ├── database.py          # SQLAlchemy engine, session, Base
│   ├── dependencies.py      # get_db, get_current_user, etc.
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── course.py
│   │   └── lesson.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   └── auth.py
│   ├── routers/             # FastAPI route handlers
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── courses.py
│   │   └── lessons.py
│   └── services/            # Business logic / DB queries
│       ├── auth.py
│       ├── users.py
│       ├── courses.py
│       └── lessons.py
└── scripts/
    └── curl_examples.sh     # Quick smoke-test with curl
```

---

## Quick start

### Prerequisites

- Python 3.11+ (3.10+ works too)
- `pip` / `venv`

### 1 — Clone & enter the directory

```bash
# from the repo root
cd Backend2
```

### 2 — Create and activate a virtual environment

**macOS / Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows (PowerShell)**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt)**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

### 3 — Install dependencies

```bash
pip install -r requirements.txt
```

### 4 — Configure environment (optional)

Copy the example file and edit values as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `sqlite:///./iles.db` | SQLAlchemy database URL |
| `JWT_SECRET` | `change-me-in-production` | **Change this in production!** |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Access token lifetime (minutes) |
| `REFRESH_TOKEN_EXPIRE_MINUTES` | `10080` | Refresh token lifetime (7 days) |
| `DEBUG` | `false` | Enable debug mode |

### 5 — Run the server

```bash
# From the Backend2/ directory
uvicorn app.main:app --reload
```

Or using the convenience wrapper:

```bash
python main.py
```

The API is now available at **`http://localhost:8000`**.

---

## Database

Tables are created automatically on first startup — no migrations needed for development.

The SQLite file is written to `Backend2/iles.db` by default.

> **Production tip:** Set `DB_URL=postgresql+psycopg2://user:pass@host/dbname` and add Alembic for migrations.

---

## API endpoints

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Server health check |

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login → JWT tokens |
| POST | `/api/auth/refresh` | — | Refresh access token |
| GET | `/api/auth/me` | ✓ | Current user info |

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/` | admin | List all users |
| GET | `/api/users/{id}` | ✓ | Get user (own or admin) |
| PATCH | `/api/users/{id}` | ✓ | Update user (own or admin) |
| DELETE | `/api/users/{id}` | admin | Delete user |

### Courses

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/courses/` | — | List all courses |
| POST | `/api/courses/` | ✓ | Create a course |
| GET | `/api/courses/{id}` | — | Get course + lessons |
| PATCH | `/api/courses/{id}` | ✓ owner/admin | Update course |
| DELETE | `/api/courses/{id}` | ✓ owner/admin | Delete course |

### Lessons

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/lessons/` | — | List lessons (filter by `?course_id=`) |
| POST | `/api/lessons/` | ✓ owner/admin | Create lesson |
| GET | `/api/lessons/{id}` | — | Get lesson |
| PATCH | `/api/lessons/{id}` | ✓ owner/admin | Update lesson |
| DELETE | `/api/lessons/{id}` | ✓ owner/admin | Delete lesson |

Interactive Swagger UI: **`http://localhost:8000/docs`**

---

## Curl examples

Run the bundled smoke-test script (server must be running):

```bash
bash scripts/curl_examples.sh
```

### Register

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","full_name":"Alice Smith","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

### Create a course (authenticated)

```bash
TOKEN="<access_token_from_login>"

curl -X POST http://localhost:8000/api/courses/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Python Fundamentals","description":"Learn Python from scratch"}'
```

### Create a lesson

```bash
curl -X POST http://localhost:8000/api/lessons/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Variables & Types","content":"Everything about Python types.","order":1,"course_id":1}'
```

---

## Running tests

No automated test suite is included in this initial version. Use the Swagger UI at `/docs` or the `scripts/curl_examples.sh` script for manual testing.

---

## Security notes

- Always set a strong `JWT_SECRET` in production.
- Rotate `JWT_SECRET` if compromised (invalidates all existing tokens).
- Switch from SQLite to PostgreSQL for production deployments.
- Consider adding HTTPS (e.g., via a reverse proxy like nginx or Caddy).
