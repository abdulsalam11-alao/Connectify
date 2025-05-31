// src/utils/helpers.ts

import { Timestamp } from "firebase/firestore";

// Format Firestore Timestamp to a readable string like '10:45 AM' or 'Yesterday'
export function formatTimestamp(timestamp?: Timestamp | null): string {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day: show time
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return date.toLocaleDateString(undefined, { weekday: "short" }); // e.g. "Mon"
  return date.toLocaleDateString();
}

// Extract initials from a full name
export function getInitials(name: string): string {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
}

// Check if a message is unread by comparing last read timestamp with last message timestamp
export function isMessageUnread(
  lastMessageTime?: Timestamp | null,
  lastRead?: Timestamp | null
): boolean {
  if (!lastMessageTime) return false;
  if (!lastRead) return true; // never read before means unread
  return lastMessageTime.toMillis() > lastRead.toMillis();
}
