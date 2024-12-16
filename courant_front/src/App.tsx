import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { RealTimeMonitor } from './pages/RealTimeMonitor';
import { DailyAnalytics } from './pages/DailyAnalytics';
import { MonthlyAnalytics } from './pages/MonthlyAnalytics';
import { LocationAnalytics } from './pages/LocationAnalytics';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<RealTimeMonitor />} />
            <Route path="/daily" element={<DailyAnalytics />} />
            <Route path="/monthly" element={<MonthlyAnalytics />} />
            <Route path="/locations" element={<LocationAnalytics />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;