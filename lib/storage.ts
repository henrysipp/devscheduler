import { put, head, list } from "@vercel/blob";

const FRIENDS = ["henry", "dave", "stephen", "nick", "dre"] as const;
export type Friend = (typeof FRIENDS)[number];
export const friends = FRIENDS;

type AvailabilityData = Record<Friend, string[]>;

export type MeetupInfo = {
  date: string;
  time: string;
  location: string;
} | null;

type StorageData = {
  availability: AvailabilityData;
  meetup: MeetupInfo;
};

const BLOB_NAME = "dev-scheduler-data.json";

// In-memory fallback for local dev without blob credentials
let memoryStore: StorageData = {
  availability: {
    henry: [],
    dave: [],
    stephen: [],
    nick: [],
    dre: [],
  },
  meetup: null,
};

function hasBlobCredentials(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function getData(): Promise<StorageData> {
  if (!hasBlobCredentials()) {
    return memoryStore;
  }

  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) {
      return {
        availability: { henry: [], dave: [], stephen: [], nick: [], dre: [] },
        meetup: null,
      };
    }
    const response = await fetch(blobs[0].url);
    return response.json();
  } catch {
    return {
      availability: { henry: [], dave: [], stephen: [], nick: [], dre: [] },
      meetup: null,
    };
  }
}

async function saveData(data: StorageData): Promise<void> {
  if (!hasBlobCredentials()) {
    memoryStore = data;
    return;
  }

  await put(BLOB_NAME, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function getUserAvailability(user: Friend): Promise<string[]> {
  const data = await getData();
  return data.availability[user] || [];
}

export async function setUserAvailability(
  user: Friend,
  dates: string[]
): Promise<void> {
  const data = await getData();
  data.availability[user] = dates;
  await saveData(data);
}

export async function getAllAvailability(): Promise<AvailabilityData> {
  const data = await getData();
  return data.availability;
}

export async function toggleDateForUser(
  user: Friend,
  date: string
): Promise<string[]> {
  const data = await getData();
  const current = data.availability[user] || [];
  const index = current.indexOf(date);

  if (index === -1) {
    data.availability[user] = [...current, date].sort();
  } else {
    data.availability[user] = current.filter((d) => d !== date);
  }

  await saveData(data);
  return data.availability[user];
}

export async function getMeetup(): Promise<MeetupInfo> {
  const data = await getData();
  return data.meetup;
}

export async function setMeetup(meetup: MeetupInfo): Promise<void> {
  const data = await getData();
  data.meetup = meetup;
  await saveData(data);
}
