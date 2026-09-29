"use client";

import { useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    setSelectedFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadProgress(0);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video first.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a video title.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const pathname = `videos/${Date.now()}-${selectedFile.name}`;

      const blob = await upload(
        pathname,
        selectedFile,
        {
          access: "public",
          handleUploadUrl: "/api/upload",

          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round(progressEvent.percentage)
            );
          },
        }
      );

      console.log("Blob upload successful:", blob);

      const databaseResponse = await fetch(
        "/api/videos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category: category,
            video_url: blob.url,
            pathname: blob.pathname,
          }),
        }
      );

      const databaseResult =
        await databaseResponse.json();

      if (!databaseResponse.ok) {
        throw new Error(
          databaseResult.error ||
            "Video uploaded, but metadata could not be saved."
        );
      }

      console.log(
        "Video metadata saved:",
        databaseResult
      );

      setUploadProgress(100);

      alert(
        "Video uploaded and saved successfully!"
      );

      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setCategory("Entertainment");
      setUploadProgress(0);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Video upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Your Videos
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-white/70 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/upload"
              className="rounded-full bg-white px-5 py-2 font-semibold text-black transition hover:bg-white/90"
            >
              Upload
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            Creator Studio
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Upload your video
          </h1>

          <p className="mt-4 max-w-2xl text-white/60">
            Upload your video to Your Videos. Your video
            file will be stored securely and its details
            will be saved automatically.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
                dragActive
                  ? "border-white bg-white/10"
                  : "border-white/20 bg-white/[0.03]"
              }`}
            >
              {!selectedFile ? (
                <>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                    ↑
                  </div>

                  <h2 className="text-xl font-semibold">
                    Drag and drop your video
                  </h2>

                  <p className="mt-2 text-sm text-white/50">
                    or choose a video file from your computer
                  </p>

                  <label className="mt-6 inline-flex cursor-pointer rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90">
                    Choose Video

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="overflow-hidden rounded-2xl bg-black">
                    {previewUrl && (
                      <video
                        src={previewUrl}
                        controls
                        className="max-h-[420px] w-full object-contain"
                      />
                    )}
                  </div>

                  <div className="mt-5 text-left">
                    <p className="font-semibold">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-sm text-white/50">
                      {(selectedFile.size / (1024 * 1024)).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>
                  </div>

                  <label className="mt-5 inline-flex cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:bg-white/10">
                    Choose Another Video

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </>
              )}
            </div>

            {isUploading && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span>Uploading video...</span>
                  <span>{uploadProgress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">
              Video details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter video title"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Tell viewers about your video"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Music">
                    Music
                  </option>

                  <option value="Gaming">
                    Gaming
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="News">
                    News
                  </option>

                  <option value="Travel">
                    Travel
                  </option>

                  <option value="Lifestyle">
                    Lifestyle
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={
                  !selectedFile ||
                  isUploading
                }
                className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isUploading
                  ? `Uploading ${uploadProgress}%`
                  : "Upload Video"}
              </button>

              <p className="text-center text-xs leading-5 text-white/40">
                By uploading, you confirm that you have
                the rights to share this video.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} Your Videos
          </p>

          <Link
            href="/"
            className="transition hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}