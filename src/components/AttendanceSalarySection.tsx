import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  CreditCard,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  Clock3,
  Coins,
  ChevronDown,
  Timer,
  User,
  Check,
  Sparkles,
  HelpCircle,
  Briefcase,
  Phone,
  Layers,
} from 'lucide-react';
import { EmployeeRecord, AttendanceRecord } from '../types';
import { formatQty, generateId } from '../utils/storage';

interface AttendanceSalarySectionProps {
  employees: EmployeeRecord[];
  attendance: AttendanceRecord[];
  onSaveEmployee: (emp: EmployeeRecord) => void;
  onDeleteEmployee: (id: string) => void;
  onSaveAttendance: (att: AttendanceRecord) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AttendanceSalarySection: React.FC<AttendanceSalarySectionProps> = ({
  employees,
  attendance,
  onSaveEmployee,
  onDeleteEmployee,
  onSaveAttendance,
  onShowToast,
}) => {
  // Current view tab
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'history' | 'salary' | 'employees'>('form');

  // Today string format YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Form states matching screenshot
  const [selectedEmpId, setSelectedEmpId] = useState<string>(() => {
    const mahabub = employees.find((e) => e.name.includes('মাহাবুব'));
    return mahabub ? mahabub.id : employees[0]?.id || '';
  });

  const [entryTime, setEntryTime] = useState<string>('08:00 AM');
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'HalfDay' | 'Absent'>('Present');

  // Regular time
  const [workStartTime, setWorkStartTime] = useState<string>('08:00 AM');
  const [workEndTime, setWorkEndTime] = useState<string>('05:00 PM');

  // OT time
  const [otStartTime, setOtStartTime] = useState<string>('05:00 PM');
  const [otEndTime, setOtEndTime] = useState<string>('08:30 PM');
  const [otRatePerHour, setOtRatePerHour] = useState<number>(150);

  // Add Employee Modal
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpDesignation, setNewEmpDesignation] = useState('Operator');
  const [newEmpDept, setNewEmpDept] = useState('Sewing');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpSalary, setNewEmpSalary] = useState('14500');

  // Helper: calculate OT hours from otStartTime and otEndTime
  const otCalculations = useMemo(() => {
    if (attendanceStatus === 'Absent') {
      return { hours: 0, amount: 0 };
    }

    // Parse simple 12h or standard time
    const parseTimeToMinutes = (tStr: string): number => {
      if (!tStr) return 0;
      const clean = tStr.trim().toUpperCase();
      const isPM = clean.includes('PM');
      const isAM = clean.includes('AM');
      const parts = clean.replace(/AM|PM/g, '').trim().split(':');
      let h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      return h * 60 + m;
    };

    const startMin = parseTimeToMinutes(otStartTime);
    const endMin = parseTimeToMinutes(otEndTime);
    let diffMin = endMin - startMin;
    if (diffMin < 0) diffMin += 24 * 60; // overnight check

    const hours = Math.max(0, parseFloat((diffMin / 60).toFixed(1)));
    const amount = Math.round(hours * (otRatePerHour || 0));

    return { hours, amount };
  }, [otStartTime, otEndTime, otRatePerHour, attendanceStatus]);

  // Selected employee object
  const currentEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  // Save current form attendance
  const handleSaveFormAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmp) {
      onShowToast('দয়া করে একজন কর্মচারী নির্বাচন করুন', 'error');
      return;
    }

    const existing = attendance.find(
      (a) => a.employeeId === currentEmp.id && a.date === selectedDate
    );

    const newRecord: AttendanceRecord = {
      id: existing ? existing.id : generateId(),
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      date: selectedDate,
      status: attendanceStatus,
      inTime: entryTime,
      workStart: workStartTime,
      workEnd: workEndTime,
      otStart: otStartTime,
      otEnd: otEndTime,
      overtimeHours: otCalculations.hours,
      otRate: otRatePerHour,
      otAmount: otCalculations.amount,
    };

    onSaveAttendance(newRecord);
    onShowToast(`${currentEmp.name}-এর হাজিরা ও OT সফলভাবে সংরক্ষিত হয়েছে`, 'success');
  };

  // Add new employee
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) {
      onShowToast('কর্মচারীর নাম আবশ্যক', 'error');
      return;
    }
    const newEmp: EmployeeRecord = {
      id: generateId(),
      name: newEmpName.trim(),
      designation: newEmpDesignation,
      department: newEmpDept,
      phone: newEmpPhone.trim(),
      baseSalary: parseFloat(newEmpSalary) || 12000,
      joiningDate: todayStr,
      status: 'Active',
    };
    onSaveEmployee(newEmp);
    setSelectedEmpId(newEmp.id);
    onShowToast(`নতুন কর্মী '${newEmp.name}' যুক্ত করা হয়েছে`, 'success');
    setNewEmpName('');
    setIsEmpModalOpen(false);
  };

  // Quick mark status for today in table
  const handleQuickMark = (emp: EmployeeRecord, status: 'Present' | 'HalfDay' | 'Absent', ot: number = 0) => {
    const existing = attendance.find((a) => a.employeeId === emp.id && a.date === selectedDate);
    const rec: AttendanceRecord = {
      id: existing ? existing.id : generateId(),
      employeeId: emp.id,
      employeeName: emp.name,
      date: selectedDate,
      status,
      overtimeHours: ot,
      otRate: 150,
      otAmount: ot * 150,
    };
    onSaveAttendance(rec);
    onShowToast(`${emp.name} - ${status === 'Present' ? 'হাজির' : status === 'HalfDay' ? 'অর্ধদিবস' : 'অনুপস্থিত'} মার্ক করা হয়েছে`, 'success');
  };

  // Total payroll computation
  const totalPayroll = useMemo(() => {
    return employees.reduce((sum, e) => {
      const empAtt = attendance.filter((a) => a.employeeId === e.id);
      const totalOt = empAtt.reduce((otSum, a) => otSum + (a.overtimeHours || 0), 0);
      const hourlyRate = e.baseSalary / (26 * 8);
      const otPay = totalOt * (e.baseSalary > 0 ? hourlyRate * 1.5 : 150);
      return sum + e.baseSalary + otPay;
    }, 0);
  }, [employees, attendance]);

  return (
    <div id="attendance-salary-screen" className="space-y-4 max-w-3xl mx-auto">
      {/* 
        =======================================================
        SCREENSHOT BRANDED HEADER
        AKM APPARELS | Employee Attendance & Salary
        Date Badge: 17 Sep, 2026 / Thu
        =======================================================
      */}
      <div className="rounded-2xl bg-[#060e24]/95 border border-blue-500/30 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Coat Hanger / AKM Logo */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex flex-col items-center justify-center border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.35)] shrink-0">
            <svg
              className="w-5 h-5 text-white stroke-[2.2]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4a3 3 0 013 3c0 1.306-.835 2.418-2 2.83V11l6.5 4.5a2 2 0 01-1.16 3.5H4.66a2 2 0 01-1.16-3.5L10 11V9.83A3.001 3.001 0 0112 4z"
              />
            </svg>
            <span className="text-[7.5px] font-black text-cyan-200 tracking-wider">AKM</span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Employee Attendance & Salary</span>
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-blue-300 font-medium">
              <span>Production</span>
              <span className="text-slate-500">|</span>
              <span>Wash</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-300 font-bold">Attendance</span>
              <span className="text-slate-500">|</span>
              <span>Salary</span>
            </div>
          </div>
        </div>

        {/* Date Badge Pill */}
        <div className="flex items-center gap-2 bg-[#0a1638] border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-200 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <div className="text-right leading-tight">
            <div className="font-bold text-white">
              {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-[10px] text-blue-400 font-sans uppercase">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs for Easy Switching */}
      <div className="flex items-center gap-1.5 p-1 bg-[#050b1d] border border-blue-500/20 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('form')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'form'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>হাজিরা এন্ট্রি ফর্ম</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'history'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>আজকের হাজিরা ({attendance.filter((a) => a.date === selectedDate).length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('salary')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'salary'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>বেতন শীট (Payroll)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('employees')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'employees'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>কর্মী ({employees.length})</span>
        </button>
      </div>

      {/* 
        =======================================================
        VIEW 1: FORM MATCHING SCREENSHOT EXACTLY
        =======================================================
      */}
      {activeSubTab === 'form' && (
        <form onSubmit={handleSaveFormAttendance} className="space-y-3.5">
          {/* 
            CARD 1: কর্মচারীর তথ্য (Employee Info)
          */}
          <div className="rounded-2xl bg-[#061026] border border-blue-600/40 p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-4">
            {/* Header with circular user icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">কর্মচারীর তথ্য</h3>
              </div>

              <button
                type="button"
                onClick={() => setIsEmpModalOpen(true)}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30"
              >
                <Plus className="w-3 h-3" />
                <span>নতুন কর্মী যোগ</span>
              </button>
            </div>

            {/* Field: কর্মচারীর নাম * */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>কর্মচারীর নাম *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                  <User className="w-4 h-4" />
                </div>
                <select
                  id="employee-select"
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full bg-[#030919] border border-blue-500/40 rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-slate-900 text-white font-medium">
                      {emp.name} — {emp.designation} ({emp.department})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Two Column: তারিখ * | এন্ট্রি টাইম * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* তারিখ * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>তারিখ *</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#030919] border border-blue-500/40 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* এন্ট্রি টাইম * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>এন্ট্রি টাইম *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full bg-[#030919] border border-blue-500/40 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* হাজিরা * (Pills matching screenshot) */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>হাজিরা *</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* হাজির (Present) */}
                <button
                  type="button"
                  id="status-present-btn"
                  onClick={() => setAttendanceStatus('Present')}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                    attendanceStatus === 'Present'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-[#030919] border border-blue-500/30 text-slate-300 hover:text-white hover:border-blue-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${attendanceStatus === 'Present' ? 'bg-white text-emerald-600' : 'bg-slate-700 text-slate-300'}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>হাজির</span>
                </button>

                {/* অর্ধদিবস (HalfDay) */}
                <button
                  type="button"
                  id="status-halfday-btn"
                  onClick={() => setAttendanceStatus('HalfDay')}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                    attendanceStatus === 'HalfDay'
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                      : 'bg-[#030919] border border-blue-500/30 text-slate-300 hover:text-white hover:border-blue-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${attendanceStatus === 'HalfDay' ? 'bg-white text-amber-600' : 'bg-slate-700 text-slate-300'}`}>
                    <Clock3 className="w-3 h-3" />
                  </div>
                  <span>অর্ধদিবস</span>
                </button>

                {/* অনুপস্থিত (Absent) */}
                <button
                  type="button"
                  id="status-absent-btn"
                  onClick={() => setAttendanceStatus('Absent')}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                    attendanceStatus === 'Absent'
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : 'bg-[#030919] border border-blue-500/30 text-slate-300 hover:text-white hover:border-blue-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${attendanceStatus === 'Absent' ? 'bg-white text-rose-600' : 'bg-slate-700 text-slate-300'}`}>
                    <XCircle className="w-3 h-3" />
                  </div>
                  <span>অনুপস্থিত</span>
                </button>
              </div>
            </div>
          </div>

          {/* 
            CARD 2: নিয়মিত কাজের সময় (8:00 AM - 5:00 PM)
          */}
          <div className="rounded-2xl bg-[#061026] border border-blue-600/40 p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3.5">
            {/* Header with circular clock icon */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                নিয়মিত কাজের সময় <span className="text-xs text-blue-300 font-mono font-normal">(8:00 AM - 5:00 PM)</span>
              </h3>
            </div>

            {/* Two Column: কাজের শুরু * | কাজের শেষ * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* কাজের শুরু * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>কাজের শুরু *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full bg-[#030919] border border-blue-500/40 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* কাজের শেষ * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>কাজের শেষ *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full bg-[#030919] border border-blue-500/40 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 
            CARD 3: ওভারটাইম (OT) - 5 PM এর পর স্বয়ংক্রিয়ভাবে যোগ হবে
          */}
          <div className="rounded-2xl bg-[#061026] border border-purple-500/40 p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3.5">
            {/* Header with circular stopwatch icon */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  ওভারটাইম (OT)
                </h3>
                <p className="text-[11px] text-purple-300 font-medium">5 PM এর পর স্বয়ংক্রিয়ভাবে যোগ হবে</p>
              </div>
            </div>

            {/* Two Column: OT শুরু সময় | OT শেষ সময় */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* OT শুরু সময় */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>OT শুরু সময়</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={otStartTime}
                    onChange={(e) => setOtStartTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full bg-[#030919] border border-blue-500/40 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              {/* OT শেষ সময় */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>OT শেষ সময়</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={otEndTime}
                    onChange={(e) => setOtEndTime(e.target.value)}
                    placeholder="08:30 PM"
                    className="w-full bg-[#030919] border border-blue-500/40 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3 Metric Cards in Row (OT ঘণ্টা (অটো), OT রেট / ঘণ্টা *, OT পরিমাণ (অটো)) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {/* OT ঘণ্টা (অটো) */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#030818] border border-blue-500/30 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-300 font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">OT ঘণ্টা (অটো)</span>
                </div>
                <div className="text-sm sm:text-base font-black font-mono text-white">
                  {otCalculations.hours} ঘণ্টা
                </div>
              </div>

              {/* OT রেট / ঘণ্টা * */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#030818] border border-blue-500/30 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-300 font-semibold mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">OT রেট / ঘণ্টা *</span>
                </div>
                <div className="flex items-center text-sm sm:text-base font-black font-mono text-white">
                  <span className="text-amber-400 mr-1">৳</span>
                  <input
                    type="number"
                    value={otRatePerHour}
                    onChange={(e) => setOtRatePerHour(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono font-black text-white focus:outline-none focus:underline"
                  />
                </div>
              </div>

              {/* OT পরিমাণ (অটো) */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-950/60 to-indigo-950/70 border border-purple-400/40 flex flex-col justify-center shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-300 font-semibold mb-1">
                  <Coins className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                  <span className="truncate">OT পরিমাণ (অটো)</span>
                </div>
                <div className="text-sm sm:text-base font-black font-mono text-white flex items-center">
                  <span className="text-purple-300 mr-1">৳</span>
                  <span>{formatQty(otCalculations.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Save Attendance */}
          <button
            type="submit"
            id="save-attendance-btn"
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-[0.99] border border-cyan-400/40 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-200" />
            <span>হাজিরা ও OT সংরক্ষণ করুন (Save Attendance)</span>
          </button>
        </form>
      )}

      {/* 
        =======================================================
        VIEW 2: TODAY'S ATTENDANCE LIST
        =======================================================
      */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#061026] border border-blue-500/30 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">তারিখ নির্বাচন:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#030919] border border-blue-500/40 rounded-lg px-2.5 py-1 text-white font-mono"
              />
            </div>
            <span className="text-slate-400">মোট কর্মী: {employees.length} জন</span>
          </div>

          {employees.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-[#061026] border border-blue-500/20">
              কোনো কর্মী তালিকাভুক্ত নেই।
            </div>
          ) : (
            <div className="rounded-2xl bg-[#061026] border border-blue-500/30 divide-y divide-blue-500/15 overflow-hidden">
              {employees.map((emp) => {
                const dayAtt = attendance.find((a) => a.employeeId === emp.id && a.date === selectedDate);
                const currentStatus = dayAtt?.status;

                return (
                  <div key={emp.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{emp.name}</span>
                        {dayAtt && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-blue-950 border border-blue-500/30 text-blue-300">
                            {dayAtt.overtimeHours ? `${dayAtt.overtimeHours} hrs OT` : 'No OT'}
                          </span>
                        )}
                      </h5>
                      <p className="text-xs text-slate-400">
                        {emp.designation} | {emp.department}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickMark(emp, 'Present', 2)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-emerald-950/40 hover:text-white'
                        }`}
                      >
                        ✓ হাজির
                      </button>
                      <button
                        onClick={() => handleQuickMark(emp, 'HalfDay', 0)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          currentStatus === 'HalfDay'
                            ? 'bg-amber-600 border-yellow-400 text-white shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-amber-950/40 hover:text-white'
                        }`}
                      >
                        ◐ অর্ধদিবস
                      </button>
                      <button
                        onClick={() => handleQuickMark(emp, 'Absent', 0)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-rose-950/40 hover:text-white'
                        }`}
                      >
                        ✖ অনুপস্থিত
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 
        =======================================================
        VIEW 3: PAYROLL / SALARY SHEET
        =======================================================
      */}
      {activeSubTab === 'salary' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-950/90 border border-blue-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-300 font-semibold block">মোট আনুমানিক পে-রোল (Total Payroll)</span>
              <span className="text-2xl font-black text-white font-mono">
                ৳ {formatQty(Math.round(totalPayroll))}
              </span>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-blue-500/20">
              {employees.length} জন কর্মী
            </span>
          </div>

          <div className="rounded-2xl bg-[#061026] border border-blue-500/30 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#030919] text-slate-400 uppercase text-[10px] border-b border-blue-500/20">
                <tr>
                  <th className="p-3">কর্মী</th>
                  <th className="p-3">পদবী</th>
                  <th className="p-3 text-right">মূল বেতন</th>
                  <th className="p-3 text-center">উপস্থিত দিন</th>
                  <th className="p-3 text-center">OT ঘন্টা</th>
                  <th className="p-3 text-right">মোট প্রদেয়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10 font-mono">
                {employees.map((emp) => {
                  const empAtt = attendance.filter((a) => a.employeeId === emp.id);
                  const presentDays = empAtt.filter((a) => a.status === 'Present' || a.status === 'HalfDay').length;
                  const otHoursTotal = empAtt.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
                  const hourlyRate = emp.baseSalary / (26 * 8);
                  const otAmount = otHoursTotal * (hourlyRate > 0 ? hourlyRate * 1.5 : 150);
                  const netPayable = emp.baseSalary + otAmount;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-sans font-bold text-white">{emp.name}</td>
                      <td className="p-3 font-sans text-slate-400">{emp.designation}</td>
                      <td className="p-3 text-right text-slate-300">৳ {formatQty(emp.baseSalary)}</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">{presentDays}</td>
                      <td className="p-3 text-center text-cyan-300">{otHoursTotal} hrs</td>
                      <td className="p-3 text-right font-black text-cyan-300 text-sm">৳ {formatQty(Math.round(netPayable))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 
        =======================================================
        VIEW 4: EMPLOYEE DIRECTORY
        =======================================================
      */}
      {activeSubTab === 'employees' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setIsEmpModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কর্মী যোগ করুন</span>
            </button>
          </div>

          <div className="rounded-2xl bg-[#061026] border border-blue-500/30 divide-y divide-blue-500/15">
            {employees.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">কোনো কর্মী তালিকাভুক্ত নেই।</div>
            ) : (
              employees.map((emp) => (
                <div key={emp.id} className="p-3.5 flex items-center justify-between hover:bg-slate-800/30">
                  <div>
                    <h5 className="text-sm font-bold text-white">{emp.name}</h5>
                    <p className="text-xs text-slate-400">
                      {emp.designation} | {emp.department} | ফোন: {emp.phone || 'N/A'}
                    </p>
                    <span className="text-xs font-mono text-emerald-400 font-bold">বেতন: ৳ {formatQty(emp.baseSalary)}</span>
                  </div>
                  <button
                    onClick={() => onDeleteEmployee(emp.id)}
                    className="p-2 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/30"
                    title="কর্মী মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 
        =======================================================
        MODAL: ADD NEW EMPLOYEE
        =======================================================
      */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreateEmployee}
            className="w-full max-w-sm rounded-2xl bg-[#070e24] border border-blue-500/40 p-5 space-y-3.5 shadow-2xl animate-scaleUp text-white"
          >
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>নতুন কর্মী যুক্ত করুন</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEmpModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">নাম *</label>
              <input
                type="text"
                value={newEmpName}
                onChange={(e) => setNewEmpName(e.target.value)}
                placeholder="যেমন: মাহাবুব"
                className="w-full bg-[#030919] border border-blue-500/30 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">পদবী</label>
                <input
                  type="text"
                  value={newEmpDesignation}
                  onChange={(e) => setNewEmpDesignation(e.target.value)}
                  placeholder="Operator"
                  className="w-full bg-[#030919] border border-blue-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">শাখা / Dept</label>
                <input
                  type="text"
                  value={newEmpDept}
                  onChange={(e) => setNewEmpDept(e.target.value)}
                  placeholder="Sewing"
                  className="w-full bg-[#030919] border border-blue-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">ফোন নম্বর</label>
                <input
                  type="text"
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
                  placeholder="017..."
                  className="w-full bg-[#030919] border border-blue-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">মাসিক বেতন (৳)</label>
                <input
                  type="number"
                  value={newEmpSalary}
                  onChange={(e) => setNewEmpSalary(e.target.value)}
                  placeholder="15000"
                  className="w-full bg-[#030919] border border-blue-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEmpModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
              >
                যুক্ত করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
