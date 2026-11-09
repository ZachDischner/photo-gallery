# zd-gallery

Self-hosted photo gallery replacing Smugmug. Static site on AWS (S3 + CloudFront).

## Quick Start

```bash
# 1. Deploy infrastructure (first time only)
cd infra && npx cdk deploy

# 2. Point GoDaddy NS records to Route53 (see stack output)

# 3. Deploy site + photos
cd tools && uv run deploy.py
```

## Local Development

```bash
cd site && npm run dev
# Open http://localhost:4321
```

## Adding Photos

1. Add folders to `photos/` (use slugified names like `2024-trip-name`)
2. Run `cd tools && uv run deploy.py`

## Code Changes

Push review branches named `codex/<short-description>` to GitHub. After the pull request workflow is merged into `main`, GitHub opens a pull request as `github-actions[bot]`. See [the GitHub review workflow](docs/GITHUB_WORKFLOW.md).

## Structure

- `infra/` - CDK infrastructure (S3 + CloudFront + Route53 + ACM)
- `site/` - Astro static site
- `tools/` - Python utilities (uv)
- `photos/` - Local staging (gitignored)
