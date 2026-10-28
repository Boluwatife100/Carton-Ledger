# Carton Ledger: expense tracker

Two separate projects in one repo:

- `backend/`: Express + TypeScript + Prisma + PostgreSQL (JWT auth, bcrypt, CORS)
- `frontend/`: React + TypeScript + Tailwind + Recharts

## Run everything with Docker

```bash
docker compose up --build
```

- Web app: http://localhost:5173
- API: http://localhost:4000/api/health

The API container applies database migrations on start. Set `JWT_SECRET` (and optionally
`VITE_CURRENCY`, e.g. `NGN`) in a root `.env` file before deploying anywhere real.

## Run for development (hot reload)

```bash
# 1. database only
docker compose up db -d

# 2. backend
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run seed        
npm run dev         

# 3. frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

After changing `prisma/schema.prisma`, run `npx prisma migrate dev --name what_changed`.

## API

All routes except `/auth/register` and `/auth/login` need `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account, returns `{ token, user }` |
| POST | `/api/auth/login` | Sign in, returns `{ token, user }` |
| GET | `/api/auth/me` | Current user |
| GET | `/api/expenses` | List with `search`, `category`, `from`, `to`, `page`, `limit` |
| POST | `/api/expenses` | Create |
| PUT | `/api/expenses/:id` | Update |
| DELETE | `/api/expenses/:id` | Delete |
| GET | `/api/reports/dashboard` | Today / week / month totals, 7-day series, category split, recent |
| GET | `/api/reports?period=daily\|weekly&from=&to=` | Breakdown series, category split, peak, largest expense |
