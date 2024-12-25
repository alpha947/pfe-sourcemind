import React from 'react';
import { Activity } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Activity className="w-10 h-10 text-blue-600" />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Surveillance Électrique</h1>
        <p className="text-gray-600">
          {isConnected ? 'Connecté au serveur' : 'Connexion en cours...'}
        </p>
      </div>
    </div>
  );
}