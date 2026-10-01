"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  "All",
  "Trending",
  "Music",
  "Gaming",
  "Technology",
  "News",
  "Sports",
  "Travel",
];

type Video = {
  id: number;
  title: string;
  description: string;
  category: string;
  video_url: string;
  pathname: string;
  created_at: string;
};

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch("/api/videos");

        const data = await response.json();

        if (data.success) {
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error("VIDEO LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter(
          (video) => video.category === selectedCategory
        );

  return (
    <main className="min-h-screen bg-[#070b14] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#070b14]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Your <span className="text-red-500">Videos</span>
          </Link>

          <nav className="hidden gap-8 text-sm text-gray-300 md:flex">
            <Link
              href="/"
              className="hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/upload"
              className="hover:text-white"
            >
              Upload
            </Link>
          </nav>

          <Link
            href="/upload"
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500"
          >
            Upload Video
          </Link>

        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="max-w-4xl">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
            Your Video Platform
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Watch.
            <br />
            Discover.
            <br />
            <span className="text-red-500">
              Share.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Discover amazing videos, explore new creators
            and share your favorite moments with the world.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/upload"
              className="rounded-full bg-red-600 px-7 py-3 font-semibold hover:bg-red-500"
            >
              Upload Your Video
            </Link>

            <a
              href="#videos"
              className="rounded-full border border-white/20 px-7 py-3 font-semibold hover:bg-white/10"
            >
              Explore Videos
            </a>

          </div>

        </div>

      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6">

        <div className="flex gap-3 overflow-x-auto pb-5">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {category}
            </button>

          ))}

        </div>

      </section>

      {/* Videos */}
      <section
        id="videos"
        className="mx-auto max-w-7xl px-6 py-10"
      >

        <div className="mb-8">

          <p className="text-sm uppercase tracking-widest text-red-500">
            Discover
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Latest Videos
          </h2>

        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-400">
            Loading videos...
          </div>
        )}

        {/* No videos */}
        {!loading &&
          filteredVideos.length === 0 && (

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">

              <div className="text-5xl">
                🎬
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No videos yet
              </h3>

              <p className="mt-2 text-gray-500">
                Upload the first video to Your Videos.
              </p>

              <Link
                href="/upload"
                className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 font-semibold hover:bg-red-500"
              >
                Upload Video
              </Link>

            </div>

          )}

        {/* Video Grid */}
        {!loading &&
          filteredVideos.length > 0 && (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredVideos.map((video) => (

                <Link
                  href={`/watch/${video.id}`}
                  key={video.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20"
                >

                  {/* Video Preview */}
                  <div className="relative aspect-video overflow-hidden bg-black">

                    <video
                      src={video.video_url}
                      preload="metadata"
                      muted
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur">

                        <span className="ml-1 text-xl">
                          ▶
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Video Info */}
                  <div className="p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                      {video.category}
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-red-400">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {video.description}
                      </p>
                    )}

                  </div>

                </Link>

              ))}

            </div>

          )}

      </section>

      {/* Creator CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/40 to-white/[0.03] p-10 text-center">

          <h2 className="text-3xl font-bold">
            Have a video to share?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Upload your videos and start building your
            audience on Your Videos.
          </p>

          <Link
            href="/upload"
            className="mt-7 inline-block rounded-full bg-red-600 px-7 py-3 font-semibold hover:bg-red-500"
          >
            Start Uploading
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 Your Videos. All rights reserved.
          </p>

          <div className="flex gap-6">

            <Link
              href="/"
              className="hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/upload"
              className="hover:text-white"
            >
              Upload
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}