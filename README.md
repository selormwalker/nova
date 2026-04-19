# ✦ NOVA IDE

> **The world's most powerful browser-based IDE** — AI-powered, cross-platform, zero-install.

[![CI](https://github.com/your-org/nova-ide/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/nova-ide/actions)
[![Docker](https://ghcr.io/your-org/nova-ide)](https://ghcr.io/your-org/nova-ide)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## Features

| Category | Feature |
|---|---|
| **Editor** | Monaco Editor (same engine as VS Code), syntax highlighting for 50+ languages, IntelliSense, multi-cursor |
| **AI Copilot** | Inline completions, explain/refactor/test/document with one click, bug finder, optimizer |
| **File System** | Virtual FS in-browser, File System Access API for local folders, IndexedDB persistence |
| **Terminal** | Full xterm.js terminal, multiple tabs, resize, WebSocket backend support |
| **Git** | Branch indicator, stage/unstage/commit UI, diff viewer |
| **Themes** | 4 built-in themes (Nova Dark, Light, Midnight, Ocean), live switching |
| **PWA** | Install on any device, offline support via Service Worker, push notifications |
| **Debugging** | Breakpoints UI, watch expressions, debug console |
| **Extensions** | Extension marketplace panel |
| **Docker** | Container status + management panel |
| **Database** | Database schema explorer |
| **Search** | Project-wide search with find & replace |
| **Shortcuts** | Full keyboard shortcut support, command palette |

## Quick Start

### Option 1 — Docker (recommended)

```bash
docker run -p 80:80 ghcr.io/your-org/nova-ide:latest
```

Open http://localhost

### Option 2 — Docker Compose

```bash
git clone https://github.com/your-org/nova-ide
cd nova-ide
cp .env.example .env.local
docker compose up -d
```

### Option 3 — Dev server

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Option 4 — Build & serve

```bash
npm run build
npx serve dist
```

## Deploy in 5 minutes

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Fly.io

```bash
fly launch --dockerfile Dockerfile
fly deploy
```

### DigitalOcean / AWS / GCP

Use the provided `Dockerfile` and `docker-compose.yml`. The CI/CD pipeline in `.github/workflows/ci.yml` auto-deploys on push to `main`.

## Architecture

```
nova-ide/
├── src/
│   ├── components/       # React UI components (CSS Modules)
│   │   ├── TitleBar      # Top menu bar
│   │   ├── ActivityBar   # Left icon strip
│   │   ├── SidebarPanel  # Explorer, Search, Git, Docker, DB...
│   │   ├── EditorGroup   # Monaco Editor + tabs + breadcrumb
│   │   ├── RightPanel    # AI Copilot, Outline, Problems
│   │   ├── TerminalPanel # Interactive terminal (resizable)
│   │   ├── StatusBar     # Bottom status bar + theme switcher
│   │   ├── CommandPalette # Fuzzy command search (Ctrl+K)
│   │   └── Notifications # Toast notification system
│   ├── store/            # Zustand global state
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utilities
│   └── themes/           # Theme definitions
├── public/
│   ├── sw.js             # Service Worker (offline / PWA)
│   └── manifest.json     # PWA manifest (installable on all devices)
├── docker/
│   └── nginx.conf        # Production nginx config
├── Dockerfile            # Multi-stage production build
├── docker-compose.yml    # Full stack deployment
└── .github/workflows/
    └── ci.yml            # GitHub Actions CI/CD
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Command Palette |
| `Ctrl+B` | Toggle Sidebar |
| `Ctrl+`` ` | Toggle Terminal |
| `Ctrl+Shift+A` | Toggle AI Copilot |
| `Ctrl+S` | Save & Format |
| `Ctrl+Shift+F` | Find in Files |
| `F5` | Run / Debug |
| `Ctrl+,` | Settings |
| `Alt+Z` | Word Wrap |

## Platform Support

NOVA IDE runs on every device with a modern browser:

- **Desktop**: Windows, macOS, Linux
- **Mobile**: iOS Safari, Android Chrome (touch-optimized)
- **Tablet**: iPadOS, Android tablets
- **Chromebook**: Chrome OS
- **TV/Embedded**: Any Chromium-based browser

Install as PWA for a native-like experience on any platform.

## License

MIT © NOVA IDE Contributors
