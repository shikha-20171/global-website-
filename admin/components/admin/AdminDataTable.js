export default function AdminDataTable({
  columns = [],
  data = [],
  keyField = "id",
  emptyState,
}) {
  if (!data || data.length === 0) {
    return emptyState || null;
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-xs">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  className={`py-4 px-5 font-bold ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIdx) => (
              <tr
                key={row[keyField] ?? rowIdx}
                className="transition-colors hover:bg-blue-50/30 group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.header}
                    className={`py-4 px-5 text-slate-800 align-middle text-sm ${
                      col.className || ""
                    }`}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
