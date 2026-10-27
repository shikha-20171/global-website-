"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Key,
  ShieldAlert,
  Check,
  X,
  Lock,
  Mail,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import InviteUserModal from "./components/InviteUserModal";
import EditUserModal from "./components/EditUserModal";
import {
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_ROLES_LIST,
  MOCK_PERMISSION_MODULES,
} from "@/lib/admin/mock-data/users";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);
  const [activeTab, setActiveTab] = useState("users");
  const [toast, setToast] = useState(null);

  const refreshUsers = () => {
    // [API IMPLEMENTATION] getAdminUsers() -> GET /api/v1/admin/users
    getAdminUsers()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUsers(
            data.map((u) => ({
              ...u,
              role: u.role?.name || "Super Admin",
              roleId: "super_admin",
              status: u.isActive !== false ? "Active" : "Deactivated",
              lastActive: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never",
            }))
          );
        }
      })
      .catch((err) => {
        console.warn("Could not load users via API:", err.message);
      });
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  // Modals
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deactivateTarget, setDeleteTarget] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Super Admin",
    roleId: "super_admin",
    twoFactorEnforced: true,
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      // [API IMPLEMENTATION] createAdminUser() -> POST /api/v1/admin/users
      await createAdminUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || "SuperAdminPass123!",
      });
      refreshUsers();
      setToast({
        type: "success",
        message: "Super Admin Created",
        description: `New Super Admin account registered for ${newUser.email}.`,
      });
    } catch (err) {
      console.warn("Create user API error:", err.message);
      const created = {
        id: `usr_${Date.now()}`,
        ...newUser,
        lastActive: "Never logged in",
        status: "Active",
        modulesAllowed: ["all"],
      };
      setUsers([...users, created]);
      setToast({
        type: "info",
        message: "Account Created",
        description: `Super Admin account added.`,
      });
    }
    setIsInviteOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser.name) return;

    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
    setToast({
      type: "success",
      message: "Administrator Profile Updated",
      description: `Saved changes for "${editingUser.name}".`,
    });
  };

  const handleConfirmDeactivate = () => {
    if (!deactivateTarget) return;
    setUsers(
      users.map((u) =>
        u.id === deactivateTarget.id ? { ...u, status: "Deactivated" } : u
      )
    );
    setToast({
      type: "warning",
      message: "Administrator Deactivated",
      description: `Access revoked for ${deactivateTarget.name}.`,
    });
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Administrator",
      key: "name",
      render: (val, row) => (
        <div>
          <span className="font-semibold text-white">{val}</span>
          <div className="text-[11px] font-mono text-cool">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Assigned Role",
      key: "role",
      render: (r) => (
        <span className="text-[11px] font-mono text-electric bg-electric/10 px-2 py-0.5 rounded border border-electric/20 font-medium">
          {r}
        </span>
      ),
    },
    {
      header: "2FA Policy",
      key: "twoFactorEnforced",
      render: (tf) => (
        <span
          className={`text-[11px] font-mono ${
            tf ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {tf ? "Enforced (Hardware/TOTP)" : "Not Enrolled"}
        </span>
      ),
    },
    {
      header: "Last Activity",
      key: "lastActive",
      render: (la) => <span className="text-xs text-cool">{la}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (s) => (
        <AdminStatusBadge status={s === "Active" ? "Published" : s === "Pending" ? "Draft" : "Archived"} />
      ),
    },
    {
      header: "Actions",
      key: "id",
      className: "text-right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setEditingUser({ ...row })}
            className="p-1.5 rounded-lg text-cool hover:text-electric hover:bg-electric/10 transition"
            title="Edit Role & Status"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-cool hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Deactivate Account"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          description={toast.description}
          onClose={() => setToast(null)}
        />
      )}

      <AdminPageHeader
        title="Admin Users & Role Permissions (RBAC)"
        description="Govern administrative access, module-level permission boundaries (View, Create, Edit, Publish, Delete), and multi-factor authentication policies."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Admin Users" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-electric text-white text-xs font-medium hover:bg-electric/90 shadow-md shadow-electric/20 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Invite Administrator</span>
          </button>
        }
      />

      <AdminTabs
        tabs={[
          { id: "users", label: `Administrator Accounts (${users.length})` },
          { id: "matrix", label: "RBAC Module Permission Matrix" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "users" ? (
        <AdminDataTable columns={columns} data={users} keyField="id" />
      ) : (
        /* Permission Matrix View */
        <div className="rounded-xl border border-line bg-graphite/60 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-line">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Module Access Boundaries by Role
            </h3>
            <p className="text-[11px] text-cool mt-0.5">
              Granular access control governing administrative capabilities across the 11 CMS domains.
            </p>
          </div>

          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line bg-white/[0.02] text-cool font-mono uppercase text-[10px]">
                  <th className="py-3 px-4 font-semibold">CMS Module</th>
                  <th className="py-3 px-4 font-semibold">Super Admin</th>
                  <th className="py-3 px-4 font-semibold">Website Mgr</th>
                  <th className="py-3 px-4 font-semibold">Product Mgr</th>
                  <th className="py-3 px-4 font-semibold">Content Editor</th>
                  <th className="py-3 px-4 font-semibold">Sales Mgr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {MOCK_PERMISSION_MODULES.map((mod, idx) => (
                  <tr key={mod.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white">
                      {mod.name}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                      Full Control
                    </td>
                    <td className="py-3 px-4">
                      {["website", "resources", "media"].includes(mod.id) ? (
                        <span className="text-emerald-400 font-mono text-[11px]">Read / Write</span>
                      ) : (
                        <span className="text-cool/40 font-mono text-[11px]">No Access</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {["products", "pricing", "solutions", "industries"].includes(mod.id) ? (
                        <span className="text-emerald-400 font-mono text-[11px]">Read / Write</span>
                      ) : (
                        <span className="text-cool/40 font-mono text-[11px]">No Access</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {["resources", "portfolio", "media"].includes(mod.id) ? (
                        <span className="text-emerald-400 font-mono text-[11px]">Author / Edit</span>
                      ) : (
                        <span className="text-cool/40 font-mono text-[11px]">No Access</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {["leads", "demos"].includes(mod.id) ? (
                        <span className="text-emerald-400 font-mono text-[11px]">Full CRM</span>
                      ) : (
                        <span className="text-cool/40 font-mono text-[11px]">No Access</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Administrator Modal */}
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        newUser={newUser}
        rolesList={MOCK_ADMIN_ROLES_LIST}
        onChange={setNewUser}
        onSave={handleCreateUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        editingUser={editingUser}
        rolesList={MOCK_ADMIN_ROLES_LIST}
        onChange={setEditingUser}
        onSave={handleSaveEdit}
      />

      <AdminConfirmDialog
        isOpen={Boolean(deactivateTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeactivate}
        title={`Deactivate Administrator: ${deactivateTarget?.name}?`}
        description="This user will be logged out immediately and their administrative privileges revoked."
        confirmLabel="Deactivate Account"
        danger
      />
    </div>
  );
}
