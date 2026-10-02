"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertCircle, Upload, VideoOff } from "lucide-react";
import { formatRelativeDate, useVideos } from "@/lib/videos";
import { EmptyState } from "@/components/empty-state";
import { VideoCard, VideoCardSkeleton } from "@/components/video-card";

export function ProfileView() {
  const { videos, error, isLoading } = useVideos();

  const stats = useMemo(() => {
    const categories = new Set(videos.map((video) => video.category));
    return [
      { label: "Videos", value: videos.length.toString() },
      { label: "Categories", value: categories.size.toString() },
      { label: "Latest upload", value: videos[0] ? formatRelativeDate(videos[0].created_at) : "—" },
    ];
  }, [videos]);

  return (
    <main className="pb-20">
      <section className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/25 via-background to-background" />
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8 md:py-16">
          <div className="flex animate-fade-up items-center gap-5">
            <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-2xl font-semibold text-white ring-4 ring-background md:size-24">
              YV
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your Studio</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Your Videos</h1>
              <p className="mt-1 text-sm text-muted">Every video in your channel, in one place.</p>
            </div>
          </div>
          <Link
            href="/upload"
            className="flex w-fit animate-fade-up items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition [animation-delay:80ms] hover:bg-accent-hover"
          >
            <Upload className="size-4" aria-hidden="true" />
            Upload new video
          </Link>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 pt-8 md:px-8">
        <dl className="grid animate-fade-up grid-cols-1 gap-4 [animation-delay:120ms] sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-surface p-5 ring-1 ring-border shadow-sm shadow-accent/5">
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
                {isLoading ? <span className="skeleton inline-block h-7 w-16 rounded" /> : stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="uploads-heading" className="flex flex-col gap-6">
          <h2 id="uploads-heading" className="text-xl font-semibold tracking-tight">
            Uploads
          </h2>
          {error ? (
            <EmptyState icon={<AlertCircle className="size-5" />} title="Could not load videos" description={error.message} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <VideoCardSkeleton key={index} />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<VideoOff className="size-5" />}
              title="No uploads yet"
              description="Videos you upload will appear here."
            />
          )}
        </section>
      </div>
    </main>
  );
}
