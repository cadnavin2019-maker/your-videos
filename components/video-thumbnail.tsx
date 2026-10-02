"use client";

import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/videos";

type VideoThumbnailProps = {
  src: string;
  title: string;
  hovering?: boolean;
  className?: string;
};

export function VideoThumbnail({ src, title, hovering = false, className = "" }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hovering) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      if (video.readyState > 0) video.currentTime = Math.min(1, video.duration || 1);
    }
  }, [hovering]);

  return (
    <div className={`relative aspect-video overflow-hidden rounded-xl bg-surface ${className}`}>
      {!loaded && <div aria-hidden="true" className="skeleton absolute inset-0" />}
      <video
        ref={videoRef}
        src={`${src}#t=1`}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={`Preview of ${title}`}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onLoadedData={() => setLoaded(true)}
        className={`size-full object-cover transition duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${hovering ? "scale-[1.03]" : "scale-100"}`}
      />
      {duration > 0 && (
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-xs font-medium text-white">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
}
