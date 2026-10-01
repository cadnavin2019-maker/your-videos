"use client";

import { useRef, useState } from "react";

const UPLOAD_SERVER =
  "https://tobago-investing-meat-mike.trycloudflare.com";

const categories = [
  "Entertainment",
  "Music",
  "Sports",
  "News",
  "Education",
  "Technology",
  "Other",
];

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const selectFile = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setMessage("Please select a video file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setUploadProgress(0);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    selectFile(file);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0] || null;
    selectFile(file);
  };

  const uploadVideo = async () => {
    if (!selectedFile) {
      setMessage("Please select a video first.");
      return;
    }

    if (!title.trim()) {
      setMessage("Please enter a video title.");
      return;
    }

    if (!category) {
      setMessage("Please select a category.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setUploadProgress(5);

      const filename =
        `${Date.now()}-${selectedFile.name}`;

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("pathname", `videos/${filename}`);

      setUploadProgress(15);

      // Upload directly to your local F: drive
      // through Cloudflare Tunnel.
      const uploadResponse = await fetch(
        `${UPLOAD_SERVER}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setUploadProgress(70);

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.error ||
            "Video upload failed."
        );
      }

      const uploadedFilename =
        uploadResult.filename;

      const videoUrl =
        `${UPLOAD_SERVER}/videos/${encodeURIComponent(
          uploadedFilename
        )}`;

      setUploadProgress(80);

      // Save video information in Neon database
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
            category,
            video_url: videoUrl,
            pathname: `videos/${uploadedFilename}`,
          }),
        }
      );

      const databaseResult =
        await databaseResponse.json();

      if (
        !databaseResponse.ok ||
        !databaseResult.success
      ) {
        throw new Error(
          databaseResult.error ||
            "Video uploaded, but database save failed."
        );
      }

      setUploadProgress(100);
      setMessage(
        "Video uploaded successfully!"
      );

      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setCategory("Entertainment");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Video upload failed."
      );

      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">

        <h1 className="mb-2 text-4xl font-bold">
          Upload Video
        </h1>

        <p className="mb-8 text-gray-400">
          Upload your video to MSP Video.
        </p>

        {/* Video Upload Area */}
        <div
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          onClick={() =>
            !uploading &&
            fileInputRef.current?.click()
          }
          className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-700 bg-gray-900 p-12 text-center transition hover:border-gray-500"
        >
          <div className="mb-4 text-5xl">
            🎬
          </div>

          <h2 className="text-xl font-semibold">
            {selectedFile
              ? selectedFile.name
              : "Select your video"}
          </h2>

          <p className="mt-2 text-gray-400">
            Drag & drop your video here or click
            to browse
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-6 rounded-xl bg-gray-900 p-5">
            <p className="font-medium">
              Selected video
            </p>

            <p className="mt-1 break-all text-sm text-gray-400">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(
                2
              )}{" "}
              MB
            </p>
          </div>
        )}

        {/* Title */}
        <div className="mt-8">
          <label className="mb-2 block font-medium">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter video title"
            disabled={uploading}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-white"
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter video description"
            rows={5}
            disabled={uploading}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-white"
          />
        </div>

        {/* Category */}
        <div className="mt-6">
          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            disabled={uploading}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mt-6 rounded-xl bg-gray-900 p-4">
            {message}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadVideo}
          disabled={uploading || !selectedFile}
          className="mt-8 w-full rounded-xl bg-white px-6 py-4 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading
            ? `Uploading... ${uploadProgress}%`
            : "Upload Video"}
        </button>

      </div>
    </main>
  );
}