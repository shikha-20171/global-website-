"use client";

export default function AdminTabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto [scrollbar-width:none] ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap -mb-[1px] ${
              isActive
                ? "border-blue-600 text-blue-700 bg-blue-50/40"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {Icon && <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                isActive ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
