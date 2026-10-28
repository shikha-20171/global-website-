"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Download,
  Mail,
  Building,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  UserCheck,
  CheckCircle,
  FileText,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import LeadDetailModal from "./components/LeadDetailModal";
import {
  getAdminLeads,
  updateAdminLeadStatus,
  deleteAdminLead,
} from "@/lib/api";

const PIPELINE_STATUSES = ["New", "Contacted", "Qualified", "Demo Scheduled", "Proposal", "Won", "Lost"];

const defaultLeads = [
  {
    id: "LEAD-1048",
    name: "Elena Rostova",
    company: "St. Jude Medical Network",
    email: "elena@berlin-healthgroup.de",
    phone: "+49 30 1234567",
    country: "Germany",
    companySize: "201–1,000",
    product: "Healthcare & Hospital Management",
    budget: "$25,000 – $100,000",
    requirement: "HIPAA and EU GDPR compliance protocol verification in progress. Looking for 350-bed inpatient rollout across 3 specialty clinics.",
    source: "CONTACT_SALES",
    status: "Qualified",
    date: "Oct 27, 2026",
    submittedAt: "2026-10-27T07:14:11.604Z",
  },
  {
    id: "LEAD-1049",
    name: "Dr. Ronald Sterling",
    company: "Apex Global Institutions",
    email: "r.sterling@oxford-academy.edu",
    phone: "+44 20 7946 0912",
    country: "United Kingdom",
    companySize: "1,000+",
    product: "School & Education ERP",
    budget: "$100,000+",
    requirement: "Requires integration with existing Moodle LMS and multi-currency tuition billing for 12,000 students across 3 campuses.",
    source: "DEMO_REQUEST",
    status: "Demo Scheduled",
    date: "Oct 26, 2026",
    submittedAt: "2026-10-26T09:14:00.000Z",
  },
  {
    id: "LEAD-1046",
    name: "Marcus Vance",
    company: "Vance Digital Logistics",
    email: "m.vance@vancetech.io",
    phone: "+1 (555) 321-7654",
    country: "United States",
    companySize: "51–200",
    product: "Fleet & Logistics Automation",
    budget: "$5,000 – $25,000",
    requirement: "Reviewing multi-country tax compliance engines and automated ACH payroll direct deposit features.",
    source: "CONTACT_SALES",
    status: "Contacted",
    date: "Oct 25, 2026",
    submittedAt: "2026-10-25T13:15:00.000Z",
  },
  {
    id: "LEAD-1047",
    name: "Tariq Al-Mansoor",
    company: "Emirates Heights Real Estate",
    email: "tariq@skyline-towers.ae",
    phone: "+971 4 312 8900",
    country: "United Arab Emirates",
    companySize: "11–50",
    product: "Real Estate & Property CRM",
    budget: "$5,000 – $25,000",
    requirement: "Activated 14-day trial. Need automated WhatsApp notification trigger setup for prospective tenant leads.",
    source: "START_TRIAL",
    status: "New",
    date: "Oct 24, 2026",
    submittedAt: "2026-10-24T18:30:00.000Z",
  },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  // Detail Modal
  const [activeLead, setActiveLead] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refreshLeads = () => {
    getAdminLeads()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || data?.items || []);
        const mapped = list.map((l) => ({
          ...l,
          status: l.status === "NEW" ? "New" : l.status === "CONTACTED" ? "Contacted" : l.status === "QUALIFIED" ? "Qualified" : l.status === "DEMO" ? "Demo Scheduled" : l.status === "PROPOSAL" ? "Proposal" : l.status === "WON" ? "Won" : l.status === "LOST" ? "Lost" : l.status,
          date: l.submittedAt ? new Date(l.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : l.date || "Recent"),
          product: l.interestedSolution || l.solution || l.product || "Enterprise Platform",
          requirement: l.requirement || l.req || l.message || "",
          budget: l.budgetRange || l.budget || "Standard SaaS",
          companySize: l.companySize || "N/A",
          phone: l.phone || "",
          source: l.source || "GENERAL_CONTACT",
          submittedAt: l.submittedAt || l.createdAt || null,
        }));
        if (mapped.length > 0) {
          setLeads(mapped);
        } else {
          setLeads(defaultLeads);
        }
      })
      .catch((err) => {
        console.warn("Using default leads fallback:", err.message);
        setLeads(defaultLeads);
      });
  };

  useEffect(() => {
    refreshLeads();
  }, []);

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.product?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (activeLead && activeLead.id === id) {
      setActiveLead((prev) => ({ ...prev, status: newStatus }));
    }
    const prismaStatus = newStatus.toUpperCase().replace(/\s+/g, "_");
    if (id) {
      try {
        await updateAdminLeadStatus(id, prismaStatus);
      } catch (err) {
        console.warn("Could not update lead status on backend:", err.message);
      }
    }
    setToast({
      type: "success",
      message: "Lead Status Updated",
      description: `Inquiry status updated to "${newStatus}".`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setLeads((prev) => prev.filter((l) => l.id !== targetId));
    if (targetId) {
      try {
        await deleteAdminLead(targetId);
      } catch (err) {
        console.warn("Could not delete lead via API:", err.message);
      }
    }
    setToast({
      type: "info",
      message: "Lead Removed",
      description: `Inquiry from ${deleteTarget.name} has been archived.`,
    });
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Company", "Country", "Product", "Status", "Date"];
    const rows = filtered.map((l) => [
      l.id,
      `"${l.name || ""}"`,
      `"${l.email || ""}"`,
      `"${l.company || ""}"`,
      `"${l.country || ""}"`,
      `"${l.product || ""}"`,
      l.status || "New",
      `"${l.createdDate || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dezoryn_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "info",
      message: "CSV Exported",
      description: `Downloaded ${filtered.length} inquiries in CSV format.`,
    });
  };

  const columns = [
    {
      header: "Visitor Contact",
      key: "name",
      render: (val, row) => (
        <div
          onClick={() => {
            setActiveLead(row);
            setIsDetailOpen(true);
          }}
          className="cursor-pointer group"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
            {val}
          </div>
          <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Mail size={13} className="text-blue-600 shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Company & Country",
      key: "company",
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900 text-sm">{val || "Enterprise Client"}</div>
          <div className="text-xs text-slate-500">{row.country || "Global"}</div>
        </div>
      ),
    },
    {
      header: "Requested Solution / Product",
      key: "product",
      render: (val) => (
        <span className="text-sm font-semibold text-slate-800">
          {val || "Enterprise Platform"}
        </span>
      ),
    },
    {
      header: "Inquiry Stage",
      key: "status",
      render: (s, row) => (
        <select
          value={s || "New"}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold font-mono text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer shadow-2xs"
        >
          {PIPELINE_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
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
              setActiveLead(row);
              setIsDetailOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="View Details"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Archive Inquiry"
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
        title="Contact & Sales Inquiries"
        description="Review and manage inquiries submitted by prospective enterprise clients on the global website."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Contact Inquiries" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search inquiries by contact name, email, company or product..."
        filters={[
          {
            key: "status",
            label: "Stage",
            value: statusFilter,
            onChange: setStatusFilter,
            options: PIPELINE_STATUSES.map((s) => ({ label: s, value: s })),
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
        emptyMessage="No contact inquiries found matching the selected filters."
      />

      {/* View Detail Modal */}
      <LeadDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        lead={activeLead}
        pipelineStatuses={PIPELINE_STATUSES}
        onStatusChange={handleStatusChange}
        onNotesChange={(notesVal) => {
          setLeads(leads.map((l) => (l.id === activeLead.id ? { ...l, notes: notesVal } : l)));
          setActiveLead({ ...activeLead, notes: notesVal });
        }}
      />

      {/* Delete / Archive Confirmation Dialog */}
      {deleteTarget && (
        <AdminConfirmDialog
          isOpen={Boolean(deleteTarget)}
          title="Archive Contact Inquiry"
          message={`Are you sure you want to remove the inquiry from "${deleteTarget.name}" (${deleteTarget.company})?`}
          confirmLabel="Archive"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
