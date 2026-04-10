# ILES — Internship Logging & Evaluation System

A browser-based internship management dashboard with a signup/login flow.

---

## Project Structure

```
Group_12/
├── frontend/
│   ├── login.html      ← Sign-in page (start here)
│   ├── signup.html     ← New-account registration
│   └── dashboard.html  ← Main application (requires login)
└── backend/            ← Django backend (optional – see below)
```

---

## Running the Frontend

No server or build step is needed.

1. Open **`frontend/login.html`** in any modern browser (Chrome, Firefox, Edge, Safari).
2. Create an account on the signup page, or use one of the pre-seeded demo accounts below.
3. After logging in you will be taken to `dashboard.html`.

> All data (accounts and internship records) is stored in the browser's
> **`localStorage`** under the `iles_*` key namespace.  
> To reset everything: open the browser console and run `localStorage.clear()`, then reload.

---

## Demo Accounts

| Username | Password  | Role                  |
|----------|-----------|-----------------------|
| alice    | alice123  | Student               |
| brian    | brian123  | Student               |
| carol    | carol123  | Academic Supervisor   |
| david    | david123  | Internship Supervisor |
| admin    | admin123  | Administrator         |

> **Important:** you must select the correct **User Type** on the login page to match the account's role; logging in with the wrong role will be rejected.

---

## Sign Up

1. Open `frontend/signup.html` (or click **"Sign up"** on the login page).
2. Fill in:
   - **Full Name**
   - **Username** (must be unique)
   - **User Type** (Student / Academic Supervisor / Internship Supervisor / Administrator)
   - **Password** (minimum 6 characters)
   - **Confirm Password**
3. Click **Create Account** — you will be automatically logged in and redirected to the dashboard.

---

## Log Out

Click the **🚪 Logout** button in the top-right corner of the dashboard header.

---

## Route Protection

`dashboard.html` checks for an active session in `localStorage` on every load.  
If no valid session is found, the browser is immediately redirected to `login.html`.

---

## Running the Django Backend (optional)

The backend is not required to run the frontend.  
If you want to use it:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Then visit `http://127.0.0.1:8000/`.

To connect the frontend to the backend, replace the `DB.get` / `DB.save` calls in
`dashboard.html` with `fetch()` calls as described in the comments at the top of that file.
