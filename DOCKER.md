# Docker Setup Guide

## Quick Start

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Edit `.env` and set your values:
   - `POSTGRES_PASSWORD`: Strong password for database
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your production URL

3. Build and start:
```bash
docker-compose up -d
```

4. View logs:
```bash
docker-compose logs -f
```

## Production Deployment

For production, use the production compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Commands

- Start: `docker-compose up -d`
- Stop: `docker-compose down`
- View logs: `docker-compose logs -f app`
- Rebuild: `docker-compose build --no-cache`
- Database backup: `docker-compose exec postgres pg_dump -U portfoliyours portfoliyours > backup.sql`
- Database restore: `docker-compose exec -T postgres psql -U portfoliyours portfoliyours < backup.sql`

## Volumes

- `postgres_data`: Database persistence
- `./public/uploads`: User uploaded files (avatars, documents)

## Environment Variables

Required variables in `.env`:
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: NextAuth secret key

