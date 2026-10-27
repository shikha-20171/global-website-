"use client";

import { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

export default function PageEditorModal({
  isOpen,
  onClose,
  page,
  onSave,
  isNew = false,
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (page) {
      setFormData({ ...page });
      setActiveTab("general");
    }
  }, [page]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? "Create Website Page" : `Edit Page: ${formData.title}`}
      description="Configure page templates, section layout, rich content, SEO metadata and publication status."
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500 font-mono">
            Route: {formData.slug || "—"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition active:scale-[0.98]"
            >
              Save Page
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <AdminTabs
          tabs={[
            { id: "general", label: "General & Identity" },
            { id: "content", label: "Page Content" },
            { id: "seo", label: "SEO & Social Graph" },
            { id: "publishing", label: "Publication Status" },
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
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Mission & Vision"
                  className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g. /mission"
                  className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category Type
                </label>
                <select
                  value={formData.type || formData.pageType || "Corporate"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                      pageType: e.target.value,
                    })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                >
                  <option value="Core">Core & Homepage</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Commercial">Commercial & Pricing</option>
                  <option value="Solutions">Solutions</option>
                  <option value="Conversion">Conversion & Leads</option>
                  <option value="Portfolio">Portfolio & Projects</option>
                  <option value="Content">Content & Resources</option>
                  <option value="Support">Support & FAQs</option>
                  <option value="Legal">Legal & Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Page Template
                </label>
                <select
                  value={formData.template || "Standard Landing"}
                  onChange={(e) =>
                    setFormData({ ...formData, template: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                >
                  <option value="Standard Landing">Standard Landing</option>
                  <option value="Legal Document">Legal Document (Sticky Outline)</option>
                  <option value="Enterprise Grid">Enterprise Grid</option>
                  <option value="Two-Column Form">Two-Column Form</option>
                </select>
              </div>
            </div>

            <AdminImageUploader
              label="Featured Header Banner"
              value={formData.featuredImage || ""}
              onChange={(url) =>
                setFormData({ ...formData, featuredImage: url })
              }
              hint="Recommended 1920x600 WebP for crisp hero banners."
            />
          </div>
        )}

        {/* Tab 2: Content */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroHeadline: e.target.value,
                  })
                }
                placeholder="e.g. Empowering Modern Global Enterprises"
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Structured Page Body / Markdown Content
              </label>
              <textarea
                rows={8}
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter page sections, paragraphs, and markdown headings..."
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none leading-relaxed transition"
              />
            </div>
          </div>
        )}

        {/* Tab 3: SEO */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={formData.seoTitle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, seoTitle: e.target.value })
                }
                placeholder="e.g. Mission & Global Vision | DEZORYN TECHNOLOGY"
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
              <p className="text-xs text-slate-500 mt-1">
                Recommended: 50–60 characters. Current: {formData.seoTitle?.length || 0}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaDescription: e.target.value,
                  })
                }
                placeholder="Comprehensive overview of DEZORYN's architecture, reliability, and enterprise missions."
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
              <p className="text-xs text-slate-500 mt-1">
                Recommended: 140–160 characters. Current: {formData.metaDescription?.length || 0}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Publishing */}
        {activeTab === "publishing" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Publication Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Published", "Draft", "Archived"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: st })
                  }
                  className={`p-3.5 rounded-xl border text-left transition ${
                    formData.status === st
                      ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-sm">{st}</div>
                  <p className="text-xs text-slate-500 mt-1">
                    {st === "Published"
                      ? "Live on public site"
                      : st === "Draft"
                      ? "Hidden from public view"
                      : "De-indexed & preserved"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
}
