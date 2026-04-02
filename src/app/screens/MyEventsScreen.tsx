import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bookmark, BookmarkX, Calendar, MapPin, Users, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import type { Event } from '../data/mockData';
import { toast } from 'sonner';

function getEventStatus(event: Event): { label: string; color: string } {
  const now = new Date();
  const eventDate = new Date(event.date);
  if (eventDate < now) return { label: 'Completed', color: 'bg-gray-100 text-gray-600' };
  if (event.registered >= event.capacity) return { label: 'Full', color: 'bg-red-100 text-red-700' };
  return { label: 'Upcoming', color: 'bg-green-100 text-green-700' };
}

export default function MyEventsScreen() {
  const navigate = useNavigate();
  const { savedEvents, toggleSaveEvent, registeredEvents, unregisterFromEvent, addNotification, events } = useAppContext();
  const [activeTab, setActiveTab] = useState('registered');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const registeredEventsList = events.filter(event => registeredEvents.includes(event.id));
  const savedEventsList = events.filter(event => savedEvents.includes(event.id));

  const handleCancelRegistration = (event: Event) => {
    unregisterFromEvent(event.id);
    addNotification({
      title: 'Registration Canceled',
      message: `Your registration for ${event.title} has been canceled`,
      time: 'Just now',
      read: false,
      type: 'update',
    });
    setCancelingId(null);
    toast.success('Registration canceled');
  };

  const handleUnsave = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    toggleSaveEvent(eventId);
  };

  const RegisteredCard = ({ event }: { event: Event }) => {
    const status = getEventStatus(event);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div
          className="flex gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate(`/event/${event.id}`)}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-900 text-sm font-medium line-clamp-2 mb-1">{event.title}</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-indigo-50 text-indigo-700 text-xs">{event.category}</Badge>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-green-800 font-medium">Registered</span>
            <span className="text-xs text-gray-500 ml-auto">{event.capacity - event.registered} spots left</span>
          </div>
          <button
            onClick={() => setCancelingId(event.id)}
            className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      </motion.div>
    );
  };

  const SavedCard = ({ event }: { event: Event }) => {
    const status = getEventStatus(event);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div
          className="flex gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate(`/event/${event.id}`)}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h4 className="text-gray-900 text-sm font-medium line-clamp-2 mb-1 flex-1">{event.title}</h4>
              <button
                onClick={(e) => handleUnsave(e, event.id)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Remove from saved"
              >
                <BookmarkX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-indigo-50 text-indigo-700 text-xs">{event.category}</Badge>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Find event for cancel confirmation
  const cancelEvent = cancelingId ? events.find(e => e.id === cancelingId) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-gray-900 flex-1">My Events</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="registered" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Registered ({registeredEventsList.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Saved ({savedEventsList.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="registered" className="mt-0">
            {registeredEventsList.length > 0 ? (
              <AnimatePresence>
                <div className="space-y-3">
                  {registeredEventsList.map(event => (
                    <RegisteredCard key={event.id} event={event} />
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">No registered events yet</p>
                <p className="text-sm text-gray-600 mb-6">
                  Browse events and tap "Register" to secure your spot
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Browse Events
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {savedEventsList.length > 0 ? (
              <AnimatePresence>
                <div className="space-y-3">
                  {savedEventsList.map(event => (
                    <SavedCard key={event.id} event={event} />
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">No saved events</p>
                <p className="text-sm text-gray-600 mb-6">
                  Tap the bookmark icon on any event to save it for later
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Browse Events
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Registration Confirmation */}
      <AnimatePresence>
        {cancelEvent && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setCancelingId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-gray-900 text-center mb-2">Cancel Registration?</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                You will lose your spot at <strong>{cancelEvent.title}</strong>. You can re-register if spots are still available.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelingId(null)}
                  className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Keep Registration
                </button>
                <button
                  onClick={() => handleCancelRegistration(cancelEvent)}
                  className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
