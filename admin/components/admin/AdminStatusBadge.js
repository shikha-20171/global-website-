export default function AdminStatusBadge({ status, className = "" }) {
  const getStyle = (s) => {
    const norm = String(s || "").toLowerCase();

    if (["published", "active", "qualified", "confirmed", "live"].includes(norm)) {
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-500",
      };
    }

    if (["draft", "archived", "inactive"].includes(norm)) {
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
      };
    }

    if (["negotiating", "contacted", "in review"].includes(norm)) {
      return {
        bg: "bg-blue-50 text-blue-800 border-blue-200",
        dot: "bg-blue-600",
      };
    }

    if (["pending", "pending link", "scheduled"].includes(norm)) {
      return {
        bg: "bg-amber-50 text-amber-800 border-amber-200",
        dot: "bg-amber-500",
      };
    }

    if (["new", "urgent", "flagged"].includes(norm)) {
      return {
        bg: "bg-purple-50 text-purple-800 border-purple-200",
        dot: "bg-purple-500",
      };
    }

    return {
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    };
  };

  const { bg, dot } = getStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono border ${bg} ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
