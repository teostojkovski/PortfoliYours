# Deployment Guide

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured (optional)
- SSL certificate (for HTTPS)

### Step 1: Environment Setup

1. Copy environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with production values:
```env
POSTGRES_USER=portfoliyours
POSTGRES_PASSWORD=<strong_random_password>
POSTGRES_DB=portfoliyours

NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate_with_openssl_rand_-base64_32>

APP_PORT=3000
```

### Step 2: Build and Deploy

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Step 3: Verify

Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

Access application at your configured URL.

## Database Management

### Backup
```bash
docker-compose exec postgres pg_dump -U portfoliyours portfoliyours > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
docker-compose exec -T postgres psql -U portfoliyours portfoliyours < backup.sql
```

### Migration
Database migrations run automatically on container start via `prisma db push`.

## File Storage

Uploaded files are stored in `./public/uploads` which is mounted as a volume. Ensure this directory exists and has proper permissions.

## Monitoring

- View app logs: `docker-compose logs -f app`
- View database logs: `docker-compose logs -f postgres`
- Container status: `docker-compose ps`

## Updates

1. Pull latest code
2. Rebuild: `docker-compose -f docker-compose.prod.yml build --no-cache`
3. Restart: `docker-compose -f docker-compose.prod.yml up -d`

## Troubleshooting

- **Database connection errors**: Check `DATABASE_URL` in `.env`
- **Build failures**: Ensure all dependencies are in `package.json`
- **Permission errors**: Check file permissions on `public/uploads`
- **Port conflicts**: Change `APP_PORT` in `.env`

