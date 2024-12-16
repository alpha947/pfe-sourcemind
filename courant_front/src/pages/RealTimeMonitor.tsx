import React, { useState, useCallback, useEffect } from 'react';
import { PowerStatus } from '../components/PowerStatus';
import { OutageList } from '../components/OutageList';
import { StatisticsCard } from '../components/StatisticsCard';
import { PowerOutage } from '../types/PowerOutage';
import { OutageStatistics } from '../types/Analytics';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAlertSound } from '../hooks/useSound';
import { fetchStatistics } from '../services/api';

export const RealTimeMonitor: React.FC = () => {
  const [currentOutage, setCurrentOutage] = useState<PowerOutage | null>(null);
  const [recentOutages, setRecentOutages] = useState<PowerOutage[]>([]);
  const [statistics, setStatistics] = useState<OutageStatistics>({
    totalOutages: 0,
    averageDuration: 0,
    mostAffectedLocation: ''
  });

  const playAlert = useAlertSound();

  // Charger les statistiques initiales
  useEffect(() => {
    fetchStatistics().then(setStatistics);
  }, []);

  const handleOutage = useCallback((outage: PowerOutage) => {
    setCurrentOutage(outage);
    setRecentOutages(prev => [outage, ...prev].slice(0, 10));
    playAlert();
    fetchStatistics().then(setStatistics);
  }, [playAlert]);

  const handleRestore = useCallback((outage: PowerOutage) => {
    setCurrentOutage(null);
    setRecentOutages(prev => 
      prev.map(o => o.id === outage.id ? outage : o)
    );
    fetchStatistics().then(setStatistics);
  }, []);

  useWebSocket(handleOutage, handleRestore);

  return (
    <div className="space-y-6">
      <StatisticsCard statistics={statistics} />
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          État du Réseau Électrique
        </h2>
        
        <PowerStatus isOutage={!!currentOutage} />
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Dernières Coupures</h3>
          <OutageList outages={recentOutages} />
        </div>
      </div>
    </div>
  );
};