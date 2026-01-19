"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAllAvailability,
  toggleDateForUser,
  getMeetup,
  setMeetup,
  type Friend,
  type MeetupInfo,
  friends,
} from "@/lib/storage";

const PASSWORD = process.env.APP_PASSWORD || "devmeetup";
const AUTH_COOKIE = "dev-scheduler-auth";

export async function login(formData: FormData): Promise<{ error?: string }> {
  const password = formData.get("password") as string;

  if (password !== PASSWORD) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect("/scheduler");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE);
  return auth?.value === "authenticated";
}

export async function toggleAvailability(
  user: Friend,
  date: string
): Promise<string[]> {
  if (!friends.includes(user)) {
    throw new Error("Invalid user");
  }

  return toggleDateForUser(user, date);
}

export async function getAvailability() {
  return getAllAvailability();
}

export async function getNextMeetup() {
  return getMeetup();
}

export async function updateMeetup(meetup: MeetupInfo) {
  await setMeetup(meetup);
  return meetup;
}
