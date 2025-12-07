# Today — Intelligent To‑Do Monorepo

This repository contains a starter scaffold for "Today", an intelligent to-do web application with a separate AI service for categorization, prioritization and embeddings.

Structure:

- `apps/web` — Next.js (TypeScript, App Router) frontend and API routes.
- `services/ai` — FastAPI service for AI features (categorization, prioritization, embeddings).
- `prisma` — Prisma schema for Postgres models.
- `infra` — Docker Compose for Postgres (development).

Getting started (development):

1. Install dependencies for the frontend:

```bash
cd apps/web
pnpm install # or npm install
pnpm dev
```

2. Start Postgres (development):

```bash
cd infra
docker compose up -d
```

3. Run the AI service (Python):

```bash
cd services/ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

What's included:

- Minimal Next.js app skeleton with TailwindCSS.
- Prisma schema with `User` and `Item` models.
- Docker Compose with Postgres for local development.
- FastAPI placeholder endpoints for AI features.

Next steps: wire up authentication, Prisma client, API routes, and implement AI endpoints. See the `TODO` list in the project root for planned tasks.
