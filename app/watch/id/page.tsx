"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const videos = [
  {
    id: 1,
    title: "Welcome to Your Videos",
    channel: "Your Videos",
    views: "1.2K views",
    description:
      "Welcome to Your Videos — your new home for videos, creators and stories.",
  },
  {
    id: 2,
    title: "The Future of Technology",
    channel: "Tech World",
    views: "8.5K views",
    description:
      "Explore the exciting future of technology and innovation.",
  },
  {
    id: 3,
    title: "Beautiful Places Around the World",
    channel: "Travel Vibes",
    views: "24K views",
    description:
      "Discover beautiful places and amazing destinations around the world.",
  },
  {
    id: 4,
    title: "The World of Gaming",
    channel: "Game Zone",
    views: "32K views",
    description:
      "Gaming highlights, entertainment and amazing gaming moments.",
  },
  {
    id: 5,
    title: "Music That Changes Everything",
    channel: "Music Station",
    views: "45K views",
    description:
      "Enjoy music, performances and unforgettable moments.",
  },
  {
    id: 6,
    title: "World News Today",
    channel: "Daily News",
    views: "19K views",
    description:
      "Latest stories and important events from around the world.",
  },
  {
    id: 7,
    title: "Amazing Sports Moments",
    channel: "Sports World",
    views: "51K views",
    description:
      "The greatest sports moments and unforgettable highlights.",
  },
  {
    id: 8,
    title: "Explore Beautiful Nature",
    channel: "Nature Life",
    views: "15K views",
    description:
      "Relax and explore beautiful nature from around the world.",
  },
];

export default function WatchPage() {
  const params = useParams();

  const id = Number(params.id);

  const video = videos.find((item) => item.id === id);

  if (!video) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] p-10">
        <h1 className="text-3xl font-bold">
          Video not found
        </h1>

        <Link
          href="/"
          className="mt-5 inline-block text-blue-600"
        >
          ← Back to Home
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


      {/* VIDEO PLAYER */}

      <section className="mx-auto max-w-[1200px] px-5 py-8">

        <Link
          href="/"
          className="mb-6 inline-block font-semibold text-blue-600"
        >
          ← Back to Videos
        </Link>

        <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">

          <video
            controls
            autoPlay
            className="aspect-video w-full"
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          />

        </div>


        {/* VIDEO INFORMATION */}

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">

          <h1 className="text-2xl font-bold md:text-3xl">
            {video.title}
          </h1>

          <p className="mt-2 text-slate-500">
            {video.views}
          </p>

          <div className="mt-5 flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {video.channel.charAt(0)}
            </div>

            <div>
              <h2 className="font-bold">
                {video.channel}
              </h2>

              <p className="text-sm text-slate-500">
                Creator
              </p>
            </div>

            <button className="ml-auto rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Subscribe
            </button>

          </div>


          <div className="mt-6 rounded-2xl bg-slate-50 p-5">

            <p className="leading-7 text-slate-700">
              {video.description}
            </p>

          </div>


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