import Link from "next/link";
import { ChevronRight } from "lucide-react";
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-cool">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.href ? <Link href={it.href} className="hover:text-white">{it.label}</Link> : <span className="text-white/80" aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <ChevronRight size={14} aria-hidden="true" />}
        </span>
      ))}
    </nav>
  );
}
