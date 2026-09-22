/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Waves,
  Scale,
  Scissors,
  Users,
  Settings as SettingsIcon,
  Home,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Menu,
  X,
  Building,
  Calendar,
} from 'lucide-react';
import {
  GarmentInputRecord,
  GarmentWashRecord,
  FilterState,
  ActiveTab,
  EmployeeRecord,
  AttendanceRecord,
  ProductionRecord,
} from './types';
import {
  loadGarmentInputs,
  saveGarmentInputs,
  loadGarmentWashRecords,
  saveGarmentWashRecords,
  loadEmployees,
  saveEmployees,
  loadAttendance,
  saveAttendance,
  loadProduction,
  saveProduction,
  generateId,
  getInitialInputs,
  getInitialWashRecords,
  INITIAL_EMPLOYEES,
  getInitialAttendance,
  getInitialProduction,
} from './utils/storage';
import { InputWashSummary } from './components/InputWashSummary';
import { SearchFilterPanel } from './components/SearchFilterPanel';
import { GarmentsInputSection } from './components/GarmentsInputSection';
import { GarmentsWashSection } from './components/GarmentsWashSection';
import { CombinedBalanceView } from './components/CombinedBalanceView';
import { ProductionSection } from './components/ProductionSection';
import { AttendanceSalarySection } from './components/AttendanceSalarySection';
import { SettingsSection } from './components/SettingsSection';
import { NavigationDrawer } from './components/NavigationDrawer';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persistent State
  const [inputs, setInputs] = useState<GarmentInputRecord[]>(() => loadGarmentInputs());
  const [washRecords, setWashRecords] = useState<GarmentWashRecord[]>(() => loadGarmentWashRecords());
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => loadEmployees());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadAttendance());
  const [production, setProduction] = useState<ProductionRecord[]>(() => loadProduction());

  // Cross-tab and mobile localStorage synchronization listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === 'garment_inputs') setInputs(loadGarmentInputs());
      if (e.key === 'garment_wash_records') setWashRecords(loadGarmentWashRecords());
      if (e.key === 'garment_employees') setEmployees(loadEmployees());
      if (e.key === 'garment_attendance') setAttendance(loadAttendance());
      if (e.key === 'garment_production') setProduction(loadProduction());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Search & Filter State
  const initialFilters: FilterState = {
    buyer: '',
    item: '',
    size: '',
    style: '',
    color: '',
    level: '',
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
  };
  const [filterState, setFilterState] = useState<FilterState>(initialFilters);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  };

  // Sync with LocalStorage
  useEffect(() => {
    saveGarmentInputs(inputs);
  }, [inputs]);

  useEffect(() => {
    saveGarmentWashRecords(washRecords);
  }, [washRecords]);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    saveProduction(production);
  }, [production]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.buyer) count++;
    if (filterState.item) count++;
    if (filterState.size) count++;
    if (filterState.style) count++;
    if (filterState.color) count++;
    if (filterState.level) count++;
    if (filterState.searchQuery.trim()) count++;
    return count;
  }, [filterState]);

  const handleClearFilters = () => {
    setFilterState(initialFilters);
    showToast('সব ফিল্টার রিসেট করা হয়েছে', 'info');
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  // Filtered Records & Calculation Engine
  const { filteredInputs, filteredWashRecords, totalFilteredInputQty, totalFilteredWashQty, totalAllInputQty, totalAllWashQty } =
    useMemo(() => {
      const q = filterState.searchQuery.trim().toLowerCase();
      const bFilter = filterState.buyer.trim().toLowerCase();
      const itFilter = filterState.item.trim().toLowerCase();
      const szFilter = filterState.size.trim().toLowerCase();
      const stFilter = filterState.style.trim().toLowerCase();
      const clFilter = filterState.color.trim().toLowerCase();
      const lvFilter = filterState.level.trim().toLowerCase();

      // Filter Inputs
      const matchedInputs = inputs.filter((inp) => {
        if (bFilter && inp.buyer.toLowerCase() !== bFilter) return false;
        if (itFilter && inp.item.toLowerCase() !== itFilter) return false;
        if (szFilter && inp.size.toLowerCase() !== szFilter) return false;
        if (stFilter && inp.style.toLowerCase() !== stFilter) return false;
        if (clFilter && inp.color.toLowerCase() !== clFilter) return false;
        if (lvFilter && inp.level.toLowerCase() !== lvFilter) return false;

        if (q) {
          const combinedStr = `${inp.buyer} ${inp.style} ${inp.item} ${inp.color} ${inp.size} ${inp.level} ${inp.date}`.toLowerCase();
          if (!combinedStr.includes(q)) return false;
        }
        return true;
      });

      // Filter Wash Records
      const matchedWash = washRecords.filter((w) => {
        // If buyer filter is set and wash record has buyer info, check it
        if (bFilter) {
          if (!w.buyer || w.buyer.toLowerCase() !== bFilter) return false;
        }
        if (itFilter) {
          if (!w.item || w.item.toLowerCase() !== itFilter) return false;
        }
        if (szFilter) {
          if (!w.size || w.size.toLowerCase() !== szFilter) return false;
        }
        if (stFilter) {
          if (!w.style || w.style.toLowerCase() !== stFilter) return false;
        }
        if (clFilter) {
          if (!w.color || w.color.toLowerCase() !== clFilter) return false;
        }
        if (lvFilter) {
          if (!w.level || w.level.toLowerCase() !== lvFilter) return false;
        }

        if (q) {
          const combinedStr = `${w.washCompany} ${w.washType} ${w.buyer || ''} ${w.style || ''} ${w.item || ''} ${w.chalanNo || ''} ${w.date}`.toLowerCase();
          if (!combinedStr.includes(q)) return false;
        }
        return true;
      });

      const sumIn = matchedInputs.reduce((acc, curr) => acc + curr.quantity, 0);
      const sumWash = matchedWash.reduce((acc, curr) => acc + curr.quantity, 0);

      const allIn = inputs.reduce((acc, curr) => acc + curr.quantity, 0);
      const allWash = washRecords.reduce((acc, curr) => acc + curr.quantity, 0);

      return {
        filteredInputs: matchedInputs,
        filteredWashRecords: matchedWash,
        totalFilteredInputQty: sumIn,
        totalFilteredWashQty: sumWash,
        totalAllInputQty: allIn,
        totalAllWashQty: allWash,
      };
    }, [inputs, washRecords, filterState]);

  // Input Handlers
  const handleSaveInput = (record: GarmentInputRecord) => {
    setInputs((prev) => {
      const next = [record, ...prev];
      saveGarmentInputs(next);
      return next;
    });
    showToast('Input রেকর্ড লোকাল স্টোরেজে সফলভাবে সেভ হয়েছে!', 'success');
  };

  const handleUpdateInput = (record: GarmentInputRecord) => {
    setInputs((prev) => {
      const next = prev.map((item) => (item.id === record.id ? record : item));
      saveGarmentInputs(next);
      return next;
    });
    showToast('Input আপডেট লোকাল স্টোরেজে সংরক্ষিত হয়েছে!', 'success');
  };

  const handleDeleteInput = (id: string) => {
    setInputs((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveGarmentInputs(next);
      return next;
    });
    showToast('Input রেকর্ড মুছে ফেলা হয়েছে', 'info');
  };

  // Wash Handlers
  const handleSaveWash = (record: GarmentWashRecord) => {
    setWashRecords((prev) => {
      const next = [record, ...prev];
      saveGarmentWashRecords(next);
      return next;
    });
    showToast('Wash রেকর্ড লোকাল স্টোরেজে সফলভাবে সেভ হয়েছে!', 'success');
  };

  const handleUpdateWash = (record: GarmentWashRecord) => {
    setWashRecords((prev) => {
      const next = prev.map((item) => (item.id === record.id ? record : item));
      saveGarmentWashRecords(next);
      return next;
    });
    showToast('Wash আপডেট লোকাল স্টোরেজে সংরক্ষিত হয়েছে!', 'success');
  };

  const handleDeleteWash = (id: string) => {
    setWashRecords((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveGarmentWashRecords(next);
      return next;
    });
    showToast('Wash রেকর্ড মুছে ফেলা হয়েছে', 'info');
  };

  // Production Handlers
  const handleSaveProduction = (rec: ProductionRecord) => {
    setProduction((prev) => {
      const next = [rec, ...prev];
      saveProduction(next);
      return next;
    });
    showToast('প্রোডাকশন রেকর্ড লোকাল স্টোরেজে সেভ হয়েছে!', 'success');
  };

  const handleDeleteProduction = (id: string) => {
    setProduction((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveProduction(next);
      return next;
    });
    showToast('প্রোডাকশন রেকর্ড মুছে ফেলা হয়েছে', 'info');
  };

  // Attendance & Employee Handlers
  const handleSaveEmployee = (emp: EmployeeRecord) => {
    setEmployees((prev) => {
      const next = [emp, ...prev];
      saveEmployees(next);
      return next;
    });
    showToast('কর্মচারীর তথ্য লোকাল স্টোরেজে সেভ হয়েছে!', 'success');
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEmployees(next);
      return next;
    });
    setAttendance((prev) => {
      const next = prev.filter((a) => a.employeeId !== id);
      saveAttendance(next);
      return next;
    });
    showToast('কর্মচারী মুছে ফেলা হয়েছে', 'info');
  };

  const handleSaveAttendance = (att: AttendanceRecord) => {
    setAttendance((prev) => {
      const idx = prev.findIndex((a) => a.id === att.id);
      let next: AttendanceRecord[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = att;
      } else {
        next = [att, ...prev];
      }
      saveAttendance(next);
      return next;
    });
    showToast('হাজিরা ও ওভারটাইম ডাটা লোকাল স্টোরেজে সংরক্ষিত হয়েছে!', 'success');
  };

  // Sample Data Loader (For testing on mobile & localhost)
  const handleLoadSampleData = () => {
    const sampleInputs = getInitialInputs();
    const sampleWash = getInitialWashRecords();
    const sampleEmployees = INITIAL_EMPLOYEES;
    const sampleAttendance = getInitialAttendance();
    const sampleProduction = getInitialProduction();

    setInputs(sampleInputs);
    setWashRecords(sampleWash);
    setEmployees(sampleEmployees);
    setAttendance(sampleAttendance);
    setProduction(sampleProduction);

    saveGarmentInputs(sampleInputs);
    saveGarmentWashRecords(sampleWash);
    saveEmployees(sampleEmployees);
    saveAttendance(sampleAttendance);
    saveProduction(sampleProduction);

    showToast('বাস্তবসম্মত গার্মেন্টস ডাটা লোকালহোস্টে লোড ও সেভ হয়েছে!', 'success');
  };

  const handleClearAllData = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত Input, Wash, Salary এবং Production ডাটা মুছে ফেলতে চান?')) {
      setInputs([]);
      setWashRecords([]);
      setEmployees([]);
      setAttendance([]);
      setProduction([]);
      saveGarmentInputs([]);
      saveGarmentWashRecords([]);
      saveEmployees([]);
      saveAttendance([]);
      saveProduction([]);
      showToast('সমস্ত লোকাল ডাটা মুছে ফেলা হয়েছে', 'info');
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 
        =======================================================
        FIXED TOP APP BAR / HEADER
        Dark navy glassmorphism with blue glowing border
        =======================================================
      */}
      <header className="shrink-0 z-30 bg-[#060c18]/90 backdrop-blur-2xl border-b border-blue-500/25 px-3 sm:px-6 py-2 shadow-lg shadow-blue-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Menu Trigger Button & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prominent All Features Menu Button */}
            <button
              id="open-navigation-menu-btn"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/20 hover:from-blue-600/40 hover:to-indigo-600/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all active:scale-95 cursor-pointer"
              title="সমস্ত ফিচার মেনু খুলুন (Open All Features Menu)"
            >
              <Menu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">মেনু</span>
            </button>

            {/* AKM Logo & Title */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex flex-col items-center justify-center border border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.3)] shrink-0">
                <svg
                  className="w-4 h-4 text-white stroke-[2.2]"
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
                <span className="text-[6.5px] font-black text-cyan-200 tracking-tighter">AKM</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-base font-black text-white tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    AKM APPARELS
                  </h1>
                  <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-900/40 text-cyan-300 border border-cyan-400/30 font-mono uppercase tracking-wider">
                    ERP 2026
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-blue-300 font-medium truncate max-w-[140px] sm:max-w-none">
                    Production | Wash | Attendance | Salary
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 border border-blue-500/25 rounded-xl p-1 text-xs shadow-inner backdrop-blur-md">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>সারসংক্ষেপ</span>
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'input'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>Input হিসাব</span>
            </button>
            <button
              onClick={() => setActiveTab('wash')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'wash'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-purple-400" />
              <span>Wash হিসাব</span>
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'balance'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>ব্যালেন্স</span>
            </button>
            <button
              onClick={() => setActiveTab('production')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'production'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-cyan-400" />
              <span>Production</span>
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'salary'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>বেতন ও হাজিরা</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-blue-600 to-slate-700 text-white shadow-md shadow-blue-600/30 border border-blue-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>সেটিংস</span>
            </button>
          </nav>

          {/* Quick Header Metric Badge & Date */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* LocalStorage Data Saved Indicator */}
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              title="সমস্ত ডাটা মোবাইল ও লোকালহোস্ট লোকাল স্টোরেজে নিরাপদে সংরক্ষিত রয়েছে"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 font-mono hidden xs:inline">DATA SAVED</span>
            </div>

            {/* Date Pill (Matching Screenshot) */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#091432] border border-blue-500/30 text-xs text-cyan-300 font-mono">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-blue-500/30 text-xs shadow-inner">
              <span className="text-[10px] text-slate-400 font-medium">ব্যালেন্স বাকি:</span>
              <span
                className={`font-mono font-black text-xs sm:text-sm ${
                  totalFilteredInputQty - totalFilteredWashQty < 0
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {totalFilteredInputQty - totalFilteredWashQty}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">PCS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Drawer for All Features */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        totalInputQty={totalFilteredInputQty}
        totalWashQty={totalFilteredWashQty}
        balanceQty={totalFilteredInputQty - totalFilteredWashQty}
        employeeCount={employees.length}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-200 pointer-events-none w-11/12 max-w-sm">
          <div
            className={`px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-xl border ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/30'
                : toast.type === 'info'
                ? 'bg-blue-950/90 text-blue-200 border-blue-500/40 shadow-blue-900/30'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 
        =======================================================
        SCROLLABLE CONTENT AREA
        Smooth native momentum scrolling for sections
        =======================================================
      */}
      <div className="flex-1 overflow-y-auto overscroll-contain relative focus:outline-none">
        <main className="max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 pb-24 md:pb-10 space-y-4">
          {/*
            =======================================================
            1. OVERVIEW / HOME VIEW (Exact Mobile-First Requested Flow):
               Summary ↓ Search & Filter ↓ Input হিসাব ↓ Wash হিসাব ↓ Balance
            =======================================================
          */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* 5. MAIN SUMMARY (হিসাব) Card */}
              <InputWashSummary
                totalInputQty={totalFilteredInputQty}
                totalWashQty={totalFilteredWashQty}
                filterState={filterState}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />

              {/* 6. SEARCH & FILTER PANEL */}
              <SearchFilterPanel
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                inputs={inputs}
                washRecords={washRecords}
                activeFilterCount={activeFilterCount}
              />

              {/* Input & Wash Dual Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Input Section */}
                <div>
                  <GarmentsInputSection
                    records={inputs}
                    filteredRecords={filteredInputs}
                    onSaveRecord={handleSaveInput}
                    onUpdateRecord={handleUpdateInput}
                    onDeleteRecord={handleDeleteInput}
                    totalFilteredInputQty={totalFilteredInputQty}
                    totalAllInputQty={totalAllInputQty}
                    isFilterActive={activeFilterCount > 0}
                    onShowToast={showToast}
                  />
                </div>

                {/* Wash Section */}
                <div>
                  <GarmentsWashSection
                    records={washRecords}
                    filteredRecords={filteredWashRecords}
                    inputRecords={inputs}
                    onSaveRecord={handleSaveWash}
                    onUpdateRecord={handleUpdateWash}
                    onDeleteRecord={handleDeleteWash}
                    totalFilteredWashQty={totalFilteredWashQty}
                    totalAllWashQty={totalAllWashQty}
                    isFilterActive={activeFilterCount > 0}
                    onShowToast={showToast}
                  />
                </div>
              </div>

              {/* Style-wise Balance Breakdown */}
              <div className="pt-1">
                <CombinedBalanceView
                  inputs={filteredInputs}
                  washRecords={filteredWashRecords}
                  totalInputQty={totalFilteredInputQty}
                  totalWashQty={totalFilteredWashQty}
                />
              </div>
            </div>
          )}

          {/* 2. DEDICATED INPUT TAB */}
          {activeTab === 'input' && (
            <div className="space-y-4">
              <InputWashSummary
                totalInputQty={totalFilteredInputQty}
                totalWashQty={totalFilteredWashQty}
                filterState={filterState}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />

              <SearchFilterPanel
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                inputs={inputs}
                washRecords={washRecords}
                activeFilterCount={activeFilterCount}
              />

              <GarmentsInputSection
                records={inputs}
                filteredRecords={filteredInputs}
                onSaveRecord={handleSaveInput}
                onUpdateRecord={handleUpdateInput}
                onDeleteRecord={handleDeleteInput}
                totalFilteredInputQty={totalFilteredInputQty}
                totalAllInputQty={totalAllInputQty}
                isFilterActive={activeFilterCount > 0}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* 3. DEDICATED WASH TAB */}
          {activeTab === 'wash' && (
            <div className="space-y-4">
              <InputWashSummary
                totalInputQty={totalFilteredInputQty}
                totalWashQty={totalFilteredWashQty}
                filterState={filterState}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />

              <SearchFilterPanel
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                inputs={inputs}
                washRecords={washRecords}
                activeFilterCount={activeFilterCount}
              />

              <GarmentsWashSection
                records={washRecords}
                filteredRecords={filteredWashRecords}
                inputRecords={inputs}
                onSaveRecord={handleSaveWash}
                onUpdateRecord={handleUpdateWash}
                onDeleteRecord={handleDeleteWash}
                totalFilteredWashQty={totalFilteredWashQty}
                totalAllWashQty={totalAllWashQty}
                isFilterActive={activeFilterCount > 0}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* 4. DEDICATED BALANCE TAB */}
          {activeTab === 'balance' && (
            <div className="space-y-4">
              <InputWashSummary
                totalInputQty={totalFilteredInputQty}
                totalWashQty={totalFilteredWashQty}
                filterState={filterState}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />

              <SearchFilterPanel
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                inputs={inputs}
                washRecords={washRecords}
                activeFilterCount={activeFilterCount}
              />

              <CombinedBalanceView
                inputs={filteredInputs}
                washRecords={filteredWashRecords}
                totalInputQty={totalFilteredInputQty}
                totalWashQty={totalFilteredWashQty}
              />
            </div>
          )}

          {/* 5. PRODUCTION TAB */}
          {activeTab === 'production' && (
            <ProductionSection
              records={production}
              onSaveRecord={handleSaveProduction}
              onDeleteRecord={handleDeleteProduction}
              onShowToast={showToast}
            />
          )}

          {/* 6. SALARY & ATTENDANCE TAB */}
          {activeTab === 'salary' && (
            <AttendanceSalarySection
              employees={employees}
              attendance={attendance}
              onSaveEmployee={handleSaveEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onSaveAttendance={handleSaveAttendance}
              onShowToast={showToast}
            />
          )}

          {/* 7. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <SettingsSection
              inputs={inputs}
              washRecords={washRecords}
              onLoadSampleData={handleLoadSampleData}
              onClearAllData={handleClearAllData}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/*
        =======================================================
        FIXED MOBILE BOTTOM NAVIGATION BAR
        Premium neon blue glowing active state, touch-optimized (min 44px)
        Safe-area padding for modern mobile browsers
        =======================================================
      */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#050a16]/95 backdrop-blur-3xl border-t border-blue-500/25 px-1 pt-1 pb-[max(0.55rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
      >
        <div className="grid grid-cols-7 items-center gap-0.5 max-w-lg mx-auto">
          {/* Home / Overview */}
          <button
            id="nav-overview-btn"
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'overview'
                ? 'text-cyan-300 font-bold bg-gradient-to-t from-cyan-600/25 to-blue-500/5 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'overview' ? 'scale-110 text-cyan-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">হোম</span>
            {activeTab === 'overview' && (
              <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#22d3ee]"></span>
            )}
          </button>

          {/* Input */}
          <button
            id="nav-input-btn"
            onClick={() => setActiveTab('input')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'input'
                ? 'text-blue-300 font-bold bg-gradient-to-t from-blue-600/25 to-blue-500/5 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'input' ? 'scale-110 text-blue-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">ইনপুট</span>
            {activeTab === 'input' && (
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1 shadow-[0_0_6px_#60a5fa]"></span>
            )}
          </button>

          {/* Wash */}
          <button
            id="nav-wash-btn"
            onClick={() => setActiveTab('wash')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'wash'
                ? 'text-purple-300 font-bold bg-gradient-to-t from-purple-600/25 to-purple-500/5 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Waves className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'wash' ? 'scale-110 text-purple-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">ওয়াশ</span>
            {activeTab === 'wash' && (
              <span className="w-1 h-1 rounded-full bg-purple-400 mt-1 shadow-[0_0_6px_#c084fc]"></span>
            )}
          </button>

          {/* Balance */}
          <button
            id="nav-balance-btn"
            onClick={() => setActiveTab('balance')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'balance'
                ? 'text-emerald-300 font-bold bg-gradient-to-t from-emerald-600/25 to-emerald-500/5 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'balance' ? 'scale-110 text-emerald-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">ব্যালেন্স</span>
            {activeTab === 'balance' && (
              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1 shadow-[0_0_6px_#34d399]"></span>
            )}
          </button>

          {/* Production */}
          <button
            id="nav-production-btn"
            onClick={() => setActiveTab('production')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'production'
                ? 'text-cyan-300 font-bold bg-gradient-to-t from-cyan-600/25 to-cyan-500/5 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'production' ? 'scale-110 text-cyan-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">উৎপাদন</span>
            {activeTab === 'production' && (
              <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#22d3ee]"></span>
            )}
          </button>

          {/* Salary & Attendance */}
          <button
            id="nav-salary-btn"
            onClick={() => setActiveTab('salary')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'salary'
                ? 'text-indigo-300 font-bold bg-gradient-to-t from-indigo-600/25 to-indigo-500/5 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'salary' ? 'scale-110 text-indigo-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">বেতন</span>
            {activeTab === 'salary' && (
              <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1 shadow-[0_0_6px_#818cf8]"></span>
            )}
          </button>

          {/* Settings */}
          <button
            id="nav-settings-btn"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'settings'
                ? 'text-blue-300 font-bold bg-gradient-to-t from-blue-600/25 to-blue-500/5 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className={`w-4 h-4 mb-0.5 transition-transform ${activeTab === 'settings' ? 'scale-110 text-blue-300' : 'text-slate-400'}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">সেটিংস</span>
            {activeTab === 'settings' && (
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1 shadow-[0_0_6px_#60a5fa]"></span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
