import React from 'react';
import type { WebSocketStatus } from '../../utils/websocket';

interface StatusMessageProps {
  status: WebSocketStatus;
  powerStatus?: string;
}

export function StatusMessage({ status, powerStatus }: StatusMessageProps) {
  switch (status) {
    case 'connecting':
      return <p className="text-gray-600">Connecting to server...</p>;
    case 'error':
      return <p className="text-gray-600">Connection error</p>;
    case 'disconnected':
      return <p className="text-gray-600">Disconnected</p>;
    case 'connected':
      return <p className="text-gray-600">{powerStatus || 'Waiting for status...'}</p>;
    default:
      return null;
  }
}