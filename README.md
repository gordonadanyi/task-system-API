# Task System API

A NestJS backend for a small task management system. It handles user registration and login, role-based access, task creation/assignment, status updates, and realtime task events over Socket.IO.

This project uses two databases:

- MongoDB for users and roles
- PostgreSQL for tasks

That split is intentional in the current codebase, so make sure both services are running before you start the API.

## What it can do

- Register and log in users with hashed passwords
- Issue JWT access tokens
- Support `user` and `admin` roles
- Let admins list users and assign roles
- Create, list, update, assign, and delete tasks
- Let assigned users update their own task status
- Broadcast task changes with websocket events

## Tech stack

- NestJS
- TypeScript
- MongoDB with Mongoose
- PostgreSQL with TypeORM
- Passport JWT
- Socket.IO
- Jest

## Getting started

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root if you want to override the defaults:

```env
PORT=3000

MONGO_URI=mongodb://localhost/task-system-api

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your password
DB_DATABASE=task_system_api
```

The app currently uses `your_secret_key` as the JWT secret inside `src/auth/auth.module.ts`. For anything beyond local development, move that value into an environment variable.

Start the app in watch mode:

```bash
npm run start:dev
```

By default, the API runs on:

```text
http://localhost:3000
```

## Database notes

MongoDB is used for the `users` collection. A user has:

- `userName`
- `email`
- `passwordHash`
- `roles`

PostgreSQL is used for the `tasks` table. A task has:

- `id`
- `title`
- `description`
- `status`
- `createdById`
- `assignedToId`
- `createdAt`
- `updatedAt`

TypeORM has `synchronize: true` enabled, so the task table is created from the entity when the app starts. That is convenient while developing, but it should be replaced with migrations before production.

## Authentication flow

Register a user:

```http
POST /auth/register
Content-Type: application/json

{
  "userName": "adminuser",
  "email": "admin@gmail.com",
  "password": "secret123",
  "roles": ["admin"]
}
```

Log in:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "secret123"
}
```

The login response includes an `accessToken`. Send it with protected requests:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

## API routes

### Auth

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a new user |
| `POST` | `/auth/login` | Log in and receive a JWT |

### Users

These routes require an admin token.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/users` | List all users |
| `PATCH` | `/users/:id/roles` | Replace a user's roles |

Example role update:

```http
PATCH /users/USER_ID_HERE/roles
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN_HERE

{
  "roles": ["user", "admin"]
}
```

### Tasks

All task routes require a JWT. Some actions are admin-only.

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/tasks` | Any logged-in user | Create a task |
| `GET` | `/tasks` | Any logged-in user | List tasks |
| `GET` | `/tasks/:id` | Admin | Get one task |
| `PUT` | `/tasks/:id` | Admin | Update a task |
| `PATCH` | `/tasks/:id/assign` | Admin | Assign a task to a user |
| `PATCH` | `/tasks/:id/status` | Assigned user | Update task status |
| `DELETE` | `/tasks/:id` | Admin | Delete a task |

Create a task:

```http
POST /tasks
Content-Type: application/json
Authorization: Bearer TOKEN_HERE

{
  "title": "Write API documentation",
  "description": "Document the auth, user, and task endpoints.",
  "assignedToId": "MONGO_USER_ID_HERE"
}
```

Valid task statuses are:

- `pending`
- `in_progress`
- `completed`

Update task status:

```http
PATCH /tasks/TASK_ID_HERE/status
Content-Type: application/json
Authorization: Bearer ASSIGNED_USER_TOKEN_HERE

{
  "status": "completed"
}
```

## Realtime events

The task gateway accepts Socket.IO connections and sends a `connected` event when a client joins.

Task changes are emitted with these event names:

- `taskCreated`
- `taskUpdated`
- `taskAssigned`
- `taskStatusUpdated`
- `taskDeleted`

Example client connection:

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connected', (payload) => {
  console.log(payload);
});

socket.on('taskCreated', (task) => {
  console.log('New task:', task);
});
```

## Useful scripts

```bash
npm run start       # start once
npm run start:dev   # start with watch mode
npm run build       # compile the project
npm run start:prod  # run the compiled app
npm run lint        # lint and fix files
npm run format      # format source and test files
npm test            # run unit tests
npm run test:e2e    # run e2e tests
npm run test:cov    # run tests with coverage
```

## A quick local testing path

1. Start MongoDB and PostgreSQL.
2. Create the PostgreSQL database named `task_system_api`.
3. Run `npm run start:dev`.
4. Register an admin user.
5. Log in and copy the returned access token.
6. Use the token to create users, assign roles, and work with tasks.

There is also a `test.rest` file one directory above this project folder with sample requests you can adapt while testing locally.

## Project structure

```text
src/
  auth/            JWT login, strategy, guards, and role helpers
  tasks/           Task controller, service, DTOs, and TypeORM entity
  tasks.gateway/   Socket.IO gateway for task events
  users/           User controller, service, DTOs, and Mongoose schema
```

## Things to improve next

- Move the JWT secret into environment configuration.
- Replace TypeORM `synchronize: true` with migrations.
- Add pagination and filtering for task lists.
- Decide whether roles should stay as just `user` and `admin`.
- Add stronger e2e coverage around role permissions.
