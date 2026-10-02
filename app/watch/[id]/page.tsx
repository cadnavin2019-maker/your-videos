"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Film } from "lucide-react";
import DolbyPlayer from "@/components/DolbyPlayer";
import { useVideos } from "@/lib/videos";
import { EmptyState } from "@/components/empty-state";
import { VideoDetails } from "@/components/video-details";
import { UpNext } from "@/components/up-next";

export default function WatchPage() {
  const params = useParams();
  const id = params?.id;
  const { videos, error, isLoading } = useVideos();

  const video = videos.find((item) => String(item.id) === String(id));

  if (isLoading) {
    return (
      <main className="mx-auto grid max-w-[1600px] gap-8 px-4 py-6 md:px-8 xl:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading video">
          <div className="skeleton aspect-video w-full rounded-2xl" />
          <div className="skeleton h-8 w-2/3 rounded-lg" />
          <div className="skeleton h-24 w-full rounded-2xl" />
        </div>
        <UpNext videos={[]} loading />
      </main>
    );
  }

  if (error || !video) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <EmptyState
          icon={<Film className="size-5" />}
          title="Video not found"
          description={error?.message || "This video does not exist or may have been removed."}
          action={
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-accent-hover"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to videos
            </Link>
          }
        />
      </main>
    );
  }

  const related = [
    ...videos.filter((item) => item.id !== video.id && item.category === video.category),
    ...videos.filter((item) => item.id !== video.id && item.category !== video.category),
  ].slice(0, 12);

  return (
    <main className="mx-auto grid max-w-[1600px] gap-8 px-4 py-6 md:px-8 xl:grid-cols-[1fr_400px]">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="animate-fade-up overflow-hidden rounded-2xl bg-black shadow-2xl shadow-accent/15 ring-1 ring-border">
          <DolbyPlayer src={video.video_url} />
        </div>
        <VideoDetails video={video} />
      </div>
      <UpNext videos={related} />
    </main>
  );
}
