import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, MapPin, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Event } from '../data/mockData';

export default function RSVPConfirmationScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event as Event;

  if (!event) {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-gray-900 mb-2">You're all set!</h2>
        <p className="text-gray-600">
          Your registration has been confirmed
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md mb-8"
      >
        <div className="text-center mb-6">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-40 object-cover rounded-2xl mb-4"
          />
          <h3 className="text-gray-900 mb-2">{event.title}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
            <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-600">{event.time.split(' - ')[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <p className="text-sm text-gray-900">{event.location}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Reminder Set
              </p>
              <p className="text-xs text-gray-600">
                We'll notify you 1 day before the event
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-3 w-full max-w-md"
      >
        <Button
          onClick={() => navigate('/my-events')}
          className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          View My Events
        </Button>
        <Button
          onClick={() => navigate('/home')}
          variant="outline"
          className="w-full h-12 text-base"
        >
          Discover More Events
        </Button>
      </motion.div>
    </div>
  );
}
