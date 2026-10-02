"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertCircle, SearchX, Upload, VideoOff, X } from "lucide-react";
import { getCategories, matchesQuery, useVideos } from "@/lib/videos";
import { CategoryBar } from "@/components/category-bar";
import { EmptyState } from "@/components/empty-state";
import { FeaturedEmpty, FeaturedSkeleton, FeaturedVideo } from "@/components/featured-video";
import { VideoCard, VideoCardSkeleton } from "@/components/video-card";

export function HomeFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { videos, error, isLoading, refresh } = useVideos();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => getCategories(videos), [videos]);
  const searched = useMemo(() => videos.filter((video) => matchesQuery(video, query)), [videos, query]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: searched.length };
    for (const video of searched) result[video.category] = (result[video.category] ?? 0) + 1;
    return result;
  }, [searched]);

  const filtered =
    selectedCategory === "All" ? searched : searched.filter((video) => video.category === selectedCategory);

  const featured = videos[0];
  const showFeatured = !query;
  const gridVideos = showFeatured && selectedCategory === "All" ? filtered.slice(1) : filtered;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 pb-20 pt-6 md:px-8">
      {showFeatured &&
        (isLoading ? <FeaturedSkeleton /> : featured ? <FeaturedVideo video={featured} /> : !error && <FeaturedEmpty />)}

      <section aria-labelledby="library-heading" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="library-heading" className="text-2xl font-semibold tracking-tight">
                {query ? "Search results" : "Browse library"}
              </h2>
              {query ? (
                <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                  {searched.length} {searched.length === 1 ? "result" : "results"} for
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised py-0.5 pl-3 pr-1 text-foreground">
                    {query}
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      aria-label="Clear search"
                      className="rounded-full p-0.5 text-muted transition hover:bg-zinc-700 hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">Fresh uploads, sorted by newest first.</p>
              )}
            </div>
          </div>
          <CategoryBar
            categories={categories}
            selected={selectedCategory}
            counts={counts}
            onSelect={setSelectedCategory}
          />
        </div>

        {error ? (
          <EmptyState
            icon={<AlertCircle className="size-5" />}
            title="Could not load videos"
            description={error.message}
            action={
              <button
                type="button"
                onClick={() => refresh()}
                className="rounded-full bg-surface-raised px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-700"
              >
                Try again
              </button>
            }
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <VideoCardSkeleton key={index} />
            ))}
          </div>
        ) : gridVideos.length > 0 ? (
          <div
            key={`${selectedCategory}-${query}`}
            className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          >
            {gridVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        ) : query ? (
          <EmptyState
            icon={<SearchX className="size-5" />}
            title="No matches found"
            description="Try a different keyword or browse another category."
          />
        ) : (
          <EmptyState
            icon={<VideoOff className="size-5" />}
            title={videos.length === 0 ? "No videos yet" : `Nothing in ${selectedCategory} yet`}
            description="Upload a video to fill this space."
            action={
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                <Upload className="size-4" aria-hidden="true" />
                Upload video
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
