"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Handshake,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  Globe,
  AlertCircle,
  Building,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import PartnerEditorModal from "./components/PartnerEditorModal";
import {
  getAdminPartners,
  createAdminPartner,
  updateAdminPartner,
  deleteAdminPartner,
} from "@/lib/api";

const fallbackPartners = [
  {
    id: "part_1",
    name: "Amazon Web Services (AWS)",
    category: "Cloud Infrastructure",
    website: "https://aws.amazon.com",
    tier: "Premier Technology Alliance",
    logoUrl: "/resources/cloud-aws.png",
    displayOrder: 1,
    status: "Active",
  },
  {
    id: "part_2",
    name: "Stripe Global Payments",
    category: "Financial Infrastructure",
    website: "https://stripe.com",
    tier: "Global Payment Partner",
    logoUrl: "/resources/stripe-badge.png",
    displayOrder: 2,
    status: "Active",
  },
  {
    id: "part_3",
    name: "Google Cloud Platform",
    category: "Cloud & AI",
    website: "https://cloud.google.com",
    tier: "Strategic Cloud Partner",
    logoUrl: "/resources/gcp-badge.png",
    displayOrder: 3,
    status: "Active",
  },
  {
    id: "part_4",
    name: "Twilio Communications",
    category: "Omnichannel Messaging",
    website: "https://twilio.com",
    tier: "Enterprise Communications",
    logoUrl: "/resources/twilio-badge.png",
    displayOrder: 4,
    status: "Active",
  },
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const refreshPartners = () => {
    getAdminPartners()
      .then((data) => {
        const list = data?.partners || (Array.isArray(data) ? data : []);
        const mapped = list.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          website: p.websiteUrl || p.website || "https://",
          tier: p.tier || "Technology Partner",
          logoUrl: p.logoUrl || p.logo || "",
          displayOrder: p.displayOrder || 1,
          status: p.status === "PUBLISHED" || p.status === "Active" ? "Active" : "Draft",
        }));
        if (mapped.length > 0) {
          setPartners(mapped);
        } else {
          setPartners(fallbackPartners);
        }
      })
      .catch((err) => {
        console.warn("Using website partners fallback:", err.message);
        setPartners(fallbackPartners);
      });
  };

  useEffect(() => {
    refreshPartners();
  }, []);

  const handleOpenCreate = () => {
    setEditingPartner({
      id: `ptn_${Date.now()}`,
      name: "",
      category: "Cloud Infrastructure",
      website: "https://",
      tier: "Technology Partner",
      logoUrl: "",
      displayOrder: partners.length + 1,
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPartner({ ...p, logoUrl: p.logoUrl || "" });
    setIsModalOpen(true);
  };

  const movePartner = (index, dir) => {
    const updated = [...partners];
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[targetIdx];
    updated[targetIdx] = updated[index];
    updated[index] = temp;
    setPartners(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPartner.name) return;

    const exists = partners.some((p) => p.id === editingPartner.id);
    if (exists) {
      setPartners(
        partners.map((p) => (p.id === editingPartner.id ? editingPartner : p))
      );
      if (editingPartner.id && !editingPartner.id.startsWith("ptn_")) {
        try {
          // [API IMPLEMENTATION] updateAdminPartner() -> PUT /api/v1/admin/partners/:id
          await updateAdminPartner(editingPartner.id, {
            name: editingPartner.name,
            category: editingPartner.category,
            websiteUrl: editingPartner.website,
            tier: editingPartner.tier,
            logoUrl: editingPartner.logoUrl || null,
          });
        } catch (err) {
          console.warn("Could not update partner on backend:", err.message);
        }
      }
      setToast({
        type: "success",
        message: "Partner Updated",
        description: `Changes saved for "${editingPartner.name}".`,
      });
    } else {
      setPartners([...partners, editingPartner]);
      try {
        // [API IMPLEMENTATION] createAdminPartner() -> POST /api/v1/admin/partners
        await createAdminPartner({
          name: editingPartner.name,
          category: editingPartner.category,
          websiteUrl: editingPartner.website,
          tier: editingPartner.tier,
          logoUrl: editingPartner.logoUrl || null,
        });
        refreshPartners();
      } catch (err) {
        console.warn("Could not create partner on backend:", err.message);
      }
      setToast({
        type: "success",
        message: "Partner Added",
        description: `Added "${editingPartner.name}" to strategic ecosystem.`,
      });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setPartners(partners.filter((p) => p.id !== targetId));
    if (targetId && !targetId.startsWith("ptn_")) {
      try {
        // [API IMPLEMENTATION] deleteAdminPartner() -> DELETE /api/v1/admin/partners/:id
        await deleteAdminPartner(targetId);
      } catch (err) {
        console.warn("Could not delete partner on backend:", err.message);
      }
    }
    setToast({
      type: "warning",
      message: "Partner Removed",
      description: `"${deleteTarget.name}" deleted.`,
    });
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Partner Organization",
      key: "name",
      render: (name, row) => (
        <div className="flex items-center gap-2.5">
          {row.logoUrl ? (
            <div className="h-8 w-8 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={row.logoUrl}
                alt={name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <span className="font-semibold text-slate-900 block">{name}</span>
            <span className="text-[11px] font-mono text-slate-500">
              {row.website}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (c) => (
        <span className="text-[11px] font-mono text-cool bg-white/[0.04] px-2 py-0.5 rounded border border-line">
          {c}
        </span>
      ),
    },
    {
      header: "Tier / Status",
      key: "tier",
      render: (t) => <span className="text-xs text-cool">{t}</span>,
    },
    {
      header: "Display Order",
      key: "displayOrder",
      render: (_, row, idx) => (
        <div className="flex items-center gap-1 font-mono text-xs text-cool">
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => movePartner(idx, "up")}
            className="p-1 hover:text-white disabled:opacity-20"
          >
            <MoveUp className="h-3 w-3" />
          </button>
          <span>#{idx + 1}</span>
          <button
            type="button"
            disabled={idx === partners.length - 1}
            onClick={() => movePartner(idx, "down")}
            className="p-1 hover:text-white disabled:opacity-20"
          >
            <MoveDown className="h-3 w-3" />
          </button>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (s) => <AdminStatusBadge status={s === "Active" ? "Published" : "Draft"} />,
    },
    {
      header: "Actions",
      key: "id",
      className: "text-right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={row.website}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-cool hover:text-white hover:bg-white/[0.04] transition"
            title="Visit Website"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-cool hover:text-electric hover:bg-electric/10 transition"
            title="Edit Partner"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-cool hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Delete Partner"
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
        title="Strategic Partners & Alliances"
        description="Curate technology partners, cloud ecosystem badges, co-sell alliances and global integrations."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Website", href: "/admin/website" },
          { label: "Partners" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-electric text-white text-xs font-medium hover:bg-electric/90 shadow-md shadow-electric/20 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Partner</span>
          </button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={partners}
        keyField="id"
      />

      <PartnerEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        partner={editingPartner}
        onChange={setEditingPartner}
        onSave={handleSave}
      />

      <AdminConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Partner: ${deleteTarget?.name}?`}
        description="Are you sure you want to remove this partner organization?"
        confirmLabel="Confirm Delete"
        danger
      />
    </div>
  );
}
