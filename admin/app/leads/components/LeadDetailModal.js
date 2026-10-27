"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function LeadDetailModal({
  isOpen,
  onClose,
  lead,
  pipelineStatuses = [],
  onStatusChange,
  onNotesChange,
}) {
  if (!isOpen || !lead) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inquiry from ${lead.name}`}
      description={`Submitted from ${lead.country || "Global"} for ${lead.company || "Enterprise"}`}
      size="md"
      footer={
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-2xs"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block">Contact Person</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{lead.name}</span>
            <a
              href={`mailto:${lead.email}`}
              className="text-blue-600 hover:underline mt-0.5 block font-mono"
            >
              {lead.email}
            </a>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Company & Country</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {lead.company || "N/A"}
            </span>
            <span className="text-slate-600 mt-0.5 block">{lead.country || "Global"}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 font-medium block">Requested Product / Service</span>
          <span className="font-bold text-slate-900 text-sm mt-0.5 block">
            {lead.product || "General Enterprise Solutions"}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Inquiry Stage
          </label>
          <select
            value={lead.status || "New"}
            onChange={(e) => onStatusChange?.(lead.id, e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-semibold focus:border-blue-600 focus:outline-none"
          >
            {pipelineStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Internal Follow-Up Notes
          </label>
          <textarea
            rows={4}
            value={lead.notes || ""}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="Add meeting notes, client requirements, or follow-up details..."
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </AdminModal>
  );
}
