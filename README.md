# Portfoliyours

Career and resource management platform built with Next.js.

## Prerequisites

- Docker Desktop installed and running
- Node.js 20+ (for local development)

## Quick Start with Docker

1. **Start Docker Desktop** (if not already running)

2. Copy environment file:
```bash
cp .env.example .env
```

3. Edit `.env` and configure:
   - `POSTGRES_PASSWORD`: Database password
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your application URL (default: http://localhost:3000)

4. Start services:
```bash
docker-compose up -d
```

5. Access application:
   - App: http://localhost:3000
   - Database: localhost:5432

## Manual Setup

1. Install dependencies: `npm install`
2. Configure `.env` with database and auth settings
3. Run migrations: `npx prisma generate && npx prisma db push`
4. Start dev server: `npm run dev`

## Docker Commands

- Start: `docker-compose up -d`
- Stop: `docker-compose down`
- Logs: `docker-compose logs -f`
- Rebuild: `docker-compose build --no-cache`
- Production: `docker-compose -f docker-compose.prod.yml up -d`

## Troubleshooting

If Docker commands fail, ensure Docker Desktop is running. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more help.

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.
