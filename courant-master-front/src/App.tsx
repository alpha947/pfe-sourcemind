import React, { useState, useEffect } from 'react';
import { WebSocketService } from './utils/websocket';
import { PowerStatus } from './components/PowerStatus';
import { Header } from './components/header/Header';
import { ConnectionStatus } from './components/status/ConnectionStatus';

function App() {
  const [powerStatus, setPowerStatus] = useState<string>('En attente de connexion...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocketService();

    ws.onMessage((message) => {
      setPowerStatus(message.body);
    });

    ws.onStatusChange((status) => {
      setIsConnected(status === 'connected');
    });

    ws.connect();

    return () => ws.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Header isConnected={isConnected} />
        <PowerStatus status={powerStatus} />
        <ConnectionStatus isConnected={isConnected} />
      </div>
    </div>
  );
}

export default App;