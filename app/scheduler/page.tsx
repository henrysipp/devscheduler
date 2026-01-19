import { redirect } from "next/navigation";
import { isAuthenticated, getAvailability } from "@/app/actions";
import { SchedulerClient } from "./scheduler-client";

export default async function SchedulerPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/");
  }

  const availability = await getAvailability();

  return <SchedulerClient initialAvailability={availability} />;
}
