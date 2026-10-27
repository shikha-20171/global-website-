"use client";

import { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

export default function LeaderModal({
  isOpen,
  onClose,
  leader,
  isEdit = false,
  onSave,
}) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (leader) {
      setFormData({ ...leader, avatar: leader.avatar || "" });
    }
  }, [leader]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Executive Member" : "Add Executive Member"}
      subtitle="Displayed on /company leadership matrix"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
          >
            Save Leader
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Executive Photo / Portrait
          </label>
          <AdminImageUploader
            value={formData.avatar || ""}
            onChange={(url) => setFormData({ ...formData, avatar: url })}
            label="Leader Photo"
            hint="Square portrait (e.g. 400x400) recommended"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Dr. Alexander Wright"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Executive Role / Title *
            </label>
            <input
              type="text"
              required
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Chief Executive Officer"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operating Location
            </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bhopal, India"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Executive Biography
          </label>
          <textarea
            rows={3}
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Background and architectural specialization..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>
      </form>
    </AdminModal>
  );
}
