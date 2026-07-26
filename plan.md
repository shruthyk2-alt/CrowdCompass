## CrowdCompass — Phase 1 Build Plan

Build the foundation of CrowdCompass from scratch with the premium dark navy + orange/yellow gradient glassmorphism aesthetic. This phase covers **Auth, Venue Selection, Smart Dashboard, floating SOS, and floating AI Assistant**. Phases 2–3 (Map, Tickets, Events, Missing Person, Notifications, Analytics, Profile) come next.

### Design system (locked for the whole app)
- Background: near-black navy (`oklch(0.15 0.03 260)`), layered glass surfaces with 8–16px blur and subtle white borders.
- Brand gradient: orange → yellow (`#FF6B1A → #FFB800`) used on primary CTAs, active nav, logo, and the floating AI/SOS buttons.
- Rounded-2xl cards, soft shadows, smooth 200–300ms transitions, mobile-first responsive.
- Fonts: Space Grotesk (display) + Inter (body).
- All colors as semantic tokens in `src/styles.css` — no hardcoded hex in components.

### 1. Auth (localStorage)
- `src/lib/auth.ts` — user store in `localStorage` (`cc_users`, `cc_session`), password hashed with `crypto.subtle` SHA-256 (not plaintext).
- `useAuth()` hook + `AuthProvider` context; router auth context via `createRootRouteWithContext`.
- Routes: `/auth` (tabbed Login / Signup), pathless `_authenticated` layout gates the app.
- Signup fields: Full Name, Email, Phone, Password (+ confirm).
- Password field with a **working** eye toggle (`useState<boolean>` + `type={show ? "text" : "password"}`, aria-labeled button).
- "Remember me" persists session; logout clears session and redirects to `/auth`.
- Header shows real logged-in user's name + avatar initials + logout.

### 2. Venue Selection
- Route `/_authenticated/venues` — post-login landing when no venue selected.
- 3 seeded venues (Chinnaswamy, Sunburn, IISc) in `src/lib/venues.ts` with image, capacity, event, simulated occupancy + weather.
- Selecting a venue stores `cc_active_venue` in localStorage and navigates to `/dashboard`.
- A "Change venue" chip in the header returns here.

### 3. Smart Venue Dashboard (`/_authenticated/dashboard`)
- Header row: Venue name, current event, live clock, weather chip, capacity badge, occupancy % ring, status pill (Safe/Moderate/Crowded/Critical driven by %).
- **Crowd Density by Zone** grid — 8 glass cards (North/South/East/West Gate, Main Stage, Food Court, Parking, VIP): current crowd, max, occupancy %, queue length, trend arrow, AI risk chip (green/yellow/orange/red).
- **Gate Analytics** table — 4 gates with open/closed, queue length, wait time, entry speed, exit speed.
- **Venue-specific panel** switches on active venue:
  - Chinnaswamy → live match card (score/overs/wickets/status), parking, food court, weather.
  - Sunburn → current artist, next performance, stage crowd, VIP crowd, schedule, food court, parking.
  - IISc → today's events, workshop schedule, seminar hall %, hackathon crowd, registration queue, cafeteria.
- All numbers simulated by `useSimulatedVenueData()` — random-walk updates every 5s via `setInterval` for the "live" feel.
- Weather simulated (temp, feels like, humidity, wind, rain %, UV, AQI) — no external API this phase.

### 4. Floating SOS button
- Fixed bottom-right on every authenticated route, red gradient, pulse animation.
- Opens a glass dialog with: Medical, Police, Fire & Rescue, Venue Security, Share Location.
- Shows nearest medical booth + nearest emergency exit (from venue mock data) + emergency contact numbers.
- "Send alert" simulates dispatch with toast + brief loading state.

### 5. Floating AI Assistant button
- Fixed bottom-right (offset above SOS), orange→yellow gradient with sparkle icon.
- Opens a glass chat sheet (not a separate page).
- Rule-based intent matcher answers the 8 example prompts from spec (nearest washroom, least crowded gate, parking, route to Gate 3, emergency exits, medical booth, weather, shortest food-court queue) by reading the active venue's simulated data. Free-text falls back to a helpful default.
- Suggested-question chips for one-tap queries.

### Navigation shell
- Persistent `AppSidebar` (shadcn) with items: Dashboard, Venues, Events, Tickets, Missing Person, Notifications, Analytics, Profile. Phase-1 non-implemented items link to a `/coming-soon` route with a clean "Coming in the next update" panel — no dead links, no console errors.
- Sidebar collapses to icon rail on mobile; header has a trigger + venue chip + user menu.

### File additions
```text
src/lib/auth.ts, src/lib/venues.ts, src/lib/simulate.ts, src/lib/format.ts
src/hooks/use-auth.tsx, src/hooks/use-active-venue.tsx, src/hooks/use-simulated-venue-data.ts
src/components/app-sidebar.tsx, src/components/app-header.tsx
src/components/floating-sos.tsx, src/components/floating-ai.tsx
src/components/dashboard/{StatusRing,ZoneCard,GateAnalytics,WeatherCard,VenueSpecificPanel}.tsx
src/routes/index.tsx (public landing → CTA to /auth)
src/routes/auth.tsx
src/routes/_authenticated.tsx (route guard + shell + floating buttons)
src/routes/_authenticated/venues.tsx
src/routes/_authenticated/dashboard.tsx
src/routes/_authenticated/coming-soon.tsx
```
Update `src/styles.css` with the CrowdCompass token palette; update `__root.tsx` head metadata (title "CrowdCompass — Navigate Smarter", real description, og tags).

### Technical notes
- TanStack Start file-based routing; auth context on the root route; `_authenticated/route.tsx` redirects to `/auth` when no session.
- All simulation is client-side; no backend, no Supabase this phase.
- Zod validation on signup + login forms; toasts via existing sonner setup.
- Accessible: keyboard-navigable password toggle, dialogs, sheet.

### Out of scope for Phase 1 (Phase 2 will cover)
Google Maps venue map, Events CRUD, My Tickets + QR, Profile edit, Missing Person module, Notifications feed, Analytics charts, real weather API. Sidebar links land on `/coming-soon` until then.

### Deliverable
A working sign-up → login → venue picker → live-updating dashboard with SOS and AI floating actions, all wrapped in the locked visual system, ready for you to click through end-to-end.