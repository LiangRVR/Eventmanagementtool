import { createBrowserRouter } from "react-router";
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchFilterScreen from "./screens/SearchFilterScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import RSVPConfirmationScreen from "./screens/RSVPConfirmationScreen";
import MyEventsScreen from "./screens/MyEventsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import OrganizerDashboard from "./screens/OrganizerDashboard";
import CreateEventScreen from "./screens/CreateEventScreen";
import EditEventScreen from "./screens/EditEventScreen";
import AttendeeManagementScreen from "./screens/AttendeeManagementScreen";
import ProfileScreen from "./screens/ProfileScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/welcome",
    Component: WelcomeScreen,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/search",
    Component: SearchFilterScreen,
  },
  {
    path: "/event/:id",
    Component: EventDetailsScreen,
  },
  {
    path: "/rsvp-confirmation",
    Component: RSVPConfirmationScreen,
  },
  {
    path: "/my-events",
    Component: MyEventsScreen,
  },
  {
    path: "/notifications",
    Component: NotificationsScreen,
  },
  {
    path: "/organizer/dashboard",
    Component: OrganizerDashboard,
  },
  {
    path: "/organizer/create-event",
    Component: CreateEventScreen,
  },
  {
    path: "/organizer/edit-event/:id",
    Component: EditEventScreen,
  },
  {
    path: "/organizer/attendees/:id",
    Component: AttendeeManagementScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
]);
