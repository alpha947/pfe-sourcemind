import React from 'react';
import { Zap, ZapOff } from 'lucide-react';

interface PowerStatusProps {
  isOutage: boolean;
}

export const PowerStatus: React.FC<PowerStatusProps> = ({ isOutage }) => {
  return (
    <div className={`flex items-center justify-center p-8 rounded-full ${
      isOutage ? 'bg-red-100' : 'bg-green-100'
    } w-32 h-32 mx-auto mb-8`}>
      {isOutage ? (
        <ZapOff className="w-16 h-16 text-red-500 animate-pulse" />
      ) : (
        <Zap className="w-16 h-16 text-green-500" />
      )}
    </div>
  );
};