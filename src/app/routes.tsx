import { createBrowserRouter, Navigate } from "react-router";
import { useAppContext } from "./context/AppContext";
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

function RequireOrganizer({ children }: { children: React.ReactNode }) {
  const { userType, userName } = useAppContext();
  if (!userName) return <Navigate to="/welcome" replace />;
  if (userType !== 'organizer') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

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
    element: <RequireOrganizer><OrganizerDashboard /></RequireOrganizer>,
  },
  {
    path: "/organizer/create-event",
    element: <RequireOrganizer><CreateEventScreen /></RequireOrganizer>,
  },
  {
    path: "/organizer/edit-event/:id",
    element: <RequireOrganizer><EditEventScreen /></RequireOrganizer>,
  },
  {
    path: "/organizer/attendees/:id",
    element: <RequireOrganizer><AttendeeManagementScreen /></RequireOrganizer>,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
]);
