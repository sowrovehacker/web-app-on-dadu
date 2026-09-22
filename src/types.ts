export interface GarmentInputRecord {
  id: string;
  date: string;
  buyer: string;
  item: string;
  size: string;
  style: string;
  color: string;
  level: string;
  quantity: number;
  notes?: string;
  createdAt: number;
}

export type WashType = 'Normal' | 'Enzyme' | 'Stone' | 'Bleach' | 'Silicon' | 'Other';

export interface GarmentWashRecord {
  id: string;
  date: string;
  washCompany: string;
  washType: WashType;
  quantity: number;
  buyer?: string;
  style?: string;
  item?: string;
  color?: string;
  size?: string;
  level?: string;
  chalanNo?: string;
  notes?: string;
  createdAt: number;
}

export interface FilterState {
  buyer: string;
  item: string;
  size: string;
  style: string;
  color: string;
  level: string;
  washCompany?: string;
  washType?: string;
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  baseSalary: number;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'HalfDay';
  inTime?: string;
  outTime?: string;
  overtimeHours: number;
  workStart?: string;
  workEnd?: string;
  otStart?: string;
  otEnd?: string;
  otRate?: number;
  otAmount?: number;
}

export interface ProductionRecord {
  id: string;
  date: string;
  line: string;
  style: string;
  buyer: string;
  target: number;
  actual: number;
  rejectCount: number;
}

export type ActiveTab = 'overview' | 'input' | 'wash' | 'balance' | 'production' | 'salary' | 'settings';
