# Deployment Guide

## Overview

This project uses a three-branch Git workflow for safe development and deployment:
- **main** - Production-ready code
- **staging** - Pre-production testing environment
- **develop** - Active development

---

## Branch Strategy

### Branch Purposes

```
main (production)
  ├── staging (pre-production testing)
  └── develop (active development)
      └── feature/* (individual features)
```

**main**
- Production-ready code only
- Protected branch (no direct commits)
- Deploys to production environment
- Only accepts merges from `staging`

**staging**
- Pre-production testing
- Mirrors production environment
- Deploys to staging environment
- Accepts merges from `develop`

**develop**
- Active development branch
- All feature branches merge here first
- Continuous integration testing
- Not deployed automatically

---

## Development Workflow

### 1. Starting New Work

```bash
# Make sure you're on develop and up to date
git checkout develop
git pull origin develop

# Create a feature branch (optional for small changes)
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes
# Test locally with: npm run dev

# Stage and commit
git add .
git commit -m "Description of changes"
```

### 3. Merging to Develop

```bash
# Switch to develop
git checkout develop

# Merge your changes
git merge feature/your-feature-name
# OR if you worked directly on develop, you're already done

# Push to remote
git push origin develop
```

### 4. Testing in Staging

```bash
# Switch to staging
git checkout staging

# Merge from develop
git merge develop

# Push to remote (triggers staging deployment)
git push origin staging
```

**Test thoroughly in staging environment before proceeding!**

### 5. Deploying to Production

```bash
# Switch to main
git checkout main

# Merge from staging (only after thorough testing)
git merge staging

# Push to remote (triggers production deployment)
git push origin main
```

---

## Environment Setup

### Local Development

1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your local configuration

3. Start the dev server:
```bash
npm run dev
```

### Staging Environment

Configure your deployment platform (Vercel, Netlify, etc.) with:
- Branch: `staging`
- Environment variables from `.env.staging.example`

### Production Environment

Configure your deployment platform with:
- Branch: `main`
- Environment variables from `.env.production.example`

---

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Configure Production**
   - Production Branch: `main`
   - Add environment variables from `.env.production.example`

3. **Configure Staging**
   - Go to Settings → Git
   - Add `staging` branch
   - Create a new deployment for staging branch
   - Add environment variables from `.env.staging.example`

4. **Auto-Deployment**
   - Pushes to `main` → auto-deploy to production
   - Pushes to `staging` → auto-deploy to staging
   - Pushes to `develop` → no deployment (dev only)

### Netlify

Similar setup to Vercel:
1. Connect repository
2. Set production branch to `main`
3. Add staging branch deployment
4. Configure environment variables

### GitHub Pages

Requires static export:
1. Add to `package.json`:
```json
"scripts": {
  "export": "next build && next export"
}
```

2. Configure GitHub Actions for deployment

---

## Quick Reference

### Common Commands

```bash
# Check current branch
git branch

# Switch branches
git checkout main
git checkout staging
git checkout develop

# View branch status
git status

# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

### Workflow Cheatsheet

```bash
# Daily development
git checkout develop
# ... make changes ...
git add .
git commit -m "Your changes"
git push origin develop

# Deploy to staging
git checkout staging
git merge develop
git push origin staging
# → Test in staging environment

# Deploy to production
git checkout main
git merge staging
git push origin main
# → Live in production
```

---

## Rollback Procedures

### Rollback Staging

```bash
git checkout staging
git reset --hard HEAD~1  # Undo last commit
git push origin staging --force
```

### Rollback Production

```bash
git checkout main
git reset --hard HEAD~1  # Undo last commit
git push origin main --force

# OR revert specific commit
git revert <commit-hash>
git push origin main
```

**⚠️ Use force push carefully!**

---

## Best Practices

1. **Never commit directly to main**
   - Always go through staging first

2. **Test thoroughly in staging**
   - Staging should mirror production exactly

3. **Keep develop clean**
   - Only merge working code
   - Run `npm run lint` before committing

4. **Use descriptive commit messages**
   ```
   Good: "Fix React hooks errors in file-upload component"
   Bad: "fix bugs"
   ```

5. **Pull before you push**
   ```bash
   git pull origin develop  # Before pushing to develop
   ```

6. **Keep branches in sync**
   - Regularly merge develop → staging → main
   - Don't let branches drift too far apart

---

## Troubleshooting

### Merge Conflicts

```bash
# If you get merge conflicts
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
```

### Lost Changes

```bash
# View recent commits
git reflog

# Restore to specific commit
git reset --hard <commit-hash>
```

### Wrong Branch

```bash
# If you committed to wrong branch
git log  # Find commit hash
git checkout correct-branch
git cherry-pick <commit-hash>
```

---

## Support

For deployment platform-specific help:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
