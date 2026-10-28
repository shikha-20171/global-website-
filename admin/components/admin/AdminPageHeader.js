import AdminBreadcrumbs from "./AdminBreadcrumbs";

export default function AdminPageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
  actions,
  children,
}) {
  const customSlot = actions || children;

  return (
    <div className="mb-7 border-b border-slate-200 pb-6">
      {breadcrumbs.length > 0 && <AdminBreadcrumbs items={breadcrumbs} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-exo">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>

        {(customSlot || action) && (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 sm:shrink-0 w-full sm:w-auto">
            {customSlot}
            {action && (
              <button
                onClick={action.onClick}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 shadow-sm transition active:scale-[0.98]"
              >
                {action.icon && <action.icon size={18} />}
                <span>{action.label}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

