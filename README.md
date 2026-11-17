# Backend-GolfAPP

REST API for the GolfAPP golf store application, built with Express, TypeScript, and PostgreSQL.

## Requirements

- Node.js and npm
- PostgreSQL

## Setup

Install dependencies and create your local environment file from the example:

```bash
npm install
Copy-Item .env.example .env
```

Set the PostgreSQL connection values in `.env`. Never commit this file or share its credentials.

Initialize the database using `database/schema.sql`, then start the API:

```bash
npm run dev
```

The API listens on port `3000` by default and exposes its health check at `/api/v1/health`.
