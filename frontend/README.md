# Internship Management System — Frontend

A React + Vite + TypeScript frontend for the Internship Management System. Currently uses mocked data and runs independently of the Django backend.

## Prerequisites

- Node.js 18+ and npm 9+

## Setup

```bash
cd frontend
npm install
```

## Running (development)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building

```bash
npm run build
```

Output is written to `frontend/dist/`.

## Preview production build

```bash
npm run preview
```

## Project structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx          # Entry point
    ├── App.tsx           # Router + auth state
    ├── types.ts          # Shared TypeScript types
    ├── styles/
    │   └── theme.css     # Pastel palette + global styles
    ├── data/
    │   └── mockData.ts   # Mock data (replace with API calls)
    ├── components/
    │   ├── Layout.tsx    # Shared sidebar layout + logout
    │   ├── Layout.css
    │   ├── StatCard.tsx  # Reusable metric card
    │   └── StatCard.css
    └── pages/
        ├── LoginPage.tsx                      # Role selector login
        ├── LoginPage.css
        ├── StudentDashboard.tsx
        ├── AcademicSupervisorDashboard.tsx
        ├── InternshipSupervisorDashboard.tsx
        ├── AdminDashboard.tsx
        └── Dashboard.css                      # Shared dashboard styles
```

## Roles

| Role                   | Route                      |
|------------------------|----------------------------|
| Student                | `/dashboard/student`       |
| Academic Supervisor    | `/dashboard/academic`      |
| Internship Supervisor  | `/dashboard/internship`    |
| System Administrator   | `/dashboard/admin`         |

## Theme

All colours are defined as CSS variables in `src/styles/theme.css`. The palette uses soft pastels:

| Variable              | Colour     |
|-----------------------|------------|
| `--pastel-lavender`   | #e8d5f5    |
| `--pastel-mint`       | #d5f0e8    |
| `--pastel-peach`      | #fde8d8    |
| `--pastel-sky`        | #d5eaf5    |
| `--pastel-rose`       | #fad5e0    |
| `--pastel-yellow`     | #fdf5d5    |

## Connecting to the backend

Mock data lives in `src/data/mockData.ts`. To connect to the Django backend:

1. Add a `VITE_API_URL` environment variable in a `.env.local` file (e.g., `VITE_API_URL=http://localhost:8000`).
2. Replace the mock data imports with `fetch`/`axios` calls to the backend REST API endpoints.
3. Handle authentication tokens (JWT or session cookies) in the API client.
