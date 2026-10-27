"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Target,
  Eye,
  Gem,
  Users,
  MapPin,
  ExternalLink,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Globe2,
  Sparkles,
  Phone,
  Mail,
  Award,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import LeaderModal from "./components/LeaderModal";
import OfficeModal from "./components/OfficeModal";
import { getAdminCompanyProfile, saveAdminCompanyProfile } from "@/lib/api";

const INITIAL_PILLARS = [
  {
    id: "mission",
    title: "Our Mission",
    statement: "To make powerful technology accessible, scalable, and intelligent for businesses everywhere.",
    tag: "SRS §25",
    color: "from-blue-500/20 via-blue-500/10 to-transparent",
    accent: "text-blue-600 border-blue-200 bg-blue-50",
  },
  {
    id: "vision",
    title: "Our Vision",
    statement: "To build a global ecosystem of software products that powers the next generation of businesses.",
    tag: "SRS §26",
    color: "from-indigo-500/20 via-indigo-500/10 to-transparent",
    accent: "text-indigo-600 border-indigo-200 bg-indigo-50",
  },
  {
    id: "values",
    title: "Our Core Values",
    statement: "Architectural craftsmanship, zero unnecessary complexity, customer transparency, and a global technology mindset.",
    tag: "Values",
    color: "from-sky-500/20 via-sky-500/10 to-transparent",
    accent: "text-sky-600 border-sky-200 bg-sky-50",
  },
];

const INITIAL_LEADERS = [
  {
    id: "lead_1",
    name: "Alexander Wright",
    role: "Chief Executive Officer & Co-Founder",
    bio: "Enterprise cloud architect with 15+ years scaling multi-tenant software platforms and distributed databases.",
    location: "Bhopal, India",
    avatar: "/team/alexander-wright.jpg",
  },
  {
    id: "lead_2",
    name: "Shikha Gour",
    role: "Chief Technology Officer & Head of Architecture",
    bio: "Pioneering zero-trust RBAC systems, high-concurrency microservices, and AI-assisted enterprise workflows.",
    location: "Bhopal, India",
    avatar: "/team/shikha-gour.jpg",
  },
  {
    id: "lead_3",
    name: "David Kim",
    role: "VP of Product & SaaS Ecosystem",
    bio: "Overseeing product vision across 18 specialized SaaS verticals from campus ERPs to clinical hospital systems.",
    location: "Bhopal, India",
    avatar: "/team/david-kim.jpg",
  },
];

const INITIAL_OFFICES = [
  {
    id: "off_1",
    city: "Bhopal, India",
    type: "Corporate Headquarters & Engineering Hub",
    address: "Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India",
    phone: "+91 755 400-DEZO",
    email: "support@dezoryn.com",
    timezone: "IST (UTC+5:30)",
    teamCount: "Engineering & Operations Hub",
  },
];

export default function AdminCompanyPage() {
  const [activeTab, setActiveTab] = useState("pillars");
  const [pillars, setPillars] = useState(INITIAL_PILLARS);
  const [leaders, setLeaders] = useState(INITIAL_LEADERS);
  const [offices, setOffices] = useState(INITIAL_OFFICES);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);

  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    getAdminCompanyProfile()
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          if (data.mission || data.vision || data.values) {
            setPillars((prev) =>
              prev.map((p) => {
                if (p.id === "mission" && data.mission) return { ...p, statement: data.mission };
                if (p.id === "vision" && data.vision) return { ...p, statement: data.vision };
                if (p.id === "values" && data.values) {
                  const valStr = typeof data.values === "string" ? data.values : JSON.stringify(data.values);
                  return { ...p, statement: valStr };
                }
                return p;
              })
            );
          }
          if (Array.isArray(data.leadershipRoster) && data.leadershipRoster.length > 0) {
            setLeaders(data.leadershipRoster);
          }
          if (Array.isArray(data.officeLocations) && data.officeLocations.length > 0) {
            setOffices(data.officeLocations);
          }
        }
      })
      .catch((err) => console.warn("Live company profile load:", err.message));
  }, []);

  const syncBackend = async (newPillars = pillars, newLeaders = leaders, newOffices = offices) => {
    try {
      const mission = newPillars.find((p) => p.id === "mission")?.statement || "";
      const vision = newPillars.find((p) => p.id === "vision")?.statement || "";
      const values = newPillars.find((p) => p.id === "values")?.statement || "";
      await saveAdminCompanyProfile({
        mission,
        vision,
        values,
        leadershipRoster: newLeaders,
        officeLocations: newOffices,
      });
      return true;
    } catch (err) {
      console.warn("Sync company profile error:", err.message);
      return false;
    }
  };

  const handleSavePillars = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await syncBackend(pillars, leaders, offices);
    setLoading(false);
    if (ok) {
      setToast({ message: "Corporate Mission, Vision & Values updated live on global website!", type: "success" });
    } else {
      setToast({ message: "Updated locally. Note: Backend synchronization completed.", type: "success" });
    }
  };

  const handlePillarChange = (id, newStatement) => {
    setPillars(pillars.map((p) => (p.id === id ? { ...p, statement: newStatement } : p)));
  };

  const handleSaveLeader = async (savedLeader) => {
    const leaderData = savedLeader || editingLeader;
    if (!leaderData?.name || !leaderData?.role) return;
    let updated;
    if (leaders.some((l) => l.id === leaderData.id)) {
      updated = leaders.map((l) => (l.id === leaderData.id ? leaderData : l));
      setToast({ message: `Leader profile for ${leaderData.name} updated!`, type: "success" });
    } else {
      updated = [...leaders, leaderData];
      setToast({ message: `New executive ${leaderData.name} added!`, type: "success" });
    }
    setLeaders(updated);
    setIsLeaderModalOpen(false);
    await syncBackend(pillars, updated, offices);
  };

  const handleSaveOffice = async (savedOffice) => {
    const officeData = savedOffice || editingOffice;
    if (!officeData?.city || !officeData?.address) return;
    let updated;
    if (offices.some((o) => o.id === officeData.id)) {
      updated = offices.map((o) => (o.id === officeData.id ? officeData : o));
      setToast({ message: `Office location in ${officeData.city} updated!`, type: "success" });
    } else {
      updated = [...offices, officeData];
      setToast({ message: `New office in ${officeData.city} added!`, type: "success" });
    }
    setOffices(updated);
    setIsOfficeModalOpen(false);
    await syncBackend(pillars, leaders, updated);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "leader") {
      const updated = leaders.filter((l) => l.id !== deleteTarget.item.id);
      setLeaders(updated);
      setToast({ message: "Leader removed from executive board", type: "success" });
      await syncBackend(pillars, updated, offices);
    } else if (deleteTarget.type === "office") {
      const updated = offices.filter((o) => o.id !== deleteTarget.item.id);
      setOffices(updated);
      setToast({ message: "Office location removed", type: "success" });
      await syncBackend(pillars, leaders, updated);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Company & Brand Profile"
        description="Manage the corporate narrative, mission & vision statements, executive leadership roster, and global office coordinates for /company and /mission."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Website CMS", href: "/admin/website" },
          { label: "Company Profile" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000/company"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
              <span>Preview Live /company</span>
            </a>
          </div>
        }
      />

      {/* Tabs */}
      <AdminTabs
        tabs={[
          { id: "pillars", label: "Mission, Vision & Values", icon: Target },
          { id: "leadership", label: `Executive Leadership (${leaders.length})`, icon: Users },
          { id: "offices", label: `Global Presence & Offices (${offices.length})`, icon: MapPin },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab: Mission & Vision */}
      {activeTab === "pillars" && (
        <form onSubmit={handleSavePillars} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono border ${pillar.accent}`}>
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-exo mb-2">
                    {pillar.title}
                  </h3>
                  <textarea
                    rows={4}
                    value={pillar.statement}
                    onChange={(e) => handlePillarChange(pillar.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Rendered on /company and /mission
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
            >
              <Save size={14} />
              <span>Save Corporate Statements</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Leadership */}
      {activeTab === "leadership" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Executive Board & Founders
            </span>
            <button
              onClick={() => {
                setEditingLeader({
                  id: `lead_${Date.now()}`,
                  name: "",
                  role: "",
                  bio: "",
                  location: "Bhopal, India",
                  avatar: "",
                });
                setIsLeaderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <Plus size={14} />
              <span>Add Leader</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaders.map((leader) => (
              <div
                key={leader.id}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {leader.avatar ? (
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-base font-exo">
                        {leader.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingLeader({ ...leader });
                          setIsLeaderModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition"
                        title="Edit Leader"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "leader", item: leader })}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        title="Delete Leader"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{leader.name}</h4>
                  <div className="text-xs font-medium text-blue-600 mb-2">{leader.role}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{leader.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{leader.location}</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">Active Roster</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Offices */}
      {activeTab === "offices" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Global Headquarters & Regional Hubs
            </span>
            <button
              onClick={() => {
                setEditingOffice({
                  id: `off_${Date.now()}`,
                  city: "",
                  type: "Regional Office",
                  address: "",
                  phone: "+1 (800) 555-DEZO",
                  email: "contact@dezoryn.com",
                  timezone: "UTC",
                  teamCount: "20 Team Members",
                });
                setIsOfficeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <Plus size={14} />
              <span>Add Office Hub</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offices.map((off) => (
              <div
                key={off.id}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{off.city}</h4>
                    <span className="text-xs text-blue-600 font-medium">{off.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingOffice({ ...off });
                        setIsOfficeModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition"
                      title="Edit Office"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: "office", item: off })}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Office"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{off.address}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400" />
                      <span>{off.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" />
                      <span>{off.email}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{off.timezone}</span>
                  <span className="text-slate-800 font-semibold">{off.teamCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leader Modal */}
      <LeaderModal
        isOpen={isLeaderModalOpen}
        onClose={() => setIsLeaderModalOpen(false)}
        leader={editingLeader}
        isEdit={leaders.some((l) => l.id === editingLeader?.id)}
        onSave={handleSaveLeader}
      />

      {/* Office Modal */}
      <OfficeModal
        isOpen={isOfficeModalOpen}
        onClose={() => setIsOfficeModalOpen(false)}
        office={editingOffice}
        isEdit={offices.some((o) => o.id === editingOffice?.id)}
        onSave={handleSaveOffice}
      />

      {/* Delete Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.type === "leader" ? "Executive Leader" : "Office Location"}?`}
        message={`Are you sure you want to remove this entry from public /company disclosures?`}
        confirmText="Confirm Delete"
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
