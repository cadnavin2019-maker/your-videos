import { Suspense } from "react";
import { HomeFeed } from "@/components/home-feed";
import { FeaturedSkeleton } from "@/components/featured-video";

export default function Home() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1600px] px-4 pt-6 md:px-8">
            <FeaturedSkeleton />
          </div>
        }
      >
        <HomeFeed />
      </Suspense>
    </main>
  );
}
