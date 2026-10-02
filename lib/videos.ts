"use client";

import useSWR from "swr";

export type Video = {
  id: number;
  title: string;
  description: string;
  category: string;
  video_url: string;
  pathname: string;
  created_at: string;
};

export const UPLOAD_CATEGORIES = [
  "General",
  "Entertainment",
  "Education",
  "Technology",
  "Sports",
  "News",
  "Music",
] as const;

async function fetchVideos(url: string): Promise<Video[]> {
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to load videos.");
  }

  return data.videos || [];
}

export function useVideos() {
  const { data, error, isLoading, mutate } = useSWR<Video[]>(
    "/api/videos",
    fetchVideos,
    { revalidateOnFocus: false }
  );

  return {
    videos: data ?? [],
    error: error as Error | undefined,
    isLoading,
    refresh: mutate,
  };
}

export function getCategories(videos: Video[]) {
  const fromData = videos.map((video) => video.category).filter(Boolean);
  return ["All", ...new Set([...UPLOAD_CATEGORIES, ...fromData])];
}

export function formatRelativeDate(value: string) {
  const date = new Date(value);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return formatter.format(-Math.floor(seconds / size), unit);
    }
  }
  return "just now";
}

export function formatDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

export function matchesQuery(video: Video, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [video.title, video.description, video.category]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(needle));
}
