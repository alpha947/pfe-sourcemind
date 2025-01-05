import React from 'react';
import type { WebSocketStatus } from '../utils/websocket';
import { StatusIcon } from './status/StatusIcon';
import { StatusMessage } from './status/StatusMessage';

interface StatusIndicatorProps {
  status: WebSocketStatus;
  powerStatus?: string;
}

export function StatusIndicator({ status, powerStatus }: StatusIndicatorProps) {
  const hasPower = powerStatus?.includes('il ya le courant');
  const bgColor = status === 'connected'
    ? hasPower ? 'bg-green-100' : 'bg-red-100'
    : status === 'connecting'
    ? 'bg-blue-100'
    : status === 'error'
    ? 'bg-red-100'
    : 'bg-orange-100';
  
  const textColor = status === 'connected'
    ? hasPower ? 'text-green-700' : 'text-red-700'
    : status === 'connecting'
    ? 'text-blue-700'
    : status === 'error'
    ? 'text-red-700'
    : 'text-orange-700';

  return (
    <div className={`p-6 rounded-lg ${bgColor} flex items-center gap-4`}>
      <StatusIcon status={status} hasPower={hasPower} />
      <div>
        <h2 className={`text-xl font-semibold ${textColor}`}>
          Power Status
        </h2>
        <StatusMessage status={status} powerStatus={powerStatus} />
      </div>
    </div>
  );
}