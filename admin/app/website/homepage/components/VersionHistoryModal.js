"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function VersionHistoryModal({
  isOpen,
  onClose,
  onRollback,
}) {
  if (!isOpen) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Homepage Version History"
      description="Select an approved SRS revision snapshot to roll back layout configurations."
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onRollback}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition active:scale-[0.98]"
          >
            Restore Initial SRS Baseline
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-blue-950">
              v1.2.0 (Current Live Baseline)
            </span>
            <span className="text-xs text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono font-bold">
              Active
            </span>
          </div>
          <p className="text-xs text-blue-900/80">
            Published Oct 14, 2026 by Super Admin. All 11 sections operational.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              v1.1.0 (Pre-launch Staging Snapshot)
            </span>
            <span className="text-xs text-slate-500 font-mono">Oct 10, 2026</span>
          </div>
          <p className="text-xs text-slate-600">
            Initial verification of trust metrics and SaaS carousel widgets.
          </p>
        </div>
      </div>
    </AdminModal>
  );
}
