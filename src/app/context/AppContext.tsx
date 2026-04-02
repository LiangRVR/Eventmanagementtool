import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../data/mockData';

interface AppContextType {
  userType: 'attendee' | 'organizer';
  setUserType: (type: 'attendee' | 'organizer') => void;
  userName: string;
  setUserName: (name: string) => void;
  savedEvents: string[];
  toggleSaveEvent: (eventId: string) => void;
  registeredEvents: string[];
  registerForEvent: (eventId: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (notificationId: string) => void;
  organizerEvents: Event[];
  addOrganizerEvent: (event: Event) => void;
  updateOrganizerEvent: (eventId: string, updatedEvent: Event) => void;
  deleteOrganizerEvent: (eventId: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'update' | 'registration';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<'attendee' | 'organizer'>('attendee');
  const [userName, setUserName] = useState('');
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Event Reminder',
      message: 'Design Thinking Workshop starts tomorrow at 2:00 PM',
      time: '2 hours ago',
      read: false,
      type: 'reminder'
    },
    {
      id: '2',
      title: 'Registration Confirmed',
      message: 'You\'re registered for Campus Career Fair 2026',
      time: '1 day ago',
      read: false,
      type: 'registration'
    },
    {
      id: '3',
      title: 'Event Update',
      message: 'Open Mic Night venue changed to Campus Cafe Stage',
      time: '2 days ago',
      read: true,
      type: 'update'
    }
  ]);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('eventAppData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSavedEvents(data.savedEvents || []);
      setRegisteredEvents(data.registeredEvents || []);
      setUserName(data.userName || '');
      setOrganizerEvents(data.organizerEvents || []);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('eventAppData', JSON.stringify({
      savedEvents,
      registeredEvents,
      userName,
      organizerEvents
    }));
  }, [savedEvents, registeredEvents, userName, organizerEvents]);

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const registerForEvent = (eventId: string) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => [...prev, eventId]);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    setNotifications(prev => [
      {
        ...notification,
        id: Date.now().toString(),
      },
      ...prev
    ]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const addOrganizerEvent = (event: Event) => {
    setOrganizerEvents(prev => [...prev, event]);
  };

  const updateOrganizerEvent = (eventId: string, updatedEvent: Event) => {
    setOrganizerEvents(prev =>
      prev.map(event => event.id === eventId ? updatedEvent : event)
    );
  };

  const deleteOrganizerEvent = (eventId: string) => {
    setOrganizerEvents(prev => prev.filter(event => event.id !== eventId));
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
        notifications,
        addNotification,
        markNotificationRead,
        organizerEvents,
        addOrganizerEvent,
        updateOrganizerEvent,
        deleteOrganizerEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
