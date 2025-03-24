import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';
import EventForm from './EventForm';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus } from 'react-icons/fa';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // Add state for current date

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      const mappedEvents = res.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : new Date(event.start),
      }));
      setEvents(mappedEvents);
      console.log('Events fetched:', mappedEvents);
    } catch (error) {
      console.error('Error fetching events:', error.response ? error.response.data : error.message);
    }
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent || !selectedEvent._id) {
      console.error('No event selected or event ID missing');
      return;
    }

    try {
      console.log('Attempting to delete event with ID:', selectedEvent._id);
      const response = await axios.delete(`http://localhost:5000/api/events/${selectedEvent._id}`);
      console.log('Delete response:', response.data);
      setSelectedEvent(null);
      await fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error.response ? error.response.data : error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle navigation (Next, Previous, Today, etc.)
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={handleAddEvent}
          className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition duration-200"
        >
          <FaPlus />
          <span>Add Event</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-blue-200 dark:border-purple-700">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh', minHeight: '400px' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          className="w-full dark:text-gray-200"
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#10B981',
              color: 'white',
              borderRadius: '4px',
            },
          })}
          date={currentDate} // Set the current date
          onNavigate={handleNavigate} // Handle navigation events
          views={['month', 'week', 'day', 'agenda']} // Explicitly enable views
          defaultView="month" // Set default view
          toolbar={true} // Ensure toolbar is enabled
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-blue-300 dark:border-purple-600">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-purple-400 mb-4">
              {selectedEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <EventForm
              onEventAdded={() => { fetchEvents(); closeModal(); }}
              selectedEvent={selectedEvent}
              onDelete={selectedEvent ? handleDelete : null}
            />
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
