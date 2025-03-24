import React, { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaStickyNote, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventForm = ({ onEventAdded, selectedEvent, onDelete }) => {
  const [title, setTitle] = useState(selectedEvent?.title || '');
  const [start, setStart] = useState(selectedEvent?.start ? new Date(selectedEvent.start).toISOString().slice(0, 16) : '');
  const [end, setEnd] = useState(selectedEvent?.end ? new Date(selectedEvent.end).toISOString().slice(0, 16) : '');
  const [description, setDescription] = useState(selectedEvent?.description || '');
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!start) {
      newErrors.start = 'Start time is required';
    }

    if (end && new Date(end) <= new Date(start)) {
      newErrors.end = 'End time must be after start time';
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const event = { 
      title: title.trim(), 
      start, 
      end: end || null, 
      description: description.trim() 
    };

    try {
      if (selectedEvent) {
        await axios.put(`https://events-project-iia2.onrender.com/api/events/${selectedEvent._id}`, event);
        toast.success('Event updated successfully!');
      } else {
        await axios.post('https://events-project-iia2.onrender.com/api/events', event);
        toast.success('Event added successfully!');
      }
      onEventAdded();
      // Reset form after successful submission
      if (!selectedEvent) {
        setTitle('');
        setStart('');
        setEnd('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-3">
        <FaCalendarAlt className="text-blue-500 dark:text-purple-400" />
        <div className="w-full">
          <label className="block text-sm font-medium text-blue-700 dark:text-purple-300">Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className={`mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-purple-400 dark:focus:border-purple-400 ${
              errors.title ? 'border-red-500' : 'border-blue-300 dark:border-purple-600'
            }`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <FaClock className="text-blue-500 dark:text-purple-400" />
        <div className="w-full">
          <label className="block text-sm font-medium text-blue-700 dark:text-purple-300">Start Time</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={`mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-purple-400 dark:focus:border-purple-400 ${
              errors.start ? 'border-red-500' : 'border-blue-300 dark:border-purple-600'
            }`}
          />
          {errors.start && <p className="text-red-500 text-xs mt-1">{errors.start}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <FaClock className="text-blue-500 dark:text-purple-400" />
        <div className="w-full">
          <label className="block text-sm font-medium text-blue-700 dark:text-purple-300">End Time (Optional)</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={`mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-purple-400 dark:focus:border-purple-400 ${
              errors.end ? 'border-red-500' : 'border-blue-300 dark:border-purple-600'
            }`}
          />
          {errors.end && <p className="text-red-500 text-xs mt-1">{errors.end}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <FaStickyNote className="text-blue-500 dark:text-purple-400" />
        <div className="w-full">
          <label className="block text-sm font-medium text-blue-700 dark:text-purple-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={`mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-purple-400 dark:focus:border-purple-400 ${
              errors.description ? 'border-red-500' : 'border-blue-300 dark:border-purple-600'
            }`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 dark:bg-purple-500 dark:hover:bg-purple-600 transition duration-200 flex items-center justify-center space-x-2"
        >
          <FaCalendarAlt />
          <span>{selectedEvent ? 'Update Event' : 'Add Event'}</span>
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition duration-200 flex items-center justify-center space-x-2"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
