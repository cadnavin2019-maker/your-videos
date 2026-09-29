"use client";

import { useState } from "react";
import Link from "next/link";

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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);

    setSelectedFile(file);
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
      setUploadProgress(10);

      const pathname = `videos/${Date.now()}-${selectedFile.name}`;

      // Create FormData for server upload
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("pathname", pathname);

      setUploadProgress(20);

      // Upload video to our server API
      const uploadResponse = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      setUploadProgress(80);

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.error ||
            "Video upload failed."
        );
      }

      console.log(
        "Blob upload successful:",
        uploadResult
      );

      // Save video information to Neon database
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
            video_url: uploadResult.url,
            pathname: uploadResult.pathname,
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

      // Reset form
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setCategory("Entertainment");

    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Video upload failed."
      );

      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              Y
            </div>

            <span className="text-2xl font-bold tracking-tight text-blue-700">
              Your Videos
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">

            <Link
              href="/"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/upload"
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Upload Video
            </Link>

          </nav>

        </div>
      </header>


      {/* MAIN */}
      <section className="mx-auto max-w-6xl px-6 py-12">

        {/* TITLE */}
        <div className="mb-10">

          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Creator Studio
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Upload your video
          </h1>

          <p className="mt-4 max-w-2xl text-slate-500">
            Upload your video to Your Videos. Add your
            video information and publish it to your
            video platform.
          </p>

        </div>


        {/* CONTENT GRID */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">


          {/* LEFT */}
          <div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 bg-white"
              }`}
            >

              {!selectedFile ? (

                <>
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-4xl text-blue-600">
                    ↑
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Drag and drop your video
                  </h2>

                  <p className="mt-3 text-slate-500">
                    or choose a video file from your computer
                  </p>

                  <label className="mt-7 inline-flex cursor-pointer rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">

                    Choose Video

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                  </label>

                  <p className="mt-4 text-xs text-slate-400">
                    Supported video files only
                  </p>
                </>

              ) : (

                <>
                  {/* VIDEO PREVIEW */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">

                    {previewUrl && (
                      <video
                        src={previewUrl}
                        controls
                        className="max-h-[430px] w-full object-contain"
                      />
                    )}

                  </div>


                  {/* FILE INFORMATION */}
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-left">

                    <p className="break-all font-semibold text-slate-900">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                      {(
                        selectedFile.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}

                      MB

                    </p>

                  </div>


                  {/* CHANGE VIDEO */}
                  <label className="mt-5 inline-flex cursor-pointer rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">

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


            {/* PROGRESS */}
            {isUploading && (

              <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                <div className="mb-3 flex items-center justify-between text-sm">

                  <span className="font-medium text-slate-700">
                    Uploading video...
                  </span>

                  <span className="font-bold text-blue-600">
                    {uploadProgress}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-blue-50">

                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />

                </div>

              </div>

            )}

          </div>


          {/* RIGHT - VIDEO DETAILS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="mb-7">

              <h2 className="text-2xl font-bold text-slate-900">
                Video details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add information about your video.
              </p>

            </div>


            <div className="space-y-6">


              {/* TITLE */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter video title"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>


              {/* DESCRIPTION */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Tell viewers about your video"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>


              {/* CATEGORY */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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


              {/* UPLOAD BUTTON */}
              <button
                type="button"
                onClick={handleUpload}
                disabled={
                  !selectedFile ||
                  isUploading
                }
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >

                {isUploading
                  ? `Uploading ${uploadProgress}%`
                  : "Upload Video"}

              </button>


              <p className="text-center text-xs leading-5 text-slate-400">
                By uploading, you confirm that you have
                the rights to share this video.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row">

          <p>
            © {new Date().getFullYear()} Your Videos
          </p>

          <Link
            href="/"
            className="font-medium text-blue-600 transition hover:text-blue-700"
          >
            Back to Home
          </Link>

        </div>

      </footer>

    </main>
  );
}