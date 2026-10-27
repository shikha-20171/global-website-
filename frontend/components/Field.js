export default function Field({ label, error, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
