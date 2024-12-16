import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, BarChart2, MapPin, Clock } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <Activity className="w-5 h-5 mr-2" />
              Temps Réel
            </NavLink>
            <NavLink
              to="/daily"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <Clock className="w-5 h-5 mr-2" />
              Quotidien
            </NavLink>
            <NavLink
              to="/monthly"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              Mensuel
            </NavLink>
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <MapPin className="w-5 h-5 mr-2" />
              Zones
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};