import React from 'react';
import { motion } from 'framer-motion';
import { BASE_URL } from 'helper.js';

const Notifs = ({ notifications, onNotificationClick }) => {
  const smoothScrollStyle = {
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-xl overflow-hidden z-50 border border-gray-200"
    >
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
      </div>
      <ul 
        className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overscroll-contain rounded-b-xl"
        style={smoothScrollStyle}
      >
        {notifications?.length > 0 ? (
          notifications?.map((notification) => (
            <motion.li
              key={notification._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out"
              onClick={() => onNotificationClick(notification._id)}
            >
              <h3 className="font-semibold text-blue mb-1">{notification.title}</h3>
            </motion.li>
          ))
        ) : (
          <li className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 font-medium">No new notifications</p>
            <p className="text-gray-400 text-sm mt-1">We'll notify you when something arrives</p>
          </li>
        )}
      </ul>
    </motion.div>
  );
};

export default Notifs;

