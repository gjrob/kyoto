# CLAUDE.md — kyoto/clients/cherrytree (CherryTree Foundation Site)
# Read this before writing any code in this repo.
# Last updated: 2026-03-19 · Garlan Robinson / BluRing Holdings LLC

---

## WHAT THIS REPO IS

**CherryTree Foundation** — cherry-tree-foundation.org
The standalone Next.js site for CherryTree Community Forum, a 501(c) nonprofit
in Wilmington NC led by Chaz Springer.

This is NOT the BTV live platform. That is bluetubetv-live-vercel/.
This is NOT the web agency template. This client is scaffolded from kyoto
but deploys independently as its own Vercel project.

---

## REPO STRUCTURE

```
kyoto/clients/cherrytree/
├── app/
│   ├── components/
│   │   ├── ChatBot.tsx         ← AI assistant (CherryTree-configured)
│   │   └── PoweredByBTV.tsx    ← Required on every page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                ← CherryTree landing page
├── components/
│   └── DonationOverlay.tsx     ← Live stream donation CTA overlay
├── lib/
├── pages/
│   ├── admin/cherry-tree/
│   │   └── crm.tsx             ← Chaz's member database
│   ├── api/cherry-tree/
│   │   ├── members.ts          ← CRUD + DPA gate + audit log
│   │   ├── donate.ts           ← Stripe payment intent
│   │   └── stripe-webhook.ts   ← SEPARATE from BTV webhook
│   └── cherry-tree/
│       ├── donate.tsx          ← Bilingual donation form
│       └── join.tsx            ← Bilingual member registration
└── public/
```

---

## TECH STACK

- **Framework:** Next.js 14 (App Router for landing, Pages Router for features)
- **Database:** Supabase — nonprofit_cherry_tree schema ONLY
- **Payments:** Stripe — CherryTree account (separate from BTV)
- **Deployment:** Vercel → cherry-tree-foundation.org
- **Language:** TypeScript
- **AI:** Anthropic via coastalAI pattern

---

## CANONICAL RULES (ALL NON-NEGOTIABLE)

### Rule 1 — DPA gate on every API route
```typescript
if (process.env.CHERRY_TREE_DPA_EXECUTED !== 'true') {
  return res.status(503).json({ error: 'DPA not executed.' });
}
// Flip to true ONLY after Document 8 is signed by both parties.
```

### Rule 2 — Supabase client: lazy init, nonprofit schema
```typescript
// ✅ CORRECT — lazy init inside handler, routes to nonprofit schema
function getSupabaseCherry() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.CHERRY_TREE_SERVICE_ROLE_KEY!,
    { db: { schema: 'nonprofit_cherry_tree' } }
  );
}
// ❌ WRONG — never at module level, never public schema
```

### Rule 3 — audit_log is insert-only, forever
```typescript
// ✅ INSERT only
await supabase.from('audit_log').insert({ action, performed_by, ... });
// ❌ Never — violates DPA
await supabase.from('audit_log').update(...);
await supabase.from('audit_log').delete()...;
```

### Rule 4 — Separate Stripe webhook endpoint
```
CherryTree: /api/cherry-tree/stripe-webhook.ts  → CHERRY_TREE_STRIPE_WEBHOOK_SECRET
BTV:        Never use BTV's stripe-webhook here
```
Guard in webhook: `if (meta.client !== 'cherry_tree') return 200 skipped`

### Rule 5 — data_subjects: soft delete only
```typescript
// ✅ Soft delete — DPA right to erasure
await supabase.from('data_subjects').update({
  status: 'deleted',
  deletion_completed_at: new Date().toISOString()
}).eq('id', id);
// ❌ Never hard delete
await supabase.from('data_subjects').delete()...;
```

### Rule 6 — Bilingual EN/ES on all public pages
Every public string needs EN and ES. Language toggle in nav.
14% Hispanic population in Wilmington. Non-negotiable.

### Rule 7 — PoweredByBTV on every page
Mounted in layout.tsx. Never remove it.

### Rule 8 — Push from inside this directory
```bash
# ✅ CORRECT
cd kyoto/clients/cherrytree && git push origin main
# ❌ WRONG — pushes to wrong repo
cd kyoto && git push origin main
```

---

## DATABASE — nonprofit_cherry_tree schema

Same Supabase project as BTV. Isolated by schema + RLS.

```
nonprofit_cherry_tree (schema)
├── data_subjects    ← Members (DPA-compliant, soft-delete only)
├── donations        ← One-time + recurring gifts
├── members          ← Recurring donors with stripe_subscription_id
├── programs         ← Program catalog
├── participation    ← Attendance records
├── impressions      ← Digital engagement
├── email_campaigns  ← Marketing history
├── grants           ← Grant applications
├── audit_log        ← INSERT ONLY — compliance log
└── config           ← Schema settings
```

**BTV public schema is inaccessible from here. Never cross these streams.**

---

## FEATURE BUILD ORDER

### P0 — Built, needs DPA + env vars to go live
- ✅ CRM (`/admin/cherry-tree/crm`)
- ✅ Donation form (`/cherry-tree/donate`)
- ✅ Join page (`/cherry-tree/join`)
- ✅ Members API (`/api/cherry-tree/members`)
- ✅ Donate API (`/api/cherry-tree/donate`)
- ✅ Stripe webhook (`/api/cherry-tree/stripe-webhook`)
- ✅ DonationOverlay component

### P0 — Still needed
- ⬜ Impact dashboard (`/admin/cherry-tree/impact`)
- ⬜ Impact report API (`/api/cherry-tree/impact-report`)
- ⬜ Attendance logging (`/api/cherry-tree/log-attendance`)
- ⬜ ImpactSnapshot public widget
- ⬜ Programs management page

### P1 — After go-live
- ⬜ Marketing automation
- ⬜ AI assistant + grant writer

---

## ENVIRONMENT VARIABLES

```bash
# Supabase — same project as BTV, different schema
NEXT_PUBLIC_SUPABASE_URL=https://sdcgujkvszlgxflbxhcn.supabase.co
NEXT_PUBLIC_CHERRY_TREE_ANON_KEY=        # same as BTV anon key
CHERRY_TREE_SERVICE_ROLE_KEY=            # same as BTV service role key

# DPA gate — flip to true after Document 8 signed
CHERRY_TREE_DPA_EXECUTED=false

# Stripe — CherryTree account (separate from BTV)
NEXT_PUBLIC_CHERRY_TREE_STRIPE_KEY=
CHERRY_TREE_STRIPE_SECRET_KEY=
CHERRY_TREE_STRIPE_WEBHOOK_SECRET=       # different from BTV webhook secret

# AI
ANTHROPIC_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=https://cherry-tree-foundation.org
```

---

## GO-LIVE CHECKLIST

- ⬜ Document 8 signed by Garlan Robinson + Chaz Springer
- ⬜ Flip CHERRY_TREE_DPA_EXECUTED=true in .env.local + Vercel
- ⬜ Stripe keys filled in
- ⬜ Stripe webhook endpoint registered at /api/cherry-tree/stripe-webhook
- ⬜ npm run build passes clean
- ⬜ Push from kyoto/clients/cherrytree/
- ⬜ Set all env vars in Vercel project settings
- ⬜ Verify /cherry-tree/donate processes a $1 test payment

---

## OPENING PROMPT FOR EVERY CLAUDE CODE SESSION

```
Read CLAUDE.md at the repo root before writing any code.
This is kyoto/clients/cherrytree — the CherryTree Foundation 
standalone site (cherry-tree-foundation.org).
NOT the BTV live platform. NOT the kyoto web agency.

DPA status: NOT YET SIGNED — do not flip CHERRY_TREE_DPA_EXECUTED=true

CURRENT TASK: [describe task]
FILES TO TOUCH: [list them]
```
