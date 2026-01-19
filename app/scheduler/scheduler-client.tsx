"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/calendar";
import { AvailabilityLegend } from "@/components/availability-legend";
import { NextMeetup } from "@/components/next-meetup";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Field, Label } from "@/components/ui/fieldset";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { toggleAvailability, logout } from "@/app/actions";
import { friends, type Friend, type MeetupInfo } from "@/lib/storage";

type Availability = Record<Friend, string[]>;

interface SchedulerClientProps {
  initialAvailability: Availability;
  initialMeetup: MeetupInfo;
}

const FRIEND_DISPLAY_NAMES: Record<Friend, string> = {
  henry: "Henry",
  dave: "Dave",
  stephen: "Stephen",
  nick: "Nick",
  dre: "Dre",
};

export function SchedulerClient({ initialAvailability, initialMeetup }: SchedulerClientProps) {
  const router = useRouter();
  const [availability, setAvailability] =
    useState<Availability>(initialAvailability);
  const [currentUser, setCurrentUser] = useState<Friend | null>(null);
  const [baseMonth, setBaseMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [isPending, startTransition] = useTransition();

  const handleDateClick = useCallback(
    (date: string) => {
      if (!currentUser) return;

      startTransition(async () => {
        const updated = await toggleAvailability(currentUser, date);
        setAvailability((prev) => ({
          ...prev,
          [currentUser]: updated,
        }));
      });
    },
    [currentUser]
  );

  const handlePrevMonth = useCallback(() => {
    setBaseMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setBaseMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleUserChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setCurrentUser(value ? (value as Friend) : null);
    },
    []
  );

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await logout();
      router.push("/");
    });
  }, [router]);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Heading>Dev Scheduler</Heading>
            <Text className="mt-1">
              Select your name and click dates to mark your availability
            </Text>
          </div>
          <Button onClick={handleLogout} color="outline" disabled={isPending}>
            Sign Out
          </Button>
        </header>

        <div className="mb-6">
          <NextMeetup initialMeetup={initialMeetup} />
        </div>

        <div className="mb-6">
          <Field>
            <Label>Who are you?</Label>
            <Select
              value={currentUser || ""}
              onChange={handleUserChange}
              className="mt-2 max-w-xs"
            >
              <option value="">Select your name</option>
              {friends.map((friend) => (
                <option key={friend} value={friend}>
                  {FRIEND_DISPLAY_NAMES[friend]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="rounded-xl border border-mist-200 bg-white p-4 sm:p-6">
          <Calendar
            currentUser={currentUser}
            availability={availability}
            baseMonth={baseMonth}
            onDateClick={handleDateClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>

        <div className="mt-6">
          <AvailabilityLegend availability={availability} />
        </div>

        {isPending && (
          <div className="mt-4">
            <Text className="text-mist-400">Saving...</Text>
          </div>
        )}
      </div>
    </div>
  );
}
