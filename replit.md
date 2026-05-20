# GreenedIn

A comprehensive agricultural mobile app for African farmers — knowledge, tracking, marketplace, and AI assistant in one platform.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000/8080)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build composite libs (OpenAI integration, etc.)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-provisioned via Replit AI Integrations)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo ~54, Expo Router ~6, React Native 0.81
- API: Express 5 + Pino logging
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI via Replit AI Integrations proxy (`gpt-5.1`)
- Fonts: Geist Sans (UI) + Lora (headings/display)
- Animations: React Native Animated (Reanimated also available)
- Storage: AsyncStorage for user data, enterprises, language preference

## Where things live

```
artifacts/mobile/
  app/                  — Expo Router screens
    index.tsx           — Entry redirect (checks auth + onboarding state)
    splash.tsx          — Animated splash (logo drop)
    (onboarding)/       — 3-screen onboarding flow
    (auth)/             — Sign in + Sign up
    (tabs)/             — Main tab layout (Home, Track, Inwealth, Update, Profile)
    enterprise/[id].tsx — Enterprise worksheet detail
    chat.tsx            — Alabi AI chat screen
  components/           — Shared UI components
  constants/            — Colors, i18n (6 languages), market data, courses, tips
  context/              — AppContext (auth/language), EnterpriseContext (tracking)
  hooks/                — useColors (dark/light mode aware)

artifacts/api-server/
  src/routes/ai.ts      — POST /api/ai/chat SSE streaming endpoint (Alabi AI)

lib/
  integrations-openai-ai-server/  — OpenAI client + batch utilities
  integrations-openai-ai-react/   — Voice hooks (unused in mobile, available)
  db/                             — Drizzle ORM schema + migrations
  api-spec/                       — OpenAPI contract
```

## Architecture decisions

- **Frontend-first persistence**: All user data (profile, enterprises, language) stored in AsyncStorage — no backend database required for core features. Only AI chat requires the backend.
- **Context-based state**: Two React contexts — `AppContext` (global: user, language, offline) and `EnterpriseContext` (farming: enterprises + worksheet entries).
- **SSE streaming for AI**: The Alabi AI endpoint streams responses via Server-Sent Events so users see words appear as they're generated.
- **Offline detection**: Periodic ping to `dns.google` every 30 seconds; offline banner appears automatically.
- **No emojis anywhere**: All icons use `@expo/vector-icons` (Feather set). All text is plain.

## Product

GreenedIn serves African farmers across 6 languages (English, French, Hausa, Yoruba, Igbo, Arabic):

- **Home**: Weather widget, AI-powered farming tip card, Quick Tools grid, live commodity prices, learning courses
- **Track**: Enterprise management — create poultry/crop/livestock enterprises, track revenue/expenses, auto-calculates cost per unit
- **Inwealth**: Coming Soon — agricultural fintech (credit, insurance, investment)
- **Update**: 3 tabs — Knowledge Hub (courses), Ask Community (forum), Marketplace (commodity prices)
- **Profile**: Language selector, account settings, sign out
- **Alabi AI**: Streaming agricultural AI assistant with farm-specific system prompt

## User preferences

- No emojis anywhere in the UI — use Feather icons instead
- Typography: Geist Sans for all UI text, Lora for headings and display text
- Colors: dark forest green (#2A5129) primary, bright leaf green (#5CB840) accent, #F8FAF5 background
- Minimalist, clean — no gradients on buttons, no rainbow/multicolor AI patterns

## Gotchas

- `expo-network` version mismatch: installed v55 but Expo 54 expects ~8.0.8 — use the offline detection via fetch fallback (already implemented in AppContext, no expo-network import needed)
- `useNativeDriver: true` in splash animations — not supported on web, falls back to JS animations (harmless warning)
- The `(onboarding)` and `(auth)` groups use parentheses for grouping — Expo Router treats these as layout groups, not URL segments
- The AI chat uses `expo/fetch` for compatibility with SSE streaming in React Native

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `ai-integrations-openai` skill for OpenAI integration setup
