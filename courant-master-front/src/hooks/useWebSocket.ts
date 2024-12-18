import { useEffect, useState, useCallback, useRef } from 'react';
import { WebSocketService, WebSocketStatus } from '../utils/websocket';
import { PowerStatus } from '../types/PowerStatus';

export function useWebSocket() {
  const [status, setStatus] = useState<WebSocketStatus>('connecting');
  const [history, setHistory] = useState<PowerStatus[]>([]);
  const wsRef = useRef<WebSocketService>();

  const handleMessage = useCallback((message: { body: string }) => {
    const newStatus: PowerStatus = {
      status: message.body,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newStatus, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    wsRef.current = new WebSocketService();
    
    const unsubscribeMessage = wsRef.current.onMessage(handleMessage);
    const unsubscribeStatus = wsRef.current.onStatusChange(setStatus);
    
    wsRef.current.connect();

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      wsRef.current?.disconnect();
    };
  }, [handleMessage]);

  return { status, history };
}