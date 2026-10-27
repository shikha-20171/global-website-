"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function EditUserModal({
  isOpen,
  onClose,
  editingUser,
  rolesList = [],
  onChange,
  onSave,
}) {
  if (!isOpen || !editingUser) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Administrator: ${editingUser.name}`}
      description="Update assigned role profile, status and access policies."
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-line text-xs text-cool hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-1.5 rounded-lg bg-electric text-white text-xs font-medium hover:bg-electric/90"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) => onChange({ ...editingUser, name: e.target.value })}
            className="w-full text-xs rounded-lg border border-line bg-ink/70 px-3 py-2 text-white focus:border-electric focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Assigned Role
          </label>
          <select
            value={editingUser.role}
            onChange={(e) => onChange({ ...editingUser, role: e.target.value })}
            className="w-full text-xs rounded-lg border border-line bg-ink/70 px-3 py-2 text-white focus:border-electric focus:outline-none"
          >
            {rolesList.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Account Status
          </label>
          <select
            value={editingUser.status}
            onChange={(e) => onChange({ ...editingUser, status: e.target.value })}
            className="w-full text-xs rounded-lg border border-line bg-ink/70 px-3 py-2 text-white focus:border-electric focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending Invite</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </form>
    </AdminModal>
  );
}
