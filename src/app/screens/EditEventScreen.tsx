import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ImageIcon, Tag, AlignLeft, Trash2, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { categories } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', label: 'Conference' },
  { url: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80', label: 'Music' },
  { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80', label: 'Workshop' },
  { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', label: 'Networking' },
  { url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80', label: 'Festival' },
  { url: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&q=80', label: 'Art' },
];

function formatTime(val: string): string {
  if (!val) return '';
  const [h, m] = val.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/** Parse "2:00 PM" → "14:00" for <input type="time"> */
function parseTo24h(str: string): string {
  const m = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return '';
  let h = parseInt(m[1]);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

export default function EditEventScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, updateEvent, deleteEvent } = useAppContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find event from the unified event list
  const event = getEventById(id ?? '');

  // Parse existing time string into start/end for <input type="time">
  const [startPart, endPart] = (event?.time || '').split(' - ');

  const [formData, setFormData] = useState({
    title: event?.title || '',
    category: event?.category || '',
    date: event?.date || '',
    startTime: parseTo24h(startPart || ''),
    endTime: parseTo24h(endPart || ''),
    location: event?.location || '',
    capacity: event?.capacity.toString() || '',
    description: event?.description || '',
    imageUrl: event?.imageUrl || PRESET_IMAGES[0].url,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!event) {
      navigate('/organizer/dashboard');
    }
  }, [event, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    if (!event) return;

    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    else if (formData.startTime && formData.endTime <= formData.startTime) newErrors.endTime = 'End time must be after start time';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    const cap = parseInt(formData.capacity);
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (isNaN(cap) || cap < 1) newErrors.capacity = 'Must be at least 1';
    else if (cap < event.registered) newErrors.capacity = `Cannot be less than current registrations (${event.registered})`;
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    const timeStr = formData.endTime
      ? `${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`
      : formatTime(formData.startTime);

    const updatedEvent = {
      ...event,
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date,
      time: timeStr,
      location: formData.location.trim(),
      description: formData.description.trim(),
      capacity: cap,
      imageUrl: formData.imageUrl,
    };

    updateEvent(event.id, updatedEvent);
    toast.success('Event updated successfully!');
    navigate('/organizer/dashboard');
  };

  const handleDelete = () => {
    if (!event) return;
    deleteEvent(event.id);
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
        {/* Event Image Picker */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label className="text-gray-900 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            Event Image
          </Label>
          <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
            <img
              src={formData.imageUrl}
              alt="Event preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_IMAGES.map((img) => (
              <button
                key={img.url}
                type="button"
                onClick={() => handleChange('imageUrl', img.url)}
                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  formData.imageUrl === img.url ? 'border-purple-600' : 'border-transparent'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                {formData.imageUrl === img.url && (
                  <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow" />
                  </div>
                )}
              </button>
            ))}
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
            className={`h-12 ${errors.title ? 'border-red-400' : ''}`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Label className="text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600" />
            Category *
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className={`h-12 ${errors.category ? 'border-red-400' : ''}`}>
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
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
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
              className={`h-12 ${errors.date ? 'border-red-400' : ''}`}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="startTime" className="text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Start time *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className={`h-12 ${errors.startTime ? 'border-red-400' : ''}`}
              />
              {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="endTime" className="text-gray-900 mb-3 block">
                End time *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className={`h-12 ${errors.endTime ? 'border-red-400' : ''}`}
              />
              {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
            </div>
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
            className={`h-12 ${errors.location ? 'border-red-400' : ''}`}
          />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
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
            className={`h-12 ${errors.capacity ? 'border-red-400' : ''}`}
            min={event.registered}
          />
          <p className="text-xs text-gray-500 mt-1">
            {event.registered} people currently registered
          </p>
          {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
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
            className={`min-h-32 resize-none ${errors.description ? 'border-red-400' : ''}`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
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
