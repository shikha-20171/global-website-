"use client";

import AdminModal from "@/components/admin/AdminModal";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

export default function EditSectionModal({
  isOpen,
  onClose,
  section,
  onChange,
  onSave,
}) {
  if (!isOpen || !section) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Copy: ${section.name}`}
      description="Update section headline, description, CTA labels and linking targets."
      size="lg"
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
            Apply Changes
          </button>
        </div>
      }
    >
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Section Headline
          </label>
          <input
            type="text"
            value={section.headline || ""}
            onChange={(e) => onChange({ ...section, headline: e.target.value })}
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Subheadline / Description
          </label>
          <textarea
            rows={3}
            value={section.subheadline || ""}
            onChange={(e) => onChange({ ...section, subheadline: e.target.value })}
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Section Graphic / Banner Image
          </label>
          <AdminImageUploader
            value={section.imageUrl || ""}
            onChange={(url) => onChange({ ...section, imageUrl: url })}
            label="Section Image / Illustration"
            hint="Upload graphic, mockup, or banner for this section"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary CTA Label
            </label>
            <input
              type="text"
              value={section.primaryCtaLabel || ""}
              onChange={(e) =>
                onChange({
                  ...section,
                  primaryCtaLabel: e.target.value,
                })
              }
              placeholder="e.g. Explore Products"
              className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary CTA Destination URL
            </label>
            <input
              type="text"
              value={section.primaryCtaUrl || ""}
              onChange={(e) =>
                onChange({
                  ...section,
                  primaryCtaUrl: e.target.value,
                })
              }
              placeholder="e.g. /products"
              className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Secondary CTA Label
            </label>
            <input
              type="text"
              value={section.secondaryCtaLabel || ""}
              onChange={(e) =>
                onChange({
                  ...section,
                  secondaryCtaLabel: e.target.value,
                })
              }
              placeholder="e.g. Contact Sales"
              className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Secondary CTA Destination URL
            </label>
            <input
              type="text"
              value={section.secondaryCtaUrl || ""}
              onChange={(e) =>
                onChange({
                  ...section,
                  secondaryCtaUrl: e.target.value,
                })
              }
              placeholder="e.g. /contact-sales"
              className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
            />
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
