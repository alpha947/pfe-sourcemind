// Polyfill for SockJS in browser environment
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).global.global = window;
  (window as any).process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: function(fn: Function) {
      setTimeout(fn, 0);
    }
  };
  (window as any).Buffer = Buffer;
}