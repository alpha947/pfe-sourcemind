import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { PowerOutage } from '../types/PowerOutage';

export const useWebSocket = (
  onOutage: (outage: PowerOutage) => void,
  onRestore: (outage: PowerOutage) => void
) => {
  const connectWebSocket = useCallback(() => {
    const socket: Socket = io('ws://localhost:8080');

    socket.on('powerOutage', (data: PowerOutage) => {
      onOutage(data);
    });

    socket.on('powerRestored', (data: PowerOutage) => {
      onRestore(data);
    });

    return socket;
  }, [onOutage, onRestore]);

  useEffect(() => {
    const socket = connectWebSocket();
    return () => {
      socket.disconnect();
    };
  }, [connectWebSocket]);
};