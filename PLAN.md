# Event Management Tool — Improvement Plan

This plan turns the prototype from a visually strong demo into a consistent, believable, end-to-end event management tool where attendee and organizer flows work together, key actions are real, and fake interactions are finished or removed.

---

## Phase 1 — Fix the Foundation

Everything else depends on this. The core problem is that event data lives in two disconnected places (`mockEvents` in `mockData.ts` and `organizerEvents` in context), and different screens read different sources.

### Task 1.1 — Unified event state in AppContext

**Problem:** 7 screens import `mockEvents` directly. The organizer dashboard merges only the first 3 mock events with `organizerEvents`. Edit/delete only affects `organizerEvents`, so edits to mock events silently fail.

**Changes:**

1. **`AppContext.tsx`** — Add a single `events` array to state, seeded from `mockData.ts` on first load (no prior localStorage). Expose:
   - `events` — the full event list (replaces all direct `mockEvents` imports)
   - `getEventById(id)` — single lookup
   - `getOrganizerEvents()` — filtered by `organizer === userName` or a flag
   - `addEvent(event)` — used by CreateEventScreen
   - `updateEvent(id, partial)` — used by EditEventScreen
   - `deleteEvent(id)` — used by EditEventScreen
   - `registerForEvent(id)` — increments `registered` count on the event AND adds to `registeredEvents`
   - `unregisterFromEvent(id)` — decrements count AND removes from `registeredEvents` *(new)*
2. **`mockData.ts`** — Keep as seed data only. Export `initialMockEvents` (rename for clarity). No screen should import from here anymore.
3. **localStorage** — Persist the full `events` array under the existing `eventAppData` key. On load, if `events` exists in storage use it; otherwise seed from `initialMockEvents`.

**Files touched:** `AppContext.tsx`, `mockData.ts`

### Task 1.2 — Migrate every screen to use context instead of mockData

Remove every `import { mockEvents } from "../data/mockData"` and replace with context reads.

| Screen | Current source | Change |
|---|---|---|
| `HomeScreen.tsx` | `mockEvents` | `useApp().events` |
| `SearchFilterScreen.tsx` | `mockEvents` | `useApp().events` |
| `EventDetailsScreen.tsx` | `mockEvents.find(...)` | `useApp().getEventById(id)` |
| `MyEventsScreen.tsx` | `mockEvents.filter(...)` | `useApp().events.filter(...)` |
| `OrganizerDashboard.tsx` | `mockEvents.slice(0,3)` + `organizerEvents` | `useApp().getOrganizerEvents()` |
| `EditEventScreen.tsx` | `mockEvents` + `organizerEvents` | `useApp().getEventById(id)` + `updateEvent` / `deleteEvent` |
| `AttendeeManagementScreen.tsx` | `mockEvents.find(...)` | `useApp().getEventById(id)` |

**Expected result:** Create → appears everywhere. Edit → reflected everywhere. Delete → gone everywhere.

**Files touched:** All 7 screens above.

### Task 1.3 — All seeded events are editable and deletable

**Decision:** Treat all events the same. No "sample" vs "user-created" distinction. Every event in the unified `events` list supports edit and delete.

**Changes:**
- Remove the `organizerEvents` concept as a separate array.
- `OrganizerDashboard` shows events where `event.organizer === userName` (or all events for demo).
- `EditEventScreen` uses `updateEvent(id, data)` which works on any event.
- `deleteEvent(id)` works on any event.

**Files touched:** `AppContext.tsx`, `OrganizerDashboard.tsx`, `EditEventScreen.tsx`

### Task 1.4 — Persist all important state

**Problem:** `userType` and `notifications` are not persisted. A refresh loses role and notifications.

**Changes in `AppContext.tsx`:**
1. Add `userType` to the persisted `eventAppData` object.
2. Add `notifications` to the persisted object.
3. Structure localStorage data with a `version` field for future migrations:
   ```ts
   {
     version: 1,
     userType: "attendee",
     userName: "...",
     savedEvents: [...],
     registeredEvents: [...],
     notifications: [...],
     events: [...]
   }
   ```
4. On load, check `version` and migrate if needed.

**Files touched:** `AppContext.tsx`

### Task 1.5 — Route protection for organizer screens

**Problem:** All 13 routes are public. An attendee can navigate to `/organizer/dashboard` via URL bar.

**Changes:**
1. Create a `<RequireOrganizer>` wrapper component (can live in `routes.tsx` or a small `components/RouteGuard.tsx`).
2. Wrap organizer routes (`/organizer/*`) with it.
3. If `userType !== 'organizer'`, redirect to `/home`.
4. Optionally: if no user is set (first visit), redirect non-splash routes to `/welcome`.

**Files touched:** `routes.tsx`, new `RouteGuard.tsx` (small)

---

## Phase 2 — Complete the Attendee Experience

### Task 2.1 — Save/unsave works everywhere consistently

**Problem:** HomeScreen bookmark button works but was flagged with a comment. Need to verify all locations.

**Changes:**
1. Verify `HomeScreen` bookmark calls `toggleSaveEvent` — already works per analysis. Remove any misleading comments.
2. `EventDetailsScreen` save/unsave — already works. Confirm it reflects immediately.
3. `MyEventsScreen` — add an "unsave" quick action (small X or bookmark-off icon on saved tab cards).
4. Ensure save state is reactive across all screens with no stale reads.

**Files touched:** `HomeScreen.tsx` (comment cleanup), `MyEventsScreen.tsx` (add unsave action)

### Task 2.2 — Cancel registration / unregister

**Problem:** Registration is one-directional. No way to cancel.

**Changes:**
1. **`AppContext.tsx`** — `unregisterFromEvent(id)`: remove from `registeredEvents`, decrement `event.registered`.
2. **`EventDetailsScreen.tsx`** — If already registered, show "Cancel Registration" button instead of "Register". Add confirmation dialog (`AlertDialog` component already available).
3. **`MyEventsScreen.tsx`** — Add "Cancel Registration" quick action on registered tab cards with confirmation.
4. Create a "Registration canceled" notification on unregister.

**Files touched:** `AppContext.tsx`, `EventDetailsScreen.tsx`, `MyEventsScreen.tsx`

### Task 2.3 — Improve search and filter usefulness

**Problem:** Home "See all" button behavior unclear. Filters are basic.

**Changes:**
1. Home "See all" navigates to `/search` with the current category pre-applied as a query param.
2. Add filter options to `SearchFilterScreen`:
   - "Has available spots" toggle (filters `registered < capacity`)
   - Sort dropdown: "Soonest first" (default), "Most popular", "Most spots available"
3. Show "No results" empty state with suggestion to clear filters.

**Files touched:** `HomeScreen.tsx`, `SearchFilterScreen.tsx`

### Task 2.4 — Strengthen My Events screen

**Changes:**
1. Add status labels to event cards:
   - "Upcoming" (date > today)
   - "Completed" (date < today)
   - "Full" (registered >= capacity)
2. Add quick actions: "Cancel Registration" button on registered cards, "Unsave" on saved cards.
3. Improve empty states: more descriptive text + CTA button ("Browse Events").

**Files touched:** `MyEventsScreen.tsx`

---

## Phase 3 — Complete the Organizer Experience

### Task 3.1 — Strengthen event creation form

**Problem:** Time is free text, validation is minimal, no start/end time separation.

**Changes:**
1. Replace single `time` field with `startTime` and `endTime` (use `<input type="time">`).
2. Update the `Event` interface: replace `time: string` with `startTime: string` and `endTime: string`. Add a display helper `formatTimeRange(start, end)`.
3. Add validation rules:
   - Title required (already done), min 3 chars
   - Capacity must be positive integer
   - End time must be after start time
   - Description min 20 chars
   - Date cannot be in the past
4. Add optional fields:
   - Organizer contact (email/phone)
   - Event notes / "What to bring"
5. Add image selection: a grid of 5-6 predefined image thumbnails the user can pick from instead of typing a URL.
6. Show inline validation errors below each field (not just toasts).

**Files touched:** `mockData.ts` (Event type update + seed data update), `AppContext.tsx` (type update), `CreateEventScreen.tsx`, `EditEventScreen.tsx`, all screens that display event time

### Task 3.2 — Strengthen edit form

**Changes (after Task 3.1):**
1. Reuse same validation as create.
2. Prevent reducing capacity below `event.registered` (inline error: "X attendees already registered").
3. Delete confirmation dialog: improve wording ("This will permanently delete the event and notify X registered attendees").

**Files touched:** `EditEventScreen.tsx`

### Task 3.3 — Fix organizer dashboard

**Changes:**
1. Base stats on `getOrganizerEvents()` from context (unified source).
2. Remove the MoreVertical button or implement a dropdown with: Edit, View Attendees, Delete.
3. Add status chips on event cards: "Upcoming", "Completed", "Full".

**Files touched:** `OrganizerDashboard.tsx`

### Task 3.4 — Make attendee management believable

**Problem:** Generates fake attendees dynamically. "Email All" and "Export List" do nothing.

**Changes:**
1. Keep simulated attendees but back them with deterministic data tied to `event.registered` count.
2. Add a banner: "Showing simulated attendee data for demo purposes."
3. "Export List" — generate a CSV download of the displayed attendee list (simple Blob + download link). This is low effort and impressive in a demo.
4. "Email All" — open a mailto: link with all attendee emails, or show a toast "Email client would open with X recipients" if we want to keep it simple.
5. Add "Check-in" toggle per attendee (local state, resets on leave — acceptable for prototype).
6. Add registered date display (generated deterministically from event date).

**Files touched:** `AttendeeManagementScreen.tsx`

---

## Phase 4 — Remove or Finish Fake Interactions

### Task 4.1 — Audit and fix every fake button/link

**Full audit results and actions:**

| Screen | Element | Status | Action |
|---|---|---|---|
| **HomeScreen** | "See all" link | Partial | Wire to `/search?category=X` (Task 2.3) |
| **HomeScreen** | Bottom nav (Discover) | Works | — |
| **HomeScreen** | Bottom nav (My Events) | Works | — |
| **HomeScreen** | Bottom nav (Create) | Works | — |
| **HomeScreen** | Bottom nav (Profile) | Works | — |
| **EventDetails** | Share → Message | Fake | Use `navigator.share()` if available, else copy-to-clipboard + toast |
| **EventDetails** | Share → Email | Fake | `mailto:?subject=...&body=...` link |
| **EventDetails** | Share → Copy Link | Fake | Copy current URL to clipboard + toast |
| **EventDetails** | Share → More | Fake | Remove (redundant with above) |
| **OrganizerDashboard** | MoreVertical button | Fake | Implement dropdown (Edit / Attendees / Delete) or remove (Task 3.3) |
| **AttendeeManagement** | Email All | Fake | Implement or label (Task 3.4) |
| **AttendeeManagement** | Export List | Fake | Implement CSV export (Task 3.4) |
| **AttendeeManagement** | Individual email icon | Fake | `mailto:attendee@email` |
| **Profile** | Edit Profile | Fake | Navigate to an inline edit mode or show toast "Coming soon" |
| **Profile** | Privacy & Security | Fake | Show toast "Coming soon" or remove |
| **Profile** | Help Center | Fake | Show toast "Coming soon" or remove |
| **Profile** | Notification toggles | Fake | Wire to context or label as demo |

**Files touched:** `EventDetailsScreen.tsx`, `OrganizerDashboard.tsx`, `AttendeeManagementScreen.tsx`, `ProfileScreen.tsx`

---

## Phase 5 — HCI / Usability Improvements

### Task 5.1 — Inline validation on forms

Replace toast-only validation with inline error messages below each form field on Create and Edit screens. Use `react-hook-form` error display (already a dependency).

**Files touched:** `CreateEventScreen.tsx`, `EditEventScreen.tsx`

### Task 5.2 — Empty states and guidance

1. **My Events** — registered tab empty: "You haven't registered for any events yet. [Browse Events]"
2. **My Events** — saved tab empty: "Save events you're interested in by tapping the bookmark icon. [Browse Events]"
3. **Notifications** — empty: "No notifications yet. We'll let you know about event updates."
4. **Organizer Dashboard** — no events: "Create your first event to get started. [Create Event]"

**Files touched:** `MyEventsScreen.tsx`, `NotificationsScreen.tsx`, `OrganizerDashboard.tsx`

### Task 5.3 — Splash screen timing

Reduce from 2500 ms to 1500 ms. The current delay feels slow during live demo.

**Files touched:** `SplashScreen.tsx`

### Task 5.4 — Organizer mode explanation

On ProfileScreen, add a subtitle under the Organizer Mode toggle: "Enable to create and manage events" so the purpose is immediately clear.

**Files touched:** `ProfileScreen.tsx`

### Task 5.5 — Visual hierarchy and consistency review

1. Check all button labels for clarity and action-oriented wording.
2. Ensure consistent spacing between sections (use Tailwind spacing scale).
3. Verify touch targets are at least 44×44px on all interactive elements.
4. Review typography hierarchy across all screens.

**Files touched:** Multiple (minor adjustments)

---

## Phase 6 — Technical & Repo Cleanup

### Task 6.1 — Refactor repeated event patterns

1. Move event status calculation into a helper: `getEventStatus(event)` → "upcoming" | "completed" | "full" | "canceled".
2. Move date formatting into a helper: `formatEventDate(date)` → "Sat, April 15".
3. Move spots-left calculation: `getSpotsLeft(event)` → number.
4. Standardize time display: `formatTimeRange(start, end)`.

**Files touched:** New `src/app/utils/eventHelpers.ts`, then update screens to use it.

### Task 6.2 — Remove unused dependencies

**Audit plan:** Run `npx depcheck` or manually check imports for these likely-unused packages:
- `react-dnd`, `react-dnd-html5-backend` (no drag-and-drop in any screen)
- `@mui/material`, `@mui/icons-material` (all UI uses Radix + Tailwind + Lucide)
- Several Radix components that aren't imported by any screen
- Check if all 30+ Radix packages are actually used

**Action:** Remove confirmed unused packages from `package.json` and run `pnpm install`.

**Files touched:** `package.json`, `pnpm-lock.yaml`

### Task 6.3 — Remove dead code and placeholder comments

1. Search for `// TODO`, `// FIXME`, `// placeholder`, `// coming soon` comments.
2. Remove unreachable code paths.
3. Remove commented-out code blocks.

**Files touched:** Various

### Task 6.4 — Improve README

Replace the current bare README with a proper project document:

- **Project overview** — What this is and why it exists
- **Problem statement** — Event management for campus communities
- **Target users** — Attendees and Organizers
- **Key features** — Attendee flow (discover, filter, register, save, manage) + Organizer flow (create, edit, dashboard, attendee management)
- **Tech stack** — React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Router, React Hook Form, Recharts, Framer Motion
- **Getting started** — `pnpm install && pnpm dev`
- **Project structure** — Brief folder guide
- **Known limitations** — Local state only, no backend, simulated attendees
- **Screenshots** — Add 4-6 key screen captures
- **Future improvements** — Backend integration, real auth, push notifications

**Files touched:** `README.md`

---

## Implementation Order (Recommended)

The tasks have dependencies. Here is the recommended sequence:

```
Phase 1 (Foundation) — Do first, in order:
  1.1 → 1.2 → 1.3 → 1.4 → 1.5

Phase 2 (Attendee) — After Phase 1:
  2.1, 2.2 can be parallel
  2.3, 2.4 can be parallel after 2.1–2.2

Phase 3 (Organizer) — After Phase 1, parallel with Phase 2:
  3.1 first (changes Event type)
  3.2, 3.3, 3.4 after 3.1

Phase 4 (Fake interactions) — After Phases 2+3:
  4.1 is a single sweep

Phase 5 (HCI) — After Phase 4:
  5.1–5.5 can be done in any order

Phase 6 (Cleanup) — Last:
  6.1 after all feature work
  6.2, 6.3, 6.4 independent
```

## Estimated Scope

- **~15 files modified**, **~2 new files** created
- Phase 1 is the largest and most impactful change
- Phase 3.1 (Event type change) has wide ripple effects — plan carefully
- Phases 5 and 6 are lower risk and can be done incrementally
