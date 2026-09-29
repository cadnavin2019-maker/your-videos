"use client";

import { useState } from "react";
import Link from "next/link";

type Video = {
  id: number;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  category: string;
  thumbnail: string;
};

const videos: Video[] = [
  {
    id: 1,
    title: "Welcome to Your Videos",
    channel: "Your Videos",
    views: "1.2K views",
    time: "2 hours ago",
    duration: "12:45",
    category: "Featured",
    thumbnail:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1400",
  },
  {
    id: 2,
    title: "The Future of Technology",
    channel: "Tech World",
    views: "8.5K views",
    time: "5 hours ago",
    duration: "10:32",
    category: "Technology",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400",
  },
  {
    id: 3,
    title: "Beautiful Places Around the World",
    channel: "Travel Vibes",
    views: "24K views",
    time: "1 day ago",
    duration: "15:18",
    category: "Travel",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1400",
  },
  {
    id: 4,
    title: "The World of Gaming",
    channel: "Game Zone",
    views: "32K views",
    time: "2 days ago",
    duration: "18:42",
    category: "Gaming",
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400",
  },
  {
    id: 5,
    title: "Music That Changes Everything",
    channel: "Music Station",
    views: "45K views",
    time: "3 days ago",
    duration: "25:10",
    category: "Music",
    thumbnail:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400",
  },
  {
    id: 6,
    title: "World News Today",
    channel: "Daily News",
    views: "19K views",
    time: "4 days ago",
    duration: "09:55",
    category: "News",
    thumbnail:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1400",
  },
  {
    id: 7,
    title: "Amazing Sports Moments",
    channel: "Sports World",
    views: "51K views",
    time: "5 days ago",
    duration: "11:27",
    category: "Sports",
    thumbnail:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400",
  },
  {
    id: 8,
    title: "Explore Beautiful Nature",
    channel: "Nature Life",
    views: "15K views",
    time: "1 week ago",
    duration: "08:21",
    category: "Travel",
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400",
  },
];

const categories = [
  "All",
  "Trending",
  "Music",
  "Gaming",
  "Technology",
  "News",
  "Sports",
  "Travel",
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      video.channel.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      selectedCategory === "Trending" ||
      video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-slate-900">

      {/* HEADER */}

      <header className="premium-header sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1700px] items-center gap-4 px-5 lg:px-8">

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-button lg:hidden"
          >
            ☰
          </button>

          {/* BRAND */}

          <div className="brand flex items-center gap-3">

            <div className="brand-logo">
              <span>▶</span>
            </div>

            <div>
              <div className="brand-name">
                Your Videos
              </div>

              <div className="brand-tagline">
                WATCH • DISCOVER • ENJOY
              </div>
            </div>

          </div>

          {/* SEARCH */}

          <div className="mx-auto hidden w-full max-w-2xl md:block">

            <div className="modern-search">

              <span className="search-icon">
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos, creators and more..."
              />

              <button>
                Search
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="ml-auto flex items-center gap-2">

            <button className="header-icon">
              ♡
            </button>

            <button className="header-icon">
              🔔
            </button>

            <button className="signin-button">
              Sign In
            </button>

          </div>

        </div>
      </header>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="mobile-menu">

          <button onClick={() => setMenuOpen(false)}>
            ✕
          </button>

          <div className="mobile-menu-title">
            Your Videos
          </div>

          <div className="mobile-links">
            <button>⌂ Home</button>
            <button>🔥 Trending</button>
            <button>♡ Liked Videos</button>
            <button>◷ Watch Later</button>
            <button>▣ Subscriptions</button>
          </div>

        </div>
      )}

      {/* CATEGORY BAR */}

      <nav className="category-bar">

        <div className="mx-auto flex max-w-[1700px] gap-3 overflow-x-auto px-5 py-4 lg:px-8">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "category active"
                  : "category"
              }
            >
              {category}
            </button>

          ))}

        </div>

      </nav>

      {/* HERO */}

      <section className="mx-auto max-w-[1700px] px-5 pt-7 lg:px-8">

        <div className="premium-hero">

          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-content">

            <div className="hero-badge">
              ✦ THE NEW WAY TO WATCH
            </div>

            <h1>
              Your world.
              <br />

              <span>One video at a time.</span>
            </h1>

            <p>
              Discover inspiring creators, entertainment,
              technology, music and stories — all in one beautiful place.
            </p>

            <div className="hero-buttons">

              <button className="primary-button">
                ▶ Explore Videos
              </button>

              <button className="secondary-button">
                ✦ Trending Now
              </button>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="floating-card card-one">
              ▶
            </div>

            <div className="floating-card card-two">
              ♫
            </div>

            <div className="floating-card card-three">
              ✦
            </div>

            <div className="hero-circle">

              <div className="hero-play">
                ▶
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1700px] px-5 py-12 lg:px-8">

        <div className="section-heading">

          <div>
            <div className="section-label">
              FOR YOU
            </div>

            <h2>
              Discover something amazing
            </h2>

            <p>
              Videos selected for your experience
            </p>
          </div>

          <div className="video-count">
            {filteredVideos.length} videos
          </div>

        </div>

        {/* VIDEO GRID */}

        {filteredVideos.length === 0 ? (

          <div className="empty-state">
            <div>⌕</div>

            <h3>
              No videos found
            </h3>

            <p>
              Try another search or category.
            </p>
          </div>

        ) : (

          <div className="video-grid">

            {filteredVideos.map((video) => (

              <article
                key={video.id}
                className="video-card"
              >

                {/* THUMBNAIL */}

                <div className="thumbnail-wrapper">

                  <img
                    src={video.thumbnail}
                    alt={video.title}
                  />

                  <div className="thumbnail-overlay" />

                  <div className="play-circle">
                    ▶
                  </div>

                  <span className="duration">
                    {video.duration}
                  </span>

                  <span className="category-label">
                    {video.category}
                  </span>

                </div>

                {/* INFO */}

                <div className="video-info">

                  <div className="channel-avatar">
                    {video.channel.charAt(0)}
                  </div>

                  <div className="video-text">

                    <h3>
                      {video.title}
                    </h3>

                    <p className="channel-name">
                      {video.channel}
                    </p>

                    <p className="video-meta">
                      {video.views} · {video.time}
                    </p>

                  </div>

                  <button className="more-button">
                    ⋮
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}

      <footer className="premium-footer">

        <div className="footer-logo">
          ▶ Your Videos
        </div>

        <p>
          A new home for videos, creators and stories.
        </p>

        <div className="footer-links">
          <span>About</span>
          <span>Creators</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>

        <div className="copyright">
          © 2026 Your Videos
        </div>

      </footer>

    </main>
  );
}