import React, { useRef } from 'react';
import {
  Download,
  Upload,
  Database,
  Trash2,
  Sparkles,
  Building,
  FileSpreadsheet,
  FileText,
  Table,
  CheckCircle,
  Package,
  Waves,
  Scale,
  HardDrive,
  Clock,
} from 'lucide-react';
import { GarmentInputRecord, GarmentWashRecord } from '../types';
import { getStorageStats } from '../utils/storage';

interface SettingsSectionProps {
  inputs?: GarmentInputRecord[];
  washRecords?: GarmentWashRecord[];
  onLoadSampleData: () => void;
  onClearAllData: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  inputs = [],
  washRecords = [],
  onLoadSampleData,
  onClearAllData,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function to safely escape and trigger CSV file download with UTF-8 BOM
  const triggerCSVDownload = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (cell: string | number | undefined | null) => {
      if (cell === undefined || cell === null) return '""';
      const str = String(cell).replace(/"/g, '""');
      return `"${str}"`;
    };

    // \uFEFF is the UTF-8 Byte Order Mark (BOM), ensuring Excel renders Bengali and unicode perfectly
    const csvContent =
      '\uFEFF' +
      headers.map(escapeCell).join(',') +
      '\n' +
      rows.map((row) => row.map(escapeCell).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Export Input Records to CSV
  const handleExportInputCSV = () => {
    // Fallback to local storage if prop is empty
    const records: GarmentInputRecord[] =
      inputs.length > 0
        ? inputs
        : localStorage.getItem('garment_inputs')
        ? JSON.parse(localStorage.getItem('garment_inputs')!)
        : [];

    if (records.length === 0) {
      onShowToast('এক্সপোর্ট করার মতো কোনো Input ডাটা পাওয়া যায়নি', 'error');
      return;
    }

    const headers = [
      'তারিখ (Date)',
      'বায়ার (Buyer)',
      'আইটেম (Item)',
      'সাইজ (Size)',
      'স্টাইল (Style)',
      'কালার (Color)',
      'কাজের ধাপ (Level)',
      'পরিমাণ (Input Qty)',
      'মন্তব্য (Notes)',
      'রেকর্ড আইডি (ID)',
    ];

    const rows = records.map((item) => [
      item.date || '',
      item.buyer || '',
      item.item || '',
      item.size || '',
      item.style || '',
      item.color || '',
      item.level || '',
      item.quantity || 0,
      item.notes || '',
      item.id || '',
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    triggerCSVDownload(`garments_inputs_${dateStr}.csv`, headers, rows);
    onShowToast(`সফলভাবে ${records.length} টি Input রেকর্ড CSV ডাউনলোড হয়েছে`, 'success');
  };

  // 2. Export Wash Records to CSV
  const handleExportWashCSV = () => {
    const records: GarmentWashRecord[] =
      washRecords.length > 0
        ? washRecords
        : localStorage.getItem('garment_wash_records')
        ? JSON.parse(localStorage.getItem('garment_wash_records')!)
        : [];

    if (records.length === 0) {
      onShowToast('এক্সপোর্ট করার মতো কোনো Wash ডাটা পাওয়া যায়নি', 'error');
      return;
    }

    const headers = [
      'তারিখ (Date)',
      'ওয়াশিং কোম্পানি (Wash Plant)',
      'ওয়াশের ধরণ (Wash Type)',
      'পরিমাণ (Wash Qty)',
      'চালান নং (Chalan No)',
      'বায়ার (Buyer)',
      'স্টাইল (Style)',
      'আইটেম (Item)',
      'কালার (Color)',
      'সাইজ (Size)',
      'রেকর্ড আইডি (ID)',
    ];

    const rows = records.map((item) => [
      item.date || '',
      item.washCompany || '',
      item.washType || '',
      item.quantity || 0,
      item.chalanNo || '',
      item.buyer || '',
      item.style || '',
      item.item || '',
      item.color || '',
      item.size || '',
      item.id || '',
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    triggerCSVDownload(`garments_wash_${dateStr}.csv`, headers, rows);
    onShowToast(`সফলভাবে ${records.length} টি Wash রেকর্ড CSV ডাউনলোড হয়েছে`, 'success');
  };

  // 3. Export Combined Balance Summary CSV
  const handleExportCombinedCSV = () => {
    const inputList: GarmentInputRecord[] =
      inputs.length > 0
        ? inputs
        : localStorage.getItem('garment_inputs')
        ? JSON.parse(localStorage.getItem('garment_inputs')!)
        : [];

    const washList: GarmentWashRecord[] =
      washRecords.length > 0
        ? washRecords
        : localStorage.getItem('garment_wash_records')
        ? JSON.parse(localStorage.getItem('garment_wash_records')!)
        : [];

    if (inputList.length === 0 && washList.length === 0) {
      onShowToast('এক্সপোর্ট করার মতো কোনো রেকর্ড নেই', 'error');
      return;
    }

    // Group by style
    const styleMap = new Map<
      string,
      {
        style: string;
        buyer: string;
        item: string;
        inputQty: number;
        washQty: number;
      }
    >();

    inputList.forEach((inp) => {
      const key = inp.style || 'Unspecified';
      const existing = styleMap.get(key) || {
        style: key,
        buyer: inp.buyer || '-',
        item: inp.item || '-',
        inputQty: 0,
        washQty: 0,
      };
      existing.inputQty += inp.quantity;
      if (existing.buyer === '-' && inp.buyer) existing.buyer = inp.buyer;
      if (existing.item === '-' && inp.item) existing.item = inp.item;
      styleMap.set(key, existing);
    });

    washList.forEach((w) => {
      const key = w.style || 'Unspecified';
      const existing = styleMap.get(key) || {
        style: key,
        buyer: w.buyer || '-',
        item: w.item || '-',
        inputQty: 0,
        washQty: 0,
      };
      existing.washQty += w.quantity;
      if (existing.buyer === '-' && w.buyer) existing.buyer = w.buyer;
      if (existing.item === '-' && w.item) existing.item = w.item;
      styleMap.set(key, existing);
    });

    const headers = [
      'স্টাইল নম্বর (Style)',
      'বায়ার (Buyer)',
      'আইটেম (Item)',
      'মোট ইনপুট (Total Input Qty)',
      'মোট ওয়াশ (Total Wash Qty)',
      'বাকি ব্যালেন্স (Remaining Balance)',
      'স্ট্যাটাস (Status)',
    ];

    const rows = Array.from(styleMap.values()).map((row) => {
      const balance = row.inputQty - row.washQty;
      let status = 'ব্যালেন্সড (Balanced)';
      if (balance > 0) status = 'ওয়াশ বাকি (Pending Wash)';
      else if (balance < 0) status = 'অতিরিক্ত ওয়াশ (Over-wash)';

      return [
        row.style,
        row.buyer,
        row.item,
        row.inputQty,
        row.washQty,
        balance,
        status,
      ];
    });

    const dateStr = new Date().toISOString().split('T')[0];
    triggerCSVDownload(`garments_input_wash_balance_report_${dateStr}.csv`, headers, rows);
    onShowToast('স্টাইল অনুযায়ী সমন্বিত ব্যালেন্স রিপোর্ট CSV ডাউনলোড হয়েছে', 'success');
  };

  // Full JSON System Backup
  const handleExportAll = () => {
    const backupData = {
      version: '2.4',
      exportedAt: new Date().toISOString(),
      inputs: localStorage.getItem('garment_inputs') ? JSON.parse(localStorage.getItem('garment_inputs')!) : [],
      wash: localStorage.getItem('garment_wash_records') ? JSON.parse(localStorage.getItem('garment_wash_records')!) : [],
      employees: localStorage.getItem('garment_employees') ? JSON.parse(localStorage.getItem('garment_employees')!) : [],
      attendance: localStorage.getItem('garment_attendance') ? JSON.parse(localStorage.getItem('garment_attendance')!) : [],
      production: localStorage.getItem('garment_production') ? JSON.parse(localStorage.getItem('garment_production')!) : [],
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `garments_system_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    onShowToast('সম্পূর্ণ সিস্টেম ব্যাকআপ JSON ডাউনলোড হয়েছে', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.inputs) localStorage.setItem('garment_inputs', JSON.stringify(json.inputs));
        if (json.wash) localStorage.setItem('garment_wash_records', JSON.stringify(json.wash));
        if (json.employees) localStorage.setItem('garment_employees', JSON.stringify(json.employees));
        if (json.attendance) localStorage.setItem('garment_attendance', JSON.stringify(json.attendance));
        if (json.production) localStorage.setItem('garment_production', JSON.stringify(json.production));
        onShowToast('ডাটা সফলভাবে রিস্টোর হয়েছে! পেজ রিফ্রেশ করুন।', 'success');
        setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        onShowToast('ভুল ফাইল ফরম্যাট। সঠিক ব্যাকআপ JSON ফাইল দিন।', 'error');
      }
    };
    reader.readAsText(file);
  };

  const actualInputCount = inputs.length || (localStorage.getItem('garment_inputs') ? JSON.parse(localStorage.getItem('garment_inputs')!).length : 0);
  const actualWashCount = washRecords.length || (localStorage.getItem('garment_wash_records') ? JSON.parse(localStorage.getItem('garment_wash_records')!).length : 0);
  const stats = getStorageStats();

  return (
    <div id="settings-section" className="space-y-4 max-w-4xl mx-auto">
      {/* 
        =======================================================
        0. LOCALHOST & MOBILE STORAGE STATUS (Live Health)
        =======================================================
      */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091432]/90 border border-emerald-500/35 backdrop-blur-xl shadow-lg shadow-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>মোবাইল ও লোকালহোস্ট ডাটাবেস স্ট্যাটাস</span>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active & Saved
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                সমস্ত ইনপুট, ওয়াশ, প্রোডাকশন এবং কর্মচারীর হাজিরা আপনার ব্রাউজার ও লোকালহোস্টে নিরাপদে সেভ রয়েছে।
              </p>
            </div>
          </div>

          {stats.lastSaved && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono self-start sm:self-center bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>সর্বশেষ সেভ: {new Date(stats.lastSaved).toLocaleTimeString('bn-BD')}</span>
            </div>
          )}
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-blue-500/20">
            <div className="text-[10px] text-slate-400">ইনপুট রেকর্ড</div>
            <div className="text-base sm:text-lg font-black font-mono text-blue-400 mt-0.5">{stats.inputCount} টি</div>
            <div className="text-[9px] text-slate-500">{stats.totalInputQty.toLocaleString()} pcs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-purple-500/20">
            <div className="text-[10px] text-slate-400">ওয়াশ রেকর্ড</div>
            <div className="text-base sm:text-lg font-black font-mono text-purple-400 mt-0.5">{stats.washCount} টি</div>
            <div className="text-[9px] text-slate-500">{stats.totalWashQty.toLocaleString()} pcs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/20">
            <div className="text-[10px] text-slate-400">কর্মচারী ও হাজিরা</div>
            <div className="text-base sm:text-lg font-black font-mono text-indigo-400 mt-0.5">{stats.employeeCount} জন</div>
            <div className="text-[9px] text-slate-500">{stats.attendanceCount} হাজিরা লগ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
            <div className="text-[10px] text-slate-400">প্রোডাকশন লগ</div>
            <div className="text-base sm:text-lg font-black font-mono text-cyan-400 mt-0.5">{stats.productionCount} টি</div>
            <div className="text-[9px] text-emerald-400 font-semibold">১০০% অফলাইন সেফ</div>
          </div>
        </div>
      </div>

      {/* 
        =======================================================
        1. CSV EXPORT & BACKUP PANEL (Mobile-First Touch Optimized)
        =======================================================
      */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-emerald-500/30 backdrop-blur-xl shadow-lg shadow-emerald-950/20">
        <div className="flex items-center justify-between gap-2.5 mb-3 pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>CSV ও Excel ফাইল এক্সপোর্ট</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase font-mono">
                  Excel Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Input এবং Wash হিসাবের সমস্ত রেকর্ড ব্যাকআপ ও প্রিন্টের জন্য CSV ফাইলে ডাউনলোড করুন
              </p>
            </div>
          </div>
        </div>

        {/* Live records counter pill badges for mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">ইনপুট রেকর্ড:</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {actualInputCount}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">ওয়াশ রেকর্ড:</span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {actualWashCount}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">ইউনিকোড ফরম্যাট:</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-300">
              UTF-8 (বাংলা সাপোর্ট)
            </span>
          </div>
        </div>

        {/* Mobile-friendly action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Export Input CSV */}
          <button
            id="export-input-csv-btn"
            onClick={handleExportInputCSV}
            className="w-full min-h-[46px] p-3 rounded-xl bg-gradient-to-r from-blue-700/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2.5 border border-blue-400/30 shadow-md shadow-blue-900/30 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4 text-blue-200 shrink-0" />
            <div className="text-left leading-tight">
              <span className="block font-bold">Input ডাটা CSV</span>
              <span className="text-[10px] text-blue-200 block">ইনপুট লট ও পরিমাণ</span>
            </div>
          </button>

          {/* Export Wash CSV */}
          <button
            id="export-wash-csv-btn"
            onClick={handleExportWashCSV}
            className="w-full min-h-[46px] p-3 rounded-xl bg-gradient-to-r from-purple-700/80 to-purple-600/80 hover:from-purple-600 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2.5 border border-purple-400/30 shadow-md shadow-purple-900/30 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4 text-purple-200 shrink-0" />
            <div className="text-left leading-tight">
              <span className="block font-bold">Wash ডাটা CSV</span>
              <span className="text-[10px] text-purple-200 block">কোম্পানি ও ওয়াশ ধরণ</span>
            </div>
          </button>

          {/* Export Combined Balance Report */}
          <button
            id="export-combined-csv-btn"
            onClick={handleExportCombinedCSV}
            className="w-full min-h-[46px] p-3 rounded-xl bg-gradient-to-r from-emerald-700/80 to-emerald-600/80 hover:from-emerald-600 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2.5 border border-emerald-400/30 shadow-md shadow-emerald-900/30 active:scale-[0.98] transition-all"
          >
            <Table className="w-4 h-4 text-emerald-200 shrink-0" />
            <div className="text-left leading-tight">
              <span className="block font-bold">ব্যালেন্স রিপোর্ট CSV</span>
              <span className="text-[10px] text-emerald-200 block">ইনপুট বনাম ওয়াশ সামারি</span>
            </div>
          </button>
        </div>
      </div>

      {/* 
        =======================================================
        2. SYSTEM BACKUP & RESTORE (JSON Full Clone)
        =======================================================
      */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-blue-500/25 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-blue-500/20">
          <Database className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">সম্পূর্ণ ডাটাবেস ক্লোন ও রিস্টোর (JSON)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          আপনার সমস্ত Input, Wash, Salary এবং Production ডাটা একক JSON ফাইলে সুরক্ষিত রাখুন অথবা অন্য কোনো মোবাইল বা কম্পিউটারে স্থানান্তর করুন।
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={handleExportAll}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>সম্পূর্ণ সিস্টেম ব্যাকআপ ফাইল ডাউনলোড (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 active:scale-[0.98] transition-all"
          >
            <Upload className="w-4 h-4 shrink-0" />
            <span>ফাইল থেকে ডাটা রিস্টোর (Import JSON)</span>
          </button>
        </div>
      </div>

      {/* 
        =======================================================
        3. FACTORY PROFILE & SOFTWARE SPEC
        =======================================================
      */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-blue-500/25 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-blue-500/20">
          <Building className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">গার্মেন্টস ও সিস্টেম স্পেসিফিকেশন</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">সফটওয়্যার সংস্করণ:</span>
            <span className="text-white font-mono font-bold bg-slate-950 px-2.5 py-1 rounded border border-blue-500/20 inline-block">
              Garments Tracking v2.4 (Enterprise Edition)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">ডাটাবেস আর্কিটেকচার:</span>
            <span className="text-emerald-400 font-mono font-semibold bg-slate-950 px-2.5 py-1 rounded border border-emerald-500/20 inline-block">
              Isolated Local Storage with CSV Engine
            </span>
          </div>
        </div>
      </div>

      {/* 
        =======================================================
        4. TESTING & RESET
        =======================================================
      */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-blue-500/25 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-blue-500/20">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">টেস্টিং ও ডাটা ব্যবস্থাপনা</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          দ্রুত ফিচার টেস্ট করার জন্য বাস্তবসম্মত ডেমো ডাটা (ABC Buyer, H&M, ইত্যাদি) লোড করতে পারেন অথবা সমস্ত ডাটা একবারে ক্লিয়ার করতে পারেন।
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={onLoadSampleData}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>স্যাম্পল টেস্ট ডাটা লোড করুন (Demo Data)</span>
          </button>

          <button
            onClick={onClearAllData}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>সমস্ত ডাটা রিসেট করুন (Clear All)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
