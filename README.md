# Task Management API

Express, MySQL and Drizzle backend for the task management assignment.

## Setup

Start MySQL locally:

```bash
docker compose up -d
```

Then run the API:

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Demo accounts after seeding:

- `admin@admin.com` / `Password@123`
- `user@user.com` / `Password@123`

## Scripts

- `npm run dev` starts the API in watch mode.
- `npm run build` compiles TypeScript.
- `npm run db:generate` creates Drizzle migrations.
- `npm run db:migrate` applies migrations.
- `npm run db:seed` inserts demo users and tasks.
- `npm test` runs the small API test suite.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/summary`

Most task routes require a bearer token. Admin users can assign tasks to other users. Database settings are split across DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL and DB_SSL_REJECT_UNAUTHORIZED.

## Database

Schemas live in `src/db/schema`, one file per table. Migrations are generated into
`src/db/migrations`. Stored procedure scripts are kept in `src/db/procedures`.
