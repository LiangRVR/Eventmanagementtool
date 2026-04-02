import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bookmark, Calendar, MapPin, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { mockEvents } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function MyEventsScreen() {
  const navigate = useNavigate();
  const { savedEvents, registeredEvents } = useAppContext();
  const [activeTab, setActiveTab] = useState('registered');

  const registeredEventsList = mockEvents.filter(event =>
    registeredEvents.includes(event.id)
  );

  const savedEventsList = mockEvents.filter(event =>
    savedEvents.includes(event.id)
  );

  const EventCard = ({ event, type }: { event: typeof mockEvents[0]; type: 'registered' | 'saved' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/event/${event.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h4 className="text-gray-900 text-sm line-clamp-2 flex-1">{event.title}</h4>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 text-xs mb-2">
            {event.category}
          </Badge>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
      {type === 'registered' && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-green-800 font-medium">Registered</span>
          </div>
        </div>
      )}
    </motion.div>
  );

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
              <div className="space-y-3">
                {registeredEventsList.map(event => (
                  <EventCard key={event.id} event={event} type="registered" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">No registered events</p>
                <p className="text-sm text-gray-600 mb-6">
                  Discover events and register to see them here
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Discover Events
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {savedEventsList.length > 0 ? (
              <div className="space-y-3">
                {savedEventsList.map(event => (
                  <EventCard key={event.id} event={event} type="saved" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">No saved events</p>
                <p className="text-sm text-gray-600 mb-6">
                  Save events you're interested in to view them later
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Discover Events
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
