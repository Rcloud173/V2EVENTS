import React, { useState } from 'react';
import { Calendar, Users, Bell, MessageSquare, Settings, BarChart, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';

export function FacultyDashboard() {
  const { profile } = useAuth();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: '',
    price: 'Free',
    image_url: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    try {
      const { error } = await eventService.createEvent({
        ...eventForm,
        capacity: parseInt(eventForm.capacity),
        organizer_id: profile.id,
        organizer_name: profile.name,
        organizer_contact: profile.contact || null
      });

      if (!error) {
        setFormSubmitted(true);
        setTimeout(() => {
          setShowCreateEventModal(false);
          setFormSubmitted(false);
          setEventForm({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            category: '',
            capacity: '',
            price: 'Free',
            image_url: ''
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const stats = {
    totalEvents: 12,
    activeEvents: 5,
    pendingApprovals: 2,
    totalParticipants: 450
  };

  const recentActivities = [
    { id: 1, type: 'Event', message: 'Tech Workshop 2025 approved', time: '2 hours ago' },
    { id: 2, type: 'Registration', message: '25 new registrations for Coding Competition', time: '4 hours ago' },
    { id: 3, type: 'Update', message: 'Updated Cultural Night schedule', time: '6 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Faculty Dashboard</h1>
          <p className="mt-2 text-gray-400">Welcome back, {profile?.name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Active Events</p>
                <p className="text-2xl font-bold text-white">{stats.activeEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Pending Approvals</p>
                <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-white">{stats.totalParticipants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => setShowCreateEventModal(true)}
            className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">Create Event</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">View Calendar</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <BarChart className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">Analytics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Settings className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">Settings</span>
          </button>
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activities</h2>
          <div className="space-y-6">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="p-2 bg-[#f14621]/10 rounded-lg">
                  <Bell className="w-5 h-5 text-[#ff6b4a]" />
                </div>
                <div>
                  <p className="text-white">{activity.message}</p>
                  <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Create New Event</h2>
                <button 
                  onClick={() => setShowCreateEventModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {formSubmitted ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Event Submitted for Approval</h3>
                  <p className="text-gray-400 mb-4">
                    Your event has been submitted to the admin for approval. You will be notified once it's approved.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={eventForm.title}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={eventForm.date}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                        Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={eventForm.time}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={eventForm.location}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={eventForm.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={eventForm.category}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Academic">Academic</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
                        Capacity *
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={eventForm.capacity}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={eventForm.price}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                        placeholder="Free or ₹XXX"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        id="image_url"
                        name="image_url"
                        value={eventForm.image_url}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateEventModal(false)}
                      className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors"
                    >
                      Submit for Approval
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}