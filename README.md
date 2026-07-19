# FileDrive

FileDrive is a modern, collaborative cloud storage and workspace SaaS platform designed for individuals and teams. Built with a high-performance Python (Django) backend and a type-safe React (Vite/TS) frontend, FileDrive replicates the core features of Google Drive with a focus on granular sharing levels, workspace management, and developer experience.

## Features

- **Team Workspaces**: Organize files, folders, and resources under shared workspaces with managed storage allocations.
- **Granular Sharing & Access Control**: Share files and folders with specific users using tailored permissions (Viewer, Editor, Owner).
- **Link-Based Share Operations**: Generate public or private sharing links with ease.
- **Developer Experience (DX) First**:
  - **Nix Flake Integration**: Instant, reproducible development environment setup.
  - **Docker Compose**: Entire stack (PostgreSQL, Redis, Django server, Vite client) runs out of the box.
  - **Justfile Integration**: Shortcut commands for migrations, server execution, container builds, and database shells.
  - **CSS Module Type-Safety**: Automated TypeScript type generation for CSS modules using `typed-css-modules`.

---

## Tech Stack

### Frontend (`/client`)

- **Framework**: React 19 (Vite)
- **Language**: TypeScript (v6.0)
- **Styling**: CSS Modules with type-safe declarations (`tcm`)
- **Data Fetching**: React Query (TanStack Query v5)

### Backend (`/server`)

- **Framework**: Django 6.0 & Django REST Framework (DRF)
- **Package Management**: `uv` (modern, ultra-fast Python package resolver)
- **Database**: PostgreSQL 17
- **Caching & Broker**: Redis 7.4

### Environment & Orchestration

- **Dev Shell**: Nix Flake (`flake.nix`)
- **Containers**: Docker & Docker Compose
- **Task Runner**: Just (`justfile`)

---

## Quick Start

Ensure you have [Docker](https://www.docker.com/) and [Just](https://github.com/casey/just) installed.

### 1. Spin up the containers

Start PostgreSQL, Redis, Django server, and the Vite client:

```bash
just up
```

### 2. Run Database Migrations

Create and apply Django database migrations:

```bash
just migrate
```

### 3. Create an Admin User

Setup a Django superuser to access the admin portal:

```bash
just createsuperuser
```

### 4. Access the Applications

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## Common Dev Commands

Here is a summary of the helper commands defined in the `justfile`:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `just up`              | Start the development containers in the background |
| `just down`            | Stop development containers                        |
| `just build`           | Rebuild and start the containers                   |
| `just migrate`         | Run Django database migrations                     |
| `just makemigrations`  | Generate new Django database migrations            |
| `just createsuperuser` | Setup an admin superuser                           |
| `just shell`           | Open a Django interactive python shell             |
| `just logs`            | View real-time Django server logs                  |

---

## Project Structure

```text
├── client/                 # React frontend
│   ├── src/                # Component & page source code
│   └── package.json        # Node dependency configuration
├── server/                 # Django backend
│   ├── config/             # Django settings and routing
│   ├── pyproject.toml      # Python dependencies (uv-compatible)
│   └── manage.py           # Django entry point
├── docker-compose.yml      # Multi-container local orchestration
├── flake.nix               # Reproducible Nix developer shell
├── justfile                # Custom build/migrate task runner
└── LICENSE                 # AGPLv3 License text
```

---

## License

This project is licensed under the **GNU Affero General Public License v3 (AGPLv3)**.

### Why AGPLv3?

Because FileDrive is designed as a commercial SaaS product, it is licensed under the AGPLv3. This ensures that the code remains open-source for personal use and developer portfolio review, while legally preventing hosting providers or competitors from repackaging and hosting FileDrive as a proprietary closed-source cloud service.

See the full [LICENSE](file:///home/daksh/Desktop/FUCK/Current/FileDrive/LICENSE) file for more information.
