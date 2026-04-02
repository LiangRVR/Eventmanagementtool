import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Users, ImageIcon, Tag, AlignLeft, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { categories, mockEvents } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function EditEventScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizerEvents, updateOrganizerEvent, deleteOrganizerEvent } = useAppContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find event from organizer events or mock events
  const event = organizerEvents.find(e => e.id === id) || mockEvents.find(e => e.id === id);

  const [formData, setFormData] = useState({
    title: event?.title || '',
    category: event?.category || '',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    capacity: event?.capacity.toString() || '',
    description: event?.description || '',
    imageUrl: event?.imageUrl || '',
  });

  useEffect(() => {
    if (!event) {
      navigate('/organizer/dashboard');
    }
  }, [event, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!event) return;

    if (!formData.title || !formData.category || !formData.date || !formData.time || 
        !formData.location || !formData.capacity || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedEvent = {
      ...event,
      title: formData.title,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      capacity: parseInt(formData.capacity),
      imageUrl: formData.imageUrl,
    };

    updateOrganizerEvent(event.id, updatedEvent);
    toast.success('Event updated successfully!');
    navigate('/organizer/dashboard');
  };

  const handleDelete = () => {
    if (!event) return;
    deleteOrganizerEvent(event.id);
    toast.success('Event deleted successfully');
    navigate('/organizer/dashboard');
  };

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-gray-900 flex-1">Edit Event</h2>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
            aria-label="Delete event"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="px-6 py-6 space-y-6"
      >
        {/* Event Image Preview */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label className="text-gray-900 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            Event Image
          </Label>
          <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={formData.imageUrl}
              alt="Event preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Event Title */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label htmlFor="title" className="text-gray-900 mb-3 block">
            Event Title *
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Tech Innovation Summit 2026"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="h-12"
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label className="text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600" />
            Category *
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c !== 'All').map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <Label htmlFor="date" className="text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-gray-900 mb-3 block">
              Time *
            </Label>
            <Input
              id="time"
              type="text"
              placeholder="e.g., 2:00 PM - 4:00 PM"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label htmlFor="location" className="text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            Location *
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., Student Center Room 305"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="h-12"
          />
        </div>

        {/* Capacity */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label htmlFor="capacity" className="text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Max Capacity *
          </Label>
          <Input
            id="capacity"
            type="number"
            placeholder="e.g., 50"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            className="h-12"
            min="1"
          />
          <p className="text-xs text-gray-500 mt-2">
            Current registrations: {event.registered}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label htmlFor="description" className="text-gray-900 mb-3 flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-purple-600" />
            Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your event..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="min-h-32 resize-none"
          />
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-sm w-full"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-gray-900 text-center mb-2">Delete Event?</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              This action cannot be undone. All event data and registrations will be permanently removed.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
