import { DailyOutages, MonthlyOutages, LocationOutages, OutageStatistics } from '../types/Analytics';

const API_URL = 'http://localhost:8086/api';

export const fetchDailyOutages = async (startDate: string, endDate: string): Promise<DailyOutages[]> => {
  const response = await fetch(`${API_URL}/analytics/daily?startDate=${startDate}&endDate=${endDate}`);
  return response.json();
};

export const fetchMonthlyOutages = async (year: number): Promise<MonthlyOutages[]> => {
  const response = await fetch(`${API_URL}/analytics/monthly/${year}`);
  return response.json();
};

export const fetchLocationOutages = async (): Promise<LocationOutages[]> => {
  const response = await fetch(`${API_URL}/analytics/locations`);
  return response.json();
};

export const fetchStatistics = async (): Promise<OutageStatistics> => {
  const response = await fetch(`${API_URL}/analytics/statistics`);
  return response.json();
};