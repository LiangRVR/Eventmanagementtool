import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Users, Bookmark, Share2, Clock, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockEvents } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function EventDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedEvents, toggleSaveEvent, registeredEvents, registerForEvent, addNotification } = useAppContext();
  const [showShareSheet, setShowShareSheet] = useState(false);

  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Event not found</p>
          <Button onClick={() => navigate('/home')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const isSaved = savedEvents.includes(event.id);
  const isRegistered = registeredEvents.includes(event.id);

  const handleRegister = () => {
    registerForEvent(event.id);
    addNotification({
      title: 'Registration Confirmed',
      message: `You're registered for ${event.title}`,
      time: 'Just now',
      read: false,
      type: 'registration'
    });
    navigate('/rsvp-confirmation', { state: { event } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Image */}
      <div className="relative h-72">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Header Actions */}
        <div className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareSheet(true)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="Share event"
            >
              <Share2 className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={() => toggleSaveEvent(event.id)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label={isSaved ? 'Unsave event' : 'Save event'}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isSaved ? 'fill-indigo-600 text-indigo-600' : 'text-gray-900'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-6">
          <Badge className="bg-white/90 text-indigo-900 backdrop-blur-sm">
            {event.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-gray-900 mb-4">{event.title}</h2>

          {/* Event Info Cards */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="text-gray-900 font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-gray-700 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-gray-900 font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Attendees</p>
                <p className="text-gray-900 font-medium">
                  {event.registered} registered
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {event.capacity - event.registered} spots remaining
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Organized by</p>
                <p className="text-gray-900 font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3">About this event</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h4 className="text-gray-900 text-sm font-medium mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto">
          {isRegistered ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-800 text-sm font-medium text-center">
                  ✓ You're registered for this event
                </p>
              </div>
              <Button
                onClick={() => navigate('/my-events')}
                variant="outline"
                className="h-12"
              >
                View Details
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleRegister}
              className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={event.registered >= event.capacity}
            >
              {event.registered >= event.capacity ? 'Event Full' : 'Register for Event'}
            </Button>
          )}
        </div>
      </div>

      {/* Share Sheet */}
      {showShareSheet && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
          onClick={() => setShowShareSheet(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full rounded-t-3xl p-6"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <h3 className="text-gray-900 mb-4">Share Event</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {['Message', 'Email', 'Copy Link', 'More'].map(option => (
                <button
                  key={option}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-xs text-gray-700">{option}</span>
                </button>
              ))}
            </div>
            <Button
              onClick={() => setShowShareSheet(false)}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
