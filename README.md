
# EventHub — Event Management Tool Prototype

A high-fidelity mobile-first prototype for an HCI class project. EventHub lets attendees discover, save, and register for events while giving organizers tools to create, edit, and manage events end-to-end.

## Setup

```bash
pnpm install
pnpm dev
```

Or with npm:

```bash
npm install
npm run dev
```

## Features

### Attendee experience
- Browse events with animated home feed
- Search and filter by keyword, category, date, location, availability, and sort order
- Register and cancel registration with confirmation dialogs
- Save / bookmark events; unsave from My Events
- Status chips on event cards (Upcoming / Completed / Full)
- Working share sheet: copy link, email, or native share
- Notifications persisted across sessions

### Organizer experience
- Dashboard with live stats (total events, attendees, upcoming)
- Create events: dual time picker (start/end), image picker, full inline validation
- Edit events: same improvements + capacity floor check (can't lower below registered count)
- Delete events with confirmation; registered/saved refs cleaned up automatically
- Attendee management: CSV export download, Email All (mailto BCC), per-row email links, check-in toggle, demo data banner
- Route guard: organizer screens require organizer mode

### General
- All state persisted to localStorage (versioned schema)
- Unified event store — no split between mock and organizer events
- Profile "Coming soon" buttons show toast; notification toggles labelled as demo
- Splash auto-advances in 1.5 s

## Tech stack

- React 18 + TypeScript, Vite 6, React Router 7
- Tailwind CSS 4, Radix UI, Lucide React
- Framer Motion (motion/react), Sonner toasts

## Known limitations (prototype scope)

- Attendee list in Attendee Management screen uses simulated data (no backend)
- Email/notification features open system defaults (mailto:, Web Share API)
- No real authentication — user name is entered on the welcome screen
- Image picker uses a fixed set of Unsplash images
