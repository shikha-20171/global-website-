import { Inbox, Plus } from "lucide-react";

export default function AdminEmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  description = "No items match your active filters or search criteria.",
  action,
}) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-graphite/40 py-12 px-6 text-center">
      <div className="mx-auto h-12 w-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-cool">
        <Icon size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-white font-exo">
        {title}
      </h3>
      <p className="mt-1 text-xs text-cool max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="mt-4">
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 rounded-lg border border-electric/40 bg-electric/15 hover:bg-electric/25 text-electric px-3.5 py-1.5 text-xs font-medium transition"
          >
            {action.icon ? <action.icon size={14} /> : <Plus size={14} />}
            <span>{action.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
