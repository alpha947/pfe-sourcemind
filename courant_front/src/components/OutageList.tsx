import React from 'react';
import { format } from 'date-fns';
import { PowerOutage } from '../types/PowerOutage';
import { Clock, MapPin } from 'lucide-react';

interface OutageListProps {
  outages: PowerOutage[];
}

export const OutageList: React.FC<OutageListProps> = ({ outages }) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {outages.map((outage) => (
        <div
          key={outage.id}
          className={`p-4 rounded-lg ${
            outage.status === 'ONGOING'
              ? 'bg-red-50 border-l-4 border-red-500'
              : 'bg-gray-50 border-l-4 border-green-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                outage.status === 'ONGOING'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {outage.status}
              </span>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                {format(new Date(outage.startTime), 'dd/MM/yyyy HH:mm:ss.SSS')}
              </div>
              {outage.location && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="mr-1 h-4 w-4" />
                  {outage.location}
                </div>
              )}
            </div>
            {outage.duration && (
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor(outage.duration / 1000)} secondes
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};