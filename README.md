# HR Inventory — Workforce System (Phase 1)

A full-stack monorepo scaffold for the **HR Inventory** workforce management system.

| Layer     | Stack                                                        | Port   |
|-----------|--------------------------------------------------------------|--------|
| Database  | PostgreSQL 15 (via Docker)                                   | `5432` |
| Backend   | Express · TypeScript · `ts-node-dev` · JWT · WebSocket (`ws`) | `4000` |
| Frontend  | Vite · React 18 · TypeScript · Tailwind CSS · React Query   | `5173` |

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Quick Start (Run Both Together)](#quick-start-run-both-together)
- [Step-by-Step Setup](#step-by-step-setup)
  - [1. Clone & Install](#1-clone--install)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Start the Database](#3-start-the-database)
  - [4. Start the Backend](#4-start-the-backend)
  - [5. Start the Frontend](#5-start-the-frontend)
- [Available Scripts](#available-scripts)
- [Environment Variables Reference](#environment-variables-reference)
- [Architecture Overview](#architecture-overview)

---

## Prerequisites

Make sure the following tools are installed on your machine before proceeding:

| Tool          | Minimum Version | Check Command         |
|---------------|-----------------|-----------------------|
| Node.js       | 18+             | `node -v`             |
| npm           | 9+              | `npm -v`              |
| Docker        | 24+             | `docker -v`           |
| Docker Compose| v2+             | `docker compose version` |

---

## Project Structure

```
hrinventory/
├── backend/                  # Express + TypeScript API server
│   ├── src/
│   │   ├── config/           # App config (port, DB URL, JWT secret)
│   │   ├── database/         # DB connection utilities
│   │   ├── middleware/        # Request logger, error handler
│   │   ├── utils/            # Shared helpers
│   │   └── server.ts         # Entry point
│   ├── modules/              # Feature modules (auth, users, attendance)
│   │   ├── auth/
│   │   ├── users/
│   │   └── attendance/
│   ├── database/
│   │   ├── migrations/       # SQL migration files
│   │   └── seed/             # Seed data scripts
│   ├── websocket/            # WebSocket server logic
│   ├── docker-compose.yml    # PostgreSQL 15 service definition
│   ├── .env.example          # Backend env template
│   └── package.json
│
├── frontend/                 # Vite + React + Tailwind SPA
│   ├── src/
│   │   ├── App.tsx           # Root component & routing shell
│   │   ├── router.tsx        # React Router definitions
│   │   ├── AuthContext.tsx   # Global auth state (JWT)
│   │   ├── axios.ts          # Pre-configured Axios instance
│   │   ├── LoginPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── lib/              # Shared utilities / hooks
│   │   └── styles/           # Global CSS / Tailwind base
│   ├── .env.example          # Frontend env template
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Quick Start (Run Both Together)

> **Recommended approach**: open **three terminal tabs** — one for each service.

### Terminal 1 — Database (PostgreSQL via Docker)

```bash
cd backend
docker compose up -d
sudo systemctl stop postgresql (Optional: if postgresql already exist)
```

### Terminal 2 — Backend (Express API)

```bash
cd backend
npm install          # first time only
cp .env.example .env # first time only — then edit .env
npm run dev
```

### Terminal 3 — Frontend (Vite Dev Server)

```bash
cd frontend
npm install          # first time only
cp .env.example .env # first time only
npm run dev
```

Once all three services are running:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:4000         |
| API Health Check | http://localhost:4000/health |

---

## Step-by-Step Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> hrinventory
cd hrinventory

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

### 2. Configure Environment Variables

#### Backend (`backend/.env`)

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in the values:

```env
PORT=4000
NODE_ENV=development

# For local Docker Compose, use 'localhost' instead of 'db' for the host
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hrinventory

JWT_SECRET=replace_this_with_a_strong_secret

# Optional OAuth providers (leave blank to skip)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
```

> **Important:** When running the backend **outside** Docker (i.e., directly with `npm run dev`), use `localhost` as the DB host instead of `db`.

#### Frontend (`frontend/.env`)

```bash
cd frontend
cp .env.example .env
```

`frontend/.env` only needs one variable — it should already be correct:

```env
VITE_API_URL=http://localhost:4000
```

---

### 3. Start the Database

The database runs as a Docker container. Start it from the `backend/` directory:

```bash
cd backend
docker compose up -d
```

Verify PostgreSQL is running:

```bash
docker compose ps
# You should see 'db' container with status: Up
```

To stop PostgreSQL:

```bash
docker compose down          # stop containers (data preserved)
docker compose down -v       # stop + destroy data volume
```

---

### 4. Start the Backend

```bash
cd backend
npm run dev
```

The backend starts with `ts-node-dev` (hot-reload on file changes). You should see:

```
Backend listening on http://localhost:4000
```

Verify it works:

```bash
curl http://localhost:4000/health
# → { "status": "ok" }
```

---

### 5. Start the Frontend

```bash
cd frontend
npm run dev
```

Vite will start the dev server and print:

```
  VITE v5.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open http://localhost:5173 in your browser.

---

## Available Scripts

### Backend (`cd backend`)

| Command          | Description                                 |
|------------------|---------------------------------------------|
| `npm run dev`    | Start dev server with hot-reload (`ts-node-dev`) |
| `npm run build`  | Compile TypeScript to `dist/`               |
| `npm start`      | Run compiled production build (`dist/server.js`) |
| `npm run lint`   | Run ESLint on all `.ts` files               |
| `npm run format` | Format codebase with Prettier               |

### Frontend (`cd frontend`)

| Command           | Description                                |
|-------------------|--------------------------------------------|
| `npm run dev`     | Start Vite dev server (HMR enabled)        |
| `npm run build`   | Build production bundle to `dist/`         |
| `npm run preview` | Serve the production build locally         |
| `npm run lint`    | Run ESLint on `.ts` / `.tsx` files         |
| `npm run format`  | Format codebase with Prettier              |

### Docker (`cd backend`)

| Command                     | Description                                 |
|-----------------------------|---------------------------------------------|
| `docker compose up -d`      | Start PostgreSQL in background              |
| `docker compose down`       | Stop PostgreSQL (data preserved)            |
| `docker compose down -v`    | Stop PostgreSQL and destroy volume (wipe DB)|
| `docker compose logs -f db` | Follow PostgreSQL logs                      |

---

## Environment Variables Reference

### Backend

| Variable           | Default                                              | Required | Description                         |
|--------------------|------------------------------------------------------|----------|-------------------------------------|
| `PORT`             | `4000`                                               | No       | Port the Express server listens on  |
| `NODE_ENV`         | `development`                                        | No       | Node environment                    |
| `DATABASE_URL`     | —                                                    | **Yes**  | PostgreSQL connection string        |
| `JWT_SECRET`       | `CHANGE_ME`                                          | **Yes**  | Secret for signing JWT tokens       |
| `GOOGLE_CLIENT_ID` | —                                                    | No       | Google OAuth client ID              |
| `GOOGLE_CLIENT_SECRET` | —                                                | No       | Google OAuth client secret          |
| `AUTH0_DOMAIN`     | —                                                    | No       | Auth0 domain                        |
| `AUTH0_CLIENT_ID`  | —                                                    | No       | Auth0 client ID                     |

### Frontend

| Variable       | Default                    | Required | Description                    |
|----------------|----------------------------|----------|--------------------------------|
| `VITE_API_URL` | `http://localhost:4000`    | **Yes**  | Base URL of the backend API    |

> All frontend env vars must be prefixed with `VITE_` to be accessible in the browser.

---

## Architecture Overview

```
Browser
  │
  ▼
Vite Dev Server (localhost:5173)
  │  HTTP/REST via Axios
  │  (VITE_API_URL → localhost:4000)
  ▼
Express API (localhost:4000)
  │  ├─ GET /health
  │  ├─ /auth routes   (JWT, Google OAuth, Auth0)
  │  ├─ /users routes
  │  ├─ /attendance routes
  │  └─ WebSocket upgrade (ws)
  │
  ▼
PostgreSQL 15 (localhost:5432)
  └─ Docker volume: db_data
```

### Key Backend Files

| File/Dir                         | Role                                           |
|----------------------------------|------------------------------------------------|
| `src/server.ts`                  | App bootstrap — Express setup, middleware, HTTP server |
| `src/config/index.ts`           | Reads `.env` and exports typed config object   |
| `src/middleware/request.logger`  | Logs every incoming HTTP request               |
| `src/middleware/error.middleware`| Centralized error handling                     |
| `modules/auth/`                  | Auth routes, JWT helpers, OAuth strategies     |
| `modules/users/`                 | User CRUD                                      |
| `modules/attendance/`            | Attendance records                             |
| `websocket/`                     | WebSocket server for real-time features        |
| `database/migrations/`           | Raw SQL migration scripts                      |
| `database/seed/`                 | Seed data for development                      |

### Key Frontend Files

| File                   | Role                                                    |
|------------------------|---------------------------------------------------------|
| `src/main.tsx`         | React entry point — mounts `<App />` to the DOM        |
| `src/App.tsx`          | Root component with `QueryClientProvider`               |
| `src/router.tsx`       | All route definitions (React Router)                    |
| `src/AuthContext.tsx`  | Global auth state (token storage, user info)            |
| `src/axios.ts`         | Axios instance pre-configured with `VITE_API_URL`       |
| `src/ProtectedRoute.tsx` | HOC that redirects unauthenticated users to login     |
| `src/LoginPage.tsx`    | Login form UI                                           |
| `src/ProfilePage.tsx`  | User profile view                                       |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` on backend startup | Database isn't running — run `docker compose up -d` first |
| `DATABASE_URL` host `db` not resolving | Change `db` → `localhost` in `backend/.env` when running outside Docker |
| Frontend shows blank page | Check `VITE_API_URL` in `frontend/.env` points to `http://localhost:4000` |
| Port `4000` already in use | Kill the conflicting process: `lsof -ti:4000 \| xargs kill` |
| Port `5173` already in use | Kill the conflicting process: `lsof -ti:5173 \| xargs kill` |
| `JWT_SECRET` default warning | Set a strong secret in `backend/.env` — never commit real secrets |
