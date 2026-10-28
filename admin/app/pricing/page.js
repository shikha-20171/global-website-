"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Star,
  Eye,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Layers,
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
  getAdminPricing,
  createAdminPricing,
  updateAdminPricing,
  deleteAdminPricing,
  getAdminProducts,
} from "@/lib/api";

export default function AdminPricingPlansPage() {
  const [plans, setPlans] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'annual'
  const [currency, setCurrency] = useState("USD");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  // Editor Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadPricing = async () => {
    try {
      setLoading(true);
      const [pricingRes, productsRes] = await Promise.allSettled([
        getAdminPricing(),
        getAdminProducts(),
      ]);

      if (productsRes.status === "fulfilled") {
        const prods = Array.isArray(productsRes.value) ? productsRes.value : [];
        setAvailableProducts(prods);
      }

      if (pricingRes.status === "fulfilled") {
        const res = pricingRes.value;
        const list = res?.plans || (Array.isArray(res) ? res : []);
        const mapped = list.map((p) => ({
          id: p.id,
          name: p.name,
          product: p.product?.name || p.product || "Universal",
          productSlug: p.product?.slug || p.productSlug || "universal",
          monthlyPriceUsd: p.monthlyPriceUsd || 49,
          annualPriceUsd: p.annualPriceUsd || 470,
          annualDiscount: p.annualDiscount || 20,
          description: p.description || "",
          features: Array.isArray(p.features) ? p.features : ["Standard Access"],
          userLimit: p.userLimit || "25 Users",
          usageLimit: p.usageLimit || "Standard API limits",
          highlighted: p.isPopular || p.highlighted || false,
          trialEligible: p.trialEligible !== false,
          isEnterprise: p.isEnterprise || false,
          displayOrder: p.order || p.displayOrder || 1,
          status: p.status === "ARCHIVED" ? "Archived" : p.status === "DRAFT" ? "Draft" : "Published",
        }));
        setPlans(mapped);
      }
    } catch (e) {
      // Keep default plans
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const filtered = plans.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenCreate = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      name: "",
      product: "Universal",
      productSlug: "universal",
      monthlyPriceUsd: 49,
      annualPriceUsd: 470,
      annualDiscount: 20,
      description: "",
      features: ["Enterprise RBAC", "API Access", "Standard Support"],
      userLimit: "25 Users",
      usageLimit: "25,000 API calls",
      highlighted: false,
      trialEligible: true,
      isEnterprise: false,
      displayOrder: plans.length + 1,
      status: "Published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan({
      ...plan,
      featuresText: plan.features.join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = (plan) => {
    const dup = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copy)`,
      status: "Draft",
    };
    setPlans([...plans, dup]);
    setToast({
      type: "success",
      message: "Plan Tier Duplicated",
      description: `Created draft copy: "${dup.name}".`,
    });
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!editingPlan.name) return;

    const parsedFeatures = editingPlan.featuresText
      ? editingPlan.featuresText.split("\n").filter(Boolean)
      : editingPlan.features;

    const updatedPlan = {
      ...editingPlan,
      features: parsedFeatures,
    };

    const exists = plans.some((p) => p.id === updatedPlan.id);
    const prev = [...plans];

    const generatedSlug =
      updatedPlan.slug ||
      updatedPlan.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      `plan-${Date.now()}`;

    if (exists) {
      setPlans(plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
      try {
        // [API IMPLEMENTATION] updateAdminPricing() -> PUT /api/v1/admin/pricing/:id
        await updateAdminPricing(updatedPlan.id, {
          name: updatedPlan.name,
          slug: generatedSlug,
          monthlyPriceUsd: Number(updatedPlan.monthlyPriceUsd),
          annualPriceUsd: Number(updatedPlan.annualPriceUsd),
          description: updatedPlan.description,
          features: updatedPlan.features,
          isHighlighted: Boolean(updatedPlan.highlighted),
          userLimit: updatedPlan.userLimit,
          usageQuota: updatedPlan.usageLimit,
        });
        setToast({
          type: "success",
          message: "Pricing Plan Updated",
          description: `Changes saved for "${updatedPlan.name}".`,
        });
      } catch (err) {
        setToast({
          type: "error",
          message: "Failed to Update Plan",
          description: err.message || "Failed to save to backend.",
        });
      }
    } else {
      setPlans([...plans, updatedPlan]);
      try {
        // [API IMPLEMENTATION] createAdminPricing() -> POST /api/v1/admin/pricing
        await createAdminPricing({
          name: updatedPlan.name,
          slug: generatedSlug,
          productId: updatedPlan.productId || undefined,
          monthlyPriceUsd: Number(updatedPlan.monthlyPriceUsd),
          annualPriceUsd: Number(updatedPlan.annualPriceUsd),
          description: updatedPlan.description,
          features: updatedPlan.features,
          isHighlighted: Boolean(updatedPlan.highlighted),
          userLimit: updatedPlan.userLimit,
          usageQuota: updatedPlan.usageLimit,
        });
        setToast({
          type: "success",
          message: "Pricing Plan Created",
          description: `"${updatedPlan.name}" added to commercial catalog.`,
        });
      } catch (err) {
        setToast({
          type: "error",
          message: "Failed to Create Plan",
          description: err.message || "Failed to save to backend.",
        });
      }
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const prev = [...plans];
    setPlans(plans.filter((p) => p.id !== deleteTarget.id));
    try {
      // [API IMPLEMENTATION] deleteAdminPricing() -> DELETE /api/v1/admin/pricing/:id
      await deleteAdminPricing(deleteTarget.id);
      setToast({
        type: "warning",
        message: "Plan Removed",
        description: `"${deleteTarget.name}" deleted from commercial pricing table.`,
      });
    } catch (e) {
      setPlans(prev);
      setToast({
        type: "error",
        message: "Deletion Failed",
        description: e.message || "Could not delete plan from backend.",
      });
    }
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Plan Tier Name",
      key: "name",
      render: (name, row) => (
        <div className="flex items-center gap-2">
          {row.highlighted && (
            <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
          )}
          <div>
            <span className="font-bold text-slate-900 text-sm">{name}</span>
            <span className="text-xs font-medium text-slate-500 block">
              {row.product}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "USD Price",
      key: "monthlyPriceUsd",
      render: (mPrice, row) => (
        <div>
          <span className="font-mono text-emerald-600 font-bold text-base">
            ${billingCycle === "annual" ? Math.round(row.annualPriceUsd / 12) : mPrice}{" "}
            <span className="text-slate-500 text-xs font-normal">/ mo</span>
          </span>
          {billingCycle === "annual" && (
            <span className="text-xs font-mono text-slate-500 block">
              Billed ${row.annualPriceUsd}/yr ({row.annualDiscount}% off)
            </span>
          )}
        </div>
      ),
    },
    {
      header: "User Quota",
      key: "userLimit",
      render: (u) => (
        <span className="text-xs font-mono text-slate-800 font-semibold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          {u}
        </span>
      ),
    },
    {
      header: "Usage Limits",
      key: "usageLimit",
      render: (lim) => <span className="text-xs text-slate-600 font-mono font-medium">{lim}</span>,
    },
    {
      header: "Trial",
      key: "trialEligible",
      render: (t) => (
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            t
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-slate-300 bg-slate-100 text-slate-600"
          }`}
        >
          {t ? "14d Free Trial" : "Contact Sales"}
        </span>
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
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Edit Plan"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Duplicate Plan"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Plan"
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
        title="Pricing & Commercial Plans"
        description="Configure Starter, Growth, Business and Enterprise SaaS tier packages. Preview monthly and annual USD billing calculations."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pricing Plans" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Public Pricing Cards</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Plan Tier</span>
            </button>
          </div>
        }
      />

      {/* Global Billing Frequency & Currency Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-slate-800">
            Billing Frequency Preview:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-semibold">
            Default Public Currency:
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Default currency"
            className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-800 font-semibold focus:border-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="USD">USD ($) — Default</option>
            <option value="EUR">EUR (€) — Ready</option>
            <option value="GBP">GBP (£) — Ready</option>
            <option value="AED">AED (د.إ) — Ready</option>
          </select>
        </div>
      </div>

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter plan tiers by name or associated product..."
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
        totalCount={plans.length}
        filteredCount={filtered.length}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyField="id"
      />

      {/* Create / Edit Plan Modal */}
      {editingPlan && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            editingPlan.name ? `Configure: ${editingPlan.name}` : "Create Plan Tier"
          }
          description="Specify tier name, USD monthly and annual rates, quotas, feature checklist, and highlight status."
          size="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Save Plan
              </button>
            </div>
          }
        >
          <form onSubmit={handleSavePlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plan Tier Name *
                </label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                  placeholder="e.g. Growth"
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Associated Product
                </label>
                <select
                  value={editingPlan.productSlug}
                  onChange={(e) => {
                    const selSlug = e.target.value;
                    const prodName =
                      selSlug === "universal"
                        ? "All Products (Universal)"
                        : availableProducts.find((p) => p.slug === selSlug)?.name || selSlug;
                    setEditingPlan({
                      ...editingPlan,
                      productSlug: selSlug,
                      product: prodName,
                    });
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                >
                  <option value="universal">All Products (Universal)</option>
                  {availableProducts.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly USD Price ($) *
                </label>
                <input
                  type="number"
                  value={editingPlan.monthlyPriceUsd}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setEditingPlan({
                      ...editingPlan,
                      monthlyPriceUsd: m,
                      annualPriceUsd: Math.round(m * 12 * 0.8),
                    });
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Annual USD Price ($)
                </label>
                <input
                  type="number"
                  value={editingPlan.annualPriceUsd}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      annualPriceUsd: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Annual Discount (%)
                </label>
                <input
                  type="number"
                  value={editingPlan.annualDiscount}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      annualDiscount: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tier Summary / Description
              </label>
              <textarea
                rows={2}
                value={editingPlan.description}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, description: e.target.value })
                }
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  User Limit Quota
                </label>
                <input
                  type="text"
                  value={editingPlan.userLimit}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, userLimit: e.target.value })
                  }
                  placeholder="e.g. 50 Users"
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usage Limits
                </label>
                <input
                  type="text"
                  value={editingPlan.usageLimit}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, usageLimit: e.target.value })
                  }
                  placeholder="e.g. 50,000 API calls / mo"
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Included Features (one per line)
              </label>
              <textarea
                rows={5}
                value={editingPlan.featuresText || editingPlan.features.join("\n")}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    featuresText: e.target.value,
                  })
                }
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={editingPlan.highlighted}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      highlighted: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Highlight as Recommended Tier</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={editingPlan.trialEligible}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      trialEligible: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Eligible for 14-Day Free Trial</span>
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Public Pricing Cards Preview Modal */}
      <AdminModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Public Pricing Tier Preview"
        description="Responsive presentation cards reflecting currently configured rates and features."
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between ${
                p.highlighted
                  ? "border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                  {p.highlighted && (
                    <span className="text-xs font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </div>
                <div className="pt-1">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    ${billingCycle === "annual" ? Math.round(p.annualPriceUsd / 12) : p.monthlyPriceUsd}
                  </span>
                  <span className="text-xs text-slate-500 font-mono"> / mo</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {p.description}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {p.features.slice(0, 4).map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-1.5 text-xs text-slate-700 font-medium"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-500 font-mono block mb-2">
                  {p.userLimit} • {p.usageLimit}
                </span>
                <button
                  type="button"
                  className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  {p.trialEligible ? "Start Free Trial" : "Contact Sales"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminModal>

      <AdminConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Pricing Tier: ${deleteTarget?.name}?`}
        description="This plan will no longer be available for customer checkout or demo selections."
        confirmLabel="Confirm Delete"
        danger
      />
    </div>
  );
}
