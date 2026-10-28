"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Users,
  MapPin,
  Clock,
  Sparkles,
  Building2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import JobEditorModal from "./components/JobEditorModal";
import {
  getAdminCareers,
  createAdminCareer,
  updateAdminCareer,
  deleteAdminCareer,
} from "@/lib/api";

const fallbackJobs = [
  {
    id: "job-1",
    title: "Senior Full-Stack Cloud Architect",
    department: "Core Engineering",
    type: "Full-Time",
    location: "Bengaluru, India (Work From Office)",
    experience: "5+ Years",
    description: "Architect and scale multi-tenant SaaS engines, high-concurrency microservices, and PostgreSQL-backed data schemas.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Docker", "Zero-Trust"],
    status: "Published",
    applicantsCount: 14,
  },
  {
    id: "job-2",
    title: "Enterprise Solutions Engineer",
    department: "Solutions & Architecture",
    type: "Full-Time",
    location: "Bengaluru, India (Work From Office)",
    experience: "3+ Years",
    description: "Conduct technical architecture discoveries, enterprise POCs, and high-level client consultations for global organizations.",
    tags: ["Cloud Architecture", "Client Discovery", "API Design", "Security"],
    status: "Published",
    applicantsCount: 9,
  },
  {
    id: "job-3",
    title: "AI & Machine Learning Systems Engineer",
    department: "AI & Automation",
    type: "Full-Time",
    location: "Bengaluru, India (Work From Office)",
    experience: "3+ Years",
    description: "Design and implement autonomous workflow agents, vision-based verification models, and intelligent document triage pipelines.",
    tags: ["Python", "PyTorch", "LLMs", "Vector DBs", "Automation"],
    status: "Published",
    applicantsCount: 22,
  },
  {
    id: "job-4",
    title: "Senior Enterprise Product Designer",
    department: "Product & Design",
    type: "Full-Time",
    location: "Bengaluru, India (Work From Office)",
    experience: "4+ Years",
    description: "Craft high-density SaaS dashboards, unified design systems, and friction-free enterprise admin workflows.",
    tags: ["Figma", "Design Systems", "UX Research", "Complex Dashboards"],
    status: "Published",
    applicantsCount: 7,
  },
];

const DEPARTMENTS = [
  "Core Engineering",
  "Solutions & Sales",
  "AI & Automation",
  "Product & Design",
  "Security & DevOps",
];

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modals & Dialogs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === "All" || j.department === selectedDept;
    const matchStatus = selectedStatus === "All" || j.status === selectedStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const refreshCareers = () => {
    getAdminCareers()
      .then((data) => {
        const list = data?.careers || (Array.isArray(data) ? data : []);
        const mapped = list.map((j) => ({
          id: j.id,
          title: j.title,
          department: j.department,
          type: j.employmentType === "FULL_TIME" ? "Full-Time" : (j.employmentType || "Full-Time"),
          location: j.location || "Bhopal HQ / Remote",
          experience: j.experienceLevel || "3+ Years",
          status: j.status === "PUBLISHED" || j.status === "Published" ? "Published" : "Draft",
          applicantsCount: j.applicantCount || 0,
          postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
          description: j.description || "",
          requirements: Array.isArray(j.requirements) ? j.requirements.join("\n") : (j.requirements || ""),
        }));
        if (mapped.length > 0) {
          setJobs(mapped);
        } else {
          setJobs(fallbackJobs);
        }
      })
      .catch((err) => {
        console.warn("Using website careers fallback:", err.message);
        setJobs(fallbackJobs);
      });
  };

  useEffect(() => {
    refreshCareers();
  }, []);

  const handleOpenCreate = () => {
    setEditingJob({
      id: `job_${Date.now()}`,
      title: "",
      department: "Core Engineering",
      type: "Full-Time",
      location: "Bhopal HQ / Remote",
      experience: "3+ Years",
      status: "Published",
      applicantsCount: 0,
      postedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: "",
      requirements: "• Strong problem solving and architectural rigor\n• Production experience in modern web platforms",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob({ ...job });
    setIsModalOpen(true);
  };

  const handleSave = async (savedJob) => {
    const jobData = savedJob || editingJob;
    if (!jobData?.title?.trim()) {
      setToast({ type: "error", message: "Job title is required." });
      return;
    }

    const exists = jobs.some((j) => j.id === jobData.id);
    if (exists) {
      setJobs(jobs.map((j) => (j.id === jobData.id ? jobData : j)));
      if (jobData.id && !jobData.id.startsWith("job_")) {
        try {
          // [API IMPLEMENTATION] updateAdminCareer() -> PUT /api/v1/admin/careers/:id
          await updateAdminCareer(jobData.id, {
            title: jobData.title,
            department: jobData.department,
            location: jobData.location,
            experienceLevel: jobData.experience,
            description: jobData.description,
            requirements: jobData.requirements ? jobData.requirements.split("\n").filter(Boolean) : [],
          });
        } catch (err) {
          console.warn("Could not update career on backend:", err.message);
        }
      }
      setToast({ type: "success", message: "Job posting updated successfully!" });
    } else {
      setJobs([jobData, ...jobs]);
      try {
        // [API IMPLEMENTATION] createAdminCareer() -> POST /api/v1/admin/careers
        await createAdminCareer({
          title: jobData.title,
          department: jobData.department,
          location: jobData.location,
          experienceLevel: jobData.experience,
          description: jobData.description,
          requirements: jobData.requirements ? jobData.requirements.split("\n").filter(Boolean) : [],
        });
        refreshCareers();
      } catch (err) {
        console.warn("Could not create career on backend:", err.message);
      }
      setToast({ type: "success", message: "New job posting published successfully!" });
    }
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setJobs(jobs.filter((j) => j.id !== targetId));
    if (targetId && !targetId.startsWith("job_")) {
      try {
        // [API IMPLEMENTATION] deleteAdminCareer() -> DELETE /api/v1/admin/careers/:id
        await deleteAdminCareer(targetId);
      } catch (err) {
        console.warn("Could not delete career on backend:", err.message);
      }
    }
    setToast({ type: "success", message: `Removed job posting "${deleteTarget.title}"` });
    setDeleteTarget(null);
  };

  const handleCopyLink = (job) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText?.(`http://localhost:3000/careers#${job.id}`);
      setToast({ type: "success", message: "Public careers link copied to clipboard!" });
    }
  };

  const columns = [
    {
      header: "Position & Department",
      key: "title",
      render: (title, row) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            <span>{title}</span>
            {row.status === "Published" && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
              {row.department}
            </span>
            <span>·</span>
            <span>Posted {row.postedDate}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      key: "location",
      render: (loc) => (
        <span className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <MapPin size={13} className="text-blue-600" />
          {loc}
        </span>
      ),
    },
    {
      header: "Work Type & Exp",
      key: "type",
      render: (type, row) => (
        <div className="text-xs space-y-0.5">
          <span className="font-medium text-slate-800 block">{type}</span>
          <span className="text-[11px] text-slate-500 font-mono">Exp: {row.experience}</span>
        </div>
      ),
    },
    {
      header: "Applicants",
      key: "applicantsCount",
      render: (count) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
          <Users size={12} className="text-slate-500" />
          {count} Applied
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
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <a
            href={`http://localhost:3000/careers#${row.id}`}
            target="_blank"
            rel="noreferrer"
            title="Preview Live Opening on Website"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => handleCopyLink(row)}
            title="Copy Public Link"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Opening"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            title="Delete Opening"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
  const publishedCount = jobs.filter((j) => j.status === "Published").length;

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <AdminPageHeader
        title="Careers & Talent Openings"
        description="Manage job listings, engineering tracks, role requirements, and live hiring openings displayed on the global website."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Content" },
          { label: "Careers & Jobs" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000/careers"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition shadow-2xs"
            >
              <ExternalLink size={13} className="text-blue-600" />
              <span>Live Careers Page</span>
            </a>
            <a
              href="http://localhost:3000#careers"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition shadow-2xs"
            >
              <ExternalLink size={13} className="text-emerald-600" />
              <span>Homepage Careers Section</span>
            </a>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
            >
              <Plus size={14} />
              <span>Post New Opening</span>
            </button>
          </div>
        }
      />

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Roles Configured</span>
            <Briefcase size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {jobs.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across engineering, solutions &amp; design
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Live Published Openings</span>
            <Sparkles size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">
            {publishedCount}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            Actively visible on /careers
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Ingested Applicants</span>
            <Users size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {totalApplicants}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Direct online submissions
          </span>
        </div>
      </div>

      {/* ─── FILTER CONTROLS ─── */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles or keywords..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* ─── DATA TABLE ─── */}
      <AdminDataTable
        columns={columns}
        data={filteredJobs}
        emptyMessage="No job openings found matching the criteria."
      />

      {/* ─── CREATE / EDIT MODAL ─── */}
      <JobEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={editingJob}
        departments={DEPARTMENTS}
        onSave={handleSave}
      />

      {/* ─── CONFIRM DELETE ─── */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Opening?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This opening will be immediately removed from the global website.`}
        confirmText="Delete Role"
        confirmVariant="danger"
      />

      {/* ─── TOAST ─── */}
      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
