# Chinese Name Generator - Production Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Options](#deployment-options)
4. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
5. [Vercel Deployment](#vercel-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Database Setup](#database-setup)
8. [Monitoring & Observability](#monitoring--observability)
9. [Security Checklist](#security-checklist)
10. [Performance Optimization](#performance-optimization)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher
- **Git**: Latest version

### Install Dependencies

```bash
pnpm install
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Database (choose one)
# Option 1: Local SQLite (development only)
DATABASE_URL=file:./data/chinese-name.db

# Option 2: Turso (recommended for production)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token

# Rate Limiting (optional but recommended)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Monitoring (optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Environment-Specific Settings

| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | development | production |
| `DATABASE_URL` | file:./data/... | libsql://... |
| `SENTRY_DSN` | (optional) | (required) |

---

## Deployment Options

### Quick Comparison

| Platform | Best For | Pros | Cons |
|----------|----------|------|------|
| **Cloudflare Pages** | Global edge deployment | Fast, free tier, edge functions | Limited Node.js APIs |
| **Vercel** | Next.js apps | Zero config, great DX | Cost at scale |
| **Docker** | Self-hosted | Full control | Requires infrastructure |

---

## Cloudflare Pages Deployment

### Step 1: Install Wrangler CLI

```bash
pnpm add -g wrangler
wrangler login
```

### Step 2: Configure Project

Create `wrangler.toml` (if not exists):

```toml
name = "chinese-name"
compatibility_date = "2024-01-01"

[vars]
NEXT_PUBLIC_SITE_URL = "https://chinese-name.pages.dev"

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

### Step 3: Deploy

```bash
# Build and deploy
pnpm build
wrangler pages deploy .next --project-name=chinese-name

# Or use the deploy script
./deploy.sh deploy --cloudflare
```

### Step 4: Configure Custom Domain

1. Go to Cloudflare Dashboard → Pages → your project
2. Click "Custom domains" → "Set up a custom domain"
3. Enter your domain and follow DNS instructions

### Cloudflare-Specific Optimizations

```typescript
// next.config.ts - Add for Cloudflare
const config = {
  // Enable edge runtime for API routes
  experimental: {
    runtime: 'edge',
  },
};
```

---

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
pnpm add -g vercel
vercel login
```

### Step 2: Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Or use the deploy script
./deploy.sh deploy --vercel --prod
```

### Step 3: Configure Environment Variables

1. Go to Vercel Dashboard → your project → Settings → Environment Variables
2. Add all required variables from `.env.example`

### Vercel-Specific Settings

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["hkg1", "sin1", "nrt1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## Docker Deployment

### Step 1: Build Docker Image

```bash
# Build image
docker build -t chinese-name:latest .

# Or use the deploy script
./deploy.sh deploy --docker
```

### Step 2: Run Container

```bash
# Run with environment file
docker run -d \
  --name chinese-name \
  -p 3000:3000 \
  --env-file .env.production \
  chinese-name:latest

# With Docker Compose
docker-compose up -d
```

### Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/data/chinese-name.db
    volumes:
      - ./data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Database Setup

### Option 1: Turso (Recommended)

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create chinese-name

# Get connection URL
turso db show chinese-name --url

# Get auth token
turso db tokens create chinese-name
```

### Option 2: Local SQLite

```bash
# Initialize database
pnpm db:push

# Import character data
pnpm data:import
```

### Database Migrations

```bash
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:push

# View database
pnpm db:studio
```

---

## Monitoring & Observability

### Sentry Setup

1. Create a Sentry project at https://sentry.io
2. Get your DSN from Project Settings → Client Keys
3. Add to environment variables:

```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=chinese-name
```

### Health Check Endpoint

The app exposes `/api/health` for monitoring:

```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0"
}
```

### Recommended Monitoring Stack

- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible
- **Performance**: Vercel Analytics, Cloudflare Analytics

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] CSP headers configured in `next.config.ts`
- [ ] Rate limiting enabled
- [ ] Input validation on all API endpoints

### Post-Deployment

- [ ] HTTPS enabled (automatic on Vercel/Cloudflare)
- [ ] Security headers verified (use securityheaders.com)
- [ ] robots.txt configured correctly
- [ ] No sensitive data in client-side code

### Security Headers (Configured)

```typescript
// Already configured in next.config.ts
{
  'Content-Security-Policy': "default-src 'self'; ...",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
pnpm build && pnpm analyze

# Check for large dependencies
npx depcheck
```

### Caching Strategy

| Resource | Cache Duration | Strategy |
|----------|----------------|----------|
| Static assets | 1 year | Immutable |
| API responses | 1-5 minutes | stale-while-revalidate |
| HTML pages | 1 hour | ISR |

### Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | ~2.0s |
| FID | < 100ms | ~50ms |
| CLS | < 0.1 | ~0.05 |

---

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### Database Connection Error

```bash
# Check DATABASE_URL format
# SQLite: file:./data/chinese-name.db
# Turso: libsql://your-db.turso.io

# Test connection
pnpm db:studio
```

#### Rate Limiting Issues

```bash
# Check Upstash configuration
curl -X GET "https://your-redis.upstash.io/get/test" \
  -H "Authorization: Bearer your-token"
```

#### Memory Issues on Build

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

### Logs

```bash
# Vercel logs
vercel logs --follow

# Cloudflare logs
wrangler tail

# Docker logs
docker logs -f chinese-name
```

---

## Quick Commands Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linter
pnpm test             # Run tests

# Database
pnpm db:push          # Apply schema
pnpm db:studio        # Open database UI
pnpm data:import      # Import character data

# Deployment
./deploy.sh full vercel prod     # Full pipeline to Vercel
./deploy.sh deploy --cloudflare  # Deploy to Cloudflare
./deploy.sh health               # Check health endpoint
```

---

## Support

- **Issues**: https://github.com/your-repo/chinese-name/issues
- **Documentation**: https://your-docs-site.com

---

*Last updated: 2024-02-07*
