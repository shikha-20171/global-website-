"use client";

import AdminModal from "@/components/admin/AdminModal";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

export default function PartnerEditorModal({
  isOpen,
  onClose,
  partner,
  onSave,
  onChange,
}) {
  if (!isOpen || !partner) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={partner.name ? `Edit Partner: ${partner.name}` : "Add Partner Organization"}
      description="Upload partner logo, enter company details, category, and website."
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition"
          >
            Save Partner
          </button>
        </div>
      }
    >
      <form onSubmit={onSave} className="space-y-4">
        {/* Direct Logo Upload on the Page */}
        <AdminImageUploader
          label="Partner Logo"
          value={partner.logoUrl || partner.logo || ""}
          onChange={(url) => onChange({ ...partner, logoUrl: url, logo: url })}
          hint="Upload brand logo or SVG (max 5MB)."
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Partner Name *
          </label>
          <input
            type="text"
            value={partner.name || ""}
            onChange={(e) => onChange({ ...partner, name: e.target.value })}
            className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. Amazon Web Services"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            value={partner.website || ""}
            onChange={(e) => onChange({ ...partner, website: e.target.value })}
            className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-500 focus:outline-none"
            placeholder="https://aws.amazon.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={partner.category || ""}
              onChange={(e) => onChange({ ...partner, category: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Cloud Infrastructure"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alliance Tier
            </label>
            <input
              type="text"
              value={partner.tier || ""}
              onChange={(e) => onChange({ ...partner, tier: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Strategic Partner"
            />
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
