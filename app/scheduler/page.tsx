import { redirect } from "next/navigation";
import { isAuthenticated, getAvailability, getNextMeetup } from "@/app/actions";
import { SchedulerClient } from "./scheduler-client";

export default async function SchedulerPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/");
  }

  const [availability, meetup] = await Promise.all([
    getAvailability(),
    getNextMeetup(),
  ]);

  return (
    <SchedulerClient initialAvailability={availability} initialMeetup={meetup} />
  );
}
