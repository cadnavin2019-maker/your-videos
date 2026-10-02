import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Play } from "lucide-react";

type UploadStatusProps = {
  uploading: boolean;
  progress: number;
  status: string;
  succeeded: boolean;
  uploadedId: number | null;
};

export function UploadStatus({ uploading, progress, status, succeeded, uploadedId }: UploadStatusProps) {
  if (!status) return null;

  const tone = uploading ? "progress" : succeeded ? "success" : "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-fade-up rounded-2xl p-4 ring-1 ${
        tone === "success"
          ? "bg-emerald-500/10 ring-emerald-500/30"
          : tone === "error"
            ? "bg-accent/10 ring-accent/30"
            : "bg-surface ring-border"
      }`}
    >
      <div className="flex items-center gap-3">
        {tone === "progress" && <Loader2 className="size-5 shrink-0 animate-spin text-foreground" aria-hidden="true" />}
        {tone === "success" && <CheckCircle2 className="size-5 shrink-0 text-emerald-400" aria-hidden="true" />}
        {tone === "error" && <AlertCircle className="size-5 shrink-0 text-accent" aria-hidden="true" />}
        <p className="flex-1 text-sm font-medium">{status}</p>
        {tone === "success" && uploadedId !== null && (
          <Link
            href={`/watch/${uploadedId}`}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-white"
          >
            <Play className="size-3 fill-current" aria-hidden="true" />
            Watch
          </Link>
        )}
      </div>
      {uploading && (
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Upload progress"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
