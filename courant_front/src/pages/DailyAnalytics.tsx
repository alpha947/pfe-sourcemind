import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchDailyOutages } from '../services/api';
import { DailyOutages } from '../types/Analytics';
import { format, subDays } from 'date-fns';

export const DailyAnalytics: React.FC = () => {
  const [data, setData] = useState<DailyOutages[]>([]);

  useEffect(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    
    fetchDailyOutages(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    ).then(setData);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Coupures Quotidiennes</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#fbbf24" name="Nombre de coupures" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};