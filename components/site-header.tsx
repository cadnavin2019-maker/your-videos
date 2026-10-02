"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Menu, Play, Search, Upload, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/profile", label: "Your Studio" },
];

function SearchForm({
  onSubmitted,
  autoFocus,
}: {
  onSubmitted?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
        onSubmitted?.();
      }}
      className="group relative w-full"
    >
      <label htmlFor="site-search" className="sr-only">
        Search videos
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted transition-colors group-focus-within:text-foreground"
      />
      <input
        id="site-search"
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search videos, categories..."
        className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-foreground/30 focus:bg-surface-raised"
      />
    </form>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Your Videos home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/30">
        <Play aria-hidden="true" className="size-4 fill-white text-white" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Your<span className="text-accent">Videos</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 md:px-8">
        <Logo />

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-surface-raised text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <Suspense fallback={<div className="h-11 rounded-full border border-border bg-surface" />}>
            <SearchForm />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/upload"
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98] sm:flex"
          >
            <Upload aria-hidden="true" className="size-4" />
            Upload
          </Link>

          <Link
            href="/profile"
            aria-label="Your Studio"
            className="hidden size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-sm font-semibold text-white ring-2 ring-transparent transition hover:ring-accent/60 sm:flex"
          >
            YV
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-surface-raised lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="animate-fade-up border-t border-border px-4 pb-6 pt-4 lg:hidden">
          <div className="md:hidden">
            <Suspense fallback={null}>
              <SearchForm onSubmitted={() => setMobileOpen(false)} />
            </Suspense>
          </div>
          <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="rounded-xl px-4 py-3 text-base font-medium text-muted transition hover:bg-surface-raised hover:text-foreground aria-[current=page]:bg-surface-raised aria-[current=page]:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
