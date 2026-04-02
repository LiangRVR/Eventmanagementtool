import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Bell, User, Calendar, MapPin, Users, Bookmark, Plus } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { userType, userName, savedEvents, toggleSaveEvent, notifications, events } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Welcome back,</p>
            <h2 className="text-white">{userName || 'User'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 pr-12 bg-white rounded-2xl border-0 shadow-lg"
          />
          <button
            onClick={() => navigate('/search')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
            aria-label="Filter"
          >
            <Filter className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Workshop', 'Networking', 'Social', 'Volunteer'].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Upcoming Events</h3>
          <button onClick={() => navigate('/search')} className="text-indigo-600 text-sm font-medium">See all</button>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleEventClick(event.id)}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-indigo-900 hover:bg-white">
                    {event.category}
                  </Badge>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveEvent(event.id);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Save event"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      savedEvents.includes(event.id)
                        ? 'fill-indigo-600 text-indigo-600'
                        : 'text-gray-700'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4">
                <h4 className="text-gray-900 mb-2 line-clamp-1">{event.title}</h4>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                    <span className="text-gray-400">•</span>
                    <span>{event.time.split(' - ')[0]}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{event.registered} registered</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{event.capacity - event.registered} spots left</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {event.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Discover</span>
          </button>

          <button
            onClick={() => navigate('/my-events')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-xs">My Events</span>
          </button>

          {userType === 'organizer' && (
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg -mt-6">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs mt-1">Organize</span>
            </button>
          )}

          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
