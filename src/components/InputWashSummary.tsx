import React from 'react';
import {
  PackageCheck,
  Waves,
  Scale,
  Filter,
  X,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { formatQty } from '../utils/storage';
import { FilterState } from '../types';

interface InputWashSummaryProps {
  totalInputQty: number;
  totalWashQty: number;
  filterState: FilterState;
  onClearFilters: () => void;
  activeFilterCount: number;
  onOpenFilter?: () => void;
}

export const InputWashSummary: React.FC<InputWashSummaryProps> = ({
  totalInputQty,
  totalWashQty,
  filterState,
  onClearFilters,
  activeFilterCount,
}) => {
  const balance = totalInputQty - totalWashQty;
  const washPercentage =
    totalInputQty > 0 ? Math.min(Math.round((totalWashQty / totalInputQty) * 100), 999) : 0;

  // Active filter labels list
  const activeFiltersSummary: { label: string; value: string }[] = [];
  if (filterState.buyer) activeFiltersSummary.push({ label: 'Buyer', value: filterState.buyer });
  if (filterState.item) activeFiltersSummary.push({ label: 'Item', value: filterState.item });
  if (filterState.size) activeFiltersSummary.push({ label: 'Size', value: filterState.size });
  if (filterState.style) activeFiltersSummary.push({ label: 'Style', value: filterState.style });
  if (filterState.color) activeFiltersSummary.push({ label: 'Color', value: filterState.color });
  if (filterState.level) activeFiltersSummary.push({ label: 'Level', value: filterState.level });
  if (filterState.searchQuery) activeFiltersSummary.push({ label: 'Search', value: filterState.searchQuery });

  return (
    <div
      id="main-summary-card"
      className="w-full rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#0a1226]/90 to-[#070c1a]/95 border border-blue-500/25 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      {/* Subtle top ambient lighting */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-72 h-20 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 translate-x-1/2 w-72 h-20 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-blue-500/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                হিসাব সারসংক্ষেপ
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/25 font-mono">
                INPUT vs WASH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              {activeFilterCount > 0 ? 'ফিল্টার অনুযায়ী রিয়েল-টাইম হিসাব' : 'ফ্যাক্টরি লাইভ অটোমেটিক রিকনসিলিয়েশন'}
            </p>
          </div>
        </div>

        {/* Filter badge / clear button */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-xl px-2.5 py-1 text-xs text-amber-300 shadow-sm">
            <Filter className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="font-semibold text-[11px]">{activeFilterCount} টি ফিল্টার সক্রিয়</span>
            <button
              id="summary-clear-filter-btn"
              onClick={onClearFilters}
              className="ml-1 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 rounded-md p-1 transition-all"
              title="ফিল্টার ক্লিয়ার করুন"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Active Warning / Pill Strip */}
      {activeFiltersSummary.length > 0 && (
        <div className="mb-3.5 p-2 rounded-xl bg-slate-950/70 border border-blue-500/20 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px] mr-1">
            <Filter className="w-3 h-3 text-cyan-400" /> ফিল্টার:
          </span>
          {activeFiltersSummary.map((f, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/30 text-blue-200 font-mono text-[10px]"
            >
              <strong className="text-slate-300 font-sans">{f.label}:</strong> {f.value}
            </span>
          ))}
          <button
            onClick={onClearFilters}
            className="ml-auto text-[10px] text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
          >
            সব মুছুন
          </button>
        </div>
      )}

      {/* 
        =======================================================
        PREMIUM SUMMARY CARDS (Distinct Visual Identity)
        =======================================================
      */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: TOTAL INPUT */}
        <div className="relative rounded-xl p-3.5 sm:p-4 bg-gradient-to-b from-[#0b162e] to-[#080e1e] border border-blue-500/35 shadow-[0_0_20px_rgba(37,99,235,0.12)] hover:border-cyan-400/60 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-cyan-400" />
              TOTAL INPUT
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-400/30 font-mono">
              IN
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]">
              {formatQty(totalInputQty)}
            </span>
            <span className="text-xs text-cyan-400 font-bold font-mono">PCS</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>গার্মেন্টস ইনপুট ভলিউম</span>
          </div>
        </div>

        {/* Card 2: TOTAL WASH IN */}
        <div className="relative rounded-xl p-3.5 sm:p-4 bg-gradient-to-b from-[#180e2b] to-[#0d0818] border border-purple-500/35 shadow-[0_0_20px_rgba(168,85,247,0.12)] hover:border-purple-400/60 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-purple-400" />
              TOTAL WASH IN
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-extrabold border border-purple-400/30 font-mono">
              WASH
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
              {formatQty(totalWashQty)}
            </span>
            <span className="text-xs text-purple-400 font-bold font-mono">PCS</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>ওয়াশিং ডেলিভারি সম্পন্ন</span>
          </div>
        </div>

        {/* Card 3: BALANCE */}
        <div
          className={`relative rounded-xl p-3.5 sm:p-4 bg-gradient-to-b ${
            balance < 0
              ? 'from-[#240b12] to-[#14060b] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)] hover:border-rose-400/60'
              : balance === 0
              ? 'from-[#0b1c18] to-[#06100d] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-400/60'
              : 'from-[#0a1e1a] to-[#061210] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.18)] hover:border-emerald-400/60'
          } transition-all group overflow-hidden`}
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 ${
              balance < 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'
            } rounded-full blur-2xl pointer-events-none`}
          />

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scale
                className={`w-4 h-4 ${
                  balance < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              />
              BALANCE
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border font-mono ${
                balance < 0
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : balance === 0
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {balance < 0 ? 'OVER WASH' : balance === 0 ? 'BALANCED' : 'PENDING'}
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span
              className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${
                balance < 0
                  ? 'text-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]'
                  : 'text-emerald-300 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)]'
              }`}
            >
              {balance < 0 ? `-${formatQty(Math.abs(balance))}` : formatQty(balance)}
            </span>
            <span
              className={`text-xs font-bold font-mono ${
                balance < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              PCS
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-medium truncate">
            {balance > 0 && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>বাকি আছে: {formatQty(balance)} pcs ওয়াশ বাকি</span>
              </>
            )}
            {balance === 0 && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span>১০০% ব্যালেন্সড (In = Wash)</span>
              </>
            )}
            {balance < 0 && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span className="text-rose-300">ইনপুটের চেয়ে ওয়াশ বেশি</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress visualizer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-medium">ওয়াশ অগ্রগতি হার (Wash Progress):</span>
            <strong className="text-white font-mono bg-blue-500/20 px-1.5 py-0.2 rounded text-[11px] border border-blue-400/30">
              {washPercentage}%
            </strong>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {formatQty(totalWashQty)} / {formatQty(totalInputQty)} pcs
          </span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-blue-500/20 p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              washPercentage > 100
                ? 'bg-gradient-to-r from-purple-500 to-rose-500'
                : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
            }`}
            style={{ width: `${Math.min(washPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
