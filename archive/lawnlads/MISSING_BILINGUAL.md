# Missing: Bilingual EN/ES — lawnlads

## What to add to page.tsx

```tsx
// 1. Add state at top of component:
const [lang, setLang] = useState<'en' | 'es'>('en')

// 2. Add translation object above component:
const t = {
  // Add every user-facing string here
  heroTitle: { en: 'Your Title', es: 'Tu Título' },
  heroCta:   { en: 'Book Now',  es: 'Reservar'  },
}

// 3. Use in JSX:
<h1>{t.heroTitle[lang]}</h1>

// 4. Add toggle button to nav:

{/* ── LANGUAGE TOGGLE — add to nav in page.tsx ── */}
{/* Add state at top of component: const [lang, setLang] = useState<'en' | 'es'>('en') */}
<button
  onClick={() => setLang((l: 'en' | 'es') => l === 'en' ? 'es' : 'en')}
  style={{
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.7)',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.08em',
  }}
>
  {lang === 'en' ? 'ES' : 'EN'}
</button>


// 5. Pass lang to ChatBot:
<ChatBot lang={lang} />
```

Issues found:
- No ES language strings found
