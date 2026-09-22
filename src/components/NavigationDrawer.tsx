import React from 'react';
import {
  X,
  Home,
  Package,
  Waves,
  Scale,
  Scissors,
  Users,
  CreditCard,
  Settings as SettingsIcon,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Layers,
  ArrowRight,
  HardDrive,
} from 'lucide-react';
import { formatQty } from '../utils/storage';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: 'overview' | 'input' | 'wash' | 'balance' | 'production' | 'salary' | 'settings') => void;
  totalInputQty: number;
  totalWashQty: number;
  balanceQty: number;
  employeeCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  totalInputQty,
  totalWashQty,
  balanceQty,
  employeeCount,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'overview',
      label: 'ওভারভিউ ড্যাশবোর্ড',
      sublabel: 'Overview & Live Analytics',
      icon: Home,
      color: 'text-cyan-400',
      bgHover: 'hover:border-cyan-500/40 hover:bg-cyan-950/30',
      badge: 'লাইভ সিস্টেম',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'input',
      label: 'গার্মেন্টস ইনপুট হিসাব',
      sublabel: 'Buyer, Style, Size & Input Qty',
      icon: Package,
      color: 'text-blue-400',
      bgHover: 'hover:border-blue-500/40 hover:bg-blue-950/30',
      badge: `${formatQty(totalInputQty)} pcs`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      id: 'wash',
      label: 'গার্মেন্টস ওয়াশ হিসাব',
      sublabel: 'Wash In, Factory, Chalan & Qty',
      icon: Waves,
      color: 'text-purple-400',
      bgHover: 'hover:border-purple-500/40 hover:bg-purple-950/30',
      badge: `${formatQty(totalWashQty)} pcs`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      id: 'balance',
      label: 'ব্যালেন্স রিকনসিলিয়েশন',
      sublabel: 'Input vs Wash Balance Tracking',
      icon: Scale,
      color: 'text-emerald-400',
      bgHover: 'hover:border-emerald-500/40 hover:bg-emerald-950/30',
      badge: `${formatQty(balanceQty)} বাকি`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'production',
      label: 'প্রোডাকশন মনিটরিং',
      sublabel: 'Line Target, Actual & Rejects',
      icon: Scissors,
      color: 'text-cyan-400',
      bgHover: 'hover:border-cyan-500/40 hover:bg-cyan-950/30',
      badge: 'কাটিং / সুইং',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'salary',
      label: 'কর্মচারীর হাজিরা ও বেতন',
      sublabel: 'Attendance, Daily Time, OT & Salary',
      icon: Users,
      color: 'text-indigo-400',
      bgHover: 'hover:border-indigo-500/40 hover:bg-indigo-950/30',
      badge: `${employeeCount} জন কর্মী`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    {
      id: 'settings',
      label: 'সেটিংস ও ব্যাকআপ',
      sublabel: 'CSV Data Export, Reset & System Config',
      icon: SettingsIcon,
      color: 'text-slate-400',
      bgHover: 'hover:border-slate-500/40 hover:bg-slate-800/40',
      badge: 'CSV এক্সপোর্ট',
      badgeColor: 'bg-slate-700/40 text-slate-300 border-slate-600',
    },
  ];

  const handleSelect = (tab: any) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#070e22] border-r border-blue-500/30 text-white shadow-2xl flex flex-col h-full z-10 animate-slideRight">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-blue-500/20 bg-[#040817] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* AKM Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black tracking-tighter text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/40">
              <span className="text-sm font-extrabold">AKM</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">AKM APPARELS</h2>
              <p className="text-[11px] text-blue-300 font-medium">Garments Management System</p>
            </div>
          </div>

          <button
            id="close-drawer-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Factory Quick Status Banner */}
        <div className="p-3.5 mx-4 mt-4 rounded-xl bg-blue-950/40 border border-blue-500/30">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              লাইভ ফ্যাক্টরি সিস্টেম
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-blue-500/20">
            <div className="p-1.5 rounded-lg bg-blue-900/30 border border-blue-500/20">
              <span className="text-[9px] text-blue-300 block uppercase">Input</span>
              <span className="text-xs font-mono font-bold text-white">{formatQty(totalInputQty)}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-purple-900/30 border border-purple-500/20">
              <span className="text-[9px] text-purple-300 block uppercase">Wash</span>
              <span className="text-xs font-mono font-bold text-white">{formatQty(totalWashQty)}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-900/30 border border-emerald-500/20">
              <span className="text-[9px] text-emerald-300 block uppercase">ব্যালেন্স</span>
              <span className="text-xs font-mono font-bold text-emerald-300">{formatQty(balanceQty)}</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation Items (All Features) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
            মেনু নেভিগেশন (All Features)
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`drawer-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-transparent border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                    : `bg-slate-900/60 border-blue-500/15 ${item.bgHover}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                        : 'bg-slate-800/80 border-slate-700/60 ' + item.color
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-400">{item.sublabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 text-slate-500 transition-transform group-hover:translate-x-1 ${
                      isActive ? 'text-blue-400' : ''
                    }`}
                  />
                </div>
              </button>
            );
          })}

          {/* Quick Shortcuts Section */}
          <div className="pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2">
              দ্রুত শর্টকাট (Quick Actions)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelect('input')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-xs font-semibold text-blue-200"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>নতুন Input</span>
              </button>
              <button
                onClick={() => handleSelect('wash')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-xs font-semibold text-purple-200"
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>নতুন Wash</span>
              </button>
              <button
                onClick={() => handleSelect('salary')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-xs font-semibold text-indigo-200"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>হাজিরা এন্ট্রি</span>
              </button>
              <button
                onClick={() => handleSelect('settings')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-semibold text-emerald-200"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>CSV ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* Localhost & Mobile Data Safe Status Card */}
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">মোবাইল ও লোকালহোস্ট সেভ</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                আপনার সমস্ত ইনপুট, ওয়াশ ও হাজিরা ডাটা ব্রাউজার লোকাল স্টোরেজে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকছে। অফলাইনেও কাজ করে।
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-blue-500/20 bg-[#040817] flex items-center justify-between text-xs text-slate-400">
          <span>AKM APPARELS ERP 2026</span>
          <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            LocalStorage Active
          </span>
        </div>
      </div>
    </div>
  );
};
