#!/usr/bin/env bash
# archive-vercel.sh
# Disconnects 5 inactive Vercel projects from Git (stops auto-deploys)
# Run from anywhere — does not require being inside a project dir

set -e

PROJECTS=(
  "1504"
  "lawnlads"
  "gilmore"
  "cutthecrapparenting"
  "popcar"
)

echo "🔍 Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

echo "🔐 Logging in to Vercel (skip if already logged in)..."
vercel whoami 2>/dev/null || vercel login

echo ""
echo "📦 Disconnecting ${#PROJECTS[@]} projects from Git..."
echo ""

for slug in "${PROJECTS[@]}"; do
  echo "→ $slug"
  # Remove the Git connection — stops all future auto-deploys
  vercel git disconnect --yes --project "$slug" 2>/dev/null \
    && echo "  ✅ Disconnected" \
    || echo "  ⚠️  Could not disconnect $slug (may already be disconnected or name differs)"
  echo ""
done

echo "================================================"
echo "Done. Verify at https://vercel.com/dashboard"
echo ""
echo "Each project's last deployment URL is still live."
echo "To fully delete a project later:"
echo "  vercel remove <project-name> --yes"
echo "================================================"