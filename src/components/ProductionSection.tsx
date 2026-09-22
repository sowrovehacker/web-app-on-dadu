import React, { useState } from 'react';
import {
  Scissors,
  TrendingUp,
  Target,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ProductionRecord } from '../types';
import { formatQty, generateId } from '../utils/storage';

interface ProductionSectionProps {
  records: ProductionRecord[];
  onSaveRecord: (record: ProductionRecord) => void;
  onDeleteRecord: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProductionSection: React.FC<ProductionSectionProps> = ({
  records,
  onSaveRecord,
  onDeleteRecord,
  onShowToast,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [line, setLine] = useState<string>('Line-01');
  const [style, setStyle] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');
  const [target, setTarget] = useState<string>('1000');
  const [actual, setActual] = useState<string>('');
  const [rejectCount, setRejectCount] = useState<string>('0');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(target, 10);
    const actualNum = parseInt(actual, 10);
    const rejectNum = parseInt(rejectCount, 10) || 0;

    if (!style.trim()) {
      onShowToast('অনুগ্রহ করে Style নম্বর দিন', 'error');
      return;
    }
    if (isNaN(actualNum) || actualNum < 0) {
      onShowToast('সঠিক উৎপাদন সংখ্যা লিখুন', 'error');
      return;
    }

    const newRecord: ProductionRecord = {
      id: generateId(),
      date,
      line,
      style: style.trim(),
      buyer: buyer.trim() || 'General',
      target: isNaN(targetNum) ? 0 : targetNum,
      actual: actualNum,
      rejectCount: rejectNum,
    };

    onSaveRecord(newRecord);
    onShowToast('উৎপাদন ডাটা সফলভাবে সংরক্ষিত হয়েছে', 'success');
    setActual('');
    setRejectCount('0');
    setIsFormOpen(false);
  };

  const totalTarget = records.reduce((acc, r) => acc + r.target, 0);
  const totalActual = records.reduce((acc, r) => acc + r.actual, 0);
  const totalRejects = records.reduce((acc, r) => acc + r.rejectCount, 0);
  const efficiency = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;

  return (
    <div id="production-section" className="space-y-4">
      {/* Production Metrics Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 border border-blue-500/30 p-4 sm:p-5 backdrop-blur-xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-blue-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/30">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">দৈনিক সুইং ও উৎপাদন ট্র্যাকিং (Production)</h3>
              <p className="text-xs text-slate-400">লাইনের টার্গেট ও অর্জিত উৎপাদনের হিসাব</p>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'ফর্ম লুকান' : 'উৎপাদন যোগ করুন'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/20">
            <span className="text-[11px] text-slate-400 block">মোট টার্গেট (Target)</span>
            <span className="text-xl font-bold font-mono text-white">{formatQty(totalTarget)}</span>
            <span className="text-[10px] text-slate-400 ml-1">pcs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/20">
            <span className="text-[11px] text-slate-400 block">মোট উৎপাদন (Output)</span>
            <span className="text-xl font-bold font-mono text-cyan-300">{formatQty(totalActual)}</span>
            <span className="text-[10px] text-slate-400 ml-1">pcs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/20">
            <span className="text-[11px] text-slate-400 block">দক্ষতা (Efficiency)</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{efficiency}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/20">
            <span className="text-[11px] text-slate-400 block">রিজেক্ট (Rejects)</span>
            <span className="text-xl font-bold font-mono text-rose-400">{formatQty(totalRejects)}</span>
            <span className="text-[10px] text-slate-400 ml-1">pcs</span>
          </div>
        </div>
      </div>

      {/* Production Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30 space-y-3">
          <h4 className="text-sm font-bold text-white mb-2">নতুন উৎপাদন এন্ট্রি</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">তারিখ (Date)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">লাইন নম্বর (Line)</label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {['Line-01', 'Line-02', 'Line-03', 'Line-04', 'Line-05', 'Finishing'].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Style নম্বর</label>
              <input
                type="text"
                required
                placeholder="e.g. ST-405"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Buyer</label>
              <input
                type="text"
                placeholder="e.g. H&M"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">টার্গেট (Target pcs)</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">উৎপাদন (Output pcs) *</label>
              <input
                type="number"
                required
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/40 rounded-lg px-2.5 py-1.5 text-xs text-blue-200 font-bold font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/30"
            >
              সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* Production List */}
      <div className="rounded-2xl bg-slate-900/85 border border-blue-500/25 overflow-hidden">
        <div className="p-3.5 border-b border-blue-500/20 flex justify-between items-center text-xs">
          <span className="font-bold text-white">উৎপাদন রেকর্ড ({records.length})</span>
        </div>
        {records.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">কোনো উৎপাদন ডাটা নেই।</div>
        ) : (
          <div className="divide-y divide-blue-500/10 text-xs">
            {records.map((r) => (
              <div key={r.id} className="p-3 hover:bg-slate-800/40 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400">{r.date}</span>
                    <span className="font-bold text-white">{r.line}</span>
                    <span className="text-slate-400">({r.style})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    টার্গেট: {formatQty(r.target)} pcs | আউটপুট:{' '}
                    <strong className="text-emerald-400 font-mono">{formatQty(r.actual)}</strong> pcs
                  </div>
                </div>
                <button
                  onClick={() => onDeleteRecord(r.id)}
                  className="text-rose-400 hover:text-rose-300 p-1.5 rounded bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
