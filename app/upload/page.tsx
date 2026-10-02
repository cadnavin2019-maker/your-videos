"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
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

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Upload Video
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block mb-2">
              Video
            </label>

            <input
              type="file"
              accept="video/*"
              disabled={uploading}
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">
              Title
            </label>

            <input
              type="text"
              value={title}
              disabled={uploading}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              placeholder="Video title"
            />
          </div>

          <div>
            <label className="block mb-2">
              Category
            </label>

            <select
              value={category}
              disabled={uploading}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            >
              <option>General</option>
              <option>Entertainment</option>
              <option>Education</option>
              <option>Technology</option>
              <option>Sports</option>
              <option>News</option>
              <option>Music</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              value={description}
              disabled={uploading}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 min-h-32"
              placeholder="Video description"
            />
          </div>

          {uploading && (
            <div>
              <div className="w-full h-3 bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                {progress}%
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full p-4 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 font-semibold"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>

          {status && (
            <p className="text-sm text-zinc-300">
              {status}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}