"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Box,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Eye,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminModal from "@/components/admin/AdminModal";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import AdminImageUploader from "@/components/admin/AdminImageUploader";
import { products as websiteProducts } from "@/lib/data";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/lib/api";

const fallbackProducts = websiteProducts.map((p, idx) => ({
  id: p.id || `prod_${p.slug}`,
  name: p.name,
  slug: p.slug,
  tagline: p.tagline || p.description || "",
  description: p.description || "",
  category: typeof p.category === "object" ? p.category?.name || "Enterprise" : p.category || "Enterprise",
  image: p.image || "/products/schooly-core.jpg",
  size: p.size || "Medium",
  deployment: p.deployment || "Cloud",
  ai: Boolean(p.ai),
  featured: idx < 6,
  isFeatured: idx < 6,
  unlisted: false,
  status: "PUBLISHED",
  features: Array.isArray(p.features) ? p.features : [],
  plans: Array.isArray(p.plans) ? p.plans : [],
  modules: Array.isArray(p.modules) ? p.modules : [],
  benefits: Array.isArray(p.benefits) ? p.benefits : [],
  tags: Array.isArray(p.tags) ? p.tags : [],
}));

const DEFAULT_CATEGORIES = [
  "Education",
  "Healthcare",
  "Real Estate",
  "FinTech",
  "HR & Workforce",
  "AI & Automation",
  "Enterprise ERP",
  "Legal & Compliance",
  "Hospitality",
  "General",
];

export default function AdminProductsPage() {
  const [productList, setProductList] = useState(fallbackProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = useMemo(() => {
    const fromProducts = productList
      .map((p) => (typeof p.category === "object" ? p.category?.name : p.category))
      .filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromProducts]));
  }, [productList]);

  const refreshProducts = () => {
    if (productList.length === 0) setLoading(true);
    getAdminProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (list.length > 0) {
          const mapped = list.map((p) => ({
            ...p,
            category: typeof p.category === "object" ? p.category?.name || "Enterprise" : p.category || "Enterprise",
            featured: Boolean(p.isFeatured || p.featured),
            unlisted: p.status === "DRAFT",
          }));
          setProductList(mapped);
        } else {
          setProductList(fallbackProducts);
        }
      })
      .catch((err) => {
        console.warn("Using website products catalog notice:", err.message);
        setProductList(fallbackProducts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("general");

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.tagline?.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || p.category === category;
      const matchStatus =
        !statusFilter ||
        (statusFilter === "Published" && !p.unlisted) ||
        (statusFilter === "Draft" && p.unlisted);
      return matchSearch && matchCat && matchStatus;
    });
  }, [productList, search, category, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "category") {
        const catA = typeof a.category === "object" && a.category ? (a.category.name || "") : (a.category || "");
        const catB = typeof b.category === "object" && b.category ? (b.category.name || "") : (b.category || "");
        return catA.localeCompare(catB);
      }
      if (sort === "price") {
        const priceA = a.plans?.[0]?.monthly_price_usd || 0;
        const priceB = b.plans?.[0]?.monthly_price_usd || 0;
        return priceB - priceA;
      }
      return 0;
    });
  }, [filtered, sort]);

  const pageSize = 8;
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleOpenCreate = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: "",
      slug: "",
      category: categories[0] || "Education",
      tagline: "",
      description: "",
      unlisted: false,
      featured: false,
      heroHeadline: "",
      startingPrice: 49,
      trialDays: 14,
      demoUrl: "/demos",
      seoTitle: "",
      metaDescription: "",
      features: ["Enterprise RBAC", "Automated Workflows", "API Access"],
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct({ ...prod });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleDuplicate = (prod) => {
    const dup = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      slug: `${prod.slug}-copy`,
      unlisted: true,
    };
    setProductList([dup, ...productList]);
    setToast({
      type: "success",
      message: "Product Duplicated",
      description: `Created draft copy: "${dup.name}".`,
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.slug) {
      setToast({
        type: "error",
        message: "Validation Error",
        description: "Product Name and Slug are required.",
      });
      return;
    }

    try {
      const exists = productList.find(
        (p) => p.slug === editingProduct.slug || p.id === editingProduct.id
      );
      if (exists && exists.id && !exists.id.startsWith("prod-")) {
        await updateAdminProduct(exists.id, editingProduct);
        setToast({
          type: "success",
          message: "Product Updated",
          description: `Changes saved to PostgreSQL database for "${editingProduct.name}".`,
        });
      } else {
        await createAdminProduct(editingProduct);
        setToast({
          type: "success",
          message: "Product Created",
          description: `"${editingProduct.name}" created in PostgreSQL database.`,
        });
      }
      refreshProducts();
    } catch (err) {
      console.warn("API product save notice:", err.message);
      const exists = productList.some((p) => p.slug === editingProduct.slug);
      if (exists) {
        setProductList(
          productList.map((p) =>
            p.slug === editingProduct.slug ? editingProduct : p
          )
        );
      } else {
        setProductList([editingProduct, ...productList]);
      }
      setToast({
        type: "success",
        message: "Product Saved",
        description: `Changes updated for "${editingProduct.name}".`,
      });
    }
    setIsEditorOpen(false);
  };

  const handleToggleFeatured = async (slug) => {
    const prod = productList.find((p) => p.slug === slug);
    if (!prod) return;
    const isNowFeatured = !prod.featured && !prod.isFeatured;

    setProductList((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const updated = { ...p, featured: isNowFeatured, isFeatured: isNowFeatured };
          setToast({
            type: isNowFeatured ? "success" : "info",
            message: isNowFeatured ? "Featured on Global Homepage" : "Removed from Featured Rail",
            description: `"${p.name}" ${isNowFeatured ? "is now pinned to the homepage featured rail." : "is removed from homepage rail."}`,
          });
          return updated;
        }
        return p;
      })
    );

    if (prod.id && !prod.id.startsWith("prod-")) {
      try {
        await updateAdminProduct(prod.id, { isFeatured: isNowFeatured, featured: isNowFeatured });
      } catch (err) {
        console.warn("Could not persist featured status to backend:", err.message);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      if (deleteModal.id && !deleteModal.id.startsWith("prod-")) {
        await deleteAdminProduct(deleteModal.id);
      }
    } catch (err) {
      console.warn("Delete API call notice:", err.message);
    }
    setProductList(productList.filter((p) => p.slug !== deleteModal.slug));
    setToast({
      type: "warning",
      message: "Product Removed",
      description: `"${deleteModal.name}" removed from product catalog.`,
    });
    setDeleteModal(null);
  };

  const columns = [
    {
      header: "Product Name & Slug",
      key: "name",
      render: (val, row) => (
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0 shadow-2xs">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm truncate max-w-xs">{val}</div>
            <div className="text-xs font-mono text-slate-500 truncate mt-0.5">/products/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (val) => (
        <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          {typeof val === "object" && val !== null ? (val.name || val.slug || "General") : (val || "General")}
        </span>
      ),
    },
    {
      header: "Starting Tier (USD)",
      key: "plans",
      render: (plans, row) => {
        const price =
          plans?.[0]?.monthly_price_usd || row.startingPrice || 29;
        return (
          <span className="font-mono font-bold text-slate-900 text-sm">
            ${price} / mo
          </span>
        );
      },
    },
    {
      header: "Featured on Web",
      key: "featured",
      render: (featured, row) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(row.slug)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
            featured
              ? "bg-amber-50 text-amber-800 border-amber-300 shadow-2xs hover:bg-amber-100"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800"
          }`}
          title="Toggle homepage featured status"
        >
          <Sparkles size={13} className={featured ? "text-amber-500 fill-amber-400" : "text-slate-400"} />
          <span>{featured ? "Featured" : "Standard"}</span>
        </button>
      ),
    },
    {
      header: "Status",
      key: "unlisted",
      render: (unlisted) => (
        <AdminStatusBadge status={unlisted ? "Draft" : "Published"} />
      ),
    },
    {
      header: "Actions",
      key: "slug",
      className: "text-right",
      render: (slug, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`http://localhost:3000/products/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
            title="Preview Public Page"
          >
            <ExternalLink size={16} />
          </a>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            title="Duplicate Product"
          >
            <Copy size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteModal(row)}
            className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
            title="Unpublish / Delete"
          >
            <Trash2 size={16} />
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
        title="Products & SaaS Catalog"
        description="Configure enterprise software products, features, starting tiers, media screenshots, SEO and publication visibility."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Filter products by name, slug, or keywords..."
        filters={[
          {
            key: "category",
            label: "Category",
            value: category,
            onChange: (c) => { setCategory(c); setPage(1); },
            options: categories.map((c) => ({ label: c, value: c })),
          },
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: (s) => { setStatusFilter(s); setPage(1); },
            options: [
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ],
          },
        ]}
        sort={sort}
        sortOptions={[
          { label: "Product Name", value: "name" },
          { label: "Category", value: "category" },
          { label: "Price (High to Low)", value: "price" },
        ]}
        onSortChange={setSort}
        onReset={() => {
          setSearch("");
          setCategory("");
          setStatusFilter("");
          setSort("name");
          setPage(1);
        }}
        totalCount={productList.length}
        filteredCount={filtered.length}
      />

      <AdminDataTable
        columns={columns}
        data={paged}
        keyField="slug"
        emptyState={
          <AdminEmptyState
            icon={Box}
            title="No matching products found"
            description="Try modifying your keyword search or selected category filter."
            action={{
              label: "Reset Filters",
              onClick: () => { setSearch(""); setCategory(""); setStatusFilter(""); },
            }}
          />
        }
      />

      {totalPages > 1 && (
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Product Create / Edit Modal with 6 Tabs */}
      {editingProduct && (
        <AdminModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={
            editingProduct.name
              ? `Edit Product: ${editingProduct.name}`
              : "Create New SaaS Product"
          }
          description="Configure product metadata, landing page content, commercial pricing, media assets, homepage feature status, and SEO."
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                /products/{editingProduct.slug || "new-slug"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition active:scale-[0.98]"
                >
                  Save Product
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <AdminTabs
              tabs={[
                { id: "general", label: "1. General" },
                { id: "content", label: "2. Content & Features" },
                { id: "commercial", label: "3. Commercial" },
                { id: "media", label: "4. Media & Gallery" },
                { id: "seo", label: "5. SEO" },
                { id: "publishing", label: "6. Publishing & Web" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {/* Tab 1: General */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      placeholder="e.g. Schooly Cloud"
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.slug}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, slug: e.target.value })
                      }
                      placeholder="e.g. schooly-cloud"
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tagline / Short Summary
                    </label>
                    <input
                      type="text"
                      value={editingProduct.tagline || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, tagline: e.target.value })
                      }
                      placeholder="e.g. Complete K-12 and university operations suite"
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    placeholder="Comprehensive description of the product capabilities, architecture, and value proposition..."
                    className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>

                {/* Homepage Feature Toggle */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-950 text-sm flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-600 fill-amber-500" />
                      <span>Feature on Global Homepage (Featured Rail)</span>
                    </div>
                    <p className="text-xs text-amber-900/80 mt-0.5">
                      Showcase this product prominently on the DEZORYN homepage 4-item featured rail.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.featured)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Content & Features */}
            {activeTab === "content" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={editingProduct.heroHeadline || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, heroHeadline: e.target.value })
                    }
                    placeholder="e.g. Modern Student Information & Campus ERP Platform"
                    className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={5}
                    value={editingProduct.features?.join("\n") || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        features: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Commercial */}
            {activeTab === "commercial" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Starting Price (USD / mo) *
                    </label>
                    <input
                      type="number"
                      value={editingProduct.startingPrice || 49}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          startingPrice: Number(e.target.value),
                        })
                      }
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      USD default currency
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Free Trial Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.trialDays || 14}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          trialDays: Number(e.target.value),
                        })
                      }
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                    <p className="text-xs text-slate-500 mt-1">Days (e.g. 14 or 30)</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Demo Target Route
                    </label>
                    <input
                      type="text"
                      value={editingProduct.demoUrl || "/demos"}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, demoUrl: e.target.value })
                      }
                      className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Media */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Product Logo / Brand Icon
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Square SVG or transparent PNG displayed in product cards, catalog, and header.
                  </p>
                  <AdminImageUploader
                    label="Product Icon / Logo"
                    value={editingProduct.logoUrl || editingProduct.logo || ""}
                    onChange={(url) =>
                      setEditingProduct({ ...editingProduct, logoUrl: url, logo: url })
                    }
                    hint="Recommended 256x256px SVG or PNG with transparent background."
                  />
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Product Cover Image / Dashboard Preview
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Hero screenshot or UI mockup displayed in product details page.
                  </p>
                  <AdminImageUploader
                    label="Product Cover Image / Dashboard Preview"
                    value={editingProduct.coverImage || ""}
                    onChange={(url) =>
                      setEditingProduct({ ...editingProduct, coverImage: url })
                    }
                    hint="Upload a 16:9 screenshot or UI preview."
                  />
                </div>
              </div>
            )}

            {/* Tab 5: SEO */}
            {activeTab === "seo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={editingProduct.seoTitle || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, seoTitle: e.target.value })
                    }
                    placeholder={`e.g. ${editingProduct.name || "Product"} | DEZORYN TECHNOLOGY`}
                    className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.metaDescription || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="Enter search engine snippet description..."
                    className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Tab 6: Publishing & Web Feature */}
            {activeTab === "publishing" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Publication Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProduct({ ...editingProduct, unlisted: false })
                      }
                      className={`p-3.5 rounded-xl border text-left transition ${
                        !editingProduct.unlisted
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-bold text-sm">Published</div>
                      <p className="text-xs text-slate-500 mt-1">
                        Visible in public products directory and API
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProduct({ ...editingProduct, unlisted: true })
                      }
                      className={`p-3.5 rounded-xl border text-left transition ${
                        editingProduct.unlisted
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-bold text-sm">Draft / Unlisted</div>
                      <p className="text-xs text-slate-500 mt-1">
                        Hidden from marketplace & visitors
                      </p>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      Pin to Global Homepage Featured Rail
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Display as one of the 4 featured products right on the global homepage.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.featured)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* Unpublish / Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteModal)}
        title={`Unpublish ${deleteModal?.name}?`}
        description="This product will be removed from the public marketplace and products directory."
        confirmLabel="Confirm Unpublish"
        onClose={() => setDeleteModal(null)}
        onConfirm={handleConfirmDelete}
        danger
      />
    </div>
  );
}
