import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../context/AppContext';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { setUserType, setUserName } = useAppContext();
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<'attendee' | 'organizer' | null>(null);

  const handleGetStarted = () => {
    if (name && selectedType) {
      setUserName(name);
      setUserType(selectedType);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-indigo-900 mb-2">Welcome to EventHub</h1>
        <p className="text-gray-600">Your gateway to amazing events</p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">What's your name?</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700">I want to...</Label>
            
            <button
              onClick={() => setSelectedType('attendee')}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${
                selectedType === 'attendee'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedType === 'attendee' ? 'bg-indigo-600' : 'bg-gray-100'
                }`}>
                  <Users className={`w-5 h-5 ${
                    selectedType === 'attendee' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <div className={`font-semibold mb-1 ${
                    selectedType === 'attendee' ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    Discover Events
                  </div>
                  <div className="text-sm text-gray-600">
                    Find and register for events I'm interested in
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('organizer')}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${
                selectedType === 'organizer'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedType === 'organizer' ? 'bg-purple-600' : 'bg-gray-100'
                }`}>
                  <Sparkles className={`w-5 h-5 ${
                    selectedType === 'organizer' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <div className={`font-semibold mb-1 ${
                    selectedType === 'organizer' ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    Organize Events
                  </div>
                  <div className="text-sm text-gray-600">
                    Create and manage events for my community
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Get Started Button */}
          <Button
            onClick={handleGetStarted}
            disabled={!name || !selectedType}
            className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
