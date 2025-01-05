import { IMessage } from '@stomp/stompjs';
import { WS_CONFIG } from '../config/constants';
import { createStompClient } from './websocket-client';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export type MessageHandler = (message: IMessage) => void;

export class WebSocketService {
  private client = createStompClient();
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<(status: WebSocketStatus) => void> = new Set();

  constructor() {
    this.setupClientHandlers();
  }

  private setupClientHandlers() {
    this.client.onConnect = () => {
      this.updateStatus('connected');
      this.setupSubscription();
    };
    this.client.onDisconnect = () => this.updateStatus('disconnected');
    this.client.onStompError = () => this.updateStatus('error');
  }

  private setupSubscription() {
    if (this.client.connected) {
      this.client.subscribe(WS_CONFIG.TOPIC, (message) => {
        this.messageHandlers.forEach(handler => handler(message));
      });
    }
  }

  private updateStatus(status: WebSocketStatus) {
    this.statusHandlers.forEach(handler => handler(status));
  }

  public connect() {
    this.updateStatus('connecting');
    this.client.activate();
  }

  public disconnect() {
    this.client.deactivate();
  }

  public onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public onStatusChange(handler: (status: WebSocketStatus) => void) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }
}