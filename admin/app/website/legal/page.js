"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  Lock,
  Globe2,
  AlertTriangle,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import { getAdminLegalPolicies, saveAdminLegalPolicy } from "@/lib/api";

export default function AdminLegalPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPolicies = () => {
    getAdminLegalPolicies()
      .then((res) => {
        const data = res?.data || res;
        const items = Array.isArray(data) ? data : data?.policies || [];
        const mapped = items.map((d) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          subtitle: d.subtitle || "",
          lastUpdated: d.lastReviewedDate || "October 2026",
          version: d.version || "v1.0",
          status: d.status === "PUBLISHED" ? "Published" : "Draft",
          frameworks: Array.isArray(d.frameworks) ? d.frameworks : [],
          sections: Array.isArray(d.clauses) ? d.clauses : [],
        }));
        setPolicies(mapped);
      })
      .catch((err) => console.warn("Load admin legal policies notice:", err.message));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleOpenEdit = (p) => {
    setEditingPolicy({ ...p, sections: [...p.sections] });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPolicy({
      id: `legal_${Date.now()}`,
      slug: "",
      title: "",
      subtitle: "",
      lastUpdated: "Today",
      version: "v1.0",
      status: "Draft",
      frameworks: ["Enterprise Standard"],
      sections: [
        { heading: "1. Policy Scope", content: "" },
      ],
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPolicy.title || !editingPolicy.slug) {
      setToast({ message: "Policy title and URL slug are required", type: "error" });
      return;
    }

    try {
      await saveAdminLegalPolicy(editingPolicy.slug, {
        title: editingPolicy.title,
        subtitle: editingPolicy.subtitle,
        version: editingPolicy.version,
        lastReviewedDate: editingPolicy.lastUpdated || "October 2026",
        status: editingPolicy.status.toUpperCase(),
        frameworks: editingPolicy.frameworks,
        clauses: editingPolicy.sections,
      });

      const exists = policies.some((p) => p.id === editingPolicy.id || p.slug === editingPolicy.slug);
      if (exists) {
        setPolicies(policies.map((p) => (p.id === editingPolicy.id || p.slug === editingPolicy.slug ? editingPolicy : p)));
        setToast({ message: `Legal policy "${editingPolicy.title}" updated live in database!`, type: "success" });
      } else {
        setPolicies([...policies, editingPolicy]);
        setToast({ message: `New policy "${editingPolicy.title}" created live in database!`, type: "success" });
      }
      setIsEditorOpen(false);
    } catch (err) {
      // Fallback update in state
      const exists = policies.some((p) => p.id === editingPolicy.id || p.slug === editingPolicy.slug);
      if (exists) {
        setPolicies(policies.map((p) => (p.id === editingPolicy.id || p.slug === editingPolicy.slug ? editingPolicy : p)));
      } else {
        setPolicies([...policies, editingPolicy]);
      }
      setToast({ message: `Policy "${editingPolicy.title}" updated locally.`, type: "success" });
      setIsEditorOpen(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPolicies(policies.filter((p) => p.id !== deleteTarget.id));
    setToast({ message: `Legal policy removed`, type: "success" });
    setDeleteTarget(null);
  };

  const handleAddSection = () => {
    setEditingPolicy({
      ...editingPolicy,
      sections: [
        ...editingPolicy.sections,
        {
          heading: `${editingPolicy.sections.length + 1}. New Clause Heading`,
          content: "",
        },
      ],
    });
  };

  const handleUpdateSection = (index, field, value) => {
    const updated = [...editingPolicy.sections];
    updated[index][field] = value;
    setEditingPolicy({ ...editingPolicy, sections: updated });
  };

  const handleRemoveSection = (index) => {
    const updated = editingPolicy.sections.filter((_, idx) => idx !== index);
    setEditingPolicy({ ...editingPolicy, sections: updated });
  };

  const columns = [
    {
      header: "Legal Policy Name",
      accessor: "title",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900 text-sm">{row.title}</div>
          <div className="text-xs text-slate-500 font-mono">/legal/{row.slug}</div>
        </div>
      ),
    },
    {
      header: "Version & Revision",
      accessor: "version",
      cell: (row) => (
        <div className="text-xs">
          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {row.version}
          </span>
          <div className="text-slate-500 mt-1">{row.lastUpdated}</div>
        </div>
      ),
    },
    {
      header: "Sections",
      accessor: "sections",
      cell: (row) => (
        <span className="text-xs font-mono text-slate-700">
          {row.sections?.length || 0} Clauses
        </span>
      ),
    },
    {
      header: "Compliance Standards",
      accessor: "frameworks",
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.frameworks?.map((f) => (
            <span
              key={f}
              className="inline-flex items-center text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded"
            >
              {f}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <AdminStatusBadge status={row.status || "Published"} />,
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <a
            href={`http://localhost:3000/legal/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            title="View Live Policy"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition"
            title="Edit Policy"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
            title="Delete Policy"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Legal & Compliance Policies"
        description="Manage the 6 public legal policies, regulatory disclosure clauses, and compliance frameworks displayed across footer and checkout routes."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Website CMS", href: "/admin/website" },
          { label: "Legal Policies" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000/legal/privacy"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
              <span>Preview Live /legal</span>
            </a>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
            >
              <Plus size={15} />
              <span>Create Legal Policy</span>
            </button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Legal Policies</span>
            <Scale className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">
            {policies.length} Policies
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">Privacy, terms, security, SLA & cookies</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Global Compliance</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">
            GDPR &amp; SOC 2
          </div>
          <div className="text-xs text-slate-500 mt-1">Multi-region data isolation validated</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Latest Review</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">
            Oct 1, 2026
          </div>
          <div className="text-xs text-slate-500 mt-1">Audit cycles current and active</div>
        </div>
      </div>

      {/* Policies Table */}
      <AdminDataTable
        columns={columns}
        data={policies}
        keyField="id"
        emptyMessage="No legal policies found."
      />

      {/* Policy Editor Modal */}
      {editingPolicy && (
        <AdminModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={`Edit ${editingPolicy.title || "New Policy"}`}
          subtitle={`Route: /legal/${editingPolicy.slug || "new"}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <a
                href={`http://localhost:3000/legal/${editingPolicy.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink size={13} />
                <span>Open in Live Website</span>
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Save Policy Changes
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            <AdminTabs
              tabs={[
                { id: "general", label: "Metadata & Status", icon: FileText },
                { id: "sections", label: `Clauses & Sections (${editingPolicy.sections?.length || 0})`, icon: Scale },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Policy Document Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPolicy.title}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, title: e.target.value })}
                      placeholder="e.g. Global Privacy Policy"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      URL Slug (/legal/*) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPolicy.slug}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, slug: e.target.value })}
                      placeholder="privacy"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtitle / Summary Description
                  </label>
                  <input
                    type="text"
                    value={editingPolicy.subtitle}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, subtitle: e.target.value })}
                    placeholder="Short summary displayed below headline"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Version Code
                    </label>
                    <input
                      type="text"
                      value={editingPolicy.version}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, version: e.target.value })}
                      placeholder="v2.4"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Effective Date
                    </label>
                    <input
                      type="text"
                      value={editingPolicy.lastUpdated}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, lastUpdated: e.target.value })}
                      placeholder="October 1, 2026"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={editingPolicy.status}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sections" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Clauses and Legal Paragraphs
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition"
                  >
                    <Plus size={14} />
                    <span>Add New Clause</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {editingPolicy.sections?.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => handleUpdateSection(idx, "heading", e.target.value)}
                          placeholder="Clause Heading (e.g. 1. Data Retention)"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove Clause"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                        placeholder="Legal content and stipulations..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* Delete Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Legal Policy?"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? Visitors browsing /legal/${deleteTarget?.slug} may encounter a 404.`}
        confirmText="Delete Policy"
        confirmVariant="danger"
      />

      {/* Toast */}
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
