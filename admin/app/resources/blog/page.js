"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Clock,
  Eye,
  FileText,
  User,
  Sparkles,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminImageUploader from "@/components/admin/AdminImageUploader";
import { MOCK_BLOG_ARTICLES } from "@/lib/admin/mock-data/content";
import {
  getAdminBlog,
  createAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost,
} from "@/lib/api";

export default function AdminBlogPage() {
  const [articles, setArticles] = useState(MOCK_BLOG_ARTICLES);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  const refreshArticles = () => {
    // [API IMPLEMENTATION] getAdminBlog() -> GET /api/v1/admin/blog
    getAdminBlog()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.posts || data?.articles || [];
        if (list.length > 0) {
          setArticles(list);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = articles.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || a.category === catFilter;
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleOpenCreate = () => {
    setEditingArticle({
      id: `art_${Date.now()}`,
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      author: "Admin Editor",
      category: "Engineering",
      tags: ["Cloud", "SaaS"],
      tagsText: "Cloud, SaaS, Architecture",
      readTime: "5 min",
      status: "Published",
      publishedDate: "Just now",
      seoTitle: "",
      seoDescription: "",
      featuredImage: "",
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle({
      ...art,
      tagsText: Array.isArray(art.tags) ? art.tags.join(", ") : "",
    });
    setActiveTab("general");
    setIsEditorOpen(true);
  };

  const handleDuplicate = (art) => {
    const dup = {
      ...art,
      id: `art_${Date.now()}`,
      slug: `${art.slug}-copy`,
      title: `${art.title} (Copy)`,
      status: "Draft",
    };
    setArticles([dup, ...articles]);
    setToast({
      type: "success",
      message: "Article Duplicated",
      description: `Created draft copy: "${dup.title}".`,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingArticle.title || !editingArticle.slug) return;

    const parsedTags = editingArticle.tagsText
      ? editingArticle.tagsText.split(",").map((s) => s.trim()).filter(Boolean)
      : editingArticle.tags || [];

    const payload = {
      title: editingArticle.title,
      slug: editingArticle.slug,
      excerpt: editingArticle.excerpt || "",
      content: editingArticle.content || "",
      author: editingArticle.author || "Admin",
      category: editingArticle.category || "Architecture",
      status: String(editingArticle.status || "PUBLISHED").toUpperCase() === "DRAFT" ? "DRAFT" : "PUBLISHED",
      featuredImage: editingArticle.featuredImage || "",
      readTime: editingArticle.readTime || "5 min read",
      tags: parsedTags,
    };

    const isNew = editingArticle.id?.startsWith("art_") && !articles.some((a) => a.id === editingArticle.id && !a.id.startsWith("art_"));

    try {
      if (!isNew) {
        // [API IMPLEMENTATION] updateAdminBlogPost() -> PUT /api/v1/admin/blog/:id
        await updateAdminBlogPost(editingArticle.id, payload);
        setToast({
          type: "success",
          message: "Article Updated",
          description: `Changes saved for "${editingArticle.title}".`,
        });
      } else {
        // [API IMPLEMENTATION] createAdminBlogPost() -> POST /api/v1/admin/blog
        await createAdminBlogPost(payload);
        setToast({
          type: "success",
          message: "Article Published",
          description: `"${editingArticle.title}" added to blog repository.`,
        });
      }
      refreshArticles();
      setIsEditorOpen(false);
    } catch (err) {
      console.warn("API blog save notice:", err.message);
      const updated = { ...editingArticle, ...payload, tags: parsedTags };
      if (!isNew) {
        setArticles(articles.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        setArticles([updated, ...articles]);
      }
      setToast({
        type: "success",
        message: "Article Saved",
        description: `"${updated.title}" saved.`,
      });
      setIsEditorOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.id && !deleteTarget.id.startsWith("art_")) {
        // [API IMPLEMENTATION] deleteAdminBlogPost() -> DELETE /api/v1/admin/blog/:id
        await deleteAdminBlogPost(deleteTarget.id);
      }
      refreshArticles();
      setToast({
        type: "warning",
        message: "Article Removed",
        description: `"${deleteTarget.title}" deleted from blog articles.`,
      });
    } catch {
      setArticles(articles.filter((a) => a.id !== deleteTarget.id));
      setToast({
        type: "warning",
        message: "Article Removed",
        description: `"${deleteTarget.title}" deleted from blog articles.`,
      });
    }
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Article Title & Slug",
      key: "title",
      render: (title, row) => (
        <div>
          <span className="font-bold text-slate-900 text-sm">{title}</span>
          <span className="text-xs font-mono text-blue-600 block mt-0.5">
            /resources/blog/{row.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (cat) => (
        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
          {cat}
        </span>
      ),
    },
    {
      header: "Author",
      key: "author",
      render: (auth) => (
        <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span>{auth}</span>
        </span>
      ),
    },
    {
      header: "Read Time",
      key: "readTime",
      render: (rt) => <span className="text-xs font-mono font-medium text-slate-600">{rt}</span>,
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
            href={`http://localhost:3000/resources/blog/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Preview Live Article"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Edit Article"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Duplicate Article"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Article"
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
        title="Blog & Technical Articles"
        description="Publish thought leadership, cloud architecture breakdowns, security blueprints, and company perspectives."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Resources", href: "/admin/resources" },
          { label: "Blog" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Article</span>
          </button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter articles by title, author, or keyword..."
        filters={[
          {
            key: "category",
            label: "Category",
            value: catFilter,
            onChange: setCatFilter,
            options: [
              { label: "Security & Compliance", value: "Security & Compliance" },
              { label: "Strategy & Cloud", value: "Strategy & Cloud" },
              { label: "Automation", value: "Automation" },
              { label: "Engineering", value: "Engineering" },
            ],
          },
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
          setCatFilter("");
          setStatusFilter("");
        }}
        totalCount={articles.length}
        filteredCount={filtered.length}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyField="id"
      />

      {/* Article Editor Modal */}
      {editingArticle && (
        <AdminModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={
            editingArticle.title
              ? `Edit: ${editingArticle.title}`
              : "Create Technical Article"
          }
          description="Compose technical insights, structured markdown body, tags, author, and SEO metadata."
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                /blog/{editingArticle.slug || "new-slug"}
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
                  Save Article
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <AdminTabs
              tabs={[
                { id: "general", label: "General & Author" },
                { id: "content", label: "Article Markdown Body" },
                { id: "seo", label: "SEO & Social Graph" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingArticle({
                          ...editingArticle,
                          title: val,
                          slug: val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        });
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={editingArticle.slug}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          slug: e.target.value,
                        })
                      }
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingArticle.category}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          category: e.target.value,
                        })
                      }
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={editingArticle.author}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          author: e.target.value,
                        })
                      }
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={editingArticle.readTime}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          readTime: e.target.value,
                        })
                      }
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Article Summary / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        excerpt: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.tagsText}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        tagsText: e.target.value,
                      })
                    }
                    placeholder="Zero-Trust, PostgreSQL, Cloud"
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <AdminImageUploader
                  label="Featured Article Cover Banner"
                  value={editingArticle.featuredImage}
                  onChange={(url) =>
                    setEditingArticle({ ...editingArticle, featuredImage: url })
                  }
                  hint="Recommended 1200x630px WebP for OpenGraph and banner cards."
                />
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-4">
                <textarea
                  rows={12}
                  value={editingArticle.content || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      content: e.target.value,
                    })
                  }
                  placeholder="# Technical Deep Dive&#10;&#10;Enter article markdown content, section headings, code snippets and analysis..."
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-blue-600 focus:outline-none leading-relaxed"
                />
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
                    value={editingArticle.seoTitle || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        seoTitle: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingArticle.seoDescription || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        seoDescription: e.target.value,
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
                    value={editingArticle.status}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
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
        title={`Delete Article: ${deleteTarget?.title}?`}
        description="Are you sure you want to remove this article from the blog?"
        confirmLabel="Confirm Delete"
        danger
      />
    </div>
  );
}
