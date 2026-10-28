"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Edit2,
  Trash2,
  Mail,
  Building,
  CheckCircle,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import DemoDetailModal from "./components/DemoDetailModal";
import { getAdminDemos, updateAdminDemoStatus, deleteAdminDemo } from "@/lib/api";

const DEMO_STATUSES = ["New Request", "Confirmed", "Completed", "Cancelled"];

export default function AdminDemosPage() {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  // Modals
  const [activeDemo, setActiveDemo] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadDemos = async () => {
    try {
      setLoading(true);
      const res = await getAdminDemos();
      const list = res?.demos || (Array.isArray(res) ? res : (res?.data || []));
      const mapped = list.map((d) => ({
        id: d.id,
        contactName: d.fullName || d.contactName || "Prospective Client",
        company: d.company || "Enterprise Corp",
        businessEmail: d.workEmail || d.businessEmail || d.email,
        product: d.productSlug ? d.productSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : (d.productInterest || d.product || "Core Enterprise"),
        productSlug: d.productSlug || d.product || "core",
        country: d.country || "Global",
        preferredDate: d.preferredDate || "Scheduled",
        preferredTime: d.preferredTime || "10:00 AM",
        timeZone: d.timezone || d.timeZone || "UTC",
        assignedOwner: d.assignedOwner?.name || "Super Admin",
        status: d.status === "PENDING" ? "New Request" : d.status === "CONFIRMED" ? "Confirmed" : d.status === "COMPLETED" ? "Completed" : d.status === "CANCELLED" ? "Cancelled" : (d.status === "Pending Link" ? "New Request" : d.status || "New Request"),
        notes: d.notes || "",
        createdAt: d.createdAt || null,
      }));
      setDemos(mapped);
    } catch (e) {
      console.warn("Could not load demos:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemos();
  }, []);

  const filtered = demos.filter((d) => {
    const matchSearch =
      !search ||
      d.contactName?.toLowerCase().includes(search.toLowerCase()) ||
      d.company?.toLowerCase().includes(search.toLowerCase()) ||
      d.product?.toLowerCase().includes(search.toLowerCase()) ||
      d.businessEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    setDemos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    if (activeDemo && activeDemo.id === id) {
      setActiveDemo((prev) => ({ ...prev, status: newStatus }));
    }
    const prismaStatus = newStatus === "New Request" ? "PENDING" : newStatus.toUpperCase().replace(/\s+/g, "_");
    if (id && !id.startsWith("DEMO-")) {
      try {
        // [API IMPLEMENTATION] updateAdminDemoStatus() -> PATCH /api/v1/admin/demos/:id/status
        await updateAdminDemoStatus(id, prismaStatus);
      } catch (err) {
        console.warn("Could not update demo status on backend:", err.message);
      }
    }
    setToast({
      type: "success",
      message: "Status Updated",
      description: `Demo status changed to "${newStatus}".`,
    });
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    const targetId = cancelTarget.id;
    setDemos((prev) =>
      prev.map((d) => (d.id === targetId ? { ...d, status: "Cancelled" } : d))
    );
    if (targetId && !targetId.startsWith("DEMO-")) {
      try {
        // [API IMPLEMENTATION] updateAdminDemoStatus() -> PATCH /api/v1/admin/demos/:id/status
        await updateAdminDemoStatus(targetId, "CANCELLED");
      } catch (err) {
        console.warn("Could not update demo on backend:", err.message);
      }
    }
    setToast({
      type: "warning",
      message: "Demo Cancelled",
      description: `Booking for ${cancelTarget.contactName} has been cancelled.`,
    });
    setCancelTarget(null);
  };

  const columns = [
    {
      header: "Client & Organization",
      key: "contactName",
      render: (val, row) => (
        <div
          onClick={() => {
            setActiveDemo(row);
            setIsDetailOpen(true);
          }}
          className="cursor-pointer group"
        >
          <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">{val}</span>
          <div className="text-xs text-slate-500 font-medium mt-0.5">{row.company} • {row.country}</div>
          <div className="text-xs font-mono text-slate-400 mt-0.5">{row.businessEmail}</div>
        </div>
      ),
    },
    {
      header: "Product Requested",
      key: "product",
      render: (val) => <span className="font-semibold text-slate-800 text-sm">{val}</span>,
    },
    {
      header: "Requested Date & Time",
      key: "preferredDate",
      render: (d, row) => (
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Clock size={13} />
            <span>{d}, {row.preferredTime}</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
            Timezone: {row.timeZone}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (st, row) => (
        <select
          value={st || "New Request"}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold font-mono text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer shadow-2xs"
        >
          {DEMO_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveDemo(row);
              setIsDetailOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="View Details"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCancelTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Cancel Booking"
          >
            <Trash2 className="h-4 w-4" />
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
        title="Demo Booking Requests"
        description="Review incoming product demonstration appointments requested by prospective clients on the global website."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Demo Bookings" },
        ]}
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter demo bookings by client name, company, email or product..."
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: DEMO_STATUSES.map((s) => ({ label: s, value: s })),
          },
        ]}
        onReset={() => {
          setSearch("");
          setStatusFilter("");
        }}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyField="id"
        emptyMessage="No demo bookings found matching the selected filters."
      />

      {/* View & Edit Demo Details Modal */}
      <DemoDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        demo={activeDemo}
        demoStatuses={DEMO_STATUSES}
        onStatusChange={(id, st) => {
          handleStatusChange(id, st);
          setActiveDemo((prev) => (prev ? { ...prev, status: st } : null));
        }}
        onNotesChange={(val) => {
          setDemos(demos.map((d) => (d.id === activeDemo.id ? { ...d, notes: val } : d)));
          setActiveDemo({ ...activeDemo, notes: val });
        }}
      />

      {/* Cancel Confirmation Dialog */}
      {cancelTarget && (
        <AdminConfirmDialog
          isOpen={Boolean(cancelTarget)}
          title="Cancel Demo Booking"
          message={`Are you sure you want to cancel the scheduled demonstration with "${cancelTarget.contactName}" (${cancelTarget.company})?`}
          confirmLabel="Cancel Booking"
          confirmVariant="danger"
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}
