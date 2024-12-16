export interface PowerOutage {
  id: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  location?: string;
  status: 'ONGOING' | 'RESOLVED';
}