import React, { useState } from 'react';
import {
  Waves,
  Calendar,
  Building2,
  Droplets,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  Download,
  Sparkles,
  TrendingUp,
  FileText,
  Tag,
  Hash,
} from 'lucide-react';
import { GarmentWashRecord, WashType, GarmentInputRecord } from '../types';
import { formatQty, generateId } from '../utils/storage';

interface GarmentsWashSectionProps {
  records: GarmentWashRecord[];
  filteredRecords: GarmentWashRecord[];
  inputRecords: GarmentInputRecord[];
  onSaveRecord: (record: GarmentWashRecord) => void;
  onUpdateRecord: (record: GarmentWashRecord) => void;
  onDeleteRecord: (id: string) => void;
  totalFilteredWashQty: number;
  totalAllWashQty: number;
  isFilterActive: boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GarmentsWashSection: React.FC<GarmentsWashSectionProps> = ({
  records,
  filteredRecords,
  inputRecords,
  onSaveRecord,
  onUpdateRecord,
  onDeleteRecord,
  totalFilteredWashQty,
  totalAllWashQty,
  isFilterActive,
  onShowToast,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [date, setDate] = useState<string>(todayStr);
  const [washCompany, setWashCompany] = useState<string>('');
  const [washType, setWashType] = useState<WashType>('Enzyme');
  const [quantity, setQuantity] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [chalanNo, setChalanNo] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [size, setSize] = useState<string>('');

  // Editing state
  const [editingRecord, setEditingRecord] = useState<GarmentWashRecord | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form visibility toggle
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);

  // Common wash companies
  const commonWashCompanies = [
    'Dhaka Washing Plant Ltd',
    'Blue Star Washing & Dyeing',
    'Comfort Denim Wash',
    'Standard Eco Wash',
    'Euro Washers Ltd',
    'Pioneer Washing Industry',
  ];

  // Available wash types
  const washTypeOptions: WashType[] = ['Normal', 'Enzyme', 'Stone', 'Bleach', 'Silicon', 'Other'];

  const handleSelectFromInput = (inp: GarmentInputRecord) => {
    setBuyer(inp.buyer);
    setStyle(inp.style);
    setItem(inp.item);
    setColor(inp.color);
    setSize(inp.size);
    onShowToast(`Input রেকর্ড থেকে ${inp.buyer} - ${inp.style} সিলেক্ট করা হয়েছে`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      onShowToast('অনুগ্রহ করে Wash In Date নির্বাচন করুন', 'error');
      return;
    }
    if (!washCompany.trim()) {
      onShowToast('অনুগ্রহ করে Wash Company Name লিখুন', 'error');
      return;
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      onShowToast('Wash In Qty অবশ্যই ০ এর চেয়ে বেশি সঠিক সংখ্যা হতে হবে', 'error');
      return;
    }

    if (editingRecord) {
      const updated: GarmentWashRecord = {
        ...editingRecord,
        date,
        washCompany: washCompany.trim(),
        washType,
        quantity: qtyNum,
        buyer: buyer.trim(),
        style: style.trim(),
        item: item.trim(),
        color: color.trim(),
        size: size.trim(),
        chalanNo: chalanNo.trim(),
      };
      onUpdateRecord(updated);
      onShowToast('Wash হিসাব সফলভাবে আপডেট হয়েছে', 'success');
      setEditingRecord(null);
    } else {
      const newRec: GarmentWashRecord = {
        id: generateId(),
        date,
        washCompany: washCompany.trim(),
        washType,
        quantity: qtyNum,
        buyer: buyer.trim(),
        style: style.trim(),
        item: item.trim(),
        color: color.trim(),
        size: size.trim(),
        chalanNo: chalanNo.trim(),
        createdAt: Date.now(),
      };
      onSaveRecord(newRec);
      onShowToast('Wash সফলভাবে সংরক্ষণ হয়েছে', 'success');
    }

    setQuantity('');
    setChalanNo('');
  };

  const startEdit = (rec: GarmentWashRecord) => {
    setEditingRecord(rec);
    setDate(rec.date);
    setWashCompany(rec.washCompany);
    setWashType(rec.washType);
    setQuantity(rec.quantity.toString());
    setBuyer(rec.buyer || '');
    setStyle(rec.style || '');
    setItem(rec.item || '');
    setChalanNo(rec.chalanNo || '');
    setColor(rec.color || '');
    setSize(rec.size || '');
    setIsFormOpen(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    setQuantity('');
    setChalanNo('');
  };

  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      onShowToast('এক্সপোর্ট করার কোনো রেকর্ড নেই', 'error');
      return;
    }
    const headers = [
      'Date',
      'Wash Company',
      'Wash Type',
      'Quantity',
      'Chalan No',
      'Buyer',
      'Style',
      'Item',
      'Color',
      'Size',
    ];
    const rows = filteredRecords.map((r) => [
      `"${r.date}"`,
      `"${r.washCompany}"`,
      `"${r.washType}"`,
      r.quantity,
      `"${r.chalanNo || ''}"`,
      `"${r.buyer || ''}"`,
      `"${r.style || ''}"`,
      `"${r.item || ''}"`,
      `"${r.color || ''}"`,
      `"${r.size || ''}"`,
    ]);
    const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `garments_wash_${todayStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Wash CSV ডাউনলোড সম্পন্ন হয়েছে', 'success');
  };

  return (
    <div id="garments-wash-section" className="space-y-4">
      {/* 
        =======================================================
        TOP METRIC BAR (Purple / Violet Theme)
        =======================================================
      */}
      <div
        id="wash-total-card"
        className="w-full rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#170e2a] via-[#110920] to-[#0a0714] border border-purple-500/35 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Waves className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                ওয়াশ ইন পরিসংখ্যান
              </span>
              {isFilterActive && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  ফিল্টারড
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
                {formatQty(totalFilteredWashQty)}
              </span>
              <span className="text-xs text-purple-400 font-bold font-mono">PCS</span>
              {isFilterActive && (
                <span className="text-[11px] text-slate-400 font-mono ml-2">
                  (মোট: {formatQty(totalAllWashQty)} pcs)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 active:scale-95"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{isFormOpen ? 'ফর্ম বন্ধ করুন' : '+ নতুন Wash এন্ট্রি'}</span>
          </button>
          <button
            onClick={exportToCSV}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs transition-colors active:scale-95"
            title="CSV এক্সপোর্ট করুন"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 
        =======================================================
        PREMIUM WASH ENTRY FORM (Violet Accent + Blue Glass)
        =======================================================
      */}
      {isFormOpen && (
        <div
          id="wash-entry-form-container"
          className="rounded-2xl bg-gradient-to-b from-[#130d22]/95 to-[#080512]/95 border border-purple-500/30 p-4 sm:p-5 backdrop-blur-2xl shadow-xl shadow-purple-950/30 relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {editingRecord ? 'Wash রেকর্ড সম্পাদনা (Edit Wash)' : 'নতুন Garments Wash এন্ট্রি'}
              </h3>
            </div>
            {editingRecord && (
              <button
                onClick={cancelEdit}
                className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30 font-medium active:scale-95"
              >
                বাতিল করুন
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {/* 1. Wash In Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Wash In Date (তারিখ) *</span>
                </label>
                <input
                  id="wash-date-field"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                />
              </div>

              {/* 2. Wash Company Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Wash Company Name *</span>
                </label>
                <input
                  id="wash-company-field"
                  type="text"
                  required
                  list="wash-company-suggestions"
                  placeholder="e.g. Dhaka Wash, Blue Star"
                  value={washCompany}
                  onChange={(e) => setWashCompany(e.target.value)}
                  className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <datalist id="wash-company-suggestions">
                  {commonWashCompanies.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* 3. Wash Type (Custom Style Select) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Wash Type (ধরণ) *</span>
                </label>
                <select
                  id="wash-type-select"
                  value={washType}
                  onChange={(e) => setWashType(e.target.value as WashType)}
                  className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="Normal">Normal Wash</option>
                  <option value="Enzyme">Enzyme Wash</option>
                  <option value="Stone">Stone Wash</option>
                  <option value="Bleach">Bleach / Acid Wash</option>
                  <option value="Silicon">Silicon / Softener Wash</option>
                  <option value="Other">Other / অন্যান্য</option>
                </select>
              </div>

              {/* 4. Wash In Qty (Visually Important with Purple Glow) */}
              <div>
                <label className="block text-[11px] font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>Wash In Qty (পরিমাণ) *</span>
                </label>
                <div className="relative">
                  <input
                    id="wash-qty-field"
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="e.g. 450"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-purple-500/60 rounded-xl px-3.5 py-2 text-base sm:text-lg font-black text-purple-200 font-mono focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400/80 font-mono">
                    PCS
                  </span>
                </div>
              </div>
            </div>

            {/* Wash Type Quick Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">দ্রুত ওয়াশ ধরণ:</span>
              {washTypeOptions.map((wt) => (
                <button
                  type="button"
                  key={wt}
                  onClick={() => setWashType(wt)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium border transition-all active:scale-95 ${
                    washType === wt
                      ? 'bg-purple-500/30 border-purple-400 text-purple-200 font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {wt}
                </button>
              ))}
            </div>

            {/* Linked Buyer & Style Tagging for Balance Reconciliation */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/25">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>পোশাকের ট্যাগ ও চালান নং (ব্যালেন্স মেলানোর জন্য):</span>
                </span>
                {inputRecords.length > 0 && (
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    ইনপুট ব্যাচ থেকে অটো-সিলেক্ট করতে পারেন
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <input
                    type="text"
                    placeholder="Buyer (e.g. H&M)"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    className="w-full bg-slate-950/80 border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Style (e.g. ST-2026-X)"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-slate-950/80 border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Item (e.g. Denim Pant)"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="w-full bg-slate-950/80 border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="চালান নং (Chalan No)"
                    value={chalanNo}
                    onChange={(e) => setChalanNo(e.target.value)}
                    className="w-full bg-slate-950/80 border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              </div>

              {/* Quick Suggest from recent Input records */}
              {inputRecords.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="text-[10px] text-slate-400 mr-1 font-medium">
                    সম্প্রতি ইনপুট হওয়া স্টাইল:
                  </span>
                  {inputRecords
                    .slice(-4)
                    .reverse()
                    .map((inp) => (
                      <button
                        type="button"
                        key={inp.id}
                        onClick={() => handleSelectFromInput(inp)}
                        className="px-2 py-0.5 rounded-md bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 transition-all text-[10px] active:scale-95"
                      >
                        {inp.buyer} ({inp.style})
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-1">
              {editingRecord && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all active:scale-95"
                >
                  বাতিল
                </button>
              )}
              <button
                id="wash-save-btn"
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-purple-400/30"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>{editingRecord ? 'আপডেট সম্পন্ন করুন' : '+ Save Wash'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 
        =======================================================
        WASH RECORD LIST (Mobile Cards & Desktop Table)
        =======================================================
      */}
      <div
        id="wash-records-container"
        className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#070512]/95 border border-purple-500/25 backdrop-blur-2xl overflow-hidden shadow-lg shadow-purple-950/30"
      >
        <div className="p-3.5 sm:p-4 border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Wash রেকর্ড তালিকা ({filteredRecords.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            মোট ওয়াশ: <strong className="text-purple-300">{formatQty(totalFilteredWashQty)} pcs</strong>
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Waves className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-300">কোনো Wash রেকর্ড পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">
              {records.length === 0
                ? 'উপরের ফর্ম ব্যবহার করে প্রথম Wash রেকর্ড সেভ করুন'
                : 'ফিল্টারের সাথে মিলে এমন কোনো Wash রেকর্ড নেই।'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: High-End Compact Luxury Cards */}
            <div className="block sm:hidden divide-y divide-purple-500/10">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 hover:bg-purple-950/20 transition-all space-y-2.5 active:bg-purple-950/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-black text-white">{rec.washCompany}</h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">{rec.date}</span>
                        {rec.chalanNo && (
                          <span className="text-[10px] text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30 font-mono">
                            চালান: {rec.chalanNo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-400/30 text-right shadow-sm">
                      <span className="text-xs font-bold text-purple-300 font-mono block leading-none">
                        Wash {formatQty(rec.quantity)}
                      </span>
                      <span className="text-[9px] text-purple-400/80 font-mono">PCS</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 text-[10px]">
                      {rec.washType}
                    </span>
                    {rec.buyer && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-slate-300">
                        Buyer: <strong className="text-white">{rec.buyer}</strong>
                      </span>
                    )}
                    {rec.style && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-purple-500/30 text-purple-300 font-mono">
                        Style: <strong className="text-white">{rec.style}</strong>
                      </span>
                    )}
                    {rec.item && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-slate-300">
                        Item: {rec.item}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                    <button
                      onClick={() => startEdit(rec)}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-[11px] font-semibold flex items-center gap-1 border border-purple-500/30 transition-all active:scale-95"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingId(rec.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] font-semibold flex items-center gap-1 border border-rose-500/30 transition-all active:scale-95"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View: Tabular Enterprise Grid */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-purple-500/20 text-[11px]">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Wash Company</th>
                    <th className="p-3.5">Wash Type</th>
                    <th className="p-3.5">Buyer</th>
                    <th className="p-3.5">Style</th>
                    <th className="p-3.5">Item</th>
                    <th className="p-3.5">Chalan No</th>
                    <th className="p-3.5 text-right">Wash Qty</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-purple-950/30 transition-colors">
                      <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">{rec.date}</td>
                      <td className="p-3.5 font-bold text-white">{rec.washCompany}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {rec.washType}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-200">{rec.buyer || '-'}</td>
                      <td className="p-3.5 font-mono text-purple-300 font-bold">{rec.style || '-'}</td>
                      <td className="p-3.5">{rec.item || '-'}</td>
                      <td className="p-3.5 font-mono text-slate-400">{rec.chalanNo || '-'}</td>
                      <td className="p-3.5 text-right font-mono font-black text-purple-300 text-sm whitespace-nowrap">
                        {formatQty(rec.quantity)} <span className="text-[10px] text-slate-400 font-sans font-normal">pcs</span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEdit(rec)}
                            className="p-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all active:scale-95"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(rec.id)}
                            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all active:scale-95"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-rose-500/40 p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">রেকর্ড ডিলিট নিশ্চিতকরণ</h4>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              আপনি কি নিশ্চিত যে এই Wash রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  onDeleteRecord(deletingId);
                  setDeletingId(null);
                  onShowToast('Wash রেকর্ড ডিলিট করা হয়েছে', 'info');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30"
              >
                হ্যাঁ, ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
