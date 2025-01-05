import React from 'react';
import type { WebSocketStatus } from '../../utils/websocket';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="mt-6 flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
      <span className="text-sm text-gray-600">
        {isConnected ? 'Surveillance active' : 'Tentative de connexion...'}
      </span>
    </div>
  );
}