"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Subheading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { updateMeetup } from "@/app/actions";
import type { MeetupInfo } from "@/lib/storage";

interface NextMeetupProps {
  initialMeetup: MeetupInfo;
}

export function NextMeetup({ initialMeetup }: NextMeetupProps) {
  const [meetup, setMeetup] = useState<MeetupInfo>(initialMeetup);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(meetup?.date || "");
  const [time, setTime] = useState(meetup?.time || "");
  const [location, setLocation] = useState(meetup?.location || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const newMeetup = date ? { date, time, location } : null;
    startTransition(async () => {
      await updateMeetup(newMeetup);
      setMeetup(newMeetup);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setDate(meetup?.date || "");
    setTime(meetup?.time || "");
    setLocation(meetup?.location || "");
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (isEditing) {
    return (
      <div className="rounded-xl border border-mist-200 bg-white p-4 sm:p-6">
        <Subheading>Next Meetup</Subheading>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-mist-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mist-700 mb-1">
              Time
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mist-700 mb-1">
              Location
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Dave's house"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleCancel} color="outline" disabled={isPending}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-mist-200 bg-white p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <Subheading>Next Meetup</Subheading>
        <Button onClick={() => setIsEditing(true)} color="outline">
          Edit
        </Button>
      </div>
      {meetup ? (
        <div className="mt-3 space-y-1">
          <p className="text-lg font-medium text-mist-900">
            {formatDate(meetup.date)}
            {meetup.time && ` at ${meetup.time}`}
          </p>
          {meetup.location && (
            <Text>{meetup.location}</Text>
          )}
        </div>
      ) : (
        <Text className="mt-3">No meetup scheduled yet</Text>
      )}
    </div>
  );
}
