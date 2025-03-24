import React, { useState, useEffect } from 'react';
import Calendar from './components/MyCalendar';
import { FaMoon, FaSun } from 'react-icons/fa';
import './index.css';
import { ToastContainer } from 'react-toastify';
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center p-6 transition-colors duration-300">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-teal-600 dark:text-teal-300">Event Calendar</h1>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 transition duration-200 shadow-md"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
        <Calendar />
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;