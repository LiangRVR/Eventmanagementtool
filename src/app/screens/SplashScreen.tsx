import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, Users, Sparkles } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center">
            <Calendar className="w-12 h-12 text-indigo-600" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white mb-3"
        >
          EventHub
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-white/90 text-lg"
        >
          Discover. Connect. Experience.
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-12 flex items-center justify-center gap-2 text-white/80"
        >
          <Users className="w-5 h-5" />
          <span className="text-sm">Join thousands of event enthusiasts</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
