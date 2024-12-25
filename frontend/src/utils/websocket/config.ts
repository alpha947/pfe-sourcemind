export const WS_CONFIG = {
  SOCKET_URL: 'http://localhost:9495/ws',
  TOPIC: '/topic/powerStatus',
  RECONNECT_DELAY: 5000,
  HEARTBEAT_INCOMING: 4000,
  HEARTBEAT_OUTGOING: 4000,
} as const;