
export interface CustomerSegment {
  premium: number;
  regular: number;
  normal: number;
}

export interface DailySale {
  day: string;
  sales: number;
  purchases: number;
}

export interface TopCategory {
  name: string;
  value: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  totalSpending: number;
  frequency: number;
  segment: 'premium' | 'regular' | 'normal';
}

export interface DashboardData {
  customerSegmentation: CustomerSegment;
  dailySales: DailySale[];
  topCategories: TopCategory[];
  topCustomers: TopCustomer[];
}