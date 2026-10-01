"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

type DolbyPlayerProps = {
  src: string;
  poster?: string;
};

export default function DolbyPlayer({
  src,
  poster,
}: DolbyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }

    video.src = src;
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      className="w-full rounded-xl bg-black"
    >
      Your browser does not support this video.
    </video>
  );
}
