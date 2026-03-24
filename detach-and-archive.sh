#!/usr/bin/env bash
# detach-and-archive.sh
# Run from: /Users/garlanjrobinson/Desktop/kyoto
# Purpose:
#   1. Strip .git from the 5 inactive client dirs (makes them regular dirs)
#   2. mv them into archive/
#   3. Strip .git from the 8 active client dirs (makes them regular dirs tracked by root repo)
#   4. git add everything so root repo owns all client files going forward
#   5. Leave billing/billing submodule alone (it's legitimate)

set -e
cd /Users/garlanjrobinson/Desktop/kyoto

echo "=== Pre-flight ==================================="
git status --short | head -20
echo ""

# ── INACTIVE: strip .git and move to archive/ ──────────────────────────────
INACTIVE=(1504 lawnlads gilmore cutthecrapparenting popcar)

echo "=== Archiving 5 inactive clients ================="
for slug in "${INACTIVE[@]}"; do
  if [ -d "clients/$slug/.git" ]; then
    echo "→ Stripping .git from clients/$slug"
    rm -rf "clients/$slug/.git"
  fi
  echo "→ Moving clients/$slug to archive/$slug"
  mv "clients/$slug" "archive/$slug"
  echo "  ✅ $slug archived"
done

# ── ACTIVE: strip .git so root repo tracks them ────────────────────────────
ACTIVE=(cellphoneparadise cherrytree kyoto queens smt dirtbikz dirtdevil western-n-third)

echo ""
echo "=== Detaching .git from 8 active clients ========="
for slug in "${ACTIVE[@]}"; do
  if [ -d "clients/$slug/.git" ]; then
    echo "→ Stripping .git from clients/$slug"
    rm -rf "clients/$slug/.git"
    echo "  ✅ $slug detached"
  else
    echo "  — $slug already clean (no .git)"
  fi
done

# ── Commit everything ──────────────────────────────────────────────────────
echo ""
echo "=== Committing to root repo ======================"
git add -A
git commit -m "restructure: detach nested client repos, archive 5 inactive clients

- Removed .git from all clients/* (were nested repos, not tracked by root)
- Archived: 1504, lawnlads, gilmore, cutthecrapparenting, popcar -> archive/
- Active clients now tracked directly by root repo:
  cellphoneparadise, cherrytree, kyoto, queens, smt, dirtbikz, dirtdevil, western-n-third
- billing/billing submodule untouched (legitimate submodule)
- All file history preserved in individual client repos on GitHub if needed"

git push origin main

echo ""
echo "=== Done ========================================="
echo ""
echo "archive/ now contains:"
ls archive/
echo ""
echo "clients/ now contains:"
ls clients/
echo ""
echo "⚠️  NOTE: Each client's individual GitHub repo (gjrob/1504 etc)"
echo "   still exists untouched. This only changes the kyoto monorepo."
echo ""
echo "Next: run ./archive-vercel.sh to disconnect the 5 from Vercel"