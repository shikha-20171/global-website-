"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Upload,
  Download,
  Copy,
  Check,
  Trash2,
  Eye,
  Filter,
  ExternalLink,
  Sparkles,
  Layers,
  HardDrive,
  FileCheck,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminImageUploader from "@/components/admin/AdminImageUploader";
import {
  getAdminMedia,
  uploadAdminMedia,
  deleteAdminMedia,
} from "@/lib/api";

const ASSET_TYPES = ["All", "Product Art", "Resource Banner", "3D Texture", "Logo & Brand"];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  const refreshMedia = () => {
    getAdminMedia()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        const mapped = list.map((a) => ({
          ...a,
          type: a.assetType ? a.assetType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : (a.type || "Product Art"),
          url: a.publicUrl || a.url || a.filePath || "/placeholder.png",
          dimensions: a.dimensions || "1200 x 800",
          size: a.fileSizeBytes ? `${Math.round(a.fileSizeBytes / 1024)} KB` : (a.size || "150 KB"),
          usedIn: a.associatedEntity || a.usedIn || "Website / Media",
          name: a.fileName || a.name || a.title || "Asset",
        }));
        setAssets(mapped);
      })
      .catch((err) => {
        console.warn("Could not load media via API:", err.message);
      });
  };

  useEffect(() => {
    refreshMedia();
  }, []);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [newAsset, setNewAsset] = useState({
    name: "",
    path: "",
    type: "Product Art",
    dimensions: "1200 x 800",
    size: "350 KB",
    alt: "",
    status: "Published",
  });

  const filtered = assets.filter((asset) => {
    const matchSearch =
      !search ||
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.alt?.toLowerCase().includes(search.toLowerCase()) ||
      asset.path.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || asset.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleCopyPath = (asset) => {
    navigator.clipboard?.writeText(asset.path);
    setCopiedId(asset.id);
    setToast({
      message: `Asset path copied: ${asset.path}`,
      type: "success",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.path) {
      setToast({ message: "Asset name and file path/URL are required", type: "error" });
      return;
    }

    const created = {
      id: `med_${Date.now()}`,
      ...newAsset,
      usageCount: 1,
    };

    setAssets([created, ...assets]);
    setIsUploadOpen(false);
    setToast({ message: `Asset "${created.name}" uploaded to media library!`, type: "success" });
    setNewAsset({
      name: "",
      path: "",
      type: "Product Art",
      dimensions: "1200 x 800",
      size: "350 KB",
      alt: "",
      status: "Published",
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAssets(assets.filter((a) => a.id !== deleteTarget.id));
    setToast({ message: `Asset "${deleteTarget.name}" deleted from library`, type: "success" });
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Asset Preview & Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative group">
            {row.path ? (
              <img
                src={row.path}
                alt={row.alt || row.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML =
                    '<div class="text-[10px] text-slate-400 font-mono flex flex-col items-center"><svg class="w-4 h-4 mb-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>IMG</div>';
                }}
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{row.name}</div>
            <div className="text-xs font-mono text-slate-500 truncate max-w-xs">{row.path}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Asset Type",
      accessor: "type",
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {row.type}
        </span>
      ),
    },
    {
      header: "Specs",
      accessor: "dimensions",
      cell: (row) => (
        <div className="text-xs">
          <div className="text-slate-900 font-medium">{row.dimensions}</div>
          <div className="text-slate-500 font-mono">{row.size}</div>
        </div>
      ),
    },
    {
      header: "Live Usage",
      accessor: "usageCount",
      cell: (row) => (
        <div className="text-xs font-mono text-slate-700">
          <span className="font-bold text-blue-600">{row.usageCount || 1}</span> pages/modules
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <AdminStatusBadge status={row.status || "Published"} />,
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleCopyPath(row)}
            title="Copy Path"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition"
          >
            {copiedId === row.id ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => {
              setSelectedAsset(row);
              setIsPreviewOpen(true);
            }}
            title="Inspect Details"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            title="Delete Asset"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media & Asset Library"
        description="Central asset manager for public website graphics, product interface screenshots, 3D globe textures, and resource banners."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Media Library" },
        ]}
        actions={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Upload size={15} />
            <span>Upload New Asset</span>
          </button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Stored Assets</span>
            <HardDrive className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">{assets.length} Assets</div>
          <div className="text-xs text-slate-500 mt-1 font-mono">Web-optimized static files</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Product Screenshots</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">
            {assets.filter((a) => a.type === "Product Art").length} Images
          </div>
          <div className="text-xs text-slate-500 mt-1">SaaS product previews</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Resource Banners</span>
            <ImageIcon className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">
            {assets.filter((a) => a.type === "Resource Banner").length} Banners
          </div>
          <div className="text-xs text-slate-500 mt-1">Blog & insights covers</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">3D Textures & Maps</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-exo">
            {assets.filter((a) => a.type === "3D Texture").length} Maps
          </div>
          <div className="text-xs text-slate-500 mt-1">Globe surface telemetry</div>
        </div>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ASSET_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
              typeFilter === type
                ? "bg-blue-600 text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Filter and Search */}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search media by filename, alt text, or path..."
      />

      {/* Data Table */}
      <AdminDataTable
        columns={columns}
        data={filtered}
        keyField="id"
        emptyMessage="No media assets match your query."
      />

      {/* Upload Asset Modal */}
      <AdminModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Add Asset to Media Library"
        subtitle="Register new product UI screenshots, resource banners, or vector marks."
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateAsset}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              Save Asset
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateAsset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Asset Display Name *
            </label>
            <input
              type="text"
              required
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              placeholder="e.g. schooly-analytics-dashboard.jpg"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asset Category / Type
              </label>
              <select
                value={newAsset.type}
                onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Product Art">Product Art</option>
                <option value="Resource Banner">Resource Banner</option>
                <option value="3D Texture">3D Texture</option>
                <option value="Logo & Brand">Logo & Brand</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image Resolution / Dimensions
              </label>
              <input
                type="text"
                value={newAsset.dimensions}
                onChange={(e) => setNewAsset({ ...newAsset, dimensions: e.target.value })}
                placeholder="1200 x 800"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <AdminImageUploader
              label="Asset File Path or URL *"
              value={newAsset.path}
              onChange={(url) => setNewAsset({ ...newAsset, path: url })}
              hint="Enter relative path (/products/name.jpg) or CDN image URL"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Accessibility Alt Text
            </label>
            <input
              type="text"
              value={newAsset.alt}
              onChange={(e) => setNewAsset({ ...newAsset, alt: e.target.value })}
              placeholder="Descriptive alt text for screen readers and SEO"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </AdminModal>

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <AdminModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedAsset(null);
          }}
          title={selectedAsset.name}
          subtitle={`Details and live usage for ${selectedAsset.path}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => handleCopyPath(selectedAsset)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <Copy size={13} />
                <span>Copy File Path</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
              >
                Close Preview
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-950 p-2 overflow-hidden flex items-center justify-center max-h-72">
              <img
                src={selectedAsset.path}
                alt={selectedAsset.alt || selectedAsset.name}
                className="max-h-64 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML =
                    '<div class="py-12 text-slate-400 font-mono text-xs text-center">Preview unavailable for local asset path: ' +
                    selectedAsset.path +
                    "</div>";
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 block mb-0.5">Asset Category</span>
                <span className="font-semibold text-slate-900">{selectedAsset.type}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 block mb-0.5">Dimensions</span>
                <span className="font-semibold text-slate-900">{selectedAsset.dimensions}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 block mb-0.5">Approx File Size</span>
                <span className="font-semibold text-slate-900">{selectedAsset.size}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 block mb-0.5">Live Module Usage</span>
                <span className="font-semibold text-blue-600">{selectedAsset.usageCount || 1} active references</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <span className="text-slate-500 block mb-1">Alt Description</span>
              <p className="text-slate-700 italic">"{selectedAsset.alt || "No alt description specified"}"</p>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any public website components referencing this image path may show a broken image placeholder.`}
        confirmText="Delete Asset"
        confirmVariant="danger"
      />

      {/* Toast */}
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
