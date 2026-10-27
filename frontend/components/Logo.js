import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      aria-label="DEZORYN Technology home"
      title="Return to Home"
    >
      <div className="relative">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="transition-shadow duration-300 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
          <rect width="32" height="32" rx="8" fill="url(#lg)" />
          <path d="M9 8h7.5c4.7 0 7.5 3.2 7.5 8s-2.8 8-7.5 8H9V8Zm4 3.6v8.8h3.3c2.4 0 3.8-1.7 3.8-4.4s-1.4-4.4-3.8-4.4H13Z" fill="#fff" />
          <defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#2f6bff" /><stop offset="1" stopColor="#7c5cff" /></linearGradient></defs>
        </svg>
      </div>
      <span className="leading-none">
        <span className="block text-[15px] font-semibold tracking-[0.04em] text-white transition-colors group-hover:text-blue-300">
          DEZORYN
        </span>
        <span className="block text-[8px] tracking-[0.32em] text-cool transition-colors group-hover:text-blue-200/80">
          TECHNOLOGY
        </span>
      </span>
    </Link>
  );
}
