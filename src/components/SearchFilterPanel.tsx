import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  X,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { FilterState, GarmentInputRecord, GarmentWashRecord } from '../types';

interface SearchFilterPanelProps {
  filterState: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  inputs: GarmentInputRecord[];
  washRecords: GarmentWashRecord[];
  activeFilterCount: number;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filterState,
  onFilterChange,
  onClearFilters,
  inputs,
  washRecords,
  activeFilterCount,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    'all' | 'buyer' | 'item' | 'size' | 'style' | 'color' | 'level'
  >('all');

  // Extract unique options across both inputs and wash records
  const uniqueBuyers = Array.from(
    new Set([
      ...inputs.map((i) => i.buyer?.trim()).filter(Boolean),
      ...washRecords.map((w) => w.buyer?.trim()).filter(Boolean),
    ])
  ).sort();

  const uniqueItems = Array.from(
    new Set([
      ...inputs.map((i) => i.item?.trim()).filter(Boolean),
      ...washRecords.map((w) => w.item?.trim()).filter(Boolean),
    ])
  ).sort();

  const uniqueSizes = Array.from(
    new Set([
      ...inputs.map((i) => i.size?.trim()).filter(Boolean),
      ...washRecords.map((w) => w.size?.trim()).filter(Boolean),
    ])
  ).sort();

  const uniqueStyles = Array.from(
    new Set([
      ...inputs.map((i) => i.style?.trim()).filter(Boolean),
      ...washRecords.map((w) => w.style?.trim()).filter(Boolean),
    ])
  ).sort();

  const uniqueColors = Array.from(
    new Set([
      ...inputs.map((i) => i.color?.trim()).filter(Boolean),
      ...washRecords.map((w) => w.color?.trim()).filter(Boolean),
    ])
  ).sort();

  const uniqueLevels = Array.from(
    new Set([
      ...inputs.map((i) => i.level?.trim()).filter(Boolean),
      ...washRecords.map((w) => w.level?.trim()).filter(Boolean),
    ])
  ).sort();

  return (
    <div
      id="search-filter-panel"
      className="w-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#080e1c]/95 border border-blue-500/25 p-3 sm:p-4 backdrop-blur-2xl shadow-lg shadow-blue-950/30 transition-all"
    >
      {/* 
        =======================================================
        HIGH-END ADVANCED SEARCH BAR
        =======================================================
      */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input Box */}
        <div className="relative flex-1 group">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-cyan-300 transition-colors" />
          <input
            id="quick-search-input"
            type="text"
            value={filterState.searchQuery}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="🔍 Search Buyer, Item, Style, Color..."
            className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 hover:bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center transition-all"
              title="সার্চ মুছুন"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Toggle & Clear All */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <button
            id="toggle-filter-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeFilterCount > 0 || isExpanded
                ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>ফিল্টার প্যানেল</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              id="clear-all-filter-btn"
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/35 hover:bg-rose-500/25 active:scale-95 transition-all shadow-sm"
              title="সব ফিল্টার রিসেট করুন"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* 
        =======================================================
        EXPANDED FILTER PANEL WITH GLOWING CHIPS
        =======================================================
      */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-blue-500/20 space-y-3 animate-in fade-in duration-200">
          {/* Filter Category Chips Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'সব ক্যাটাগরি', count: activeFilterCount },
              { id: 'buyer', label: 'Buyer', active: Boolean(filterState.buyer) },
              { id: 'item', label: 'Item', active: Boolean(filterState.item) },
              { id: 'size', label: 'Size', active: Boolean(filterState.size) },
              { id: 'style', label: 'Style', active: Boolean(filterState.style) },
              { id: 'color', label: 'Color', active: Boolean(filterState.color) },
              { id: 'level', label: 'Level', active: Boolean(filterState.level) },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategoryTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                    : tab.active
                    ? 'bg-blue-600/25 text-blue-200 border border-blue-400/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Detailed Dropdown & Filter Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* 1. Buyer */}
            <div
              className={`p-2 rounded-xl bg-slate-950/70 border transition-all ${
                filterState.buyer
                  ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-blue-500/20'
              }`}
            >
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" /> Buyer
                </span>
                {filterState.buyer && (
                  <button
                    onClick={() => onFilterChange({ buyer: '' })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </label>
              <select
                id="filter-buyer-select"
                value={filterState.buyer}
                onChange={(e) => onFilterChange({ buyer: e.target.value })}
                className="w-full bg-slate-900 border border-blue-500/25 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">সব Buyer</option>
                {uniqueBuyers.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Item */}
            <div
              className={`p-2 rounded-xl bg-slate-950/70 border transition-all ${
                filterState.item
                  ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-blue-500/20'
              }`}
            >
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-400" /> Item
                </span>
                {filterState.item && (
                  <button
                    onClick={() => onFilterChange({ item: '' })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </label>
              <select
                id="filter-item-select"
                value={filterState.item}
                onChange={(e) => onFilterChange({ item: e.target.value })}
                className="w-full bg-slate-900 border border-blue-500/25 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">সব Item</option>
                {uniqueItems.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Size */}
            <div
              className={`p-2 rounded-xl bg-slate-950/70 border transition-all ${
                filterState.size
                  ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-blue-500/20'
              }`}
            >
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-400" /> Size
                </span>
                {filterState.size && (
                  <button
                    onClick={() => onFilterChange({ size: '' })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </label>
              <select
                id="filter-size-select"
                value={filterState.size}
                onChange={(e) => onFilterChange({ size: e.target.value })}
                className="w-full bg-slate-900 border border-blue-500/25 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">সব Size</option>
                {uniqueSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Style */}
            <div
              className={`p-2 rounded-xl bg-slate-950/70 border transition-all ${
                filterState.style
                  ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-blue-500/20'
              }`}
            >
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-purple-400" /> Style
                </span>
                {filterState.style && (
                  <button
                    onClick={() => onFilterChange({ style: '' })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </label>
              <select
                id="filter-style-select"
                value={filterState.style}
                onChange={(e) => onFilterChange({ style: e.target.value })}
                className="w-full bg-slate-900 border border-blue-500/25 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">সব Style</option>
                {uniqueStyles.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Color */}
            <div
              className={`p-2 rounded-xl bg-slate-950/70 border transition-all ${
                filterState.color
                  ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-blue-500/20'
              }`}
            >
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-pink-400" /> Color
                </span>
                {filterState.color && (
                  <button
                    onClick={() => onFilterChange({ color: '' })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </label>
              <select
                id="filter-color-select"
                value={filterState.color}
                onChange={(e) => onFilterChange({ color: e.target.value })}
                className="w-full bg-slate-900 border border-blue-500/25 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">সব Color</option>
                {uniqueColors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Level */}
            <div
              className={`p-2 rounded-xl bg-slate-950/70 border transition-all ${
                filterState.level
                  ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-blue-500/20'
              }`}
            >
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-400" /> Level
                </span>
                {filterState.level && (
                  <button
                    onClick={() => onFilterChange({ level: '' })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </label>
              <select
                id="filter-level-select"
                value={filterState.level}
                onChange={(e) => onFilterChange({ level: e.target.value })}
                className="w-full bg-slate-900 border border-blue-500/25 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">সব Level</option>
                {uniqueLevels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
