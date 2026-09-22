import {
  GarmentInputRecord,
  GarmentWashRecord,
  EmployeeRecord,
  AttendanceRecord,
  ProductionRecord,
} from '../types';

export const STORAGE_KEYS = {
  INPUTS: 'garment_inputs',
  WASH: 'garment_wash_records',
  EMPLOYEES: 'garment_employees',
  ATTENDANCE: 'garment_attendance',
  PRODUCTION: 'garment_production',
  INITIALIZED: 'garment_erp_initialized_v2',
  LAST_SAVED: 'garment_erp_last_saved',
};

// Safe ID generator
export function generateId(): string {
  return 'rec_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

// Initial Sample Employees
export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp_mahabub',
    name: 'মাহাবুব',
    designation: 'Senior Machine Operator',
    department: 'Sewing Section',
    phone: '01712-345678',
    baseSalary: 15500,
    joiningDate: '2024-01-10',
    status: 'Active',
  },
  {
    id: 'emp_rafiq',
    name: 'রফিকুল ইসলাম',
    designation: 'Quality Inspector',
    department: 'Finishing Section',
    phone: '01823-456789',
    baseSalary: 16500,
    joiningDate: '2024-03-01',
    status: 'Active',
  },
  {
    id: 'emp_parvin',
    name: 'মোছাঃ পারভীন',
    designation: 'Iron & Folding Operator',
    department: 'Finishing Section',
    phone: '01934-567890',
    baseSalary: 13000,
    joiningDate: '2024-05-15',
    status: 'Active',
  },
  {
    id: 'emp_selim',
    name: 'সেলিম রেজা',
    designation: 'Cutting Master',
    department: 'Cutting Section',
    phone: '01645-678901',
    baseSalary: 19000,
    joiningDate: '2023-11-20',
    status: 'Active',
  },
];

// Initial Sample Inputs
export function getInitialInputs(): GarmentInputRecord[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'inp_sample_1',
      date: todayStr,
      buyer: 'ABC Buyer',
      item: 'Denim Pant',
      size: '32',
      style: 'ABC-DNM-01',
      color: 'Indigo Blue',
      level: 'Sewing Input',
      quantity: 5000,
      notes: 'Initial lot for summer order',
      createdAt: Date.now() - 120000,
    },
    {
      id: 'inp_sample_2',
      date: todayStr,
      buyer: 'ABC Buyer',
      item: 'Denim Pant',
      size: '34',
      style: 'ABC-DNM-01',
      color: 'Dark Vintage',
      level: 'Sewing Input',
      quantity: 5000,
      notes: 'Second lot high quality',
      createdAt: Date.now() - 90000,
    },
    {
      id: 'inp_sample_3',
      date: todayStr,
      buyer: 'H&M',
      item: 'Basic Polo',
      size: 'L',
      style: 'HM-POLO-88',
      color: 'Navy Blue',
      level: 'Line-01',
      quantity: 3500,
      notes: 'Polo batch A export',
      createdAt: Date.now() - 60000,
    },
    {
      id: 'inp_sample_4',
      date: todayStr,
      buyer: 'Zara',
      item: 'Twill Chino',
      size: 'M',
      style: 'ZR-TWILL-99',
      color: 'Olive Green',
      level: 'Line-02',
      quantity: 2000,
      notes: 'Urgent delivery lot',
      createdAt: Date.now() - 30000,
    },
  ];
}

// Initial Sample Wash Records
export function getInitialWashRecords(): GarmentWashRecord[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'wsh_sample_1',
      date: todayStr,
      washCompany: 'Dhaka Washing Plant Ltd',
      washType: 'Enzyme',
      quantity: 4500,
      buyer: 'ABC Buyer',
      style: 'ABC-DNM-01',
      item: 'Denim Pant',
      color: 'Indigo Blue',
      size: '32',
      chalanNo: 'CH-9021',
      createdAt: Date.now() - 25000,
    },
    {
      id: 'wsh_sample_2',
      date: todayStr,
      washCompany: 'Blue Star Washing & Dyeing',
      washType: 'Stone',
      quantity: 4000,
      buyer: 'ABC Buyer',
      style: 'ABC-DNM-01',
      item: 'Denim Pant',
      color: 'Dark Vintage',
      size: '34',
      chalanNo: 'CH-9022',
      createdAt: Date.now() - 20000,
    },
    {
      id: 'wsh_sample_3',
      date: todayStr,
      washCompany: 'Apex Denim Washing',
      washType: 'Bleach',
      quantity: 3000,
      buyer: 'H&M',
      style: 'HM-POLO-88',
      item: 'Basic Polo',
      color: 'Navy Blue',
      size: 'L',
      chalanNo: 'CH-9023',
      createdAt: Date.now() - 15000,
    },
    {
      id: 'wsh_sample_4',
      date: todayStr,
      washCompany: 'Prime Washing Ltd',
      washType: 'Normal',
      quantity: 1500,
      buyer: 'Zara',
      style: 'ZR-TWILL-99',
      item: 'Twill Chino',
      color: 'Olive Green',
      size: 'M',
      chalanNo: 'CH-9024',
      createdAt: Date.now() - 10000,
    },
  ];
}

// Initial Sample Attendance
export function getInitialAttendance(): AttendanceRecord[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'att_sample_1',
      employeeId: 'emp_mahabub',
      employeeName: 'মাহাবুব',
      date: todayStr,
      status: 'Present',
      inTime: '08:00 AM',
      outTime: '08:30 PM',
      workStart: '08:00 AM',
      workEnd: '05:00 PM',
      otStart: '05:00 PM',
      otEnd: '08:30 PM',
      overtimeHours: 3.5,
      otRate: 150,
      otAmount: 525,
    },
    {
      id: 'att_sample_2',
      employeeId: 'emp_rafiq',
      employeeName: 'রফিকুল ইসলাম',
      date: todayStr,
      status: 'Present',
      inTime: '08:00 AM',
      outTime: '07:00 PM',
      workStart: '08:00 AM',
      workEnd: '05:00 PM',
      otStart: '05:00 PM',
      otEnd: '07:00 PM',
      overtimeHours: 2.0,
      otRate: 160,
      otAmount: 320,
    },
    {
      id: 'att_sample_3',
      employeeId: 'emp_parvin',
      employeeName: 'মোছাঃ পারভীন',
      date: todayStr,
      status: 'Present',
      inTime: '08:00 AM',
      outTime: '05:00 PM',
      workStart: '08:00 AM',
      workEnd: '05:00 PM',
      otStart: '',
      otEnd: '',
      overtimeHours: 0,
      otRate: 125,
      otAmount: 0,
    },
  ];
}

// Initial Sample Production
export function getInitialProduction(): ProductionRecord[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'prod_sample_1',
      date: todayStr,
      line: 'Cutting Section-A',
      style: 'ABC-DNM-01',
      buyer: 'ABC Buyer',
      target: 5200,
      actual: 5000,
      rejectCount: 25,
    },
    {
      id: 'prod_sample_2',
      date: todayStr,
      line: 'Sewing Line-01',
      style: 'HM-POLO-88',
      buyer: 'H&M',
      target: 3600,
      actual: 3500,
      rejectCount: 18,
    },
  ];
}

// Initialize seed data if first time
function ensureStorageInitialized(): void {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      if (!localStorage.getItem(STORAGE_KEYS.INPUTS)) {
        localStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(getInitialInputs()));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WASH)) {
        localStorage.setItem(STORAGE_KEYS.WASH, JSON.stringify(getInitialWashRecords()));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(getInitialAttendance()));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PRODUCTION)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(getInitialProduction()));
      }
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    }
  } catch (e) {
    console.error('Error initializing default storage:', e);
  }
}

// Run initialization check immediately
ensureStorageInitialized();

// --- Input Records ---
export function loadGarmentInputs(): GarmentInputRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INPUTS);
    if (!raw) {
      const initial = getInitialInputs();
      saveGarmentInputs(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading garment inputs:', e);
    return [];
  }
}

export function saveGarmentInputs(inputs: GarmentInputRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(inputs));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (e) {
    console.error('Error saving garment inputs:', e);
  }
}

// --- Wash Records ---
export function loadGarmentWashRecords(): GarmentWashRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WASH);
    if (!raw) {
      const initial = getInitialWashRecords();
      saveGarmentWashRecords(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading garment wash records:', e);
    return [];
  }
}

export function saveGarmentWashRecords(wash: GarmentWashRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WASH, JSON.stringify(wash));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (e) {
    console.error('Error saving garment wash records:', e);
  }
}

// --- Employees ---
export function loadEmployees(): EmployeeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (!raw) {
      saveEmployees(INITIAL_EMPLOYEES);
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading employees:', e);
    return INITIAL_EMPLOYEES;
  }
}

export function saveEmployees(employees: EmployeeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (e) {
    console.error('Error saving employees:', e);
  }
}

// --- Attendance ---
export function loadAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      const initial = getInitialAttendance();
      saveAttendance(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading attendance:', e);
    return [];
  }
}

export function saveAttendance(attendance: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (e) {
    console.error('Error saving attendance:', e);
  }
}

// --- Production ---
export function loadProduction(): ProductionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
    if (!raw) {
      const initial = getInitialProduction();
      saveProduction(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading production:', e);
    return [];
  }
}

export function saveProduction(records: ProductionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(records));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (e) {
    console.error('Error saving production:', e);
  }
}

// Export all system data as JSON string
export function exportAllDataAsJSON(): string {
  try {
    const data = {
      version: '2.5',
      platform: 'Garments Tracking ERP - Mobile & Localhost Safe',
      exportedAt: new Date().toISOString(),
      inputs: loadGarmentInputs(),
      wash: loadGarmentWashRecords(),
      employees: loadEmployees(),
      attendance: loadAttendance(),
      production: loadProduction(),
    };
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error('Error exporting all data:', e);
    return '{}';
  }
}

// Import all system data from JSON string
export function importAllDataFromJSON(rawJson: string): boolean {
  try {
    const parsed = JSON.parse(rawJson);
    if (parsed.inputs && Array.isArray(parsed.inputs)) {
      saveGarmentInputs(parsed.inputs);
    }
    if (parsed.wash && Array.isArray(parsed.wash)) {
      saveGarmentWashRecords(parsed.wash);
    }
    if (parsed.employees && Array.isArray(parsed.employees)) {
      saveEmployees(parsed.employees);
    }
    if (parsed.attendance && Array.isArray(parsed.attendance)) {
      saveAttendance(parsed.attendance);
    }
    if (parsed.production && Array.isArray(parsed.production)) {
      saveProduction(parsed.production);
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    return true;
  } catch (e) {
    console.error('Error importing data from JSON:', e);
    return false;
  }
}

// Get storage summary stats
export function getStorageStats(): {
  inputCount: number;
  washCount: number;
  employeeCount: number;
  attendanceCount: number;
  productionCount: number;
  totalInputQty: number;
  totalWashQty: number;
  lastSaved: string;
} {
  const inputs = loadGarmentInputs();
  const wash = loadGarmentWashRecords();
  return {
    inputCount: inputs.length,
    washCount: wash.length,
    employeeCount: loadEmployees().length,
    attendanceCount: loadAttendance().length,
    productionCount: loadProduction().length,
    totalInputQty: inputs.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0),
    totalWashQty: wash.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0),
    lastSaved: localStorage.getItem(STORAGE_KEYS.LAST_SAVED) || 'এইমাত্র',
  };
}

// Format numbers with Bengali/English format (e.g. 10,000 pcs)
export function formatQty(num: number): string {
  return Number(num || 0).toLocaleString('en-US');
}

