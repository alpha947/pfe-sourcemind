import React from 'react';
import { Power, PowerOff, Loader2 } from 'lucide-react';
import type { WebSocketStatus } from '../../utils/websocket';

interface StatusIconProps {
  status: WebSocketStatus;
  hasPower?: boolean;
}

export function StatusIcon({ status, hasPower }: StatusIconProps) {
  switch (status) {
    case 'connecting':
      return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
    case 'error':
      return <PowerOff className="w-8 h-8 text-red-600" />;
    case 'disconnected':
      return <PowerOff className="w-8 h-8 text-orange-600" />;
    case 'connected':
      return hasPower ? 
        <Power className="w-8 h-8 text-green-600" /> : 
        <PowerOff className="w-8 h-8 text-red-600" />;
    default:
      return null;
  }
}