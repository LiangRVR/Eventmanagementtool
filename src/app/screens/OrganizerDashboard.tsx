import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Calendar, Users, TrendingUp, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { events, userName } = useAppContext();

  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, event) => sum + event.registered, 0);
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-purple-100 text-sm mb-1">Organizer Dashboard</p>
            <h2 className="text-white">{userName}</h2>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{totalEvents}</p>
            <p className="text-xs text-purple-100">Total Events</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{totalAttendees}</p>
            <p className="text-xs text-purple-100">Attendees</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{upcomingEvents}</p>
            <p className="text-xs text-purple-100">Upcoming</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-6">
        <Button
          onClick={() => navigate('/organizer/create-event')}
          className="w-full h-14 text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Event
        </Button>
      </div>

      {/* My Events */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">My Events</h3>
        </div>

        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="text-gray-900 text-sm line-clamp-1 flex-1">{event.title}</h4>
                      {(() => {
                        const isPast = new Date(event.date) < new Date();
                        const isFull = event.registered >= event.capacity;
                        if (isPast) return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">Completed</span>;
                        if (isFull) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 whitespace-nowrap">Full</span>;
                        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 whitespace-nowrap">Upcoming</span>;
                      })()}
                    </div>
                    <Badge className="bg-purple-50 text-purple-700 text-xs mb-2">
                      {event.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                        <Users className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-800 font-medium">
                          {event.registered}/{event.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex gap-2">
                  <Button
                    onClick={() => navigate(`/organizer/attendees/${event.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Attendees
                  </Button>
                  <Button
                    onClick={() => navigate(`/organizer/edit-event/${event.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-2">No events yet</p>
            <p className="text-sm text-gray-600 mb-6">
              Create your first event to get started
            </p>
            <Button
              onClick={() => navigate('/organizer/create-event')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
