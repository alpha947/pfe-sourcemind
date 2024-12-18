import React from 'react';
import { History } from 'lucide-react';
import type { PowerStatus } from '../types/PowerStatus';
import { HistoryItem } from './history/HistoryItem';

interface StatusHistoryProps {
  history: PowerStatus[];
}

export function StatusHistory({ history }: StatusHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Status History</h2>
      </div>
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item, index) => (
            <HistoryItem key={index} item={item} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No history available</p>
        )}
      </div>
    </div>
  );
}