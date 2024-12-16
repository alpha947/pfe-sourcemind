export interface DailyOutages {
  date: string;
  count: number;
  totalDuration: number;
}

export interface MonthlyOutages {
  month: string;
  count: number;
  averageDuration: number;
}

export interface LocationOutages {
  location: string;
  count: number;
}

export interface OutageStatistics {
  totalOutages: number;
  averageDuration: number;
  mostAffectedLocation: string;
}