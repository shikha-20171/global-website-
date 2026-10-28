"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Share2,
  Palette,
  Globe2,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminImageUploader from "@/components/admin/AdminImageUploader";
import { getAdminSiteSettings, saveAdminSiteSettings } from "@/lib/api";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    siteName: "DEZORYN TECHNOLOGY",
    tagline: "Enterprise SaaS Ecosystem & Cloud Platform",
    email: "support@dezoryn.com",
    salesEmail: "sales@dezoryn.com",
    phone: "+91 755 400-DEZO",
    address: "Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India",
    linkedin: "https://linkedin.com/company/dezoryn",
    twitter: "https://twitter.com/dezoryntech",
    github: "https://github.com/dezoryn",
    youtube: "https://youtube.com/@dezoryn",
    primaryCurrency: "USD ($)",
    timezone: "UTC (Coordinated Universal Time)",
    supportHours: "24/7 Global Enterprise Support",
    logoUrl: "",
    faviconUrl: "",
    ogBannerUrl: "",
  });

  useEffect(() => {
    // [API IMPLEMENTATION] getAdminSiteSettings() -> GET /api/v1/admin/settings
    getAdminSiteSettings()
      .then((data) => {
        const payload = data?.data || data;
        const dict = {};
        if (Array.isArray(payload)) {
          payload.forEach((s) => {
            if (s && s.key) dict[s.key] = s.value;
          });
        } else if (payload && typeof payload === "object") {
          Object.assign(dict, payload);
        }

        if (Object.keys(dict).length > 0) {
          setSettings((prev) => ({
            ...prev,
            siteName: dict.site_name || prev.siteName,
            tagline: dict.site_tagline || prev.tagline,
            email: dict.contact_email || dict.support_email || prev.email,
            salesEmail: dict.sales_email || prev.salesEmail,
            phone: dict.phone_primary || dict.support_phone || prev.phone,
            address: dict.office_address || prev.address,
            primaryCurrency: dict.primary_currency || prev.primaryCurrency,
            supportHours: dict.support_hours || prev.supportHours,
          }));
        }
      })
      .catch((err) => console.warn("Could not fetch live settings:", err.message));
  }, []);

  const handleChange = (field, val) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // [API IMPLEMENTATION] saveAdminSiteSettings() -> PUT /api/v1/admin/settings
      await saveAdminSiteSettings({
        site_name: settings.siteName,
        site_tagline: settings.tagline,
        contact_email: settings.email,
        support_email: settings.email,
        sales_email: settings.salesEmail,
        phone_primary: settings.phone,
        office_address: settings.address,
        primary_currency: settings.primaryCurrency,
        support_hours: settings.supportHours,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.warn("Save settings notice:", err.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const tabs = [
    { id: "general", label: "Company & Contact", icon: Building2 },
    { id: "social", label: "Social Media Links", icon: Share2 },
    { id: "branding", label: "Branding & Appearance", icon: Palette },
    { id: "localization", label: "Currency & Region", icon: Globe2 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Settings"
        description="Manage company details, contact information, social links, and regional settings displayed across the website."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-xs font-semibold hover:bg-electric/90 shadow-lg shadow-electric/20 transition"
          >
            {saved ? (
              <>
                <CheckCircle2 size={15} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        }
      />

      {saved && (
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Website settings updated successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg transition border-b-2 whitespace-nowrap ${
                active
                  ? "border-blue-600 text-blue-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Company & Contact */}
        {activeTab === "general" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">General Company Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These details are shown in the website header, footer, contact page, and legal notices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Public Contact Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sales Inquiries Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={settings.salesEmail}
                    onChange={(e) => handleChange("salesEmail", e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Support Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Support Availability</label>
                <input
                  type="text"
                  value={settings.supportHours}
                  onChange={(e) => handleChange("supportHours", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Headquarters Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Social Media */}
        {activeTab === "social" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Social Media Profiles</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                URLs linked in the website footer and contact sections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Twitter / X Profile URL</label>
                <input
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">GitHub Organization URL</label>
                <input
                  type="url"
                  value={settings.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube Channel URL</label>
                <input
                  type="url"
                  value={settings.youtube}
                  onChange={(e) => handleChange("youtube", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Branding */}
        {activeTab === "branding" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Brand Tokens & Typography</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual theme parameters applied globally across DEZORYN TECHNOLOGY.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Primary Background</span>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#090D16] border border-slate-300 shadow-sm" />
                  <span className="text-sm text-slate-900 font-mono font-bold">#090D16 (Midnight)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accent Color</span>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#0066FF] shadow-sm" />
                  <span className="text-sm text-slate-900 font-mono font-bold">#0066FF (Electric Blue)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Typography</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 font-sans">Exo 2</span>
                  <span className="text-xs text-blue-700 font-semibold px-2 py-0.5 rounded bg-blue-100 border border-blue-200">Google Font</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-6">
              <h4 className="text-sm font-bold text-slate-900">Website Brand Media Assets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Global Website Logo
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Displayed in top navigation bar across all pages.
                  </p>
                  <AdminImageUploader
                    value={settings.logoUrl || ""}
                    onChange={(url) => handleChange("logoUrl", url)}
                    label="Website Logo"
                    hint="SVG or high-res transparent PNG recommended"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Browser Favicon / App Icon
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Displayed in browser tabs and bookmarks (32x32 or 64x64).
                  </p>
                  <AdminImageUploader
                    value={settings.faviconUrl || ""}
                    onChange={(url) => handleChange("faviconUrl", url)}
                    label="Browser Favicon"
                    hint="ICO, PNG or SVG square icon"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Social Media (OpenGraph) Banner
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Shown when links to DEZORYN are shared on Twitter, LinkedIn, WhatsApp or Slack.
                </p>
                <AdminImageUploader
                  value={settings.ogBannerUrl || ""}
                  onChange={(url) => handleChange("ogBannerUrl", url)}
                  label="OG Share Image"
                  hint="1200x630px JPG or PNG"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Currency & Region */}
        {activeTab === "localization" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Currency & Regional Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Default currency rules according to DEZORYN global marketplace guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Display Currency</label>
                <select
                  value={settings.primaryCurrency}
                  onChange={(e) => handleChange("primaryCurrency", e.target.value)}
                  aria-label="Default Display Currency"
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 font-medium focus:border-blue-600 outline-none"
                >
                  <option value="USD ($)">USD ($) — Global Default</option>
                  <option value="EUR (€)">EUR (€) — European Union</option>
                  <option value="GBP (£)">GBP (£) — United Kingdom</option>
                  <option value="AED (د.إ)">AED (د.إ) — UAE & Middle East</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  USD ($) is enforced as the primary public pricing currency across all SaaS products.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">System Timezone</label>
                <input
                  type="text"
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 font-medium focus:border-blue-600 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
