import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, BellRing, CheckCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useAppContext();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <BellRing className="w-5 h-5 text-indigo-600" />;
      case 'registration':
        return <CheckCheck className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-purple-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-indigo-100';
      case 'registration':
        return 'bg-green-100';
      default:
        return 'bg-purple-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-gray-900 flex-1">Notifications</h2>
          <button
            onClick={() => {
              notifications.forEach(notif => {
                if (!notif.read) {
                  markNotificationRead(notif.id);
                }
              });
            }}
            className="text-indigo-600 text-sm font-medium"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 py-6">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markNotificationRead(notification.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  notification.read
                    ? 'bg-white shadow-sm'
                    : 'bg-indigo-50 border-2 border-indigo-200 shadow-md'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-2">You're all caught up</p>
            <p className="text-sm text-gray-600">
              Register for events to receive reminders and updates here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
