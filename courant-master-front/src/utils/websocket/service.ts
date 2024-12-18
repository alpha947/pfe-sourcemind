import { createStompClient } from './client';
import { WS_CONFIG } from './config';
import type { MessageHandler, StatusHandler, WebSocketStatus } from './types';

export class WebSocketService {
  private client = createStompClient();
  private messageHandlers = new Set<MessageHandler>();
  private statusHandlers = new Set<StatusHandler>();

  constructor() {
    this.setupClientHandlers();
  }

  private setupClientHandlers() {
    this.client.onConnect = () => {
      this.updateStatus('connected');
      this.setupSubscription();
    };

    this.client.onDisconnect = () => {
      this.updateStatus('disconnected');
    };

    this.client.onStompError = () => {
      this.updateStatus('error');
    };
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

  public onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }
}