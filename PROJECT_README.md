# EventHub - Event Management Mobile App Prototype

A comprehensive, high-fidelity mobile app prototype designed for an HCI class project. EventHub helps users discover, register for, and manage events while providing organizers with powerful event management tools.

## 🎯 Project Overview

**Purpose**: Create a user-friendly mobile app that centralizes event discovery, registration, and management.

**Target Users**:
1. **Attendees** - Discover, save, and register for events
2. **Organizers** - Create, edit, manage, and monitor events

## ✨ Key Features

### For Attendees
- Browse and discover upcoming events
- Search events by keyword with advanced filtering
- Filter by category, date, and location
- View detailed event information
- RSVP/register for events with confirmation
- Save/bookmark events for later
- View personal event schedule ("My Events")
- Receive notifications and reminders
- Toggle between attendee and organizer modes

### For Organizers
- Comprehensive organizer dashboard with stats
- Create new events with detailed forms
- Edit and update existing events
- Delete events with confirmation
- View attendee lists and manage registrations
- Monitor event capacity and registration metrics
- Send updates to attendees

## 📱 Screen Flow

### Main Screens (13+)
1. **Splash Screen** - Animated app introduction
2. **Welcome/Sign In** - User type selection and onboarding
3. **Home/Discover** - Browse events with search and categories
4. **Search & Filter** - Advanced filtering options
5. **Event Details** - Complete event information
6. **RSVP Confirmation** - Success feedback with event summary
7. **My Events** - Registered and saved events
8. **Notifications** - Event reminders and updates
9. **Organizer Dashboard** - Event management overview
10. **Create Event** - New event form
11. **Edit Event** - Modify existing events
12. **Attendee Management** - View and manage registrations
13. **Profile/Settings** - Account management and preferences

## 🎨 Design Principles (HCI-Focused)

### Usability
- Intuitive navigation with clear labels and icons
- Minimal steps to complete key actions
- Touch-friendly components (min 44px tap targets)
- Bottom navigation for easy thumb access

### Clarity
- Clean visual hierarchy with consistent spacing
- Rounded cards for content organization
- Clear call-to-action buttons
- Readable typography with proper contrast

### Consistency
- Unified color scheme (indigo/purple gradient)
- Consistent component patterns across screens
- Predictable interaction patterns
- Coherent design system

### Accessibility
- High contrast text (WCAG AA compliant)
- Clear, descriptive labels
- Touch-friendly button sizes
- Readable font sizes (16px base)

### Feedback
- Success confirmations for all actions
- Loading states and animations
- Toast notifications for updates
- Visual indicators for saved/registered states

### Efficiency
- Quick access to frequent actions
- Smart defaults and auto-complete
- Category filters for fast browsing
- Persistent bottom navigation

## 🚀 User Journeys

### Journey 1: Attendee Discovering & Registering
1. Start at Home screen
2. Browse or search for events
3. Use filters to narrow results
4. Click event card to view details
5. Tap "Register for Event"
6. See confirmation screen
7. Access event in "My Events"

### Journey 2: Saving Events for Later
1. Browse events on Home screen
2. Tap bookmark icon to save
3. Navigate to "My Events"
4. Switch to "Saved" tab
5. View all saved events

### Journey 3: Organizer Creating Event
1. Switch to organizer mode in Profile
2. Tap "Organize" in bottom nav
3. View organizer dashboard
4. Tap "Create New Event"
5. Fill out event form
6. Submit and see confirmation
7. Event appears in dashboard

### Journey 4: Managing Attendees
1. Go to Organizer Dashboard
2. Select an event
3. Tap "Attendees" button
4. View registration list
5. Search or export attendees
6. Send updates via email

## 💡 Technical Implementation

### Technology Stack
- **Framework**: React with TypeScript
- **Routing**: React Router (Data mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **State Management**: React Context API
- **Persistence**: LocalStorage

### State Management
- User preferences (attendee/organizer mode)
- Saved events (bookmarks)
- Registered events
- Notifications
- Organizer's created events
- All persisted via localStorage

### Responsive Design
- Mobile-first approach (320px - 480px)
- Max-width container (md breakpoint)
- Flexible layouts with Flexbox/Grid
- Touch-optimized interactions

## 🎓 HCI Principles Demonstrated

1. **Learnability** - Clear onboarding, intuitive interface
2. **Efficiency** - Quick access to common tasks
3. **Memorability** - Consistent patterns, familiar UI elements
4. **Errors** - Validation, confirmations for destructive actions
5. **Satisfaction** - Smooth animations, positive feedback

## 📝 Sample Content

Events include realistic scenarios:
- Campus workshops (Design Thinking, Machine Learning)
- Career networking events
- Social activities (Open Mic, Food Festival)
- Volunteer opportunities
- Academic panels and competitions

## 🔄 Interactive Features

- Real-time search filtering
- Dynamic category selection
- Animated screen transitions
- Interactive forms with validation
- Modal dialogs for confirmations
- Toast notifications
- State persistence across sessions

## 🎯 Project Goals Achieved

✅ Mobile-first design
✅ Clean, modern, polished interface
✅ Two distinct user flows (attendee & organizer)
✅ Complete CRUD operations for events
✅ Comprehensive event discovery features
✅ Registration and notification system
✅ HCI principles throughout
✅ Presentation-ready prototype
✅ Connected screen flow
✅ Realistic content and interactions

## 📱 Usage Instructions

1. **First Launch**: App shows splash screen, then welcome
2. **Setup**: Enter your name and choose user type
3. **Explore**: Browse events, search, and filter
4. **Register**: Click any event to view details and register
5. **Switch Modes**: Use Profile to toggle organizer mode
6. **Create Events**: Use organizer dashboard to add events
7. **Manage**: Edit events and view attendee lists

## 🎨 Design System

**Colors**:
- Primary: Indigo (#4F46E5)
- Secondary: Purple (#7C3AED)
- Accent: Pink (#EC4899)
- Success: Green
- Error: Red
- Neutral: Gray scale

**Typography**:
- Base size: 16px
- Headings: Medium weight (500)
- Body: Normal weight (400)

**Spacing**:
- Consistent 4px grid system
- Generous padding for touch targets
- Balanced white space

**Components**:
- Rounded corners (8-24px)
- Subtle shadows for elevation
- Gradient backgrounds for emphasis
- Cards for content grouping

---

**Built for**: HCI Class Project 2026
**Platform**: Mobile Web Application (Responsive)
**Status**: High-Fidelity Interactive Prototype
