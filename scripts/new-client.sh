#!/bin/bash
# Usage: bash scripts/new-client.sh zoras "Zora's Seafood" "#0a1628" "#00b4d8" "Marina"
# Args:  slug  "Full Name"  primary_color  accent_color  bot_name

SLUG=$1
NAME=$2
PRIMARY=${3:-"#1a1a2e"}
ACCENT=${4:-"#e8a0b0"}
BOT=${5:-"Assistant"}

if [ -z "$SLUG" ]; then
  echo "Usage: bash scripts/new-client.sh <slug> <name> <primary> <accent> <botname>"
  exit 1
fi

echo "Creating client: $SLUG — $NAME"

# Copy kyoto as base
cp -r clients/kyoto clients/$SLUG

# Remove kyoto-specific files
rm -rf clients/$SLUG/.next
rm -rf clients/$SLUG/node_modules
rm -f clients/$SLUG/.env.local

# Create .env.local for new client
cat > clients/$SLUG/.env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_CLIENT_SLUG=$SLUG
EOF

echo ""
echo "✅ Client '$SLUG' created at clients/$SLUG"
echo ""
echo "Next steps:"
echo "  1. Fill in clients/$SLUG/.env.local"
echo "  2. cd clients/$SLUG && npm install"
echo "  3. Add to Supabase: INSERT INTO client_config (slug, name, primary_color, accent_color, chatbot_name)"
echo "     VALUES ('$SLUG', '$NAME', '$PRIMARY', '$ACCENT', '$BOT');"
echo "  4. npm run dev"
echo "  5. Redesign: update globals.css colors and page.tsx content"
echo ""
