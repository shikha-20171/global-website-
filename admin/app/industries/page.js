"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Factory,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Building2,
  CheckCircle,
  GraduationCap,
  HeartPulse,
  Home,
  Truck,
  ShoppingBag,
  Landmark,
  Briefcase,
  UtensilsCrossed,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import { industries as websiteIndustries } from "@/lib/data";
import {
  getAdminIndustries,
  createAdminIndustry,
  updateAdminIndustry,
  deleteAdminIndustry,
} from "@/lib/api";

const fallbackIndustries = websiteIndustries.map((ind, idx) => ({
  id: ind.id || `ind_${ind.slug}`,
  name: ind.name,
  slug: ind.slug,
  short: ind.short || ind.problem?.slice(0, 80) || "Enterprise industry vertical",
  icon: typeof ind.icon === "string" ? ind.icon : "Building2",
  status: "Published",
  displayOrder: idx + 1,
  problem: ind.problem || "",
  solution: ind.solution || "",
  features: Array.isArray(ind.features) ? ind.features : [],
  benefits: Array.isArray(ind.benefits) ? ind.benefits : [],
  products: Array.isArray(ind.products) ? ind.products : [],
}));

export default function AdminIndustriesPage() {
  const [industryList, setIndustryList] = useState(fallbackIndustries);

  const refreshIndustries = () => {
    getAdminIndustries()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.industries || [];
        if (list.length > 0) {
          setIndustryList(list);
        } else {
          setIndustryList(fallbackIndustries);
        }
      })
      .catch((err) => {
        console.warn("Using website industries fallback:", err.message);
        setIndustryList(fallbackIndustries);
      });
  };

  useEffect(() => {
    refreshIndustries();
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = industryList.filter((ind) => {
    const matchSearch =
      !search ||
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.slug.toLowerCase().includes(search.toLowerCase()) ||
      ind.short?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || ind.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenCreate = () => {
    setEditingIndustry({
      slug: "",
      name: "",
      short: "",
      problem: "",
      solution: "",
      products: [],
      productsText: "schooly-core, dezo-care",
      status: "Published",
      seoTitle: "",
      metaDescription: "",
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (ind) => {
    setEditingIndustry({
      ...ind,
      productsText: Array.isArray(ind.products) ? ind.products.join(", ") : "",
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleDuplicate = (ind) => {
    const dup = {
      ...ind,
      slug: `${ind.slug}-copy`,
      name: `${ind.name} (Copy)`,
      status: "Draft",
    };
    setIndustryList([...industryList, dup]);
    setToast({
      type: "success",
      message: "Industry Vertical Duplicated",
      description: `Created draft copy: "${dup.name}".`,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingIndustry.name || !editingIndustry.slug) return;

    const parsedProducts = editingIndustry.productsText
      ? editingIndustry.productsText.split(",").map((s) => s.trim()).filter(Boolean)
      : editingIndustry.products || [];

    const updated = {
      ...editingIndustry,
      products: parsedProducts,
    };

    const isNew = !industryList.some((i) => i.id === editingIndustry.id || i.slug === editingIndustry.slug);

    try {
      if (!isNew && editingIndustry.id) {
        await updateAdminIndustry(editingIndustry.id, updated);
        setToast({
          type: "success",
          message: "Industry Blueprint Updated",
          description: `Changes saved for "${updated.name}".`,
        });
      } else {
        await createAdminIndustry(updated);
        setToast({
          type: "success",
          message: "Industry Blueprint Created",
          description: `Added "${updated.name}" to vertical industry registry.`,
        });
      }
      refreshIndustries();
      setIsEditorOpen(false);
    } catch (err) {
      console.warn("API industry save notice:", err.message);
      const exists = industryList.some((i) => i.slug === updated.slug);
      if (exists) {
        setIndustryList(
          industryList.map((i) => (i.slug === updated.slug ? updated : i))
        );
      } else {
        setIndustryList([...industryList, updated]);
      }
      setToast({
        type: "success",
        message: "Industry Blueprint Saved",
        description: `Saved "${updated.name}".`,
      });
      setIsEditorOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.id) {
        await deleteAdminIndustry(deleteTarget.id);
      }
      refreshIndustries();
      setToast({
        type: "warning",
        message: "Industry Vertical Removed",
        description: `"${deleteTarget.name}" deleted from active industries.`,
      });
    } catch {
      setIndustryList(industryList.filter((i) => i.slug !== deleteTarget.slug));
      setToast({
        type: "warning",
        message: "Industry Vertical Removed",
        description: `"${deleteTarget.name}" deleted from active industries.`,
      });
    }
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Industry Sector & Slug",
      key: "name",
      render: (name, row) => (
        <div>
          <span className="font-bold text-slate-900 text-sm">{name}</span>
          <span className="text-xs font-mono text-blue-600 block mt-0.5">
            /industries/{row.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Scope & Target Entities",
      key: "short",
      render: (short) => (
        <span className="text-xs text-slate-600 font-medium line-clamp-1 max-w-sm">{short}</span>
      ),
    },
    {
      header: "Connected Products",
      key: "products",
      render: (prods) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {prods?.slice(0, 2).map((p) => (
            <span
              key={p}
              className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200"
            >
              {p}
            </span>
          ))}
          {prods?.length > 2 && (
            <span className="text-xs font-bold text-slate-500">
              +{prods.length - 2}
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
      key: "slug",
      className: "text-right",
      render: (slug, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`http://localhost:3000/industries/${slug}`}
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
            title="Edit Vertical"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Duplicate Vertical"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Vertical"
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
        title="Industry Verticals & Blueprints (10 Sectors)"
        description="Manage domain-specific ERP architectures, regulatory standards, workflows and associated SaaS engines for all 10 enterprise sectors."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Industries" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Industry Vertical</span>
          </button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter vertical sectors (e.g. Healthcare, Real Estate, Education)..."
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
        totalCount={industryList.length}
        filteredCount={filtered.length}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyField="slug"
      />

      {/* Industry Editor Modal */}
      {editingIndustry && (
        <AdminModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={
            editingIndustry.name
              ? `Configure Industry: ${editingIndustry.name}`
              : "Create Industry Vertical"
          }
          description="Configure industry challenges, DEZORYN solution architecture, connected SaaS products, and SEO."
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                /industries/{editingIndustry.slug || "new-slug"}
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
                  Save Industry
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <AdminTabs
              tabs={[
                { id: "general", label: "Sector Identity" },
                { id: "challenges", label: "Problems & Solution" },
                { id: "products", label: "Connected Products" },
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
                      Industry Sector Name *
                    </label>
                    <input
                      type="text"
                      value={editingIndustry.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingIndustry({
                          ...editingIndustry,
                          name: val,
                          slug: val.toLowerCase().replace(/\s+/g, "-"),
                        });
                      }}
                      placeholder="e.g. Healthcare"
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={editingIndustry.slug}
                      onChange={(e) =>
                        setEditingIndustry({
                          ...editingIndustry,
                          slug: e.target.value,
                        })
                      }
                      placeholder="e.g. healthcare"
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Entities Summary (e.g. Hospitals, diagnostic labs, clinics)
                  </label>
                  <input
                    type="text"
                    value={editingIndustry.short}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
                        short: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "challenges" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Industry Problems & Operational Challenges
                  </label>
                  <textarea
                    rows={4}
                    value={editingIndustry.problem}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
                        problem: e.target.value,
                      })
                    }
                    placeholder="Describe legacy manual bottlenecks, compliance gaps and fragmented tools..."
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    DEZORYN Engineered Solution
                  </label>
                  <textarea
                    rows={4}
                    value={editingIndustry.solution}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
                        solution: e.target.value,
                      })
                    }
                    placeholder="Describe how DEZORYN cloud platforms automate and scale these workflows..."
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Connected SaaS Product Slugs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingIndustry.productsText}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
                        productsText: e.target.value,
                      })
                    }
                    placeholder="e.g. schooly-core, dezo-care, society-management"
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Links to these products will be highlighted on the public industry landing page.
                  </p>
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
                    value={editingIndustry.seoTitle || ""}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
                        seoTitle: e.target.value,
                      })
                    }
                    placeholder={`e.g. ${editingIndustry.name} Enterprise Solutions | DEZORYN`}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingIndustry.metaDescription || ""}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
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
                    value={editingIndustry.status}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
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
        title={`Delete Industry: ${deleteTarget?.name}?`}
        description="Are you sure you want to remove this industry blueprint from the catalog?"
        confirmLabel="Confirm Delete"
        danger
      />
    </div>
  );
}
