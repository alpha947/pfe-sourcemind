import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchLocationOutages } from '../services/api';
import { LocationOutages } from '../types/Analytics';

const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'];

export const LocationAnalytics: React.FC = () => {
  const [data, setData] = useState<LocationOutages[]>([]);

  useEffect(() => {
    fetchLocationOutages().then(setData);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Répartition par Zone</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="location"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};