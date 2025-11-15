# Quick Start Guide - Just Code Works Frontend

## First Time Setup

1. **Install dependencies:**
   ```cmd
   cd /d C:\projects\justcodeworks\frontend
   npm install
   ```
   
   Or use the helper script:
   ```cmd
   setup.cmd
   ```

2. **Start development server:**
   ```cmd
   npm run dev
   ```
   
   Or use the helper script:
   ```cmd
   start-dev.cmd
   ```

3. **Open in browser:**
   - http://localhost:3000 (auto-redirects to your browser language)
   - http://localhost:3000/en (English)
   - http://localhost:3000/nl (Dutch)
   - http://localhost:3000/fr (French)
   - http://localhost:3000/de (German)
   - http://localhost:3000/es (Spanish)
   - http://localhost:3000/pt (Portuguese)

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean cache and build files |

## Helper Scripts (Windows CMD)

| Script | Purpose |
|--------|---------|
| `setup.cmd` | First-time setup (installs dependencies) |
| `start-dev.cmd` | Start dev server with port check |
| `clean.cmd` | Clean cache if server crashes |

## Troubleshooting

### Port 3000 is busy
```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

Or run on different port:
```cmd
npm run dev -- -p 3001
```

### Dev server crashes or behaves oddly
```cmd
clean.cmd
npm install
start-dev.cmd
```

### Module not found errors
Make sure you're in the correct directory:
```cmd
cd /d C:\projects\justcodeworks\frontend
npm install
```

## Translation Workflow

Current status: All locales use English text from `base-en.ts`

To translate:
1. Open `src/i18n/locales/{locale}.ts` (e.g., `nl.ts` for Dutch)
2. Create a new dictionary object matching the structure of `base-en.ts`
3. Replace all English strings with translated versions
4. Export the translated dictionary

Example for Dutch (`nl.ts`):
```typescript
const nl = {
  hero: {
    badge: "Alles verbonden: website, drukwerk & AI.",
    title: "Alles wat je nodig hebt om je bedrijf online te krijgen.",
    // ... rest of translations
  },
  // ... etc
};

export default nl;
```

## Project Structure

```
frontend/
├── middleware.ts              # Language detection & redirect
├── next.config.mjs           # Next.js i18n config
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind base styles
│   │   └── [locale]/         # Locale-specific routes
│   │       ├── layout.tsx    # Header, footer, HTML wrapper
│   │       └── page.tsx      # Homepage content
│   └── i18n/
│       ├── base-en.ts        # Base English dictionary
│       ├── index.ts          # Dictionary loader function
│       └── locales/          # Translation files (en, nl, fr, de, es, pt)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
└── tailwind.config.js        # Tailwind config
```

## What's Next?

This frontend is ready for:
- ✅ Browser language detection
- ✅ Multi-locale routing
- ✅ Translation system
- ✅ Responsive dark theme UI
- ✅ Hero, website cards, placeholder sections

Still to do (later steps):
- Add real translations (currently all use English)
- Connect to Django backend API
- Add authentication
- Implement real pricing data
- Build out printing, POS, and AI sections
- Add forms and interactivity

## Important Reminders

- **This is frontend only** - No Python, no Django, no backend
- **Windows CMD only** - All commands work in Command Prompt
- **Stable config** - No Turbopack, no experimental features
- **Port preference** - 3000 (or 3001 if busy)
- **Always use absolute paths** - `cd /d C:\projects\justcodeworks\frontend`
