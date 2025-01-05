import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_CONFIG } from '../config/constants';

// Create a more browser-friendly WebSocket client
export function createStompClient() {
  // Ensure global is defined for SockJS
  if (typeof window !== 'undefined') {
    (window as any).global = window;
  }

  return new Client({
    webSocketFactory: () => new SockJS(WS_CONFIG.SOCKET_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
}