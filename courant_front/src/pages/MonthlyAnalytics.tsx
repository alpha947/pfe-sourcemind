import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchMonthlyOutages } from '../services/api';
import { MonthlyOutages } from '../types/Analytics';

export const MonthlyAnalytics: React.FC = () => {
  const [data, setData] = useState<MonthlyOutages[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchMonthlyOutages(currentYear).then(setData);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Tendance Mensuelle</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#fbbf24" 
              name="Nombre de coupures"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};