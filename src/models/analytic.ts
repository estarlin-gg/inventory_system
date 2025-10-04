export interface DayAnalytics {
  date: string;
  totalSales: number;
  totalPay: number;
}

export interface WeekAnalytics {
  date: string;
  totalSales: number;
  totalPay: number;
}

export interface MonthAnalytics {
  date: string;
  totalSales: number;
  totalPay: number;
}

export interface YearAnalytics {
  year: number;
  month: number;
  totalSales: number;
  totalPay: number;
}

export type Period = "day" | "week" | "month" | "year";


export interface FullAnalyticsResponse {
  day: DayAnalytics[];
  week: WeekAnalytics[];
  month: MonthAnalytics[];
  year: YearAnalytics[];
}
