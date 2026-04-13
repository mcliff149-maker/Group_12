# ILES Frontend_2

React (Vite) client with an optional Node/Express API.

## 1) Run frontend only (localStorage mode)

```bash
cd Frontend_2
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Create your first account from the **Sign up** page.  
No demo credentials are preloaded.

---

## 2) Run with the Node backend

### Start API

```bash
cd Frontend_2/backend
npm install
cp .env.example .env
npm run create-admin
npm run dev
```

API URL: `http://localhost:4000`  
Health check: `http://localhost:4000/api/health`

`npm run create-admin` creates the initial admin interactively (or via
`ADMIN_USERNAME`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` env vars).

### Point frontend to API

Create `Frontend_2/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart `npm run dev` in `Frontend_2/`.

---

## Troubleshooting

- **401 Invalid credentials**: create an account first (signup or `create-admin`).
- **CORS errors**: set `CORS_ORIGIN` in `Frontend_2/backend/.env` to your frontend URL.
- **Data disappears after backend restart**: set `DATA_STORE=file` in backend `.env`.
