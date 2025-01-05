import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_CONFIG } from './config';

export function createStompClient() {
  return new Client({
    webSocketFactory: () => new SockJS(WS_CONFIG.SOCKET_URL),
    reconnectDelay: WS_CONFIG.RECONNECT_DELAY,
    heartbeatIncoming: WS_CONFIG.HEARTBEAT_INCOMING,
    heartbeatOutgoing: WS_CONFIG.HEARTBEAT_OUTGOING,
  });
}