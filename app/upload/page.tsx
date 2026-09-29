"use client";

import { useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";

export default function UploadPage() {
  const [videoName, setVideoName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [videoPreview, setVideoPreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideo = (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    setVideoName(file.name);
    setSelectedFile(file);
    setUploadProgress(0);

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    handleVideo(file);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    handleVideo(file);
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
      setUploadProgress(0);

      const safeFileName = selectedFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

      const pathname =
        "videos/" +
        Date.now() +
        "-" +
        safeFileName;

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

      console.log("Video uploaded successfully:", {
        url: blob.url,
        pathname: blob.pathname,
        title: title,
        description: description,
        category: category,
      });

      setUploadProgress(100);

      alert("Video uploaded successfully!");

      console.log("Video URL:", blob.url);
    } catch (error) {
      console.error("Upload error:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Video upload failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f9ff] text-slate-900">

      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 lg:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-lg text-white shadow-lg">
              ▶
            </div>

            <div>
              <div className="text-xl font-black text-slate-950">
                Your Videos
              </div>

              <div className="text-[8px] font-black uppercase tracking-[3px] text-blue-500">
                Creator Studio
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          >
            ← Back to Home
          </Link>

        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1050px] px-5 pb-10 pt-16 text-center">

          <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-[11px] font-black uppercase tracking-[2px] text-blue-600 shadow-sm">
            ✦ Your creative space ✦
          </div>

          <h1 className="text-5xl font-black tracking-[-2px] text-slate-950 md:text-7xl">
            Share your
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              story with the world.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-slate-500">
            Upload your video, give it a voice, and let your creativity
            reach people everywhere.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-[1050px] px-5 pb-16">

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-xl">

            <div className="border-b border-slate-100 px-7 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  🎬
                </div>

                <div>
                  <div className="text-[11px] font-black uppercase tracking-[2px] text-blue-500">
                    Step 01
                  </div>

                  <h2 className="text-xl font-black text-slate-950">
                    Choose your video
                  </h2>
                </div>

              </div>

            </div>

            <div className="p-7">

              {!selectedFile ? (

                <label
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => {
                    setDragActive(false);
                  }}
                  onDrop={handleDrop}
                  className={
                    "flex min-h-[300px] cursor-pointer flex-col " +
                    "items-center justify-center rounded-[26px] border-2 " +
                    "border-dashed transition " +
                    (
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-blue-200 bg-[#f8fbff] hover:border-blue-400"
                    )
                  }
                >

                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoChange}
                  />

                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-4xl">
                    🎥
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    Drop your video here
                  </h3>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    or click to browse from your computer
                  </p>

                  <div className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-500 shadow-sm">
                    MP4 • MOV • AVI • WebM
                  </div>

                </label>

              ) : (

                <div className="space-y-5">

                  <div className="overflow-hidden rounded-[24px] bg-slate-950">

                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="max-h-[500px] w-full"
                      />
                    )}

                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">

                      <div className="text-xs font-black uppercase tracking-[1.5px] text-blue-500">
                        Selected video
                      </div>

                      <div className="mt-1 truncate text-sm font-bold text-slate-800">
                        {videoName}
                      </div>

                    </div>

                    <label className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-bold text-blue-600 shadow-sm">

                      Change video

                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />

                    </label>

                  </div>

                </div>

              )}

            </div>

          </div>

          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-xl">

            <div className="border-b border-slate-100 px-7 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  ✨
                </div>

                <div>
                  <div className="text-[11px] font-black uppercase tracking-[2px] text-blue-500">
                    Step 02
                  </div>

                  <h2 className="text-xl font-black text-slate-950">
                    Tell viewers about your video
                  </h2>
                </div>

              </div>

            </div>

            <div className="space-y-6 p-7">

              <div>

                <label className="mb-2 block text-sm font-black text-slate-800">
                  Video title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  placeholder="Enter an attractive video title"
                  maxLength={100}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-black text-slate-800">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  placeholder="Tell viewers what your video is about..."
                  rows={6}
                  maxLength={5000}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-black text-slate-800">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Music">
                    Music
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Gaming">
                    Gaming
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

                  <option value="Comedy">
                    Comedy
                  </option>

                  <option value="Film & Animation">
                    Film & Animation
                  </option>

                  <option value="People & Blogs">
                    People & Blogs
                  </option>

                </select>

              </div>

            </div>

          </div>

          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-xl">

            <div className="p-7">

              {uploading && (

                <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-sm font-black text-blue-700">
                      Uploading video...
                    </span>

                    <span className="text-sm font-black text-blue-600">
                      {uploadProgress}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-blue-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                      style={{
                        width: uploadProgress + "%",
                      }}
                    />

                  </div>

                </div>

              )}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="text-[11px] font-black uppercase tracking-[2px] text-blue-500">
                    Step 03
                  </div>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Ready to publish?
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Your video will be uploaded to Your Videos.
                  </p>

                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading
                    ? "Uploading " + uploadProgress + "%"
                    : "Publish Video →"}
                </button>

              </div>

            </div>

          </div>

        </form>

      </section>

      <footer className="border-t border-blue-100 bg-white">

        <div className="mx-auto max-w-[1050px] px-5 py-8 text-center">

          <div className="text-sm font-black text-slate-800">
            Your Videos
          </div>

          <div className="mt-1 text-xs font-medium text-slate-400">
            Create • Upload • Share
          </div>

        </div>

      </footer>

    </main>
  );
}