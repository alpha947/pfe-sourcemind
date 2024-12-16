import React from 'react';
import { Clock, MapPin, Zap } from 'lucide-react';
import { OutageStatistics } from '../types/Analytics';

interface StatisticsCardProps {
  statistics: OutageStatistics;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Zap className="w-8 h-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total des coupures</p>
            <p className="text-2xl font-semibold">{statistics.totalOutages}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Clock className="w-8 h-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Durée moyenne</p>
            <p className="text-2xl font-semibold">
              {Math.round(statistics.averageDuration / 1000)}s
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <MapPin className="w-8 h-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Zone la plus touchée</p>
            <p className="text-2xl font-semibold">{statistics.mostAffectedLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};