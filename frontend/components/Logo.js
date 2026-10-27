import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      aria-label="DEZORYN Technology home"
      title="Return to Home"
    >
      <div className="relative shrink-0">
        <img
          src="/logo.png"
          alt="DEZORYN Technology"
          className="h-10 w-10 rounded-full object-cover border border-blue-400/40 shadow-[0_0_14px_rgba(59,130,246,0.45)] group-hover:border-blue-400 group-hover:shadow-[0_0_18px_rgba(59,130,246,0.7)] transition-all duration-300"
        />
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
