import { useNavigate } from 'react-router';
import { ArrowLeft, User, Bell, HelpCircle, Shield, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { userName, userType, setUserType } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem('eventAppData');
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-12 pb-16 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors mb-8"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-3xl font-bold text-indigo-600">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-white mb-2">{userName}</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            {userType === 'organizer' ? (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">Event Organizer</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">Attendee</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="px-6 -mt-8"
      >
        {/* User Type Toggle */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Organizer Mode</p>
                <p className="text-xs text-gray-600">Create and manage events</p>
              </div>
            </div>
            <Switch
              checked={userType === 'organizer'}
              onCheckedChange={(checked) => {
                setUserType(checked ? 'organizer' : 'attendee');
              }}
            />
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <h3 className="text-gray-900 text-sm font-medium px-4 pt-4 pb-2">Notifications</h3>
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Event reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Demo</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Event updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Demo</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <h3 className="text-gray-900 text-sm font-medium px-4 pt-4 pb-2">Account</h3>
            <div className="divide-y divide-gray-100">
              <button onClick={() => toast.info('Coming soon')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Edit profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={() => toast.info('Coming soon')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Privacy & Security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <h3 className="text-gray-900 text-sm font-medium px-4 pt-4 pb-2">Support</h3>
            <div className="divide-y divide-gray-100">
              <button onClick={() => toast.info('Coming soon')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Help Center</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          EventHub v1.0.0
          <br />
          HCI Class Project 2026
        </p>
      </motion.div>
    </div>
  );
}
