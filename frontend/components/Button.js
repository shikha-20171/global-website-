import Link from "next/link";
import { ArrowRight } from "lucide-react";

const styles = { primary: "btn btn-primary", secondary: "btn btn-secondary", tertiary: "btn btn-ghost" };

export default function Button({ href, variant = "primary", arrow = false, children, className = "", ...rest }) {
  const cls = `${styles[variant]} group ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          size={16}
          aria-hidden="true"
          focusable="false"
          className="shrink-0 transition-transform group-hover:translate-x-1"
        />
      )}
    </>
  );
  if (href) return <Link href={href} className={cls} {...rest}>{inner}</Link>;
  return <button className={cls} {...rest}>{inner}</button>;
}
