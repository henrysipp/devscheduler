"use client";

import { useCallback, useMemo } from "react";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Badge } from "@/components/ui/badge";
import type { Friend } from "@/lib/storage";

type Availability = Record<Friend, string[]>;

interface CalendarProps {
  currentUser: Friend | null;
  availability: Availability;
  baseMonth: Date;
  onDateClick: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];

  // Fill in empty days before the first of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function MonthGrid({
  year,
  month,
  currentUser,
  availability,
  onDateClick,
}: {
  year: number;
  month: number;
  currentUser: Friend | null;
  availability: Availability;
  onDateClick: (date: string) => void;
}) {
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const today = formatDate(new Date());

  const getAvailableCount = useCallback(
    (dateStr: string): number => {
      return Object.values(availability).filter((dates) =>
        dates.includes(dateStr)
      ).length;
    },
    [availability]
  );

  const isUserAvailable = useCallback(
    (dateStr: string): boolean => {
      if (!currentUser) return false;
      return availability[currentUser]?.includes(dateStr) || false;
    },
    [availability, currentUser]
  );

  return (
    <div className="flex-1">
      <h3 className="mb-3 text-center font-semibold text-mist-900">
        {getMonthName(new Date(year, month))}
      </h3>

      <div className="calendar-grid mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-mist-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const dateStr = formatDate(date);
          const isToday = dateStr === today;
          const isPast = dateStr < today;
          const isAvailable = isUserAvailable(dateStr);
          const count = getAvailableCount(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && onDateClick(dateStr)}
              disabled={isPast || !currentUser}
              className={clsx(
                "relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors",
                isPast && "cursor-not-allowed text-mist-300",
                !isPast && !currentUser && "cursor-not-allowed",
                !isPast &&
                  currentUser &&
                  !isAvailable &&
                  "hover:bg-mist-100 text-mist-700",
                !isPast &&
                  currentUser &&
                  isAvailable &&
                  "bg-mist-800 text-white hover:bg-mist-700",
                isToday && !isAvailable && "ring-2 ring-mist-400 ring-inset"
              )}
            >
              <span>{date.getDate()}</span>
              {count > 0 && !isPast && (
                <Badge
                  color={count >= 3 ? "green" : count >= 2 ? "blue" : "default"}
                  className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]"
                >
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Calendar({
  currentUser,
  availability,
  baseMonth,
  onDateClick,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const firstMonth = baseMonth;
  const secondMonth = new Date(
    baseMonth.getFullYear(),
    baseMonth.getMonth() + 1
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="rounded-lg p-2 text-mist-600 hover:bg-mist-100"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onNextMonth}
          className="rounded-lg p-2 text-mist-600 hover:bg-mist-100"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-8">
        <MonthGrid
          year={firstMonth.getFullYear()}
          month={firstMonth.getMonth()}
          currentUser={currentUser}
          availability={availability}
          onDateClick={onDateClick}
        />
        <div className="hidden sm:block flex-1">
          <MonthGrid
            year={secondMonth.getFullYear()}
            month={secondMonth.getMonth()}
            currentUser={currentUser}
            availability={availability}
            onDateClick={onDateClick}
          />
        </div>
      </div>
    </div>
  );
}
