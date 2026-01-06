# Gymnote - Production Deployment Guide

This guide will walk you through deploying Gymnote to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Application Configuration](#application-configuration)
5. [Building for Production](#building-for-production)
6. [Deployment Options](#deployment-options)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Security Checklist](#security-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (recommended: Neon, Supabase, or Railway)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)
- Git repository set up

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gymnote.git
cd gymnote
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# JWT Authentication
# CRITICAL: Generate a strong secret key
# Use: openssl rand -base64 64
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

# Application
NODE_ENV="production"
NUXT_PUBLIC_API_BASE="/api"
NUXT_PUBLIC_APP_NAME="Gymnote"
NUXT_PUBLIC_APP_VERSION="1.0.0"

# Logging
LOG_LEVEL="info"

# Optional: Analytics
# NUXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## Database Setup

### Option 1: Neon (Recommended)

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

### Option 2: Supabase

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Navigate to Settings → Database
4. Copy the connection string (Connection pooling recommended)
5. Update `DATABASE_URL` in `.env`

### Option 3: Railway

1. Go to [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the `DATABASE_URL` from variables
4. Update `.env`

### Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate:prod
```

---

## Application Configuration

### 1. Update Security Headers

The app includes security headers by default in `nuxt.config.ts`. Review and adjust if needed.

### 2. Configure CORS

Update the CORS settings in `nuxt.config.ts` if you're hosting the frontend and backend on different domains:

```typescript
nitro: {
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': 'https://yourdomain.com',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Credentials': 'true',
      },
    },
  },
}
```

### 3. Configure PWA

Update PWA settings in `nuxt.config.ts`:

```typescript
pwa: {
  manifest: {
    name: 'Your App Name',
    short_name: 'AppName',
    theme_color: '#your-color',
    icons: [
      // Update with your icons
    ]
  }
}
```

---

## Building for Production

### 1. Run Tests

```bash
# Unit tests
npm run test:unit

# E2E tests (requires running server)
npm run test:e2e

# Coverage
npm run test:coverage
```

### 2. Build the Application

```bash
npm run build
```

This creates a `.output` directory with the production build.

### 3. Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:3000` to verify the build works correctly.

---

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login and deploy:
   ```bash
   vercel login
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from `.env`

4. Vercel will automatically build and deploy on every push to main branch

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nuxtjs",
  "regions": ["iad1"]
}
```

---

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login and deploy:
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. Set environment variables:
   ```bash
   netlify env:set JWT_SECRET "your-secret"
   netlify env:set DATABASE_URL "your-db-url"
   ```

**Netlify Configuration (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: Docker (Self-Hosted)

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine
   WORKDIR /app
   COPY --from=builder /app/.output ./.output
   ENV HOST=0.0.0.0
   ENV PORT=3000
   EXPOSE 3000
   CMD ["node", ".output/server/index.mjs"]
   ```

2. Create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - JWT_SECRET=${JWT_SECRET}
         - NODE_ENV=production
       restart: unless-stopped
   ```

3. Build and run:
   ```bash
   docker-compose up -d
   ```

---

### Option 4: Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Set environment variables:
   ```bash
   railway variables set JWT_SECRET="your-secret"
   railway variables set DATABASE_URL="your-db-url"
   ```

---

### Option 5: DigitalOcean App Platform

1. Create a new app in DigitalOcean
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `node .output/server/index.mjs`
4. Add environment variables in the dashboard
5. Deploy!

---

## Post-Deployment

### 1. Verify Deployment

Check these endpoints:

```bash
# Health check
curl https://yourdomain.com/

# API health
curl https://yourdomain.com/api/health

# Auth endpoints
curl https://yourdomain.com/api/auth/me
```

### 2. Test Critical Flows

- User registration
- User login
- Create workout
- Offline mode
- Data sync
- Export/Import data

### 3. Setup Monitoring

#### Application Monitoring

Add error tracking service (e.g., Sentry):

```bash
npm install @sentry/nuxt
```

Configure in `nuxt.config.ts`:
```typescript
sentry: {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
}
```

#### Database Monitoring

- Enable query logging in Prisma for debugging
- Monitor connection pool usage
- Set up alerts for slow queries

#### Server Monitoring

- CPU usage
- Memory usage
- Disk space
- Response times
- Error rates

### 4. Setup Backups

#### Database Backups

**Automated (Neon):**
- Neon provides automatic daily backups
- Enable point-in-time recovery

**Manual:**
```bash
# Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240101.sql
```

#### Application Backups

- Regular code backups via Git
- Environment variable backups (encrypted)
- User data export capabilities (already implemented)

---

## Monitoring & Maintenance

### Logging

Logs are available via Pino logger. Access them through:

```bash
# Vercel
vercel logs

# Netlify
netlify logs

# Docker
docker-compose logs -f app

# Railway
railway logs
```

### Performance Monitoring

Monitor these metrics:

- **Response Time:** API endpoints should respond in < 200ms
- **Error Rate:** Should be < 1%
- **Uptime:** Target 99.9%
- **Database Queries:** Should be < 50ms on average

### Regular Maintenance Tasks

**Daily:**
- Review error logs
- Check application uptime
- Monitor database performance

**Weekly:**
- Review rate limit violations
- Check disk space usage
- Update dependencies (security patches)

**Monthly:**
- Full security audit
- Performance optimization review
- Database cleanup (old sessions, etc.)

**Quarterly:**
- Major dependency updates
- Infrastructure cost review
- User feedback review

---

## Security Checklist

### Pre-Deployment

- [ ] JWT_SECRET is a strong, random string (min 32 characters)
- [ ] All environment variables are set correctly
- [ ] Database uses SSL connections
- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented on all endpoints
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSRF protection (for session-based auth)
- [ ] Dependencies are up to date
- [ ] No secrets in git repository
- [ ] Production dependencies only (no dev dependencies)

### Post-Deployment

- [ ] SSL certificate is valid
- [ ] Security headers are sent correctly
- [ ] Rate limits are working
- [ ] Authentication is working
- [ ] Authorization checks are enforced
- [ ] Data export/import is secure
- [ ] User data is properly isolated
- [ ] Logs don't contain sensitive information
- [ ] Error messages don't expose system details

### Ongoing

- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Review access logs
- [ ] Penetration testing (if applicable)
- [ ] Compliance with data protection regulations (GDPR, etc.)

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error:** `Can't reach database server`

**Solutions:**
- Verify DATABASE_URL is correct
- Check if database server is running
- Verify SSL mode is correct
- Check firewall rules
- Verify connection pooling settings

#### 2. JWT Token Errors

**Error:** `Invalid token` or `Token expired`

**Solutions:**
- Verify JWT_SECRET matches between deployments
- Check token expiration settings
- Verify Authorization header format
- Clear browser cookies/localStorage

#### 3. Rate Limit Errors

**Error:** `429 Too Many Requests`

**Solutions:**
- Implement exponential backoff
- Adjust rate limit thresholds if needed
- Check for infinite loops in client code
- Verify rate limit headers

#### 4. Build Errors

**Error:** `Build failed` or `Module not found`

**Solutions:**
- Run `npm install` to ensure all dependencies are installed
- Clear `.nuxt` and `node_modules`, then reinstall
- Check Node.js version compatibility
- Verify Prisma client is generated

#### 5. Offline Mode Not Working

**Solutions:**
- Verify service worker is registered
- Check browser console for SW errors
- Ensure HTTPS is being used (required for SW)
- Clear browser cache and re-register SW

#### 6. Migration Errors

**Error:** `Migration failed`

**Solutions:**
- Backup database before migrations
- Run migrations manually: `npx prisma migrate deploy`
- Check Prisma schema for errors
- Verify database permissions

---

## Performance Optimization

### 1. Database

```typescript
// Add indexes for frequently queried fields
@@index([userId, date])
@@index([createdAt])
```

### 2. Caching

Implement Redis or in-memory caching for:
- User sessions
- Frequently accessed workouts
- Template data

### 3. CDN

Use a CDN for static assets:
- Images
- JavaScript bundles
- CSS files

### 4. Compression

Enable gzip/brotli compression:

```typescript
// nuxt.config.ts
nitro: {
  compressPublicAssets: true,
}
```

### 5. Image Optimization

- Use WebP format
- Implement lazy loading
- Generate multiple sizes for responsive images

---

## Scaling Considerations

### Horizontal Scaling

- Deploy multiple instances behind a load balancer
- Use sticky sessions or stateless JWT tokens
- Implement distributed rate limiting

### Database Scaling

- Connection pooling (PgBouncer)
- Read replicas for read-heavy workloads
- Partition large tables by user or date

### Caching Strategy

- Implement Redis for session management
- Cache frequently accessed data
- Use CDN for static content

---

## Support

For deployment support:

- Documentation: See `API_DOCUMENTATION.md`
- Issues: GitHub Issues
- Email: support@gymnote.app
- Community: Discord/Slack

---

## Next Steps

After successful deployment:

1. ✅ Set up monitoring and alerts
2. ✅ Configure automated backups
3. ✅ Set up CI/CD pipeline
4. ✅ Document your deployment process
5. ✅ Create runbooks for common issues
6. ✅ Plan for disaster recovery
7. ✅ Set up status page
8. ✅ Collect user feedback

---

**Congratulations!** 🎉 Your production-ready Gymnote app is now deployed!
