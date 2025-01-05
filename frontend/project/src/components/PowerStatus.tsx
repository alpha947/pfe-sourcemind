import React from 'react';
import { Zap, ZapOff, AlertTriangle } from 'lucide-react';

interface PowerStatusProps {
  status: string;
}

export function PowerStatus({ status }: PowerStatusProps) {
  const hasPower = status.includes('il ya le courant');
  
  return (
    <div className={`p-8 rounded-xl shadow-lg ${hasPower ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">État du Courant</h2>
        <div className={`p-3 rounded-full ${hasPower ? 'bg-green-100' : 'bg-red-100'}`}>
          {hasPower ? (
            <Zap className="w-8 h-8 text-green-600" />
          ) : (
            <ZapOff className="w-8 h-8 text-red-600" />
          )}
        </div>
      </div>
      
      <div className={`mt-4 p-4 rounded-lg ${hasPower ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className="flex items-center gap-3">
          {hasPower ? (
            <Zap className="w-6 h-6 text-green-600" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-600" />
          )}
          <p className={`text-lg font-medium ${hasPower ? 'text-green-700' : 'text-red-700'}`}>
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}