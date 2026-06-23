# Apixy

Apixy is a Node.js backend for managing user accounts, storing provider API keys, and calling LLM providers through a protected REST API. The current implementation supports Google Gemini via `@google/genai`, with Prisma and PostgreSQL used for persistence.

## Features

- User registration, login, logout, email verification, and password update
- JWT-based access, refresh, verification, and API-key tokens
- Secure HTTP-only auth cookies on login
- Protected user profile routes
- Store and manage LLM provider API keys per user
- Call Google LLM models through a saved encrypted API key token
- Gmail SMTP verification email support

## Tech Stack

- Node.js
- Express 5
- Prisma 7
- PostgreSQL
- JWT
- bcrypt
- Nodemailer
- Google GenAI SDK

## Project Structure

```text
Apixy/
+-- backend/
|   +-- prisma/
|   |   +-- migrations/
|   |   +-- schema.prisma
|   +-- src/
|   |   +-- configs/
|   |   +-- controllers/
|   |   +-- middlewares/
|   |   +-- providers/
|   |   +-- routes/
|   |   +-- services/
|   |   +-- utils/
|   |   +-- server.js
|   +-- package.json
|   +-- prisma.config.ts
+-- task.MD
+-- README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL database
- Google AI Studio API key, if you want to use the Google LLM endpoint
- Gmail account or app password for verification emails

## Getting Started

Clone the repository and install backend dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

ACCESS_TOKEN_SECRET="your-access-token-secret"
ACCESS_TOKEN_EXPIREY="15m"

REFRESH_TOKEN_SECRET="your-refresh-token-secret"
REFRESH_TOKEN_EXPIREY="7d"

VERIFICATION_TOKEN_SECRET="your-verification-token-secret"
VERIFICATION_TOKEN_EXPIREY="1d"

API_TOKEN_SECRET="your-api-token-secret"
API_TOKEN_EXPIREY="30d"

EMAIL="your-gmail-address@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
```

Run Prisma migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend server:

```bash
npm run server
```

The server runs at:

```text
http://localhost:3000
```

## Available Scripts

Run from `backend/`:

```bash
npm run server
```

Starts the Express server with Nodemon.

## API Overview

Base URL:

```text
http://localhost:3000
```

Most protected routes expect an access token in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Returns a simple backend greeting |

### Auth Routes

Base path: `/api/v1/auth`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/` | No | Register a user |
| POST | `/login` | No | Login and set auth cookies |
| GET | `/logout` | Cookie | Clear auth cookies |
| PUT | `/forget-password` | Bearer token | Update password |

Register body:

```json
{
  "username": "Sukhraj",
  "email": "user@gmail.com",
  "password": "password123"
}
```

Login body:

```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

Change password body:

```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword123"
}
```

### Email Verification

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/verify/:verificationToken` | Verify a registered user's email |

The verification email currently points to `http://localhost:3000/verify/:verificationToken`.

### Token Routes

Base path: `/api/v1/tokens`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/` | Refresh the access token using the refresh token cookie |

Request body:

```json
{
  "id": "user_id"
}
```

### User Routes

Base path: `/api/v1/users`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/me` | Bearer token | Get the current user |
| GET | `/:id` | No | Get a user by ID |
| PUT | `/` | Bearer token | Update current user's username or email |
| DELETE | `/` | Bearer token | Delete current user |
| DELETE | `/:id` | No | Delete a user by ID |

Update body:

```json
{
  "username": "new-name",
  "email": "new-email@gmail.com"
}
```

### API Key Routes

Base path: `/api/v1/apis`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/:provider` | Bearer token | Store a provider API key |
| PUT | `/:apiId` | Bearer token | Update API key metadata |
| GET | `/` | Bearer token | Get an API key record by name |
| GET | `/all` | Bearer token | Get all API keys for the current user |
| GET | `/:Provider/:model` | Bearer token | Call an LLM model |
| DELETE | `/:apiId` | Bearer token | Delete an API key record |

Create API key body:

```json
{
  "name": "my-google-key",
  "api_key": "your-google-api-key"
}
```

Example create endpoint:

```text
POST /api/v1/apis/GOOGLE
```

Get API key by name body:

```json
{
  "apiName": "my-google-key"
}
```

Call Google LLM body:

```json
{
  "query": "Explain what Apixy does in one paragraph.",
  "skKey": "<stored-api-token>"
}
```

Example LLM endpoint:

```text
GET /api/v1/apis/Google/gemini-2.5-flash
```

## Database Models

The Prisma schema defines:

- `user`: stores account details, hashed password, verification token, refresh token, and owned API keys
- `api`: stores API key metadata, provider type, generated API token, and owner relation

Supported provider enum values:

```text
OPENAI
GOOGLE
```

The current service logic only allows Google provider keys.

## Notes

- The server currently listens on port `3000` directly in `src/server.js`.
- Auth middleware reads JWTs from the `Authorization: Bearer <token>` header.
- Login also sets `accessToken` and `refreshToken` cookies.
- Cookie options use `secure: true`, so cookies require HTTPS in many clients and browsers.
- The API creation route expects provider `GOOGLE`, while the LLM call route currently checks for provider `Google`.
- Environment variable names use `EXPIREY` in the current code, so keep that spelling unless the code is updated.

## Future Ideas

See `task.MD` for the current short task list:

- Improve Google LLM options
- Move JavaScript to TypeScript
- Add interfaces and related type improvements
