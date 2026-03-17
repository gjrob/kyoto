# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Who you are working for

**Garlan Robinson** — Solo founder, BluRing Holdings LLC
- **BlueTubeTV** — Live streaming platform for Wilmington NC venues
- **Web Agency** — Next.js demo sites for local Wilmington businesses

You are a senior full-stack engineer embedded in this team.
Write production code. Never create standalone `.html` files.

---

## Monorepo overview

BTV client demo sites. All clients share one Supabase project, separated by `client_slug`.

```
/                               ← repo root
├── clients/
│   ├── kyoto/                  ← Next.js App Router (first client — template)
│   ├── 1504/                   ← 1504 Resto-Bar
│   ├── cellphoneparadise/      ← Cell Phone Paradise
│   ├── lawnlads/               ← Lawn Lads (landscaping)
│   ├── popcar/                 ← Pop Car Auto
│   ├── queens/                 ← Queens
│   ├── smt/                    ← SMT Services (cleaning)
│   ├── dustdevil/              ← DUSTDEVIL Dirt Bike Marketplace
│   └── western-n-third/        ← Western 'N' Third Building Materials
├── shared/
│   ├── lib/events.ts           ← canonical event emitter (source of truth)
│   └── types/client.ts         ← shared TypeScript interfaces
├── supabase/migrations/        ← shared DB migrations
├── scripts/new-client.sh       ← bootstrap next client
├── create-and-push-clients.sh  ← deploy all clients to Vercel
├── fix-and-push-all.sh         ← bulk fix and push
├── roicalculator.html          ← sales pitch tool (standalone, do not move)
├── teleprompter.html           ← Loom sales video tool (standalone, do not move)
└── README.md
```

**Active clients (9):** `1504` · `cellphoneparadise` · `dustdevil` · `kyoto` · `lawnlads` · `popcar` · `queens` · `smt` · `western-n-third`

---

## Commands

All commands must be run from inside a client directory:

```bash
cd clients/kyoto
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm run start
```

To scaffold a new client:
```bash
bash scripts/new-client.sh [slug] "[Business Name]" "[primary-color]" "[accent-color]" "[tagline]"

# Examples:
bash scripts/new-client.sh smt "SMT Services" "#3d2b1f" "#c9a96e" "Superhero Cleaning"
bash scripts/new-client.sh lawnlads "Lawn Lads" "#1a3a1a" "#4caf50" "Wilmington's Lawn Pros"
```

No test suite is configured.

---

## Client architecture (kyoto is the canonical template)

```
clients/[slug]/
  app/
    layout.tsx              # Root layout — mounts ChatBot + PoweredByBTV globally
    page.tsx                # Single-page site (nav, hero, sections, footer)
    globals.css             # ALL styling — one CSS file, no modules or Tailwind
    components/
      ChatBot.tsx           # Floating chat bubble + streaming panel
      ReservationModal.tsx  # Full-screen form modal (restaurants)
      PoweredByBTV.tsx      # ← Required on every client, mounted in layout.tsx
    api/
      chat/route.ts         # Edge function — streams Claude responses
      reservations/route.ts # Inserts into Supabase reservations table
  lib/
    events.ts               # Local copy of shared/lib/events.ts (see Shared layer)
  public/
    ref/                    # Business reference images
```

### Key design decisions (follow these in every client)

**All styles live in `globals.css`.** No CSS modules, Tailwind, or inline styled-components.
Define the color palette as CSS custom properties in `:root`. Edit vars, not selectors.

**`page.tsx` is a single large client component** (`'use client'`).
All static data (menu items, categories, reviews, config) lives above the component.
State is minimal — scroll position, active tab, modal visibility.

**`ChatBot.tsx` is mounted in `layout.tsx`** so it persists across future routes.

**`PoweredByBTV.tsx` is mounted in `layout.tsx`** — same reason, and it must appear
on every client page without exception. See spec below.

**The chat API route runs on the Edge runtime:**
```typescript
export const runtime = 'edge'
// Streams raw text chunks — not SSE or JSON
// Client reads with ReadableStream / getReader()
```

**The reservations/bookings API** uses the Supabase **service-role** key (bypasses RLS)
and always includes `client_slug: '[slug]'` on every insert (multi-tenant schema).

---

## Tier 1 features — ALL 7 clients get these

Every client ships with all of the following. Never skip any of them.

| # | Feature | Implementation |
|---|---------|---------------|
| 1 | **Bilingual EN/ES** | Every user-facing string. Toggle in nav. |
| 2 | **Live venue status** | Supabase `venue_status` row, real-time open/closed |
| 3 | **Specials / Happy Hour banner** | Owner-controlled toggle, updates live |
| 4 | **Owner dashboard** `/dashboard` | Page views, menu clicks, chatbot chats |
| 5 | **AI Chatbot** | Claude API streaming, bilingual, business-aware |
| 6 | **PoweredByBTV footer** | Every page, every client, no exceptions |
| 7 | **Full SEO** | Meta + OG + Twitter Card + JSON-LD LocalBusiness |

---

## PoweredByBTV component (required on every client)

Mount in `layout.tsx` so it's automatic on all routes.

```tsx
// app/components/PoweredByBTV.tsx
export default function PoweredByBTV() {
  return (
    <div style={{
      background: '#0a0a0a',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      fontSize: '12px',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}>Powered by</span>
      <a
        href="https://bluetubetv.com"
        target="_blank"
        rel="noopener"
        style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 600 }}
      >
        BlueTubeTV
      </a>
      <span style={{ color: 'rgba(255,255,255,0.2)' }}>
        · Wilmington's Live Commerce Network
      </span>
    </div>
  )
}
```

```tsx
// app/layout.tsx
import PoweredByBTV from './components/PoweredByBTV'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <PoweredByBTV />   {/* ← always last, always present */}
        <ChatBot />
      </body>
    </html>
  )
}
```

---

## Bilingual (EN/ES) pattern

Every client string needs both languages. Use a single `lang` state in `page.tsx`:

```tsx
const [lang, setLang] = useState<'en' | 'es'>('en')

const t = {
  heroTitle:   { en: 'Authentic Japanese Cuisine', es: 'Cocina Japonesa Auténtica' },
  heroSub:     { en: 'Wilmington NC',               es: 'Wilmington NC' },
  bookBtn:     { en: 'Reserve a Table',             es: 'Reservar Mesa' },
  chatPrompt:  { en: 'Ask us anything...',          es: 'Pregúntanos...' },
}

// Usage
<h1>{t.heroTitle[lang]}</h1>

// Toggle in nav
<button onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}>
  {lang === 'en' ? 'ES' : 'EN'}
</button>
```

Pass `lang` to `ChatBot` so it responds in the active language:
```tsx
<ChatBot lang={lang} />
```

In the chat API route, add to system prompt:
```typescript
const systemPrompt = `...business context...
${lang === 'es' ? 'Respond in Spanish.' : 'Respond in English.'}`
```

---

## Client style system

Each client gets a visual identity defined at the top of `globals.css` as CSS vars.
Six presets to choose from — pick one per client, never mix.

### Style presets

| Preset | Heading Font | Body Font | Best for |
|--------|-------------|-----------|----------|
| `modern` | Cormorant Garamond | DM Sans | Home services, cafes (SMT) |
| `bold` | Bebas Neue | Inter | Auto, gyms, outdoors (Popcar, Lawnlads, Queens) |
| `editorial` | Playfair Display | Lato | Restaurants, bars (Kyoto, 1504) |
| `playful` | Fredoka One | Nunito | Food trucks, kids, casual |
| `luxury` | Bodoni Moda | Raleway | Spa, bridal, high-end retail |
| `minimal` | Space Grotesk | IBM Plex Sans | Tech, phone repair (CPP) |

### Client color map

| Client | Preset | Primary | Accent |
|--------|--------|---------|--------|
| `kyoto` | `editorial` | `#0d0a0e` | `#c8607a` |
| `1504` | `editorial` | `#0f0a08` | `#8b1a1a` |
| `smt` | `modern` | `#3d2b1f` | `#c9a96e` |
| `lawnlads` | `bold` | `#1a3a1a` | `#4caf50` |
| `popcar` | `bold` | `#0a0a0a` | `#f5c518` |
| `queens` | `bold` | `#0a0a0a` | `#d4af37` |
| `cellphoneparadise` | `minimal` | `#ffffff` | `#0070f3` |

### globals.css structure (every client)
```css
:root {
  /* Identity */
  --bg-primary:    [dark bg];
  --bg-secondary:  [slightly lighter];
  --bg-card:       [card bg];
  --accent:        [main accent color];
  --accent-deep:   [darker accent];
  --gold:          [warm highlight];
  --text-primary:  [body text];
  --text-secondary:[muted text];
  --border:        rgba(accent, 0.15);

  /* Typography */
  --font-heading:  '[Heading Font]', serif;
  --font-body:     '[Body Font]', sans-serif;

  /* Spacing */
  --radius:        [4px | 0px | 20px depending on preset];
}
```

---

## Chat API route (canonical pattern)

```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'

const client = new Anthropic()

export async function POST(req: Request) {
  const { messages, lang = 'en' } = await req.json()

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `You are the assistant for [Business Name] in Wilmington NC.
[Hours, services, specialties, phone number].
Be warm and concise (2-3 sentences). End with a CTA.
${lang === 'es' ? 'Respond in Spanish.' : 'Respond in English.'}`,
    messages,
    stream: true,
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
```

**Model string:** `claude-sonnet-4-20250514` — use this everywhere, no exceptions.

---

## SEO (every page)

Add to `app/layout.tsx` via Next.js `metadata` export:

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '[Business Name] | Wilmington NC',
  description: '[Service description]. Serving Wilmington NC.',
  keywords: '[service] Wilmington NC, [business name]',
  openGraph: {
    type: 'website',
    title: '[Business Name] | Wilmington NC',
    description: '[Description]',
    url: 'https://[domain].com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Business Name] | Wilmington NC',
    description: '[Description]',
    images: ['/og-image.jpg'],
  },
  other: {
    'geo.region': 'US-NC',
    'geo.placename': 'Wilmington, North Carolina',
  },
}
```

Add JSON-LD LocalBusiness schema in `page.tsx`:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: '[Business Name]',
    telephone: '[phone]',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wilmington',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    url: 'https://[domain].com',
    areaServed: 'Wilmington, NC',
  })}}
/>
```

---

## Shared layer

**`shared/lib/events.ts`** — canonical event emitter. Write all analytics through `emit()` or `emitServer()`. Inserts into `canonical_events` in Supabase. The comment `// KAFKA SWAP POINT` marks where to swap the transport later.

**`clients/[slug]/lib/events.ts`** — local copy required per client (Next.js App Router cannot import from outside project root). Header reads:
```
// SOURCE: shared/lib/events.ts — update both if changing
```

**`shared/types/client.ts`** — defines `ClientConfig`, `MenuItem`, `Reservation`. Use these for all new DB queries and API routes.

---

## Environment variables (per client `.env.local`)

| Variable | Purpose | Exposure |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Powers chatbot | Server only |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS for server writes | Server only |
| `NEXT_PUBLIC_CLIENT_SLUG` | e.g. `kyoto` — on every row | Public |

**Rule:** Never prefix a secret with `NEXT_PUBLIC_`. It will be in the browser bundle.

---

## Supabase — multi-tenant schema

Every table that stores client data includes `client_slug` for row isolation.

**Shared tables across all clients:**
- `reservations` — bookings with `client_slug`
- `canonical_events` — analytics events with `client_slug`
- `venue_status` — `{ client_slug, kitchen_open, specials_text, happy_hour_active }`
- `chatbot_sessions` — conversation logs with `client_slug`

**BTV-specific tables (do not use in client sites):**
- `sponsors`, `sponsor_qr_scans`, `impressions`, `scene_state`, `raffle_config`,
  `raffle_entries`, `venues`, `community_events`, `overlay_slots`

**All migrations go in `supabase/migrations/`** — never make raw schema changes
in the Supabase dashboard without a corresponding migration file.

---

## Kyoto color palette (reference — do not reuse, each client gets unique palette)

| Token | Value | Role |
|---|---|---|
| `--bg-primary` | `#0d0a0e` | Page background |
| `--bg-secondary` | `#1a1118` | Section backgrounds |
| `--bg-card` | `#211520` | Cards, chat panel |
| `--blossom-pink` | `#e8a0b0` | Labels, borders |
| `--blossom-deep` | `#c8607a` | CTAs, buttons |
| `--gold` | `#d4a843` | Headers, stats |
| `--text-primary` | `#f5ede8` | Body text |
| `--text-secondary` | `#b8929a` | Muted text |
| `--border` | `rgba(232,160,176,0.15)` | Card borders |

---

## Petal animation (kyoto-specific)

10 `.petal` divs in `.hero` from `PETAL_CONFIG` in `page.tsx`.
`petalFall` keyframe and `.petal` base styles in `globals.css`.
Each petal gets `left`, `animationDuration`, `animationDelay` as inline styles.
Do not replicate this in other clients unless specifically requested.

---

## What NOT to do

| ❌ Never | ✅ Instead |
|----------|-----------|
| Create `.html` files | `.tsx` in the client app |
| Use Pages Router | App Router (this repo uses App Router) |
| CSS modules or Tailwind | `globals.css` with CSS custom properties |
| Import from outside client root | Copy to `lib/` with source comment |
| `NEXT_PUBLIC_` on secrets | Server-only env vars |
| Skip bilingual on any string | Every label gets EN + ES |
| Skip `PoweredByBTV` | Mount in `layout.tsx`, every client |
| Skip SEO metadata | Every `layout.tsx` gets full metadata export |
| Raw Supabase schema changes | Migration file in `supabase/migrations/` |
| Reference old clients not in repo | Active 9: 1504, cellphoneparadise, dustdevil, kyoto, lawnlads, popcar, queens, smt, western-n-third |

---

## Git commits

```
feat: add bilingual EN/ES to lawnlads
feat: PoweredByBTV footer to all clients
feat: venue_status real-time for smt
fix: chat stream not closing in popcar
chore: scaffold queens via new-client.sh
style: update kyoto hero gradient
refactor: extract ChatBot to shared component
```

---

## Root utility files (do not move or convert)

| File | Purpose |
|------|---------|
| `roicalculator.html` | Standalone sales tool for pitching agency services |
| `teleprompter.html` | Loom video scripts: Pop Car, Salt & Charm, 1504, Kyoto |
| `create-and-push-clients.sh` | Deploy all client sites to Vercel |
| `fix-and-push-all.sh` | Bulk fix and force-push all clients |

---

*Last updated: March 2026*
*Garlan Robinson / BluRing Holdings LLC*
*Active clients: 1504 · cellphoneparadise · dustdevil · kyoto · lawnlads · popcar · queens · smt · western-n-third*