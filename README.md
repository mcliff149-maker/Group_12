# ILES — Internship Logging & Evaluation System

This repository contains multiple local development stacks:

- `frontend/` — plain HTML/CSS/JS app (localStorage)
- `frontend/react-app/` — React prototype app (localStorage)
- `Frontend_2/` — React app with optional Node API (`Frontend_2/backend/`)
- `backend/` — Django backend
- `Backend2/` — Python API service

No demo accounts or fixed demo credentials are preloaded.

## Prerequisites

- Node.js 18+
- Python 3.10+
- pip

---

## A) Plain HTML frontend (`frontend/`)

1. Open `frontend/signup.html` in a browser.
2. Create your first account.
3. Sign in at `frontend/login.html`.
4. Use app at `frontend/dashboard.html`.

Local URLs (if served with any static server):
- `http://localhost:<port>/frontend/signup.html`
- `http://localhost:<port>/frontend/login.html`
- `http://localhost:<port>/frontend/dashboard.html`

Data is stored in browser localStorage (`iles_*` keys).

---

## B) React prototype (`frontend/react-app/`)

```bash
cd frontend/react-app
npm install
npm run dev
```

App URL: `http://localhost:5173`

Create your first account from `/signup`, then log in from `/login`.

Build:

```bash
npm run build
```

---

## C) Frontend_2 React app (localStorage mode)

```bash
cd Frontend_2
npm install
npm run dev
```

App URL: `http://localhost:5173`

Create your first account from the signup page.

---

## D) Frontend_2 with Node backend (`Frontend_2/backend/`)

```bash
cd Frontend_2/backend
npm install
cp .env.example .env
npm run create-admin
npm run dev
```

API URL: `http://localhost:4000`  
Health: `http://localhost:4000/api/health`

Then connect `Frontend_2` to the API by creating `Frontend_2/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart `Frontend_2` dev server after changing `.env.local`.

---

## E) Django backend (`backend/`)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Django URL: `http://127.0.0.1:8000/`

---

## F) Backend2 service (`Backend2/`)

```bash
cd Backend2
pip install -r requirements.txt
cp .env.example .env
python main.py
```

API base URL defaults to localhost (see `Backend2/.env.example`).

---

## Troubleshooting

- **Invalid credentials on login**: create an account first (signup/admin bootstrap).
- **CORS errors with Frontend_2 + backend**: set `CORS_ORIGIN` in `Frontend_2/backend/.env`.
- **Port already in use**: change `PORT` in backend `.env` or stop the existing process.
- **Stale local data**: clear browser localStorage for the app origin and retry.
