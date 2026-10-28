"use client";

import AdminModal from "@/components/admin/AdminModal";

export default function LeadDetailModal({
  isOpen,
  onClose,
  lead,
  pipelineStatuses = [],
  onStatusChange,
  onNotesChange,
}) {
  if (!isOpen || !lead) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inquiry from ${lead.name}`}
      description={`Submitted from ${lead.country || "Global"} for ${lead.company || "Enterprise"}`}
      size="md"
      footer={
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-2xs"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Source and Timing Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-blue-900 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">Lead Source:</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-mono font-semibold uppercase text-[10px]">
              {lead.source ? lead.source.replace(/_/g, " ") : "Website Inbound"}
            </span>
          </div>
          {lead.submittedAt && (
            <span className="text-[11px] text-slate-500 font-mono">
              Submitted: {new Date(lead.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* Contact and Organization Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block">Contact Person</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{lead.name}</span>
            <a
              href={`mailto:${lead.email}`}
              className="text-blue-600 hover:underline mt-0.5 block font-mono break-all font-semibold"
            >
              {lead.email}
            </a>
            {lead.phone && (
              <span className="text-slate-700 mt-1 block font-mono">
                Tel: {lead.phone}
              </span>
            )}
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Company & Country</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {lead.company || "Direct Individual"}
            </span>
            <span className="text-slate-600 mt-0.5 block">{lead.country || "Global"}</span>
            {lead.companySize && (
              <span className="text-slate-500 text-[11px] mt-1 block">
                Team Size: {lead.companySize}
              </span>
            )}
          </div>
        </div>

        {/* Solution and Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block">Requested Solution / Domain</span>
            <span className="font-bold text-blue-700 text-sm mt-0.5 block">
              {lead.interestedSolution || lead.solution || lead.product || "General Enterprise Solutions"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Commercial Budget</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {lead.budgetRange || lead.budget || "Not Specified / Standard SaaS"}
            </span>
          </div>
        </div>

        {/* Customer Requirement / Message */}
        <div className="p-3.5 rounded-xl bg-white border-2 border-blue-100 shadow-2xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">
            Customer Requirement &amp; Inquiry Details
          </span>
          <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
            {lead.requirement || lead.req || lead.message || "No requirement notes provided."}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Inquiry Pipeline Stage
          </label>
          <select
            value={lead.status || "New"}
            onChange={(e) => onStatusChange?.(lead.id, e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-semibold focus:border-blue-600 focus:outline-none"
          >
            {pipelineStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Internal Follow-Up Notes
          </label>
          <textarea
            rows={3}
            value={lead.notes || ""}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="Add internal meeting notes, client requirements, or sales next steps..."
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </AdminModal>
  );
}
