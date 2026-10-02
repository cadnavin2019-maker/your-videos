"use client";

import Link from "next/link";
import { useState } from "react";
import { formatRelativeDate, type Video } from "@/lib/videos";
import { VideoThumbnail } from "@/components/video-thumbnail";

type VideoCardProps = {
  video: Video;
  layout?: "grid" | "compact";
  index?: number;
};

export function VideoCard({ video, layout = "grid", index = 0 }: VideoCardProps) {
  const [hovering, setHovering] = useState(false);
  const compact = layout === "compact";

  return (
    <Link
      href={`/watch/${video.id}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
      className={`group animate-fade-up rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
        compact ? "flex gap-3" : "flex flex-col gap-3"
      }`}
    >
      <VideoThumbnail
        src={video.video_url}
        title={video.title}
        hovering={hovering}
        className={compact ? "w-40 shrink-0 sm:w-44" : "w-full"}
      />

      <div className={`flex min-w-0 gap-3 ${compact ? "flex-col gap-1" : ""}`}>
        {!compact && (
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-muted"
          >
            YV
          </span>
        )}
        <div className="min-w-0">
          <h3
            className={`line-clamp-2 font-medium leading-snug text-foreground transition-colors group-hover:text-accent ${
              compact ? "text-sm" : "text-[15px]"
            }`}
          >
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-muted">Your Videos</p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <span>{video.category}</span>
            <span aria-hidden="true">{"·"}</span>
            <time dateTime={video.created_at}>{formatRelativeDate(video.created_at)}</time>
          </p>
        </div>
      </div>
    </Link>
  );
}

export function VideoCardSkeleton({ layout = "grid" }: { layout?: "grid" | "compact" }) {
  if (layout === "compact") {
    return (
      <div className="flex gap-3" aria-hidden="true">
        <div className="skeleton aspect-video w-40 shrink-0 rounded-xl sm:w-44" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3.5 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="skeleton aspect-video w-full rounded-xl" />
      <div className="flex gap-3">
        <div className="skeleton size-9 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}
