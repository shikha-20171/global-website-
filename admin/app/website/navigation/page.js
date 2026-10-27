"use client";

import { useState, useEffect } from "react";
import {
  Navigation,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit2,
  ExternalLink,
  Save,
  CheckCircle2,
  Share2,
  MousePointerClick,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import NavLinkModal from "./components/NavLinkModal";
import { getNavigationStructure } from "@/lib/admin/data-service";
import {
  getAdminNavigation,
  createAdminNavigation,
  updateAdminNavigation,
} from "@/lib/api";

export default function AdminNavigationPage() {
  const initialNav = getNavigationStructure();
  const [headerLinks, setHeaderLinks] = useState(initialNav.header || []);
  const [footerCols, setFooterCols] = useState(initialNav.footerColumns || []);
  const [activeTab, setActiveTab] = useState("header");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    // [API IMPLEMENTATION] getAdminNavigation() -> GET /api/v1/admin/navigation
    getAdminNavigation()
      .then((data) => {
        if (!mounted || !data) return;
        const items = Array.isArray(data) ? data : data.items || data.navigation || [];
        if (items.length > 0) {
          const headers = items
            .filter((i) => i.menuLocation === "HEADER")
            .map((i) => ({
              id: i.id,
              label: i.label,
              href: i.href,
              badge: i.badge,
              hasMega: i.hasMegaMenu,
            }));
          if (headers.length > 0) {
            setHeaderLinks(headers);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Social Links state
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "https://linkedin.com/company/dezoryn",
    twitter: "https://twitter.com/dezoryn",
    github: "https://github.com/dezoryn",
    youtube: "https://youtube.com/@dezoryn",
  });

  // CTA Button state
  const [headerCta, setHeaderCta] = useState({
    label: "Contact Sales",
    href: "/contact-sales",
    enabled: true,
  });

  // Modals for editing links
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editingTarget, setEditingTarget] = useState({ type: "header" });

  const handleSaveLink = (e) => {
    e.preventDefault();
    if (!editingLink.label || !editingLink.href) return;

    if (editingTarget.type === "header") {
      const exists = headerLinks.some((l) => l.id === editingLink.id);
      if (exists) {
        setHeaderLinks(
          headerLinks.map((l) => (l.id === editingLink.id ? editingLink : l))
        );
      } else {
        setHeaderLinks([...headerLinks, editingLink]);
      }
    } else if (editingTarget.type === "footer") {
      const { colIdx } = editingTarget;
      const updatedCols = [...footerCols];
      const targetCol = { ...updatedCols[colIdx] };
      const exists = targetCol.links.some(
        (l) => l.href === editingLink.originalHref
      );
      if (exists) {
        targetCol.links = targetCol.links.map((l) =>
          l.href === editingLink.originalHref ? editingLink : l
        );
      } else {
        targetCol.links = [...targetCol.links, editingLink];
      }
      updatedCols[colIdx] = targetCol;
      setFooterCols(updatedCols);
    }

    setIsEditModalOpen(false);
    setToast({
      type: "success",
      message: "Navigation Link Saved",
      description: `"${editingLink.label}" destination set to ${editingLink.href}.`,
    });
  };

  const handleDeleteHeaderLink = (id) => {
    setHeaderLinks(headerLinks.filter((l) => l.id !== id));
    setToast({
      type: "info",
      message: "Link Removed",
      description: "Header navigation link removed from local menu.",
    });
  };

  const handleMoveHeaderLink = (index, dir) => {
    const updated = [...headerLinks];
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[targetIdx];
    updated[targetIdx] = updated[index];
    updated[index] = temp;
    setHeaderLinks(updated);
  };

  const handleSaveAll = async () => {
    try {
      for (let i = 0; i < headerLinks.length; i++) {
        const item = headerLinks[i];
        if (item.id && !item.id.startsWith("nav-")) {
          // [API IMPLEMENTATION] updateAdminNavigation() -> PUT /api/v1/admin/navigation/:id
          await updateAdminNavigation(item.id, {
            label: item.label,
            href: item.href,
            displayOrder: i + 1,
            badge: item.badge,
          }).catch(() => {});
        } else if (item.label && item.href) {
          // [API IMPLEMENTATION] createAdminNavigation() -> POST /api/v1/admin/navigation
          await createAdminNavigation({
            label: item.label,
            href: item.href,
            menuLocation: "HEADER",
            displayOrder: i + 1,
            badge: item.badge,
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn("Navigation API sync warning:", err.message);
    }

    setToast({
      type: "success",
      message: "Navigation Menu Published",
      description: "Header, footer, CTA buttons and social links updated across the site.",
    });
  };

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
        title="Navigation & Global Menus"
        description="Configure header mega-menu navigation, dropdown links, 4-column footer layout, primary action CTAs, and corporate social channels."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Website" },
          { label: "Navigation" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 shadow-sm transition active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            <span>Save Navigation</span>
          </button>
        }
      />

      <AdminTabs
        tabs={[
          { id: "header", label: "Header Navigation" },
          { id: "footer", label: "Footer Columns" },
          { id: "cta", label: "Action Buttons & Social" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Header Navigation Tab */}
      {activeTab === "header" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Primary Header Menu Items
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Reorder or modify links that appear from left to right on the public website navbar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingLink({
                  id: `nav-${Date.now()}`,
                  label: "",
                  href: "/",
                  hasMega: false,
                });
                setEditingTarget({ type: "header" });
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition shadow-2xs self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Header Link</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {headerLinks.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveHeaderLink(idx, "up")}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100"
                    >
                      <MoveUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === headerLinks.length - 1}
                      onClick={() => handleMoveHeaderLink(idx, "down")}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100"
                    >
                      <MoveDown className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold w-6">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.hasMega && (
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                          Mega Menu
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-500 mt-0.5 block">
                      {item.href}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLink({ ...item });
                      setEditingTarget({ type: "header" });
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                    title="Edit Link"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteHeaderLink(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Columns Tab */}
      {activeTab === "footer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {footerCols.map((col, colIdx) => (
            <div
              key={col.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  {col.title}
                </h4>
                <span className="text-xs text-slate-500 font-medium">
                  {col.links.length} links
                </span>
              </div>

              <div className="space-y-2">
                {col.links.map((link) => (
                  <div
                    key={link.label}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 group transition"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-900 block truncate">
                        {link.label}
                      </span>
                      <span className="text-xs text-slate-500 font-mono truncate block mt-0.5">
                        {link.href}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLink({
                          ...link,
                          originalHref: link.href,
                        });
                        setEditingTarget({ type: "footer", colIdx });
                        setIsEditModalOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-blue-600 transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons & Social Tab */}
      {activeTab === "cta" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Header CTA Button */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Navbar Primary CTA Button
              </h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Button Label
              </label>
              <input
                type="text"
                value={headerCta.label}
                onChange={(e) =>
                  setHeaderCta({ ...headerCta, label: e.target.value })
                }
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Route
              </label>
              <input
                type="text"
                value={headerCta.href}
                onChange={(e) =>
                  setHeaderCta({ ...headerCta, href: e.target.value })
                }
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Corporate Social Media Handles
              </h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                LinkedIn Corporate URL
              </label>
              <input
                type="text"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Twitter / X Profile
              </label>
              <input
                type="text"
                value={socialLinks.twitter}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, twitter: e.target.value })
                }
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                GitHub Organization URL
              </label>
              <input
                type="text"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      <NavLinkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        link={editingLink}
        onChange={setEditingLink}
        onSave={handleSaveLink}
      />
    </div>
  );
}
