"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function NavLinkModal({
  isOpen,
  onClose,
  link,
  onChange,
  onSave,
}) {
  if (!isOpen || !link) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Navigation Link"
      description="Specify user-facing label and destination route."
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
            onClick={onSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition active:scale-[0.98]"
          >
            Save Link
          </button>
        </div>
      }
    >
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Link Label *
          </label>
          <input
            type="text"
            value={link.label || ""}
            onChange={(e) => onChange({ ...link, label: e.target.value })}
            placeholder="e.g. Products"
            required
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Destination Route / URL *
          </label>
          <input
            type="text"
            value={link.href || ""}
            onChange={(e) => onChange({ ...link, href: e.target.value })}
            placeholder="e.g. /products"
            required
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
          />
        </div>
      </form>
    </AdminModal>
  );
}
