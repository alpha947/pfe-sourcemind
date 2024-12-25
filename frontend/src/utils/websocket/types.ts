import { IMessage } from '@stomp/stompjs';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export type MessageHandler = (message: IMessage) => void;
export type StatusHandler = (status: WebSocketStatus) => void;