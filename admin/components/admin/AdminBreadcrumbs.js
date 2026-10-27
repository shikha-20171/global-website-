import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function AdminBreadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Admin Breadcrumb" className="flex items-center text-xs text-slate-500 mb-3 font-medium">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 hover:text-blue-600 transition text-slate-500 font-semibold"
          >
            <Home size={14} className="shrink-0 text-slate-400" />
            <span>Admin</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center gap-2">
              <ChevronRight size={13} className="text-slate-400 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition text-slate-600 truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-bold truncate max-w-[180px] sm:max-w-none">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
