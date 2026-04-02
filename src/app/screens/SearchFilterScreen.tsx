import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { categories, mockEvents } from '../data/mockData';
import { motion } from 'motion/react';

export default function SearchFilterScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesLocation = !locationQuery || 
      event.location.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesDate = !selectedDate || event.date === selectedDate;

    return matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

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
          <h2 className="text-gray-900 flex-1">Search & Filter</h2>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDate('');
              setLocationQuery('');
            }}
            className="text-indigo-600 text-sm font-medium"
          >
            Clear all
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-6 space-y-6">
        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <Label className="text-gray-900">Category</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <Label htmlFor="date-filter" className="text-gray-900">Date</Label>
          </div>
          <Input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-12 bg-white rounded-xl"
          />
        </div>

        {/* Location Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <Label htmlFor="location-filter" className="text-gray-900">Location</Label>
          </div>
          <Input
            id="location-filter"
            type="text"
            placeholder="Search by location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="h-12 bg-white rounded-xl"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">{filteredEvents.length} Results</h3>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/event/${event.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex gap-3">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h4 className="text-gray-900 text-sm line-clamp-1 flex-1">{event.title}</h4>
                    <Badge className="bg-indigo-50 text-indigo-700 text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No events found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
