"use client";

import { useEffect, useState } from "react";
import { FileVideo, UploadCloud, X } from "lucide-react";

type UploadDropzoneProps = {
  file: File | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
};

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export function UploadDropzone({ file, disabled = false, onFileChange }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (file && previewUrl) {
    return (
      <div className="overflow-hidden rounded-3xl bg-surface ring-1 ring-border shadow-lg shadow-accent/5">
        <video src={previewUrl} controls playsInline className="aspect-video w-full bg-black" />
        <div className="flex items-center gap-3 p-4">
          <FileVideo className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onFileChange(null)}
            aria-label="Remove selected video"
            className="rounded-full p-2 text-muted transition hover:bg-surface-raised hover:text-foreground disabled:opacity-40"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label
      htmlFor="video-file"
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (disabled) return;
        const dropped = event.dataTransfer.files?.[0];
        if (dropped && dropped.type.startsWith("video/")) onFileChange(dropped);
      }}
      className={`flex aspect-video cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
        dragging
          ? "scale-[1.01] border-accent bg-accent/10"
          : "border-border bg-surface/60 hover:border-foreground/30 hover:bg-surface"
      }`}
    >
      <span
        className={`flex size-16 items-center justify-center rounded-2xl transition-colors ${
          dragging ? "bg-accent text-white" : "bg-surface-raised text-foreground"
        }`}
      >
        <UploadCloud className="size-7" aria-hidden="true" />
      </span>
      <div>
        <p className="text-base font-semibold">Drag and drop a video</p>
        <p className="mt-1 text-sm text-muted">or click to browse your files</p>
      </div>
      <p className="text-xs text-muted">MP4, MOV, WebM and more {"·"} up to 5 GB</p>
      <input
        id="video-file"
        type="file"
        accept="video/*"
        disabled={disabled}
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="sr-only"
      />
    </label>
  );
}
