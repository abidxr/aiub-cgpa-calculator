// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation

export default function Sidebar({ toggleDarkMode, isDark }) {
  const location = useLocation(); // Get current location for active link styling

  const linkClass = (path) =>
    `flex items-center p-3 rounded-lg transition-colors duration-200 ` +
    (location.pathname === path
      ? "bg-blue-700 text-white shadow-md" // Active link style
      : "text-gray-200 hover:bg-gray-700 hover:text-white"); // Inactive link style

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="mt-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition duration-200"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isDark ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h1M3 12H2m8.05-9.05l-.707-.707M10 21.05l-.707.707M3.05 10l-.707.707M21.05 10l.707-.707M7.5 7.5l-1.414 1.414M16.5 16.5l-1.414 1.414M16.5 7.5l1.414-1.414M7.5 16.5l-1.414-1.414"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                ></path>
              )}
            </svg>
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
        <nav className="space-y-4 mt-5">
          <Link to="/" className={linkClass("/")}>
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            CGPA Calculator
          </Link>
          <Link to="/analytics" className={linkClass("/analytics")}>
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              ></path>
            </svg>
            Analytics
          </Link>
          <Link to="/grading-system" className={linkClass("/grading-system")}>
            {/* START: Updated Icon */}
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            {/* END: Updated Icon */}
            Grading System
          </Link>
        </nav>
      </div>
    </div>
  );
}
