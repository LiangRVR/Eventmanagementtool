import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, mockEvents } from '../data/mockData';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'update' | 'registration';
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Event Reminder',
    message: 'Design Thinking Workshop starts tomorrow at 2:00 PM',
    time: '2 hours ago',
    read: false,
    type: 'reminder',
  },
  {
    id: '2',
    title: 'Registration Confirmed',
    message: "You're registered for Campus Career Fair 2026",
    time: '1 day ago',
    read: false,
    type: 'registration',
  },
  {
    id: '3',
    title: 'Event Update',
    message: 'Open Mic Night venue changed to Campus Cafe Stage',
    time: '2 days ago',
    read: true,
    type: 'update',
  },
];

interface AppContextType {
  userType: 'attendee' | 'organizer';
  setUserType: (type: 'attendee' | 'organizer') => void;
  userName: string;
  setUserName: (name: string) => void;
  savedEvents: string[];
  toggleSaveEvent: (eventId: string) => void;
  registeredEvents: string[];
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  events: Event[];
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updatedEvent: Event) => void;
  deleteEvent: (eventId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const STORAGE_KEY = 'eventAppData';
const STORAGE_VERSION = 1;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<'attendee' | 'organizer'>('attendee');
  const [userName, setUserName] = useState('');
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [events, setEvents] = useState<Event[]>(mockEvents);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setSavedEvents(data.savedEvents || []);
        setRegisteredEvents(data.registeredEvents || []);
        setUserName(data.userName || '');
        if (data.userType) setUserType(data.userType);
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
        // Use persisted events if available; otherwise seed from mockEvents
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch {
        // Corrupted data — start fresh with defaults
      }
    }
  }, []);

  // Persist all important state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        userType,
        userName,
        savedEvents,
        registeredEvents,
        notifications,
        events,
      })
    );
  }, [userType, userName, savedEvents, registeredEvents, notifications, events]);

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const registerForEvent = (eventId: string) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => [...prev, eventId]);
      setEvents(prev =>
        prev.map(e => (e.id === eventId ? { ...e, registered: e.registered + 1 } : e))
      );
    }
  };

  const unregisterFromEvent = (eventId: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e
        )
      );
    }
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    setNotifications(prev => [{ ...notification, id: Date.now().toString() }, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getEventById = (id: string) => events.find(e => e.id === id);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (eventId: string, updatedEvent: Event) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? updatedEvent : e)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setSavedEvents(prev => prev.filter(id => id !== eventId));
    setRegisteredEvents(prev => prev.filter(id => id !== eventId));
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        userName,
        setUserName,
        savedEvents,
        toggleSaveEvent,
        registeredEvents,
        registerForEvent,
        unregisterFromEvent,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        events,
        getEventById,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
