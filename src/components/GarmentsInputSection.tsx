import React, { useState } from 'react';
import {
  PackagePlus,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Plus,
  PackageCheck,
  Hash,
  Palette,
  AlertCircle,
  Building2,
  Ruler,
  GitBranch,
  TrendingUp,
  Download,
  Sparkles,
} from 'lucide-react';
import { GarmentInputRecord } from '../types';
import { formatQty, generateId } from '../utils/storage';

interface GarmentsInputSectionProps {
  records: GarmentInputRecord[];
  filteredRecords: GarmentInputRecord[];
  onSaveRecord: (record: GarmentInputRecord) => void;
  onUpdateRecord: (record: GarmentInputRecord) => void;
  onDeleteRecord: (id: string) => void;
  totalFilteredInputQty: number;
  totalAllInputQty: number;
  isFilterActive: boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GarmentsInputSection: React.FC<GarmentsInputSectionProps> = ({
  records,
  filteredRecords,
  onSaveRecord,
  onUpdateRecord,
  onDeleteRecord,
  totalFilteredInputQty,
  totalAllInputQty,
  isFilterActive,
  onShowToast,
}) => {
  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [buyer, setBuyer] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [level, setLevel] = useState<string>('Sewing Input');
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Editing state
  const [editingRecord, setEditingRecord] = useState<GarmentInputRecord | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form toggle for compact mobile view
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);

  // Common quick chips
  const commonItems = ['T-Shirt', 'Polo Shirt', 'Denim Pant', 'Twill Pant', 'Jacket', 'Hoodie'];
  const commonSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34'];
  const commonLevels = ['Sewing Input', 'Cutting Input', 'Finishing Input', 'Line-01', 'Line-02', 'Line-03'];

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      onShowToast('অনুগ্রহ করে তারিখ নির্বাচন করুন', 'error');
      return;
    }
    if (!buyer.trim()) {
      onShowToast('অনুগ্রহ করে Buyer-এর নাম লিখুন', 'error');
      return;
    }
    if (!item.trim()) {
      onShowToast('অনুগ্রহ করে Item-এর নাম লিখুন', 'error');
      return;
    }
    if (!size.trim()) {
      onShowToast('অনুগ্রহ করে Size উল্লেখ করুন', 'error');
      return;
    }
    if (!style.trim()) {
      onShowToast('অনুগ্রহ করে Style নম্বর দিন', 'error');
      return;
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      onShowToast('Input Qty অবশ্যই ০ এর বেশি সঠিক সংখ্যা হতে হবে', 'error');
      return;
    }

    if (editingRecord) {
      const updated: GarmentInputRecord = {
        ...editingRecord,
        date,
        buyer: buyer.trim(),
        item: item.trim(),
        size: size.trim(),
        style: style.trim(),
        color: color.trim() || 'Standard',
        level: level.trim() || 'General',
        quantity: qtyNum,
        notes: notes.trim(),
      };
      onUpdateRecord(updated);
      onShowToast('Input সফলভাবে আপডেট হয়েছে', 'success');
      setEditingRecord(null);
    } else {
      const newRec: GarmentInputRecord = {
        id: generateId(),
        date,
        buyer: buyer.trim(),
        item: item.trim(),
        size: size.trim(),
        style: style.trim(),
        color: color.trim() || 'Standard',
        level: level.trim() || 'General',
        quantity: qtyNum,
        notes: notes.trim(),
        createdAt: Date.now(),
      };
      onSaveRecord(newRec);
      onShowToast('Input সফলভাবে সংরক্ষণ হয়েছে', 'success');
    }

    setQuantity('');
    setNotes('');
  };

  const startEdit = (rec: GarmentInputRecord) => {
    setEditingRecord(rec);
    setDate(rec.date);
    setBuyer(rec.buyer);
    setItem(rec.item);
    setSize(rec.size);
    setStyle(rec.style);
    setColor(rec.color);
    setLevel(rec.level);
    setQuantity(rec.quantity.toString());
    setNotes(rec.notes || '');
    setIsFormOpen(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    setQuantity('');
    setNotes('');
  };

  // Quick export helper
  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      onShowToast('এক্সপোর্ট করার মতো কোনো রেকর্ড নেই', 'error');
      return;
    }
    const headers = ['Date', 'Buyer', 'Item', 'Size', 'Style', 'Color', 'Level', 'Quantity', 'Notes'];
    const rows = filteredRecords.map((r) => [
      `"${r.date}"`,
      `"${r.buyer}"`,
      `"${r.item}"`,
      `"${r.size}"`,
      `"${r.style}"`,
      `"${r.color}"`,
      `"${r.level}"`,
      r.quantity,
      `"${r.notes || ''}"`,
    ]);
    const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `garments_input_${todayStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Input CSV ডাউনলোড সম্পন্ন হয়েছে', 'success');
  };

  return (
    <div id="garments-input-section" className="space-y-4">
      {/* 
        =======================================================
        TOP METRIC BAR & ACTION CONTROLS
        =======================================================
      */}
      <div
        id="input-total-card"
        className="w-full rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#0a142c] via-[#091124] to-[#070d1c] border border-blue-500/35 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                গার্মেন্টস ইনপুট পরিসংখ্যান
              </span>
              {isFilterActive && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  ফিল্টারড
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]">
                {formatQty(totalFilteredInputQty)}
              </span>
              <span className="text-xs text-cyan-400 font-bold font-mono">PCS</span>
              {isFilterActive && (
                <span className="text-[11px] text-slate-400 font-mono ml-2">
                  (মোট: {formatQty(totalAllInputQty)} pcs)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 active:scale-95"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{isFormOpen ? 'ফর্ম বন্ধ করুন' : '+ নতুন Input এন্ট্রি'}</span>
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
        PREMIUM INPUT FORM (Floating labels, Glow, Icons)
        =======================================================
      */}
      {isFormOpen && (
        <div
          id="input-entry-form-container"
          className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-[#080e1c]/95 border border-blue-500/30 p-4 sm:p-5 backdrop-blur-2xl shadow-xl shadow-blue-950/40 relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {editingRecord ? 'Input রেকর্ড সম্পাদনা (Edit Input)' : 'নতুন Garments Input এন্ট্রি'}
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
              {/* 1. Input Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Input Date (তারিখ) *</span>
                </label>
                <input
                  id="input-date-field"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                />
              </div>

              {/* 2. Buyer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Buyer (বায়ারের নাম) *</span>
                </label>
                <input
                  id="input-buyer-field"
                  type="text"
                  required
                  list="buyer-suggestions"
                  placeholder="e.g. H&M, Zara, Primark, ABC"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <datalist id="buyer-suggestions">
                  <option value="H&M" />
                  <option value="Zara" />
                  <option value="Target" />
                  <option value="Primark" />
                  <option value="Next" />
                  <option value="ABC Buyer" />
                </datalist>
              </div>

              {/* 3. Style */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-purple-400" />
                  <span>Style (স্টাইল নম্বর) *</span>
                </label>
                <input
                  id="input-style-field"
                  type="text"
                  required
                  placeholder="e.g. ST-2026-X, DNM-401"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                />
              </div>

              {/* 4. Item */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Item (পোশাকের ধরণ) *</span>
                </label>
                <input
                  id="input-item-field"
                  type="text"
                  required
                  list="item-suggestions"
                  placeholder="e.g. T-Shirt, Denim Pant"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <datalist id="item-suggestions">
                  {commonItems.map((ci) => (
                    <option key={ci} value={ci} />
                  ))}
                </datalist>
              </div>

              {/* 5. Size */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Size (সাইজ) *</span>
                </label>
                <input
                  id="input-size-field"
                  type="text"
                  required
                  placeholder="e.g. S, M, L, XL, 32"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                />
              </div>

              {/* 6. Color */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  <span>Color (রং)</span>
                </label>
                <input
                  id="input-color-field"
                  type="text"
                  placeholder="e.g. Navy Blue, Black, White"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* 7. Level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Level (কাজের ধাপ / লাইন)</span>
                </label>
                <input
                  id="input-level-field"
                  type="text"
                  list="level-suggestions"
                  placeholder="e.g. Sewing Input, Line-01"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <datalist id="level-suggestions">
                  {commonLevels.map((cl) => (
                    <option key={cl} value={cl} />
                  ))}
                </datalist>
              </div>

              {/* 8. Input Qty (Visually Important with Cyan Glow) */}
              <div>
                <label className="block text-[11px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Input Qty (পরিমাণ) *</span>
                </label>
                <div className="relative">
                  <input
                    id="input-qty-field"
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="e.g. 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-cyan-500/60 rounded-xl px-3.5 py-2 text-base sm:text-lg font-black text-cyan-200 font-mono focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-400/80 font-mono">
                    PCS
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Helper Size Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">দ্রুত সাইজ বাছুন:</span>
              {commonSizes.map((sz) => (
                <button
                  type="button"
                  key={sz}
                  onClick={() => setSize(sz)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono border transition-all active:scale-95 ${
                    size === sz
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Save Button (High-End Gradient Button) */}
            <div className="flex justify-end gap-3 pt-2">
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
                id="input-save-btn"
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-cyan-400/30"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>{editingRecord ? 'আপডেট সম্পন্ন করুন' : '+ Save Input'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 
        =======================================================
        MODERN RECORD LIST (Mobile Cards & Desktop Table)
        =======================================================
      */}
      <div
        id="input-records-container"
        className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#070d1a]/95 border border-blue-500/25 backdrop-blur-2xl overflow-hidden shadow-lg shadow-blue-950/30"
      >
        <div className="p-3.5 sm:p-4 border-b border-blue-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Input রেকর্ড তালিকা ({filteredRecords.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            মোট ভলিউম: <strong className="text-cyan-300">{formatQty(totalFilteredInputQty)} pcs</strong>
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <PackagePlus className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-300">কোনো Input রেকর্ড পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">
              {records.length === 0
                ? 'উপরের ফর্ম ব্যবহার করে প্রথম Garments Input রেকর্ড সেভ করুন'
                : 'ফিল্টারের সাথে মিলে এমন কোনো রেকর্ড নেই। ফিল্টার ক্লিয়ার করে দেখুন।'}
            </p>
          </div>
        ) : (
          <>
            {/* 
              Mobile View: High-End Compact Luxury Cards 
              Example:
              ABC Buyer | T-Shirt
              Style: ST-102 | Size: L | Color: Black | Level: Sewing
              Input 2,500 PCS
              17 Sep 2026
            */}
            <div className="block sm:hidden divide-y divide-blue-500/10">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 hover:bg-blue-950/20 transition-all space-y-2.5 active:bg-blue-950/30"
                >
                  {/* Row 1: Header (Buyer, Item, and Qty Badge) */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{rec.buyer}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs font-semibold text-cyan-300">{rec.item}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {rec.date}
                      </span>
                    </div>

                    {/* Quantity Badge */}
                    <div className="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-right shadow-sm">
                      <span className="text-xs font-bold text-cyan-300 font-mono block leading-none">
                        Input {formatQty(rec.quantity)}
                      </span>
                      <span className="text-[9px] text-cyan-400/80 font-mono">PCS</span>
                    </div>
                  </div>

                  {/* Row 2: Specifications Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-purple-500/30 text-purple-300 font-mono">
                      Style: <strong className="text-white">{rec.style}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-blue-500/30 text-blue-300 font-mono">
                      Size: <strong className="text-white">{rec.size}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-slate-300">
                      Color: {rec.color}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-emerald-500/30 text-emerald-300">
                      Level: {rec.level}
                    </span>
                  </div>

                  {/* Row 3: Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                    <button
                      onClick={() => startEdit(rec)}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-[11px] font-semibold flex items-center gap-1 border border-blue-500/30 transition-all active:scale-95"
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
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-blue-500/20 text-[11px]">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Buyer</th>
                    <th className="p-3.5">Style</th>
                    <th className="p-3.5">Item</th>
                    <th className="p-3.5">Size</th>
                    <th className="p-3.5">Color</th>
                    <th className="p-3.5">Level</th>
                    <th className="p-3.5 text-right">Input Qty</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-blue-950/30 transition-colors">
                      <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">{rec.date}</td>
                      <td className="p-3.5 font-bold text-white">{rec.buyer}</td>
                      <td className="p-3.5 font-mono text-purple-300 font-bold">{rec.style}</td>
                      <td className="p-3.5">{rec.item}</td>
                      <td className="p-3.5 font-mono font-bold text-cyan-300">{rec.size}</td>
                      <td className="p-3.5">{rec.color}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[10px] font-semibold border border-blue-500/25">
                          {rec.level}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-black text-cyan-300 text-sm whitespace-nowrap">
                        {formatQty(rec.quantity)} <span className="text-[10px] text-slate-400 font-sans font-normal">pcs</span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEdit(rec)}
                            className="p-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition-all active:scale-95"
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
              আপনি কি নিশ্চিত যে এই Input রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?
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
                  onShowToast('রেকর্ড ডিলিট করা হয়েছে', 'info');
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
