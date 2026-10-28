"use client";

import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function AdminFilterBar({
  search = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [], // array of { key, label, value, options: [{ label, value }], onChange }
  sort = "",
  sortOptions = [], // array of { label, value }
  onSortChange,
  onReset,
  totalCount,
  filteredCount,
  itemLabel = "records",
}) {
  const hasActiveFilters =
    Boolean(search) || filters.some((f) => Boolean(f.value));

  return (
    <div className="space-y-3 mb-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-1 sm:pb-0">
          {filters.map((filter) => (
            <div key={filter.key} className="flex-shrink-0">
              <select
                value={filter.value || ""}
                onChange={(e) => filter.onChange && filter.onChange(e.target.value)}
                className={`text-sm rounded-xl border px-3.5 py-2.5 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition cursor-pointer shadow-2xs ${
                  filter.value
                    ? "border-blue-600 text-blue-700 font-bold bg-blue-50/50"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 font-medium"
                }`}
              >
                <option value="" className="bg-white text-slate-800">
                  {filter.label}: All
                </option>
                {filter.options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white text-slate-800"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Sort Dropdown */}
          {sortOptions.length > 0 && (
            <div className="flex-shrink-0">
              <select
                value={sort}
                onChange={(e) => onSortChange && onSortChange(e.target.value)}
                className="text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-700 hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition cursor-pointer font-medium shadow-2xs"
              >
                {sortOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white text-slate-800"
                  >
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Summary */}
      {typeof totalCount === "number" && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800 font-bold">{filteredCount ?? totalCount}</strong> of{" "}
            <strong className="text-slate-800 font-bold">{totalCount}</strong> {itemLabel}
          </span>
          {hasActiveFilters && (
            <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">Filtered results</span>
          )}
        </div>
      )}
    </div>
  );
}
