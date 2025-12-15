#!/bin/bash

# Setup script for CI/CD Pipeline Security Check

set -e

echo "==============================================="
echo "🔒 CI/CD Pipeline Security Setup"
echo "==============================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Ensure all branches exist
echo "📌 Checking required branches..."

for branch in dev test main; do
    if git show-ref --quiet refs/heads/$branch; then
        echo "  ✅ Branch '$branch' exists"
    else
        echo "  ⚠️  Branch '$branch' not found. Creating it..."
        git checkout -b $branch
    fi
done

echo ""
echo "==============================================="
echo "🔑 GitHub Secrets Configuration"
echo "==============================================="
echo ""
echo "You need to configure these secrets in GitHub:"
echo ""
echo "1. TELEGRAM_TOKEN"
echo "   Get it from @BotFather on Telegram"
echo ""
echo "2. TELEGRAM_CHAT_ID"
echo "   Send a message to your bot and get ID from:"
echo "   https://api.telegram.org/bot{TOKEN}/getUpdates"
echo ""
echo "3. Choose a hosting provider:"
echo ""
echo "   Option A - Render (RECOMMENDED):"
echo "   - RENDER_DEPLOY_HOOK: Get from Render.com deploy settings"
echo ""
echo "   Option B - Vercel:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo ""
echo "   Option C - Fly.io:"
echo "   - FLY_API_TOKEN"
echo ""
echo "==============================================="
echo "✅ Setup Complete!"
echo "==============================================="
echo ""
echo "Next steps:"
echo "1. Go to your GitHub repo → Settings → Secrets and variables → Actions"
echo "2. Add the secrets listed above"
echo "3. Create a PR from 'dev' to 'test' branch"
echo "4. Watch the CI/CD pipeline run automatically!"
echo ""
