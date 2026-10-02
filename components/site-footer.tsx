import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:px-8">
        <p>
          {"© "}
          {new Date().getFullYear()} Your Videos. Watch, discover and share.
        </p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
          <Link href="/upload" className="transition hover:text-foreground">
            Upload
          </Link>
          <Link href="/profile" className="transition hover:text-foreground">
            Your Studio
          </Link>
        </nav>
      </div>
    </footer>
  );
}
