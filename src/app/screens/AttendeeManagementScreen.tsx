import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Users, Mail, Download, Search, CheckSquare, Square, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

// Mock attendee data
const generateAttendees = (count: number) => {
  const names = [
    'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim',
    'Jessica Taylor', 'James Wilson', 'Amanda Brown', 'Robert Martinez',
    'Laura Anderson', 'Christopher Lee', 'Nicole White', 'Kevin Garcia',
    'Ashley Thomas', 'Daniel Jackson', 'Melissa Harris', 'Ryan Clark',
    'Stephanie Lewis', 'Justin Walker', 'Rebecca Hall', 'Brandon Allen'
  ];

  return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
    id: `attendee-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
    registeredDate: `${Math.floor(Math.random() * 10) + 1} days ago`,
    status: Math.random() > 0.3 ? 'confirmed' : 'pending'
  }));
};

export default function AttendeeManagementScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());

  const event = getEventById(id ?? '');

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Event not found</p>
          <Button onClick={() => navigate('/organizer/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const attendees = generateAttendees(event.registered);
  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCheckIn = (attendeeId: string) => {
    setCheckedIn(prev => {
      const next = new Set(prev);
      if (next.has(attendeeId)) next.delete(attendeeId);
      else next.add(attendeeId);
      return next;
    });
  };

  const handleEmailAll = () => {
    const bcc = attendees.map(a => a.email).join(',');
    const subject = encodeURIComponent(`Update about: ${event.title}`);
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}`;
  };

  const handleExport = () => {
    const header = 'Name,Email,Registered,Status,Checked In';
    const rows = attendees.map(a =>
      `"${a.name}","${a.email}","${a.registeredDate}","${a.status}","${checkedIn.has(a.id) ? 'Yes' : 'No'}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `attendees-${event.title.replace(/\s+/g, '-').toLowerCase()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Attendee list exported');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900">Attendees</h2>
            <p className="text-sm text-gray-600 line-clamp-1">{event.title}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-indigo-900">{event.registered}</p>
            <p className="text-xs text-gray-600">Registered</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-900">
              {attendees.filter(a => a.status === 'confirmed').length}
            </p>
            <p className="text-xs text-gray-600">Confirmed</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-orange-900">
              {event.capacity - event.registered}
            </p>
            <p className="text-xs text-gray-600">Available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 bg-gray-50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleEmailAll} variant="outline" className="flex-1 h-10 text-sm">
            <Mail className="w-4 h-4 mr-2" />
            Email All
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex-1 h-10 text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="mx-6 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">Showing simulated attendee data for demo purposes. In production, this would list real registrations.</p>
      </div>

      {/* Attendee List */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 text-sm font-medium">
            {filteredAttendees.length} {filteredAttendees.length === 1 ? 'Person' : 'People'}
          </h3>
        </div>

        <div className="space-y-2">
          {filteredAttendees.map((attendee, index) => (
            <motion.div
              key={attendee.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCheckIn(attendee.id)}
                  className="flex-shrink-0 transition-colors"
                  aria-label={checkedIn.has(attendee.id) ? 'Mark not checked in' : 'Mark checked in'}
                >
                  {checkedIn.has(attendee.id)
                    ? <CheckSquare className="w-5 h-5 text-green-600" />
                    : <Square className="w-5 h-5 text-gray-300" />}
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {attendee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900 font-medium text-sm">{attendee.name}</p>
                    <Badge
                      className={`text-xs ${
                        attendee.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {attendee.status}
                    </Badge>
                    {checkedIn.has(attendee.id) && (
                      <Badge className="text-xs bg-blue-100 text-blue-800">Checked in</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{attendee.email}</p>
                  <p className="text-xs text-gray-500">Registered {attendee.registeredDate}</p>
                </div>
                <a
                  href={`mailto:${attendee.email}`}
                  className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={`Email ${attendee.name}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </motion.div>
          ))}

          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No attendees found</p>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
