"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Subheading } from "@/components/ui/heading";
import type { Friend } from "@/lib/storage";

type Availability = Record<Friend, string[]>;

interface AvailabilityLegendProps {
  availability: Availability;
}

const FRIEND_DISPLAY_NAMES: Record<Friend, string> = {
  henry: "Henry",
  dave: "Dave",
  stephen: "Stephen",
  nick: "Nick",
  dre: "Dre",
};

type DateSummary = {
  date: string;
  friends: Friend[];
};

export function AvailabilityLegend({ availability }: AvailabilityLegendProps) {
  const dateSummaries = useMemo(() => {
    const dateMap = new Map<string, Friend[]>();

    for (const [friend, dates] of Object.entries(availability) as [
      Friend,
      string[]
    ][]) {
      for (const date of dates) {
        const existing = dateMap.get(date) || [];
        dateMap.set(date, [...existing, friend]);
      }
    }

    const summaries: DateSummary[] = [];
    for (const [date, friends] of dateMap) {
      summaries.push({ date, friends });
    }

    // Sort by number of friends (desc), then by date (asc)
    return summaries.sort((a, b) => {
      if (b.friends.length !== a.friends.length) {
        return b.friends.length - a.friends.length;
      }
      return a.date.localeCompare(b.date);
    });
  }, [availability]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (dateSummaries.length === 0) {
    return (
      <div className="rounded-lg border border-mist-200 bg-white p-4">
        <Text>No availability marked yet. Select your name and click dates!</Text>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-mist-200 bg-white p-4">
      <Subheading>Availability Summary</Subheading>
      <div className="mt-4 space-y-3">
        {dateSummaries.map(({ date, friends }) => (
          <div
            key={date}
            className="flex items-start justify-between gap-4 border-b border-mist-100 pb-3 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="font-medium text-mist-900">{formatDate(date)}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {friends.map((friend) => (
                  <Badge
                    key={friend}
                    color={friends.length >= 3 ? "green" : "default"}
                  >
                    {FRIEND_DISPLAY_NAMES[friend]}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge
              color={
                friends.length >= 4
                  ? "green"
                  : friends.length >= 3
                  ? "blue"
                  : "default"
              }
            >
              {friends.length}/5
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
