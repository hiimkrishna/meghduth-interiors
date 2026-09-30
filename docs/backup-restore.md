# Backup & Restore Strategy

## Overview
This document outlines the backup and restore procedures for the Meghduth Interior platform.

## Database (Neon PostgreSQL)

### Automated Backups (Neon Built-in)
- **Point-in-Time Recovery (PITR)**: Enabled by default on all Neon projects
- **Retention**: 7 days on Free tier, up to 30 days on paid tiers
- **Frequency**: Continuous WAL archiving
- **RPO**: Near-zero (seconds)
- **RTO**: < 5 minutes for point-in-time restore

### Manual Backup Procedure
```bash
# Full logical backup
pg_dump -h <neon-host> -U <user> -d meghdut > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h <neon-host> -U <user> -d meghdut | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Schema-only backup
pg_dump -h <neon-host> -U <user> -d meghdut --schema-only > schema_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Procedure
```bash
# From SQL dump
psql -h <neon-host> -U <user> -d meghdut < backup_file.sql

# From compressed dump
gunzip -c backup_file.sql.gz | psql -h <neon-host> -U <user> -d meghdut

# Point-in-time restore (via Neon Console)
# 1. Go to Neon Console → Branches
# 2. Click "Create branch" → "Point-in-time restore"
# 3. Select timestamp
# 4. Swap compute endpoint after verification
```

## Application Files
- **Source Code**: Git repository (GitHub) - primary backup
- **Environment Variables**: Stored in Vercel/Neon dashboards
- **Uploaded Media**: Stored in `/public/uploads` or cloud storage (S3/R2)

## Secrets Backup
- **JWT_SECRET**: Store in 1Password/LastPass + Vercel
- **DATABASE_URL**: Neon dashboard
- **SMTP_* credentials**: Email provider dashboard
- **IMAP_* credentials**: Email provider dashboard
- **UPSTASH_REDIS_* credentials**: Upstash dashboard
- **SENTRY_DSN**: Sentry dashboard

## Recovery Time Objectives (RTO) & Recovery Point Objectives (RPO)

| Component | RTO | RPO | Backup Method |
|-----------|-----|-----|---------------|
| Database | < 5 min | < 1 sec | Neon PITR + pg_dump daily |
| Application Code | < 10 min | 0 | GitHub (every push) |
| Media Files | < 30 min | 24 hrs | S3 versioning / daily sync |
| Secrets | < 15 min | 0 | Password manager + Vercel/Neon |

## Disaster Recovery Plan

### Scenario 1: Database Corruption
1. Identify last known good timestamp
2. Use Neon PITR to create branch at that timestamp
3. Verify data integrity
4. Swap compute endpoint to new branch
5. Update DNS if needed

### Scenario 2: Complete Region Outage
1. Neon automatically fails over to replica (if configured)
2. If not, create new project in different region
3. Restore from latest pg_dump
4. Deploy application to new region
5. Update DNS

### Scenario 3: Application Deployment Failure
1. Rollback to previous Vercel deployment
2. Verify health endpoints
3. If database migration failed, run `drizzle-kit migrate` manually

## Testing Schedule
- **Monthly**: Test pg_dump restore to staging
- **Quarterly**: Full disaster recovery drill
- **After schema changes**: Verify migration works on staging copy

## Contacts
- **Primary**: DevOps Engineer
- **Secondary**: CTO
- **Neon Support**: support@neon.tech
- **Vercel Support**: support@vercel.com

## Documentation Updates
This document should be reviewed and updated:
- After any infrastructure changes
- After disaster recovery drills
- Quarterly at minimum