import type { Metadata } from "next";
import { ProfileView } from "@/components/profile-view";

export const metadata: Metadata = {
  title: "Your Studio",
  description: "Manage and review every video in your channel.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
