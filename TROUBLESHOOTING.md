# Troubleshooting Guide

## Docker Desktop Not Running

If you see this error:
```
unable to get image: error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/...": The system cannot find the file specified.
```

**Solution:**
1. Start Docker Desktop application
2. Wait for Docker Desktop to fully start (whale icon in system tray should be steady)
3. Verify Docker is running: `docker ps`
4. Try again: `docker-compose up -d`

## Common Issues

### Build Fails
- Ensure `.env` file exists with required variables
- Check Docker has enough resources (Settings > Resources)
- Try: `docker-compose build --no-cache`

### Database Connection Errors
- Verify `DATABASE_URL` in `.env` matches docker-compose settings
- Check postgres container is healthy: `docker-compose ps`
- View database logs: `docker-compose logs postgres`

### Port Already in Use
- Change `APP_PORT` in `.env` to a different port
- Or stop the service using port 3000

### Permission Errors
- On Linux/Mac: `chmod -R 755 public/uploads`
- Ensure uploads directory exists: `mkdir -p public/uploads`

