"use client";

import Link from "next/link";
import { Info, Play, Upload } from "lucide-react";
import { formatRelativeDate, type Video } from "@/lib/videos";

export function FeaturedVideo({ video }: { video: Video }) {
  return (
    <section
      aria-labelledby="featured-title"
      className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <video
        src={video.video_url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-10 size-full object-cover opacity-70"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="flex min-h-[420px] flex-col justify-end gap-5 p-6 md:min-h-[520px] md:p-12">
        <div className="flex animate-fade-up items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Featured {"·"} {video.category}
        </div>
        <h1
          id="featured-title"
          className="max-w-2xl animate-fade-up text-balance text-4xl font-semibold leading-[1.05] tracking-tight [animation-delay:80ms] md:text-6xl"
        >
          {video.title}
        </h1>
        {video.description && (
          <p className="line-clamp-3 max-w-xl animate-fade-up text-pretty text-base leading-relaxed text-foreground/75 [animation-delay:160ms] md:text-lg">
            {video.description}
          </p>
        )}
        <p className="animate-fade-up text-sm text-muted [animation-delay:200ms]">
          Added {formatRelativeDate(video.created_at)}
        </p>
        <div className="flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
          <Link
            href={`/watch/${video.id}`}
            className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-white active:scale-[0.98]"
          >
            <Play aria-hidden="true" className="size-4 fill-current" />
            Watch now
          </Link>
          <Link
            href={`/watch/${video.id}#details`}
            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:bg-white/20"
          >
            <Info aria-hidden="true" className="size-4" />
            More info
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedEmpty() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface">
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="flex min-h-[420px] flex-col justify-end gap-5 p-6 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your video platform</p>
        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Watch. Discover. <span className="text-accent">Share.</span>
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
          Your library is empty. Upload your first video to start building your channel.
        </p>
        <div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            <Upload aria-hidden="true" className="size-4" />
            Upload a video
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedSkeleton() {
  return <div aria-hidden="true" className="skeleton min-h-[420px] rounded-3xl md:min-h-[520px]" />;
}
