# Secrets Rotation Policy

## Overview
This document defines the secrets rotation schedule and procedures for the Meghduth Interior platform.

## Secrets Inventory

| Secret | Purpose | Rotation Period | Storage | Owner |
|--------|---------|-----------------|---------|-------|
| `JWT_SECRET` | Sign/verify auth tokens | 90 days | Vercel/1Password | DevOps |
| `DATABASE_URL` | Neon PostgreSQL connection | 90 days | Neon Dashboard/Vercel | DevOps |
| `SMTP_HOST/PORT/USER/PASS` | Email sending (replies) | 90 days | Email Provider/Vercel | DevOps |
| `SMTP_FROM` | From address for emails | As needed | Vercel | DevOps |
| `IMAP_HOST/PORT/USER/PASS` | Email reading (inbox sync) | 90 days | Email Provider/Vercel | DevOps |
| `UPSTASH_REDIS_REST_URL/TOKEN` | Rate limiting, caching | 90 days | Upstash/Vercel | DevOps |
| `SENTRY_DSN` | Error tracking | As needed | Sentry/Vercel | DevOps |
| `NEXT_PUBLIC_API_URL` | Client API base URL | As needed | Vercel | DevOps |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | As needed | Vercel | DevOps |
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side Sentry | As needed | Sentry/Vercel | DevOps |

## Rotation Schedule

### Quarterly (Every 90 Days)
- JWT_SECRET
- DATABASE_URL (Neon password rotation)
- SMTP credentials
- IMAP credentials
- UPSTASH_REDIS credentials

### Semi-Annually (Every 180 Days)
- SENTRY_DSN (if rotated by Sentry)
- NEXT_PUBLIC_* variables (if domain changes)

### Ad-Hoc
- When team member leaves
- After suspected compromise
- After security audit finding

## Rotation Procedure

### 1. JWT_SECRET Rotation
```bash
# Generate new secret (256-bit / 32 chars minimum)
openssl rand -base64 32

# Update in Vercel
vercel env add JWT_SECRET production
# Enter new value

# Deploy to trigger token rotation for all users
vercel --prod

# Old tokens become invalid on next refresh
# Users will be logged out and need to log in again
```

### 2. DATABASE_URL Rotation (Neon)
```bash
# In Neon Console:
# 1. Go to Project Settings → Connection
# 2. Click "Reset Password"
# 3. Copy new connection string
# 4. Update in Vercel:
vercel env add DATABASE_URL production
# 5. Deploy
vercel --prod
```

### 3. SMTP/IMAP Credentials Rotation
```bash
# In Email Provider (Postmark, SendGrid, etc.):
# 1. Generate new API key / SMTP password
# 2. Update in Vercel:
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add IMAP_USER production
vercel env add IMAP_PASS production
# 3. Deploy
vercel --prod
# 4. Test email send/receive
```

### 4. Upstash Redis Rotation
```bash
# In Upstash Console:
# 1. Go to Database → Settings
# 2. Click "Regenerate Token"
# 3. Update in Vercel:
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
# 4. Deploy
vercel --prod
```

## Rotation Checklist

- [ ] Generate new secret
- [ ] Update in secret store (Vercel/1Password)
- [ ] Deploy application
- [ ] Verify health endpoints (`/api/readyz`)
- [ ] Test critical flows (login, email send/receive, rate limiting)
- [ ] Update documentation
- [ ] Notify team (if user-facing impact)

## Emergency Rotation

If a secret is compromised:
1. **Immediately** rotate the compromised secret
2. Invalidate all active sessions (increment token_version for all users)
3. Force re-login for all admin users
4. Audit access logs for suspicious activity
5. Document incident

## Automation (Future)

Consider implementing:
- GitHub Actions workflow for automated rotation
- Secret expiration alerts (30 days before expiry)
- Integration with HashiCorp Vault or AWS Secrets Manager
- Automated deployment after rotation

## Contacts
- **Primary**: DevOps Engineer
- **Secondary**: CTO
- **Neon Support**: support@neon.tech
- **Vercel Support**: support@vercel.com
- **Upstash Support**: support@upstash.com