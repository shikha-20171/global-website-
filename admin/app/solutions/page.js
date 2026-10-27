"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Sparkles,
  Cpu,
  Workflow,
  Cloud,
  Smartphone,
  Shield,
  CheckCircle,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import {
  getAdminSolutions,
  createAdminSolution,
  updateAdminSolution,
  deleteAdminSolution,
} from "@/lib/api";

const INITIAL_SOLUTIONS = [
  {
    id: "enterprise-architecture",
    slug: "enterprise-architecture",
    name: "Enterprise Solutions",
    tagline: "Scalable zero-trust architectures for complex organizational workflows.",
    problemStatement: "Fragmented legacy tools cause data silos, high security risks, and slow response times.",
    description: "Modular enterprise cloud architectures built for high concurrency, zero-trust RBAC and multi-region resilience.",
    capabilities: ["Multi-Tenant DB Sharding", "Zero-Trust RBAC & IAM", "High Concurrency API Mesh", "Automated Disaster Recovery"],
    relatedProducts: "Schooly ERP, DezoCare, EstateSync",
    status: "Published",
    seoTitle: "Enterprise Software Solutions | DEZORYN TECHNOLOGY",
    metaDescription: "Scalable, secure enterprise architectures engineered for global organizations.",
  },
  {
    id: "ai-solutions",
    slug: "ai-solutions",
    name: "AI Solutions",
    tagline: "Intelligent automation and computer vision engines.",
    problemStatement: "Manual data entry and verification processes create human error and operational bottlenecks.",
    description: "Deep learning models, computer vision for proctoring, intelligent document processing and natural language workflows.",
    capabilities: ["Document OCR & Auto-Extraction", "Biometric & Vision Verification", "Predictive Analytics Pipelines", "Context-Aware AI Assistants"],
    relatedProducts: "Schooly Core, TalentEdge AI",
    status: "Published",
    seoTitle: "Enterprise AI & Intelligence | DEZORYN TECHNOLOGY",
    metaDescription: "Practical enterprise AI models embedded into production software workflows.",
  },
  {
    id: "business-automation",
    slug: "business-automation",
    name: "Automation",
    tagline: "Automate repetitive data handling and event workflows.",
    problemStatement: "Teams waste hundreds of hours manually coordinating data between disconnected tools.",
    description: "Event-driven workflow engines that trigger alerts, invoices, compliance checks and cross-system webhooks automatically.",
    capabilities: ["Real-Time Event Triggers", "Automated Billing & Invoicing", "Multi-Step Approval Workflows", "External Webhook Mesh"],
    relatedProducts: "FinancePulse, Society Management",
    status: "Published",
    seoTitle: "Business Process Automation | DEZORYN TECHNOLOGY",
    metaDescription: "Event-driven software automation eliminating manual enterprise friction.",
  },
  {
    id: "custom-software",
    slug: "custom-software",
    name: "Custom Software",
    tagline: "Bespoke SaaS platforms engineered for unique operational models.",
    problemStatement: "Off-the-shelf software fails to match specialized regulatory or organizational workflows.",
    description: "End-to-end custom platform development with modern web frameworks, resilient databases and clean APIs.",
    capabilities: ["Domain-Driven System Design", "Custom Cloud Architecture", "Legacy System Migration", "Dedicated QA & Automated Testing"],
    relatedProducts: "Bespoke Enterprise Builds",
    status: "Published",
    seoTitle: "Custom Software Engineering | DEZORYN TECHNOLOGY",
    metaDescription: "Tailored software applications built for mission-critical business requirements.",
  },
  {
    id: "digital-transformation",
    slug: "digital-transformation",
    name: "Digital Transformation",
    tagline: "Modernize operational frameworks from manual paper to cloud-native.",
    problemStatement: "Paper-based or legacy desktop software restricts remote operations and rapid scaling.",
    description: "Holistic modernization programs replacing archaic spreadsheets and paperwork with cloud-accessible dashboards.",
    capabilities: ["Paperless Digital Workflows", "Unified Real-Time Dashboards", "Staff Onboarding & Training", "Continuous Cloud Optimization"],
    relatedProducts: "DezoCare, Schooly ERP",
    status: "Published",
    seoTitle: "Digital Transformation Consulting | DEZORYN TECHNOLOGY",
    metaDescription: "Guiding traditional institutions into unified digital software ecosystems.",
  },
  {
    id: "cloud-solutions",
    slug: "cloud-solutions",
    name: "Cloud Solutions",
    tagline: "High availability, autoscaling and containerized deployments.",
    problemStatement: "Unreliable server infrastructure leads to downtime during peak traffic spikes.",
    description: "Kubernetes orchestration, serverless microservices, CDN caching and multi-cloud infrastructure.",
    capabilities: ["Kubernetes Cluster Management", "Automated CI/CD Pipelines", "Multi-Region Cloud Deployment", "Infrastructure as Code (IaC)"],
    relatedProducts: "Global Cloud VPCs",
    status: "Published",
    seoTitle: "Enterprise Cloud Solutions | DEZORYN TECHNOLOGY",
    metaDescription: "Resilient cloud infrastructure designed for 99.95% high availability.",
  },
  {
    id: "mobile-solutions",
    slug: "mobile-solutions",
    name: "Mobile Solutions",
    tagline: "Native and cross-platform companion apps for on-the-go teams.",
    problemStatement: "Field staff and mobile executives cannot access core system data while away from desks.",
    description: "High-performance iOS and Android mobile apps connected to central databases with offline sync support.",
    capabilities: ["Offline-First Data Sync", "Push Notification Architecture", "Biometric Security (FaceID/Fingerprint)", "Cross-Platform Code Sharing"],
    relatedProducts: "Society Resident App, Clinic Companion",
    status: "Published",
    seoTitle: "Enterprise Mobile Solutions | DEZORYN TECHNOLOGY",
    metaDescription: "Companion mobile applications extending core enterprise platforms.",
  },
];

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState(INITIAL_SOLUTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  const refreshSolutions = () => {
    // [API IMPLEMENTATION] getAdminSolutions() -> GET /api/v1/admin/solutions
    getAdminSolutions()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.solutions || [];
        if (list.length > 0) {
          setSolutions(list);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshSolutions();
  }, []);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = solutions.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenCreate = () => {
    setEditingSolution({
      id: `sol-${Date.now()}`,
      slug: "",
      name: "",
      tagline: "",
      problemStatement: "",
      description: "",
      capabilities: ["Cloud Scalability", "Secure API Gateway", "Enterprise Support"],
      relatedProducts: "All Products",
      status: "Published",
      seoTitle: "",
      metaDescription: "",
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (sol) => {
    setEditingSolution({
      ...sol,
      capabilitiesText: Array.isArray(sol.capabilities)
        ? sol.capabilities
            .map((c) =>
              typeof c === "object" && c !== null
                ? c.title || c.name || c.desc || ""
                : String(c)
            )
            .join("\n")
        : "",
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleDuplicate = (sol) => {
    const dup = {
      ...sol,
      id: `sol-${Date.now()}`,
      name: `${sol.name} (Copy)`,
      slug: `${sol.slug}-copy`,
      status: "Draft",
    };
    setSolutions([...solutions, dup]);
    setToast({
      type: "success",
      message: "Solution Duplicated",
      description: `Created draft copy: "${dup.name}".`,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingSolution.name || !editingSolution.slug) return;

    const parsedCaps = editingSolution.capabilitiesText
      ? editingSolution.capabilitiesText.split("\n").filter(Boolean)
      : editingSolution.capabilities;

    const updated = {
      ...editingSolution,
      capabilities: parsedCaps,
    };

    const isNew = editingSolution.id?.startsWith("sol-") && !solutions.some((s) => s.id === editingSolution.id && !s.id.startsWith("sol-"));

    try {
      if (!isNew) {
        // [API IMPLEMENTATION] updateAdminSolution() -> PUT /api/v1/admin/solutions/:id
        await updateAdminSolution(editingSolution.id, updated);
        setToast({
          type: "success",
          message: "Solution Updated",
          description: `Changes saved for "${updated.name}".`,
        });
      } else {
        // [API IMPLEMENTATION] createAdminSolution() -> POST /api/v1/admin/solutions
        await createAdminSolution(updated);
        setToast({
          type: "success",
          message: "Solution Created",
          description: `Added "${updated.name}" to solutions architecture catalog.`,
        });
      }
      refreshSolutions();
      setIsEditorOpen(false);
    } catch (err) {
      console.warn("API solutions save notice:", err.message);
      const exists = solutions.some((s) => s.id === updated.id);
      if (exists) {
        setSolutions(solutions.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        setSolutions([...solutions, updated]);
      }
      setToast({
        type: "success",
        message: "Solution Saved",
        description: `Saved "${updated.name}".`,
      });
      setIsEditorOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.id && !deleteTarget.id.startsWith("sol-")) {
        // [API IMPLEMENTATION] deleteAdminSolution() -> DELETE /api/v1/admin/solutions/:id
        await deleteAdminSolution(deleteTarget.id);
      }
      refreshSolutions();
      setToast({
        type: "warning",
        message: "Solution Removed",
        description: `"${deleteTarget.name}" deleted from active solutions.`,
      });
    } catch {
      setSolutions(solutions.filter((s) => s.id !== deleteTarget.id));
      setToast({
        type: "warning",
        message: "Solution Removed",
        description: `"${deleteTarget.name}" deleted from active solutions.`,
      });
    }
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Solution Framework & Slug",
      key: "name",
      render: (name, row) => (
        <div>
          <span className="font-bold text-slate-900 text-sm">{name}</span>
          <span className="text-xs font-mono text-blue-600 block mt-0.5">
            /solutions/{row.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Engineering Tagline",
      key: "tagline",
      render: (tagline) => (
        <span className="text-xs text-slate-600 font-medium line-clamp-1 max-w-sm">{tagline}</span>
      ),
    },
    {
      header: "Capabilities",
      key: "capabilities",
      render: (caps) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {caps?.slice(0, 2).map((c, idx) => {
            const label =
              typeof c === "object" && c !== null
                ? c.title || c.name || c.desc || "Capability"
                : String(c);
            return (
              <span
                key={idx}
                className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200 truncate max-w-[150px]"
              >
                {label}
              </span>
            );
          })}
          {caps?.length > 2 && (
            <span className="text-xs font-bold text-slate-500">
              +{caps.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (s) => <AdminStatusBadge status={s} />,
    },
    {
      header: "Actions",
      key: "id",
      className: "text-right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`http://localhost:3000/solutions/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Preview Public Page"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Edit Solution"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Duplicate Solution"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Solution"
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
        title="Solutions Architecture Management"
        description="Configure enterprise solution frameworks (Enterprise, AI, Automation, Custom Software, Digital Transformation, Cloud, Mobile) with capabilities and problem statements."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Solutions" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Solution</span>
          </button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter solutions by title, slug, or capability..."
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ],
          },
        ]}
        onReset={() => {
          setSearch("");
          setStatusFilter("");
        }}
        totalCount={solutions.length}
        filteredCount={filtered.length}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyField="id"
      />

      {/* Solution Editor Modal */}
      {editingSolution && (
        <AdminModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={
            editingSolution.name
              ? `Configure: ${editingSolution.name}`
              : "Create Solution Architecture"
          }
          description="Configure solution scope, capabilities, problem statements, and SEO metadata."
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                /solutions/{editingSolution.slug || "new-solution"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  Save Solution
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <AdminTabs
              tabs={[
                { id: "general", label: "Overview & Problem" },
                { id: "capabilities", label: "Capabilities & Scope" },
                { id: "seo", label: "SEO & Publication" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Solution Name *
                    </label>
                    <input
                      type="text"
                      value={editingSolution.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingSolution({
                          ...editingSolution,
                          name: val,
                          slug: val.toLowerCase().replace(/\s+/g, "-"),
                        });
                      }}
                      placeholder="e.g. Enterprise Solutions"
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={editingSolution.slug}
                      onChange={(e) =>
                        setEditingSolution({
                          ...editingSolution,
                          slug: e.target.value,
                        })
                      }
                      placeholder="e.g. enterprise-solutions"
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tagline / One-Liner
                  </label>
                  <input
                    type="text"
                    value={editingSolution.tagline}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Problem Statement (Client Pain Point)
                  </label>
                  <textarea
                    rows={2}
                    value={editingSolution.problemStatement}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        problemStatement: e.target.value,
                      })
                    }
                    placeholder="Describe the operational bottleneck this solution resolves..."
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Description / Architectural Approach
                  </label>
                  <textarea
                    rows={4}
                    value={editingSolution.description}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        description: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "capabilities" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Technical Capabilities (one per line)
                  </label>
                  <textarea
                    rows={6}
                    value={
                      editingSolution.capabilitiesText ??
                      (Array.isArray(editingSolution.capabilities)
                        ? editingSolution.capabilities
                            .map((c) =>
                              typeof c === "object" && c !== null
                                ? c.title || c.name || c.desc || ""
                                : String(c)
                            )
                            .join("\n")
                        : "")
                    }
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        capabilitiesText: e.target.value,
                      })
                    }
                    placeholder="Capability 1&#10;Capability 2&#10;Capability 3"
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Associated Products & Platforms
                  </label>
                  <input
                    type="text"
                    value={editingSolution.relatedProducts}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        relatedProducts: e.target.value,
                      })
                    }
                    placeholder="e.g. Schooly ERP, DezoCare, EstateSync"
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={editingSolution.seoTitle || ""}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        seoTitle: e.target.value,
                      })
                    }
                    placeholder={`e.g. ${editingSolution.name} | DEZORYN TECHNOLOGY`}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingSolution.metaDescription || ""}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        metaDescription: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingSolution.status}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        status: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      <AdminConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Solution: ${deleteTarget?.name}?`}
        description="Are you sure you want to remove this architecture solution from the catalog?"
        confirmLabel="Confirm Delete"
        danger
      />
    </div>
  );
}
