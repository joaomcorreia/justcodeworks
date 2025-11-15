# Just Code Works - Frontend

Translation-ready Next.js frontend for Just Code Works EU project.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- i18n with 6 locales: en, nl, fr, de, es, pt

## Setup

1. Install dependencies:
```cmd
cd /d C:\projects\justcodeworks\frontend
npm install
```

2. Run development server:
```cmd
npm run dev
```

The app will run on http://localhost:3000

## URL Structure
- `/` → Auto-redirects to `/{locale}` based on browser language
- `/en` → English homepage
- `/nl` → Dutch homepage
- `/fr` → French homepage
- `/de` → German homepage
- `/es` → Spanish homepage
- `/pt` → Portuguese homepage

## Port Management

If port 3000 is busy, find and kill the process:
```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

Or run on a different port:
```cmd
npm run dev -- -p 3001
```

## Cache Cleanup

If the dev server crashes or behaves unexpectedly:
```cmd
npm run clean
npm install
npm run dev
```

## Translation System

All text is centralized in `src/i18n/base-en.ts`.

To add translations:
1. Open the locale file (e.g., `src/i18n/locales/nl.ts`)
2. Replace `import baseEn from "../base-en"` with your translated dictionary
3. Export the translated object with the same structure

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx    # Locale-aware layout with header/footer
│   │   │   └── page.tsx      # Homepage using translations
│   │   └── globals.css       # Tailwind styles
│   └── i18n/
│       ├── base-en.ts        # Base English translations
│       ├── index.ts          # Dictionary loader
│       └── locales/          # Per-locale translation files
├── middleware.ts             # Browser language detection
└── next.config.mjs          # Next.js config with i18n
```

## Notes
- No Turbopack (stable config only)
- No Python/Django dependencies (backend separate)
- All commands are Windows CMD-compatible
