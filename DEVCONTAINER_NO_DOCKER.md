# Running FileDrive in a Dev Container Without Docker

If you are developing inside a dev container where Docker (or Docker-in-Docker / Docker-outside-of-Docker) is unavailable or restricted, you can run the entire FileDrive stack directly on the container's host environment. 

Since the dev container environment is pre-configured with **Python 3.12 (`uv`)** and **Node.js 24 (`pnpm`)**, you do not need Docker to run the application components. We can swap PostgreSQL for **SQLite** during development, and run both the Django backend and Vite frontend natively.

---

## Step-by-Step Guide

### 1. Configure the Django Backend Environment
The Django server reads configuration from a `.env` file inside the `server/` directory.

Create the file `server/.env` with the following development configurations:

```env
DEBUG=True
SECRET_KEY="django-insecure-dev-only-change-this-in-production"
ALLOWED_HOSTS="localhost,127.0.0.1"
CORS_ALLOWED_ORIGINS="http://localhost:3000"

# Use a local SQLite database instead of PostgreSQL
DATABASE_URL="sqlite:///db.sqlite3"

# JWT configuration for local dev
JWT_ACCESS_SECRET="dev-access-secret-key-replace-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-key-replace-in-production"
ACCESS_TOKEN_EXPIRE_MINUTES="15"
REFRESH_TOKEN_EXPIRE_DAYS="7"
```

### 2. Initialize the SQLite Database
With the `.env` configured, you can apply migrations and set up an administrator account using `uv`.

Run the following commands in your terminal:

```bash
# Navigate to the server folder
cd server

# Run Django database migrations
uv run python manage.py migrate

# Create a superuser to access the Django admin portal
uv run python manage.py createsuperuser
```

### 3. Start the Backend Server
Start the Django development server locally:

```bash
uv run python manage.py runserver
```
The API will be accessible at http://localhost:8000 and the Django Admin panel at http://localhost:8000/admin/.

---

### 4. Configure the React Frontend Environment
The React Vite frontend needs to know where the backend API is. 

Create the file `client/.env.development` (or `client/.env`):

```env
VITE_API_URL="http://localhost:8000"
```

### 5. Start the React Frontend
Open a new terminal tab/window in the dev container and run the following:

```bash
# Navigate to the client folder
cd client

# Install packages (if they weren't installed during post-create)
pnpm install

# Start the Vite development server with watch mode for CSS Module types
pnpm dev
```
The frontend application will be running and accessible at http://localhost:3000.

---

## Notes & Troubleshooting

### Docker Compose Justfile Commands
Since you are not running Docker, the shortcuts in the `justfile` (like `just up`, `just migrate`, etc.) **will not work** as they are designed to interface with `docker compose`. Use the manual commands listed in this guide instead.

### CSS Module Type Generation
The Vite client runs `tcm` (typed-css-modules) in the background when running `pnpm dev` to auto-generate `.module.css.d.ts` declaration files for CSS Modules. If you get CSS importing errors during compilation, ensure `pnpm dev` is running, or trigger type generation manually:
```bash
cd client
pnpm css:types
```
