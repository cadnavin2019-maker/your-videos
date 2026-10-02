"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { mutate } from "swr";
import { UPLOAD_CATEGORIES } from "@/lib/videos";
import { UploadDropzone } from "@/components/upload-dropzone";
import { UploadStatus } from "@/components/upload-status";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedId, setUploadedId] = useState<number | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  async function handleUpload() {
    setSucceeded(false);
    setUploadedId(null);

    if (!file) {
      setStatus("Please select a video.");
      return;
    }

    if (!title.trim()) {
      setStatus("Please enter a title.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setStatus("Starting upload...");

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const pathname = `videos/${Date.now()}-${safeName}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        multipart: true,

        onUploadProgress: (event) => {
          setProgress(Math.round(event.percentage));
          setStatus(`Uploading... ${Math.round(event.percentage)}%`);
        },
      });

      setStatus("Saving video information...");

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          video_url: blob.url,
          pathname: blob.pathname,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to save video information."
        );
      }

      setProgress(100);
      setStatus("Video uploaded successfully!");
      setSucceeded(true);
      setUploadedId(result.video?.id ?? null);
      mutate("/api/videos");

      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("General");
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setStatus(
        error instanceof Error
          ? error.message
          : "Video upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-foreground/30 focus:bg-surface-raised disabled:opacity-60";

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-8 md:pt-12">
      <div className="animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Creator studio</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">Upload a video</h1>
        <p className="mt-2 max-w-xl text-pretty text-muted">
          Share your work with the world. Large files are uploaded in parts directly to secure storage.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleUpload();
        }}
        className="mt-10 grid animate-fade-up gap-8 [animation-delay:80ms] lg:grid-cols-[1.1fr_1fr]"
      >
        <div className="flex flex-col gap-4">
          <UploadDropzone file={file} disabled={uploading} onFileChange={setFile} />
          <UploadStatus
            uploading={uploading}
            progress={progress}
            status={status}
            succeeded={succeeded}
            uploadedId={uploadedId}
          />
        </div>

        <div className="flex flex-col gap-5 rounded-3xl bg-surface p-6 ring-1 ring-border shadow-lg shadow-accent/5">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-accent">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              disabled={uploading}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass}
              placeholder="Give your video a memorable title"
            />
            <p className="text-right text-xs tabular-nums text-muted">{title.length}/120</p>
          </div>

          <fieldset className="flex flex-col gap-2" disabled={uploading}>
            <legend className="mb-2 text-sm font-medium">Category</legend>
            <div className="flex flex-wrap gap-2">
              {UPLOAD_CATEGORIES.map((option) => (
                <label
                  key={option}
                  className="cursor-pointer rounded-full bg-surface-raised px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-surface-hover has-[:checked]:bg-foreground has-[:checked]:text-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
                >
                  <input
                    type="radio"
                    name="category"
                    value={option}
                    checked={category === option}
                    onChange={(e) => setCategory(e.target.value)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              disabled={uploading}
              onChange={(e) => setDescription(e.target.value)}
              className={`${fieldClass} min-h-36 resize-y`}
              placeholder="Tell viewers what your video is about"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-muted"
          >
            {uploading ? `Uploading ${progress}%` : "Publish video"}
          </button>
        </div>
      </form>
    </main>
  );
}
