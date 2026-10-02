import type { Video } from "@/lib/videos";
import { VideoCard, VideoCardSkeleton } from "@/components/video-card";

export function UpNext({ videos, loading = false }: { videos: Video[]; loading?: boolean }) {
  return (
    <aside aria-labelledby="up-next-heading" className="flex flex-col gap-4">
      <h2 id="up-next-heading" className="text-lg font-semibold tracking-tight">
        Up next
      </h2>
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => <VideoCardSkeleton key={index} layout="compact" />)
      ) : videos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} layout="compact" index={index} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-surface p-5 text-sm text-muted ring-1 ring-border">
          More videos will show up here as your library grows.
        </p>
      )}
    </aside>
  );
}
