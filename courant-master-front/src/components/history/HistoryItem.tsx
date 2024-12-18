import React from 'react';
import { format } from 'date-fns';
import type { PowerStatus } from '../../types/PowerStatus';

interface HistoryItemProps {
  item: PowerStatus;
}

export function HistoryItem({ item }: HistoryItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <span className="text-gray-700">{item.status}</span>
      <span className="text-sm text-gray-500">
        {format(new Date(item.timestamp), 'HH:mm:ss')}
      </span>
    </div>
  );
}