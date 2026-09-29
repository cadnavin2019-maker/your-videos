"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [videoName, setVideoName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [videoPreview, setVideoPreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleVideo = (file: File | undefined) => {
    if (!file) return;

    setVideoName(file.name);
    setSelectedFile(file);

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleVideo(event.target.files?.[0]);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    handleVideo(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a video first.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a video title.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("video", selectedFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Upload failed."
        );
      }

      alert("🎉 Video uploaded successfully!");

      console.log("Uploaded video:", result);

    } catch (error) {
      console.error("Upload error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Video upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f9ff] text-slate-900">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/90 backdrop-blur-2xl">

        <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 lg:px-8">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1769ff] via-[#267cff] to-[#20c8e8] text-lg text-white shadow-xl shadow-blue-200 transition duration-300 group-hover:scale-105">
              ▶
            </div>

            <div>
              <div className="text-[21px] font-black tracking-[-0.7px] text-slate-950">
                Your Videos
              </div>

              <div className="mt-0.5 text-[8px] font-black uppercase tracking-[3px] text-blue-500">
                Creator Studio
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="group rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="mr-1 transition group-hover:-translate-x-1">
              ←
            </span>
            Back to Home
          </Link>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute left-[10%] top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute right-[8%] top-20 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1050px] px-5 pb-8 pt-14 text-center md:pt-20">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[2px] text-blue-600 shadow-sm">
            <span className="text-cyan-500">✦</span>
            Your creative space
            <span className="text-cyan-500">✦</span>
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-[-2.5px] text-slate-950 md:text-7xl">
            Share your
            <span className="block bg-gradient-to-r from-[#155eef] via-[#287cff] to-[#06b6d4] bg-clip-text pb-2 text-transparent">
              story with the world.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-slate-500 md:text-lg">
            Upload your video, give it a voice, and let your
            creativity reach people everywhere.
          </p>

        </div>

      </section>

      {/* FORM */}

      <section className="mx-auto max-w-[1050px] px-5 pb-16">

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* VIDEO UPLOAD */}

          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_25px_80px_rgba(30,64,175,0.10)]">

            <div className="border-b border-slate-100 px-7 py-6 md:px-9">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl">
                  🎬
                </div>

                <div>

                  <div className="text-[11px] font-black uppercase tracking-[2px] text-blue-500">
                    Step 01
                  </div>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Choose your video
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-400">
                    Start by selecting the video you want to share.
                  </p>

                </div>

              </div>

            </div>

            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`m-5 flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-[27px] border-2 border-dashed p-8 text-center transition-all duration-300 md:m-8 ${
                dragActive
                  ? "scale-[1.01] border-blue-500 bg-blue-50"
                  : "border-blue-200 bg-gradient-to-br from-[#f5f9ff] via-white to-[#effcff] hover:border-blue-400"
              }`}
            >

              <input
                type="file"
                accept=".mp4,.webm,.mov,.avi,.mkv,.m4v,.mpeg,.mpg,.3gp,.flv,.wmv,.ogv,.ts,video/*"
                onChange={handleVideoChange}
                className="hidden"
              />

              {!videoName ? (
                <>
                  <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-[#1667f5] to-[#16c7df] text-4xl text-white shadow-2xl shadow-blue-200">
                    ↑
                  </div>

                  <h3 className="text-2xl font-black text-slate-950">
                    Click to choose a video
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    or simply drag & drop your video here
                  </p>

                  <div className="mt-6 rounded-full border border-blue-100 bg-white px-5 py-2.5 text-xs font-extrabold text-blue-600 shadow-sm">
                    All video formats supported
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl text-emerald-500">
                    ✓
                  </div>

                  <h3 className="max-w-full break-all text-xl font-black text-slate-950">
                    {videoName}
                  </h3>

                  <p className="mt-2 text-sm font-bold text-emerald-500">
                    Your video is ready
                  </p>

                  <div className="mt-5 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-200">
                    Choose another video
                  </div>
                </>
              )}

            </label>

          </div>

          {/* PREVIEW */}

          {videoPreview && (
            <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white p-6 shadow-[0_25px_80px_rgba(30,64,175,0.08)] md:p-8">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <div className="text-[10px] font-black uppercase tracking-[2px] text-blue-500">
                    Video preview
                  </div>

                  <h2 className="mt-1 text-2xl font-black">
                    Take a look
                  </h2>
                </div>

                <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600">
                  ● Ready
                </div>

              </div>

              <div className="overflow-hidden rounded-[22px] bg-black shadow-2xl">

                <video
                  src={videoPreview}
                  controls
                  className="aspect-video w-full"
                />

              </div>

            </div>
          )}

          {/* DETAILS */}

          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_25px_80px_rgba(30,64,175,0.08)]">

            <div className="border-b border-slate-100 px-7 py-6 md:px-9">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl">
                  ✨
                </div>

                <div>

                  <div className="text-[11px] font-black uppercase tracking-[2px] text-blue-500">
                    Step 02
                  </div>

                  <h2 className="mt-1 text-xl font-black">
                    Tell your story
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-400">
                    Give viewers a reason to watch.
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-7 p-7 md:p-9">

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-black text-slate-800">
                    Video title
                  </label>

                  <span className="text-xs font-bold text-slate-300">
                    {title.length} / 100
                  </span>

                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Write a title people will remember..."
                  maxLength={100}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[15px] font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm font-black text-slate-800">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe your video..."
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[15px] font-medium leading-7 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm font-black text-slate-800">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[15px] font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option>Entertainment</option>
                  <option>Music</option>
                  <option>Gaming</option>
                  <option>Technology</option>
                  <option>News</option>
                  <option>Sports</option>
                  <option>Travel</option>
                  <option>Education</option>
                  <option>Comedy</option>
                  <option>Other</option>
                </select>

              </div>

            </div>

          </div>

          {/* PUBLISH */}

          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0759e8] via-[#1769f5] to-[#08b9d5] p-7 text-white shadow-[0_25px_70px_rgba(37,99,235,0.25)] md:p-9">

            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-blue-100">
                  Final step
                </div>

                <h2 className="text-2xl font-black">
                  Ready to share your creation?
                </h2>

                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-blue-50">
                  Everything looks good. Publish your video
                  and let your audience discover it.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <Link
                  href="/"
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/20"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-full bg-white px-7 py-3 text-sm font-black text-blue-700 shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {uploading ? "Uploading..." : "Publish Video"}
                  {!uploading && (
                    <span className="ml-2">→</span>
                  )}
                </button>

              </div>

            </div>

          </div>

        </form>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-blue-100 bg-white px-5 py-10 text-center">

        <div className="text-lg font-black text-blue-600">
          ▶ Your Videos
        </div>

        <p className="mt-2 text-xs font-bold uppercase tracking-[2px] text-slate-300">
          Watch • Discover • Enjoy
        </p>

        <p className="mt-5 text-xs text-slate-400">
          © 2026 Your Videos
        </p>

      </footer>

    </main>
  );
}