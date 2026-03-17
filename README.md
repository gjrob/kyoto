# BTV Client Sites — Monorepo

Local business demo sites built on Next.js + Supabase + Claude AI.
All clients share one Supabase project, separated by `client_slug`.

## Structure
- `clients/` — one folder per client site (each is a standalone Next.js app)
- `shared/` — event emitter, TypeScript types, base components
- `supabase/` — migrations (run once, shared by all clients)
- `scripts/` — bootstrap a new client

## Add a new client
```bash
bash scripts/new-client.sh zoras "Zora's Seafood" "#0a1628" "#00b4d8" "Marina"
```

## Run a client locally
```bash
cd clients/kyoto
npm run dev
```

## Deploy a client
```bash
cd clients/kyoto
npx vercel --prod
```

## Active clients
| Client | Slug | Status |
|--------|------|--------|
| Kyoto Asian Grille | `kyoto` | ✅ Active |
