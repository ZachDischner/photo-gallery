# Documentation Index

## 🚀 Quick Start

### README.md (project root)
**Purpose**: Quick setup and common commands  
**Read When**: Getting started or need a refresher

**Quick Commands:**
```bash
# Local development
cd site && npm run dev

# Deploy everything
cd tools && uv run deploy.py

# Generate thumbnails
cd tools && ./gen_thumbs.sh
```

## 🏗️ Architecture

### ARCHITECTURE.md
**Purpose**: System design and AWS infrastructure overview  
**Read When**: Understanding how components connect  
**Contains**: S3 + CloudFront + Route53 setup, image serving strategy, cost estimates

## 📦 Components

### SITE.md
**Purpose**: Astro static site structure and customization  
**Read When**: Modifying gallery layout, styles, or adding features  
**Contains**: Page structure, IMAGE_BASE config, thumbnail usage

### INFRASTRUCTURE.md
**Purpose**: CDK stack details and deployment  
**Read When**: Modifying AWS resources or debugging infra issues  
**Contains**: Stack resources, custom domain setup, CloudFront function

### TOOLS.md
**Purpose**: Python utilities for deployment and image processing  
**Read When**: Deploying or processing photos  
**Contains**: deploy.py workflow, gen_thumbs.sh usage, adding new photos

## 🔧 Operations

### DEPLOYMENT.md
**Purpose**: Step-by-step deployment guide  
**Read When**: First deploy or troubleshooting  
**Contains**: CDK deploy, DNS setup, S3 sync, CloudFront invalidation

### GITHUB_WORKFLOW.md
**Purpose**: GitHub pull request workflow

**Read When**: Opening or reviewing code changes

**Contains**: Codex branch naming, automatic PR creation, and review steps

### LOCAL_DEV.md
**Purpose**: Local development setup  
**Read When**: Setting up dev environment or testing changes  
**Contains**: Symlink setup, dev server, testing with real photos
