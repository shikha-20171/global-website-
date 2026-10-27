"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function InviteUserModal({
  isOpen,
  onClose,
  newUser,
  rolesList = [],
  onChange,
  onSave,
}) {
  if (!isOpen || !newUser) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Provision Administrator Access"
      description="Create a new administrator account and assign organizational role permissions."
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
            Send Invite
          </button>
        </div>
      }
    >
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={newUser.name}
            onChange={(e) => onChange({ ...newUser, name: e.target.value })}
            placeholder="e.g. David Vance"
            className="w-full text-xs rounded-lg border border-line bg-ink/70 px-3 py-2 text-white focus:border-electric focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Corporate Email Address *
          </label>
          <input
            type="email"
            required
            value={newUser.email}
            onChange={(e) => onChange({ ...newUser, email: e.target.value })}
            placeholder="name@dezoryn.com"
            className="w-full text-xs rounded-lg border border-line bg-ink/70 px-3 py-2 text-white focus:border-electric focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Assigned Role Profile
          </label>
          <select
            value={newUser.role}
            onChange={(e) => onChange({ ...newUser, role: e.target.value })}
            className="w-full text-xs rounded-lg border border-line bg-ink/70 px-3 py-2 text-white focus:border-electric focus:outline-none"
          >
            {rolesList.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
            <input
              type="checkbox"
              checked={newUser.twoFactorEnforced}
              onChange={(e) =>
                onChange({ ...newUser, twoFactorEnforced: e.target.checked })
              }
              className="rounded border-line bg-ink/80 text-electric focus:ring-0"
            />
            <span>Enforce Two-Factor Authentication (2FA) upon first login</span>
          </label>
        </div>
      </form>
    </AdminModal>
  );
}
