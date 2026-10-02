"use client";

import { useState } from "react";
import { Check, Clock, Link2, Share2, Sparkles, ThumbsUp } from "lucide-react";
import { formatRelativeDate, type Video } from "@/lib/videos";

export function VideoDetails({ video }: { video: Video }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const publishedDate = new Date(video.created_at).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleShare() {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: video.title, url });
        return;
      } catch {
        // fall through to copy when the share sheet is dismissed or unavailable
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const actionClass =
    "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition active:scale-95";

  return (
    <section id="details" aria-labelledby="video-title" className="flex animate-fade-up flex-col gap-5 [animation-delay:80ms]">
      <h1 id="video-title" className="text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
        {video.title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-sm font-semibold text-white">
            YV
          </span>
          <div>
            <p className="font-semibold">Your Videos</p>
            <p className="text-sm text-muted">Creator</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={liked}
            onClick={() => setLiked((value) => !value)}
            className={`${actionClass} ${liked ? "bg-foreground text-background" : "bg-surface-raised hover:bg-surface-hover"}`}
          >
            <ThumbsUp className={`size-4 ${liked ? "fill-current" : ""}`} aria-hidden="true" />
            {liked ? "Liked" : "Like"}
          </button>
          <button type="button" onClick={handleShare} className={`${actionClass} bg-surface-raised hover:bg-surface-hover`}>
            {copied ? <Link2 className="size-4" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
            {copied ? "Link copied" : "Share"}
          </button>
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
            className={`${actionClass} bg-surface-raised hover:bg-surface-hover`}
          >
            {saved ? <Check className="size-4" aria-hidden="true" /> : <Clock className="size-4" aria-hidden="true" />}
            {saved ? "Saved" : "Watch later"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-5 ring-1 ring-border shadow-sm shadow-accent/5">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-accent">{video.category}</span>
          <time dateTime={video.created_at} className="text-foreground/80" title={publishedDate}>
            {formatRelativeDate(video.created_at)}
          </time>
        </div>
        {video.description ? (
          <>
            <p
              className={`mt-3 whitespace-pre-line text-pretty leading-relaxed text-foreground/80 ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {video.description}
            </p>
            {video.description.length > 180 && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="mt-2 text-sm font-semibold text-foreground hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">No description provided.</p>
        )}
        <p className="mt-4 text-xs text-muted">Published {publishedDate}</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border p-5">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">AI insights</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Summaries, chapters and smart tags for this video will appear here.
          </p>
        </div>
      </div>
    </section>
  );
}
