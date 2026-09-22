import React from 'react';
import { Scale, CheckCircle2, Clock, AlertTriangle, ArrowRight, Package, Waves, Sparkles, TrendingUp } from 'lucide-react';
import { GarmentInputRecord, GarmentWashRecord } from '../types';
import { formatQty } from '../utils/storage';

interface CombinedBalanceViewProps {
  inputs: GarmentInputRecord[];
  washRecords: GarmentWashRecord[];
  totalInputQty: number;
  totalWashQty: number;
}

export const CombinedBalanceView: React.FC<CombinedBalanceViewProps> = ({
  inputs,
  washRecords,
  totalInputQty,
  totalWashQty,
}) => {
  const overallBalance = totalInputQty - totalWashQty;

  // Aggregate by Style
  const styleAggregates: Record<
    string,
    {
      style: string;
      buyer: string;
      item: string;
      color: string;
      inputQty: number;
      washQty: number;
    }
  > = {};

  inputs.forEach((inp) => {
    const key = inp.style ? inp.style.trim().toUpperCase() : 'UNKNOWN';
    if (!styleAggregates[key]) {
      styleAggregates[key] = {
        style: inp.style || 'Unspecified',
        buyer: inp.buyer,
        item: inp.item,
        color: inp.color,
        inputQty: 0,
        washQty: 0,
      };
    }
    styleAggregates[key].inputQty += inp.quantity;
  });

  washRecords.forEach((w) => {
    const key = w.style ? w.style.trim().toUpperCase() : 'UNKNOWN';
    if (!styleAggregates[key]) {
      styleAggregates[key] = {
        style: w.style || 'Unspecified',
        buyer: w.buyer || 'General',
        item: w.item || 'General',
        color: w.color || '-',
        inputQty: 0,
        washQty: 0,
      };
    }
    styleAggregates[key].washQty += w.quantity;
  });

  const styleList = Object.values(styleAggregates).sort((a, b) => b.inputQty - a.inputQty);

  return (
    <div id="combined-balance-view" className="space-y-4">
      {/* Top Banner Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d1c24] via-[#09151e] to-[#050b12] border border-emerald-500/35 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>স্টাইল ভিত্তিক ব্যালেন্স রিকনসিলিয়েশন</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              ইনপুট বনাম ওয়াশ ডেলিভারির নিখুঁত ব্যালেন্স পর্যবেক্ষণ
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 shadow-inner">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">মোট ইনপুট</span>
            <span className="text-xs sm:text-base font-black text-cyan-300 font-mono">
              {formatQty(totalInputQty)} <span className="text-[9px] font-sans font-normal text-slate-400">pcs</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">মোট ওয়াশ</span>
            <span className="text-xs sm:text-base font-black text-purple-300 font-mono">
              {formatQty(totalWashQty)} <span className="text-[9px] font-sans font-normal text-slate-400">pcs</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">ব্যালেন্স বাকি</span>
            <span
              className={`text-xs sm:text-base font-black font-mono ${
                overallBalance < 0
                  ? 'text-rose-400'
                  : overallBalance === 0
                  ? 'text-emerald-400'
                  : 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              }`}
            >
              {overallBalance < 0 ? `-${formatQty(Math.abs(overallBalance))}` : formatQty(overallBalance)}{' '}
              <span className="text-[9px] font-sans font-normal text-slate-400">pcs</span>
            </span>
          </div>
        </div>
      </div>

      {/* Style Breakdown Cards List */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#070b14]/95 border border-blue-500/25 backdrop-blur-2xl overflow-hidden shadow-lg shadow-blue-950/30">
        <div className="p-3.5 sm:p-4 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">স্টাইল রিকনসিলিয়েশন কার্ড ({styleList.length})</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">স্টাইল সংখ্যা: {styleList.length}</span>
        </div>

        {styleList.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            <Scale className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-40" />
            এখনো কোনো স্টাইলের ইনপুট বা ওয়াশ ডাটা পাওয়া যায়নি।
          </div>
        ) : (
          <div className="divide-y divide-blue-500/10">
            {styleList.map((st, idx) => {
              const diff = st.inputQty - st.washQty;
              const percent = st.inputQty > 0 ? Math.round((st.washQty / st.inputQty) * 100) : 0;

              return (
                <div key={idx} className="p-3.5 sm:p-4 hover:bg-slate-800/30 transition-all space-y-2.5">
                  <div className="flex items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-blue-950/80 border border-purple-500/35 text-purple-300">
                          {st.style}
                        </span>
                        <span className="text-xs font-black text-white">{st.buyer}</span>
                        <span className="text-[11px] text-slate-400">({st.item})</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        diff === 0 && st.inputQty > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                          : diff > 0
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : diff < 0
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {diff === 0 && st.inputQty > 0
                        ? '✓ 100% সম্পূর্ণ'
                        : diff > 0
                        ? `বাকি: ${formatQty(diff)} pcs`
                        : `অতিরিক্ত: ${formatQty(Math.abs(diff))} pcs`}
                    </span>
                  </div>

                  {/* 3 Columns metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">ইনপুট:</span>
                      <span className="font-mono font-black text-cyan-300">{formatQty(st.inputQty)} pcs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">ওয়াশে গেছে:</span>
                      <span className="font-mono font-black text-purple-300">{formatQty(st.washQty)} pcs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">ব্যালেন্স:</span>
                      <span
                        className={`font-mono font-black ${
                          diff < 0 ? 'text-rose-400' : diff === 0 ? 'text-emerald-400' : 'text-emerald-300'
                        }`}
                      >
                        {diff < 0 ? `-${formatQty(Math.abs(diff))}` : formatQty(diff)} pcs
                      </span>
                    </div>
                  </div>

                  {/* High class progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>ওয়াশ অগ্রগতি</span>
                      <span className="font-bold text-white">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent >= 100
                            ? 'bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : percent >= 50
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
