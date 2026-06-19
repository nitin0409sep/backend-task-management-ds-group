# Task Management API

Express + TypeScript + MySQL backend for the Task Management full-stack assignment. It uses Drizzle ORM, JWT authentication, bcrypt password hashing, Zod validation, role-based middleware, Morgan request logging, and centralized error handling.

## Live URLs

- API Base URL: https://backend-task-management-ds-group.onrender.com/api
- Health check: https://backend-task-management-ds-group.onrender.com/health
- Frontend: https://frontend-task-management-ds-group.vercel.app
- GitHub: https://github.com/nitin0409sep/backend-task-management-ds-group

## Features

- User registration and login with JWT
- Password hashing with bcrypt
- User/Admin role-based access control
- Admin-only task create/update/delete and assignment
- Users can view assigned tasks and update status
- Task filters: search, status, priority
- Sorting: created date, priority, due date
- Pagination support for infinite scrolling
- Request validation middleware with Zod
- Central error handling middleware
- Morgan HTTP logging
- MySQL schema, migrations, and stored procedure scripts
- Docker production image

## Architecture

```text
src/
  app.ts                    Express app composition
  server.ts                 HTTP server entrypoint
  config/                   env, cors, logger config
  db/                       Drizzle connection, schema, migrations, procedures
  features/auth/            auth routes, controller, service, validation
  features/tasks/           task routes, controller, repository, service, validation
  features/users/           user routes, service, types
  middleware/               auth, role, validation, error handling
  tests/                    Jest unit tests
  utils/                    JWT, password, pagination, async helpers
```

## Environment Variables

Create `.env` from `.env.example`.

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | No | `development` | Runtime environment. |
| `PORT` | No | `4000` | HTTP port. Render injects this in production. |
| `DB_HOST` | Yes | `localhost` | MySQL host. |
| `DB_PORT` | No | `3306` | MySQL port. |
| `DB_USER` | Yes | `root` | MySQL user. |
| `DB_PASSWORD` | Yes | `password` | MySQL password. |
| `DB_NAME` | Yes | `task_manager` | MySQL database name. |
| `DB_SSL` | No | `false` | Enable SSL for cloud MySQL. |
| `DB_SSL_REJECT_UNAUTHORIZED` | No | `false` | Reject unauthorized SSL certs when SSL is enabled. |
| `JWT_SECRET` | Yes | `replace-with-24-char-secret` | Secret used to sign JWTs. Must be at least 24 chars. |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiry. |
| `CLIENT_ORIGIN` | Yes | `http://localhost:5173,https://frontend-task-management-ds-group.vercel.app` | Comma-separated allowed CORS origins. |

## Local Setup

Start MySQL locally:

```bash
docker compose up -d
```

Install and run the API:

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:procedures
npm run db:seed
npm run dev
```

Demo accounts after seeding:

- `admin@admin.com` / `Password@123`
- `user@user.com` / `Password@123`

## Scripts

- `npm run dev` starts the API in watch mode.
- `npm run build` compiles TypeScript into `dist/`.
- `npm start` runs `node dist/server.js`.
- `npm run db:generate` creates Drizzle migrations.
- `npm run db:migrate` applies migrations.
- `npm run db:procedures` applies stored procedure scripts.
- `npm run db:seed` inserts demo users and tasks.
- `npm test` runs Jest tests.

## API Documentation

Base URL:

```text
/api
```

All protected endpoints require:

```text
Authorization: Bearer <token>
```

### Auth

#### POST `/auth/register`

Request:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password@123"
}
```

Response `201`:

```json
{
  "user": { "id": "uuid", "name": "Demo User", "email": "demo@example.com", "role": "user" },
  "token": "jwt"
}
```

#### POST `/auth/login`

Request:

```json
{
  "email": "admin@admin.com",
  "password": "Password@123"
}
```

Response `200`:

```json
{
  "user": { "id": "uuid", "name": "Admin User", "email": "admin@admin.com", "role": "admin" },
  "token": "jwt"
}
```

#### GET `/auth/me`

Returns the authenticated user.

### Users

#### GET `/users`

Admin only. Returns assignable users.

### Tasks

#### GET `/tasks`

Query params:

| Param | Values |
| --- | --- |
| `search` | string |
| `status` | `todo`, `in_progress`, `done` |
| `priority` | `low`, `medium`, `high` |
| `sortBy` | `createdAt`, `priority`, `dueDate` |
| `sortOrder` | `asc`, `desc` |
| `page` | positive integer |
| `limit` | positive integer, max 50 |

Response:

```json
{
  "tasks": [],
  "page": 1,
  "limit": 10
}
```

#### POST `/tasks`

Admin only. `assigneeId` is required and cannot be the admin's own user id.

```json
{
  "title": "Review report",
  "description": "Check the report before Friday",
  "status": "todo",
  "priority": "medium",
  "assigneeId": "uuid",
  "dueDate": "2026-06-30"
}
```

#### PUT `/tasks/:id`

Admin only for task detail updates and reassignment.

#### PATCH `/tasks/:id/status`

Admins and assigned users can update status.

```json
{ "status": "in_progress" }
```

#### DELETE `/tasks/:id`

Admin only.

#### GET `/tasks/summary`

Admin task summary backed by `sp_get_admin_task_summary` stored procedure.

## Database

- Drizzle table schemas live in `src/db/schema`.
- Migrations live in `src/db/migrations`.
- Stored procedure scripts live in `src/db/procedures`.
- `sp_get_admin_task_summary` provides dashboard summary counts.
- `sp_get_user_task_dashboard` demonstrates stored-procedure filtering and sorting logic.

## Docker

Build:

```bash
docker build -t task-management-backend .
```

Run:

```bash
docker run --rm -p 4000:4000 --env-file .env task-management-backend
```

## Deployment

Render settings:

```text
Build Command: npm install && npm run build
Start Command: node dist/server.js
```

Set all required environment variables in Render. `CLIENT_ORIGIN` must include the deployed frontend origin:

```text
CLIENT_ORIGIN=https://frontend-task-management-ds-group.vercel.app
```

## Testing

Current backend tests cover:

- Password hashing and verification
- Pagination normalization and limits
- Task query validation, blank filters, and explicit `createdAt` sorting
