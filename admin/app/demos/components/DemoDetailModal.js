"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function DemoDetailModal({
  isOpen,
  onClose,
  demo,
  demoStatuses = [],
  onStatusChange,
  onNotesChange,
}) {
  if (!isOpen || !demo) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Demo Request: ${demo.contactName}`}
      description={`${demo.company} • ${demo.country}`}
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
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Company
            </span>
            <p className="text-slate-900 font-bold mt-0.5 text-sm">
              {demo.company} ({demo.country})
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Business Email
            </span>
            <a
              href={`mailto:${demo.businessEmail}`}
              className="text-blue-600 hover:underline font-mono font-medium mt-0.5 block"
            >
              {demo.businessEmail}
            </a>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Product Interest
            </span>
            <p className="text-blue-700 font-bold mt-0.5 text-sm">{demo.product}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Requested Schedule
            </span>
            <p className="text-slate-900 font-bold mt-0.5 text-xs">
              {demo.preferredDate}, {demo.preferredTime} ({demo.timeZone})
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Booking Status
          </label>
          <select
            value={demo.status || "New Request"}
            onChange={(e) => onStatusChange?.(demo.id, e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 font-semibold focus:border-blue-600 focus:outline-none"
          >
            {demoStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Client Requirements / Discussion Notes
          </label>
          <textarea
            rows={4}
            value={demo.notes || ""}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="Client requirements, software modules they want to see, or follow-up notes..."
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </AdminModal>
  );
}
