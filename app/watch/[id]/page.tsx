"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DolbyPlayer from "@/components/DolbyPlayer";

type Video = {
  id: number;
  title: string;
  description: string;
  category: string;
  video_url: string;
  pathname: string;
  created_at: string;
};

export default function WatchPage() {
  const params = useParams();

  const id = params?.id;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadVideo = async () => {
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load videos.");
        }

        const foundVideo = data.videos.find(
          (item: Video) => String(item.id) === String(id)
        );

        if (!foundVideo) {
          setError("Video not found.");
          return;
        }

        setVideo(foundVideo);
      } catch (err) {
        console.error("WATCH VIDEO ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load video."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] text-slate-900">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="text-4xl">🎬</div>
            <p className="mt-4 text-slate-500">
              Loading video...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !video) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] p-10 text-slate-900">
        <h1 className="text-3xl font-bold">
          Video not found
        </h1>

        <p className="mt-3 text-slate-500">
          {error || "This video does not exist."}
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          ← Back to Videos
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-slate-900">

      {/* HEADER */}

      <header className="premium-header sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1700px] items-center px-5 lg:px-8">

          <Link
            href="/"
            className="brand flex items-center gap-3"
          >
            <div className="brand-logo">
              <span>▶</span>
            </div>

            <div>
              <div className="brand-name">
                Your Videos
              </div>

              <div className="brand-tagline">
                WATCH • DISCOVER • ENJOY
              </div>
            </div>
          </Link>

        </div>
      </header>

      {/* VIDEO */}

      <section className="mx-auto max-w-[1200px] px-5 py-8">

        <Link
          href="/"
          className="mb-6 inline-block font-semibold text-blue-600"
        >
          ← Back to Videos
        </Link>

        {/* PLAYER */}

        <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">

          <DolbyPlayer
            src={video.video_url}
          />

        </div>

        {/* VIDEO INFORMATION */}

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              {video.category}
            </span>

            <span className="text-sm text-slate-500">
              {new Date(video.created_at).toLocaleDateString()}
            </span>

          </div>

          <h1 className="mt-4 text-2xl font-bold md:text-3xl">
            {video.title}
          </h1>

          {/* CREATOR */}

          <div className="mt-5 flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              YV
            </div>

            <div>
              <h2 className="font-bold">
                Your Videos
              </h2>

              <p className="text-sm text-slate-500">
                Creator
              </p>
            </div>

            <button className="ml-auto rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Subscribe
            </button>

          </div>

          {/* DESCRIPTION */}

          {video.description && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <p className="leading-7 text-slate-700">
                {video.description}
              </p>

            </div>
          )}

          {/* ACTION BUTTONS */}

          <div className="mt-5 flex flex-wrap gap-3">

            <button className="rounded-full bg-slate-100 px-5 py-3 font-semibold transition hover:bg-slate-200">
              👍 Like
            </button>

            <button className="rounded-full bg-slate-100 px-5 py-3 font-semibold transition hover:bg-slate-200">
              💬 Comment
            </button>

            <button className="rounded-full bg-slate-100 px-5 py-3 font-semibold transition hover:bg-slate-200">
              ↗ Share
            </button>

            <button className="rounded-full bg-slate-100 px-5 py-3 font-semibold transition hover:bg-slate-200">
              ◷ Watch Later
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}