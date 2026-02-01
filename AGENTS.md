# AGENTS.md

## Project Overview

Self-hosted photo gallery replacing Smugmug. Static Astro site deployed to AWS (S3 + CloudFront) with CDK infrastructure.

## Key Components

- **site/** - Astro static site with gallery views and lightbox
- **infra/** - CDK TypeScript stack (S3, CloudFront, Route53, ACM)
- **tools/** - Python utilities for thumbnails and deployment
- **photos/** - Local photo staging (gitignored)

## For AI Agents

**Documentation Strategy**:
1. Read `docs/index.md` first to understand available documentation
2. Check `skills/index.md` for reusable workflows
3. Update docs when making changes that affect documented behaviors

**Key Files**:
- `site/src/config.ts` - IMAGE_BASE configuration for local vs prod
- `infra/lib/infra-stack.ts` - All AWS infrastructure
- `tools/deploy.py` - Build and deploy workflow

**Local Development**:
```bash
cd site && npm run dev
# Photos served from public/photos symlink
```

**Deployment**:
```bash
cd tools && uv run deploy.py
# Or manually: aws s3 sync
```
