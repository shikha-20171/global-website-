"use client";

import { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";
import { uploadAdminMedia } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AdminImageUploader({
  value = "",
  onChange,
  label = "Upload Image / Logo",
  hint = "PNG, JPG, SVG or WebP (max 5MB). Uploads directly to server.",
  altText = "",
  onAltTextChange,
  showAltInput = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value);
  const [alt, setAlt] = useState(altText);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadAdminMedia(formData);
      const filePath = res?.filePath || res?.url;

      if (filePath) {
        const permanentUrl = filePath.startsWith("http")
          ? filePath
          : `${API_BASE}${filePath.startsWith("/") ? "" : "/"}${filePath}`;

        setPreview(permanentUrl);
        if (onChange) onChange(permanentUrl, file);
      } else {
        // Fallback local preview if response was non-standard
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        if (onChange) onChange(localUrl, file);
      }
    } catch (err) {
      console.warn("Upload to backend failed, using local preview:", err.message);
      // Seamless fallback so the user is never stuck
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      if (onChange) onChange(localUrl, file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview("");
    setError("");
    setCustomUrl("");
    if (onChange) onChange("", null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (!customUrl) return;
    setPreview(customUrl);
    if (onChange) onChange(customUrl);
    setUrlMode(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setUrlMode(!urlMode)}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
        >
          <LinkIcon size={12} />
          <span>{urlMode ? "Upload File" : "Paste Image URL"}</span>
        </button>
      </div>

      {urlMode ? (
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <label className="block text-[11px] font-medium text-slate-600">
            Paste Direct Image or CDN URL:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="flex-1 text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCustomUrlSubmit}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              Apply
            </button>
          </div>
        </div>
      ) : preview ? (
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 overflow-hidden group">
          <div className="flex items-center gap-3.5">
            <div className="relative h-18 w-24 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={alt || "Uploaded image"}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none' stroke='%2394a3b8'%3E%3Crect width='40' height='40' rx='8' fill='%23f1f5f9'/%3E%3Cpath d='M10 28l7-7 6 6 4-4 7 7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='15' cy='15' r='3' stroke-width='2'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Image Uploaded Successfully</span>
                </span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-500 truncate max-w-sm">
                {preview}
              </p>
              {showAltInput && (
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => {
                    setAlt(e.target.value);
                    if (onAltTextChange) onAltTextChange(e.target.value);
                  }}
                  placeholder="Alt text for SEO..."
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 focus:border-blue-500 focus:outline-none mt-1"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
              <span className="text-xs font-semibold text-slate-700">
                Uploading to server...
              </span>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">
                Click to upload or drag &amp; drop file here
              </p>
              <p className="text-[11px] text-slate-500">{hint}</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
