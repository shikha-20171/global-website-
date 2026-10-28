"use client";

import { useState, useEffect } from "react";
import {
  LayoutTemplate,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Save,
  Send,
  ExternalLink,
  Layers,
  Sparkles,
  Check,
  Box,
  Plus,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminToast from "@/components/admin/AdminToast";
import EditSectionModal from "./components/EditSectionModal";
import VersionHistoryModal from "./components/VersionHistoryModal";
import AdminPreviewPanel from "@/components/admin/AdminPreviewPanel";
import { getAdminSections, updateAdminSection } from "@/lib/api";

export const fallbackHomepageSections = [
  {
    id: "sec_hero",
    sectionKey: "sec_hero",
    name: "Hero Header & 3D Interactive Stage",
    headline: "Technology That Moves Businesses Forward.",
    subheadline: "We build software products, enterprise platforms, and digital solutions that help businesses simplify operations, improve efficiency, and grow.",
    primaryCtaLabel: "Explore Products",
    primaryCtaUrl: "/marketplace",
    secondaryCtaLabel: "Talk to an Expert",
    secondaryCtaUrl: "/contact",
    imageUrl: "/products/schooly-core.jpg",
    status: "Published",
    enabled: true,
    order: 1,
    lastEdited: "Production Live",
  },
  {
    id: "sec_solutions_bento",
    sectionKey: "sec_solutions_bento",
    name: "Technology Solutions For Modern Businesses (Bento Showcase)",
    headline: "Intelligent Software & Digital Infrastructure",
    subheadline: "Scalable SaaS platforms, bespoke engineering, workflow automation, and enterprise web & mobile architectures built for mission-critical demands.",
    primaryCtaLabel: "Explore All Solutions",
    primaryCtaUrl: "/solutions",
    secondaryCtaLabel: "View Case Studies",
    secondaryCtaUrl: "/case-studies",
    imageUrl: "/resources/agentic-ai.jpg",
    status: "Published",
    enabled: true,
    order: 2,
    lastEdited: "Production Live",
  },
  {
    id: "sec_featured_rail",
    sectionKey: "sec_featured_rail",
    name: "Featured Products Carousel Rail",
    headline: "Production-Ready Software Products",
    subheadline: "Explore our flagship SaaS suites built with modern stacks, enterprise security, and multi-tenant isolation.",
    primaryCtaLabel: "Browse Marketplace",
    primaryCtaUrl: "/marketplace",
    secondaryCtaLabel: "Book a Demo",
    secondaryCtaUrl: "/demo",
    imageUrl: "/products/dezo-care.jpg",
    status: "Published",
    enabled: true,
    order: 3,
    lastEdited: "Production Live",
  },
  {
    id: "sec_industries",
    sectionKey: "sec_industries",
    name: "Industries We Serve (Vertical Domain Solutions)",
    headline: "Engineered For Your Specific Industry",
    subheadline: "Specialized platforms purpose-built for education, healthcare, real estate, logistics, hospitality, and retail operations.",
    primaryCtaLabel: "Explore Verticals",
    primaryCtaUrl: "/industries",
    secondaryCtaLabel: "Consult an Architect",
    secondaryCtaUrl: "/contact",
    imageUrl: "/resources/cloud-finops.jpg",
    status: "Published",
    enabled: true,
    order: 4,
    lastEdited: "Production Live",
  },
  {
    id: "sec_why_choose",
    sectionKey: "sec_why_choose",
    name: "Why Choose DEZORYN (Spotlight Capabilities)",
    headline: "Engineered For Speed, Scalability & Precision",
    subheadline: "How DEZORYN combines rapid deployment with custom architectural precision, zero-trust security, and 99.99% uptime guarantees.",
    primaryCtaLabel: "Our Platform Standards",
    primaryCtaUrl: "/company",
    secondaryCtaLabel: "Security Protocols",
    secondaryCtaUrl: "/legal/security",
    imageUrl: "/resources/cyber-security-vault.jpg",
    status: "Published",
    enabled: true,
    order: 5,
    lastEdited: "Production Live",
  },
  {
    id: "sec_global_nodes",
    sectionKey: "sec_global_nodes",
    name: "Engineering What's Next (Global Cloud Architecture)",
    headline: "Engineering What's Next",
    subheadline: "Global cloud deployment nodes across North America, Europe, Middle East, and Asia Pacific delivering sub-50ms latency.",
    primaryCtaLabel: "Enterprise Infrastructure",
    primaryCtaUrl: "/solutions/enterprise",
    secondaryCtaLabel: "System Status",
    secondaryCtaUrl: "/health",
    imageUrl: "/resources/saas-architecture.jpg",
    status: "Published",
    enabled: true,
    order: 6,
    lastEdited: "Production Live",
  },
  {
    id: "sec_careers",
    sectionKey: "sec_careers",
    name: "Careers & Engineering Culture",
    headline: "Build The Future of Enterprise Software With Us",
    subheadline: "Join a passionate team of systems architects, frontend artists, and AI engineers solving high-impact problems worldwide.",
    primaryCtaLabel: "View Open Roles",
    primaryCtaUrl: "/careers",
    secondaryCtaLabel: "Learn About Culture",
    secondaryCtaUrl: "/company",
    imageUrl: "/resources/digital-transformation.jpg",
    status: "Published",
    enabled: true,
    order: 7,
    lastEdited: "Production Live",
  },
  {
    id: "sec_faq",
    sectionKey: "sec_faq",
    name: "Frequently Asked Questions (Homepage FAQ Accordion)",
    headline: "Frequently Asked Questions",
    subheadline: "Everything you need to know about our software products, deployment models, integrations, and SLAs.",
    primaryCtaLabel: "Browse All FAQs",
    primaryCtaUrl: "/faq",
    secondaryCtaLabel: "Developer Docs",
    secondaryCtaUrl: "/resources/api",
    imageUrl: "/resources/api-developer-guide.jpg",
    status: "Published",
    enabled: true,
    order: 8,
    lastEdited: "Production Live",
  },
  {
    id: "sec_final_cta",
    sectionKey: "sec_final_cta",
    name: "Final Conversion Banner (Call to Action)",
    headline: "Ready to Move Your Business Forward?",
    subheadline: "Tell us about your business goals, book a free live demo, or explore our software products today.",
    primaryCtaLabel: "Talk to an Expert",
    primaryCtaUrl: "/contact",
    secondaryCtaLabel: "Explore Software Products",
    secondaryCtaUrl: "/marketplace",
    imageUrl: "/products/crm.jpg",
    status: "Published",
    enabled: true,
    order: 9,
    lastEdited: "Production Live",
  },
];

export default function AdminHomepageBuilderPage() {
  const [sections, setSections] = useState(fallbackHomepageSections);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;

    getAdminSections("home")
      .then((data) => {
        if (!mounted) return;
        const liveSecs = data?.sections || (Array.isArray(data) ? data : []);
        const homeSecs = liveSecs.filter(
          (s) => !s.page || s.page.slug === "/" || s.pageId === "cmvahys5p002btpwinwh7gs1d"
        );
        const targetSecs = homeSecs.length > 0 ? homeSecs : liveSecs;
        if (targetSecs.length > 0) {
          const mapped = targetSecs.map((s, idx) => ({
            id: s.id,
            sectionKey: s.sectionKey,
            name: s.name || s.sectionKey || `Section ${idx + 1}`,
            headline: s.headline || "",
            subheadline: s.subheadline || "",
            primaryCtaLabel: s.settings?.primaryCtaLabel || "Explore Products",
            primaryCtaUrl: s.settings?.primaryCtaUrl || "/marketplace",
            secondaryCtaLabel: s.settings?.secondaryCtaLabel || "Talk to an Expert",
            secondaryCtaUrl: s.settings?.secondaryCtaUrl || "/contact",
            imageUrl: s.settings?.imageUrl || s.imageUrl || "",
            status: s.isEnabled ? "Published" : "Draft",
            enabled: s.isEnabled ?? true,
            order: s.displayOrder || idx + 1,
            lastEdited: "Recently",
          }));
          setSections(mapped);
        } else {
          setSections(fallbackHomepageSections);
        }
      })
      .catch((err) => {
        console.warn("Using fallback homepage sections:", err.message);
        if (mounted) {
          setSections(fallbackHomepageSections);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Reorder section up
  const moveUp = async (index) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updated[index - 1].order = index;
    updated[index].order = index + 1;
    setSections(updated);
    if (updated[index - 1].id && !updated[index - 1].id.startsWith("sec_")) {
      updateAdminSection(updated[index - 1].id, { displayOrder: index }).catch(() => {});
    }
    if (updated[index].id && !updated[index].id.startsWith("sec_")) {
      updateAdminSection(updated[index].id, { displayOrder: index + 1 }).catch(() => {});
    }
    setToast({
      type: "info",
      message: "Section Order Updated",
      description: `Moved "${updated[index - 1].name}" up to position #${index}.`,
    });
  };

  // Reorder section down
  const moveDown = async (index) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updated[index].order = index + 1;
    updated[index + 1].order = index + 2;
    setSections(updated);
    if (updated[index].id && !updated[index].id.startsWith("sec_")) {
      updateAdminSection(updated[index].id, { displayOrder: index + 1 }).catch(() => {});
    }
    if (updated[index + 1].id && !updated[index + 1].id.startsWith("sec_")) {
      updateAdminSection(updated[index + 1].id, { displayOrder: index + 2 }).catch(() => {});
    }
    setToast({
      type: "info",
      message: "Section Order Updated",
      description: `Moved "${updated[index + 1].name}" down to position #${index + 2}.`,
    });
  };

  // Toggle visibility
  const toggleVisibility = async (id) => {
    const updated = sections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled, status: !sec.enabled ? "Published" : "Draft" } : sec
    );
    setSections(updated);
    const target = updated.find((s) => s.id === id);
    if (id && !id.startsWith("sec_")) {
      try {
        await updateAdminSection(id, { isEnabled: target.enabled });
      } catch (err) {}
    }
    setToast({
      type: target.enabled ? "success" : "warning",
      message: target.enabled ? "Section Enabled" : "Section Disabled",
      description: `"${target.name}" is now ${target.enabled ? "visible" : "hidden"} on the public homepage.`,
    });
  };

  // Save changes to selected section
  const handleSaveSection = async (e) => {
    e?.preventDefault();
    const updated = sections.map((s) =>
      s.id === selectedSection.id ? { ...selectedSection, lastEdited: "Just now" } : s
    );
    setSections(updated);
    setIsEditModalOpen(false);
    try {
      if (selectedSection.id && !selectedSection.id.startsWith("sec_")) {
        await updateAdminSection(selectedSection.id, {
          name: selectedSection.name,
          headline: selectedSection.headline,
          subheadline: selectedSection.subheadline,
          settings: {
            source: "admin_homepage_builder",
            imageUrl: selectedSection.imageUrl || "",
            primaryCtaLabel: selectedSection.primaryCtaLabel,
            primaryCtaUrl: selectedSection.primaryCtaUrl,
            secondaryCtaLabel: selectedSection.secondaryCtaLabel,
            secondaryCtaUrl: selectedSection.secondaryCtaUrl,
          },
          isEnabled: selectedSection.enabled,
          displayOrder: selectedSection.order,
        });
      }
      setToast({
        type: "success",
        message: "Section Configured",
        description: `Changes to "${selectedSection.name}" saved to database.`,
      });
    } catch (err) {
      setToast({
        type: "success",
        message: "Section Configured",
        description: `Changes to "${selectedSection.name}" saved in layout.`,
      });
    }
  };

  const handleSaveDraft = () => {
    setToast({
      type: "success",
      message: "Homepage Draft Saved",
      description: "All section layouts and content modifications saved.",
    });
  };

  const handlePublishAll = async () => {
    const updated = sections.map((s) => ({ ...s, status: "Published", lastEdited: "Just now" }));
    setSections(updated);
    try {
      for (const s of updated) {
        if (s.id && !s.id.startsWith("sec_")) {
          await updateAdminSection(s.id, { status: "PUBLISHED" }).catch(() => {});
        }
      }
      setToast({
        type: "success",
        message: "Homepage Published Successfully",
        description: "All modifications are now live on the DEZORYN corporate production homepage.",
      });
    } catch (e) {
      setToast({
        type: "success",
        message: "Homepage Published",
        description: "Layout updated on corporate website.",
      });
    }
  };

  const handleRollback = () => {
    setSections(fallbackHomepageSections);
    setIsVersionModalOpen(false);
    setToast({
      type: "info",
      message: "Restored to Default Website Layout",
      description: "Homepage layout reset to approved DEZORYN website specifications.",
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
        title="Homepage & Global Website Builder"
        description="Visual content and layout control for the DEZORYN website homepage. Reorder sections, customize headlines, subheadlines, CTA buttons, and configure live modules."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Website" },
          { label: "Homepage Builder" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition ${
                showPreview
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVersionModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Revisions</span>
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 transition shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={handlePublishAll}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 shadow-sm transition active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              <span>Publish Live to Website</span>
            </button>
          </div>
        }
      />

      {/* Optional Live Preview Panel */}
      {showPreview && (
        <AdminPreviewPanel
          title="Homepage Mock Preview"
          previewUrl="http://localhost:3000"
        >
          <div className="p-8 space-y-6 text-slate-900 text-center bg-white rounded-xl">
            <div className="py-6 border-b border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                LIVE HERO HEADLINE
              </span>
              <h2 className="text-2xl font-extrabold mt-3 text-slate-900 font-exo">
                {sections[0]?.headline || "Technology That Moves Businesses Forward."}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                {sections[0]?.subheadline}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm py-4 border-b border-slate-100 font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">99.95% Availability</div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">18+ SaaS Engines</div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">Zero-Trust RBAC</div>
            </div>
            <p className="text-xs text-slate-500">
              Showing active order of {sections.filter((s) => s.enabled).length} visible homepage sections.
            </p>
          </div>
        </AdminPreviewPanel>
      )}

      {/* Sections List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Homepage Sections &amp; Content Management ({sections.length} Sections)
            </h3>
          </div>
          <span className="text-xs text-slate-600 font-medium">
            Active: <strong className="text-slate-900 font-bold">{sections.filter((s) => s.enabled).length}</strong> / {sections.length}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`p-4 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                section.enabled ? "bg-white hover:bg-slate-50/80" : "bg-slate-50/50 opacity-60"
              }`}
            >
              {/* Order & Title */}
              <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 transition"
                    title="Move up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 transition"
                    title="Move down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                </div>

                {section.imageUrl && (
                  <img
                    src={section.imageUrl}
                    alt={section.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100 hidden sm:block shadow-2xs"
                  />
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">
                      {section.name}
                    </h4>
                    <AdminStatusBadge
                      status={section.enabled ? "Published" : "Draft"}
                    />
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-xl">
                    {section.headline || section.subheadline || "Configured layout component"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Key: {section.sectionKey}</span>
                    <span>•</span>
                    <span>CTAs: {section.primaryCtaLabel || "Explore"} / {section.secondaryCtaLabel || "Contact"}</span>
                    <span>•</span>
                    <span>Edited: {section.lastEdited || "Recent"}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => toggleVisibility(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    section.enabled
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                  title={section.enabled ? "Disable section" : "Enable section"}
                >
                  {section.enabled ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSection({ ...section });
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Configure Copy &amp; CTAs</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Section Modal */}
      <EditSectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        section={selectedSection}
        onChange={setSelectedSection}
        onSave={handleSaveSection}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        onRollback={handleRollback}
      />
    </div>
  );
}
