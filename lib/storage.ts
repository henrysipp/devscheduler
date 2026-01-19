import { kv } from "@vercel/kv";

const FRIENDS = ["henry", "dave", "stephen", "nick", "dre"] as const;
export type Friend = (typeof FRIENDS)[number];
export const friends = FRIENDS;

type AvailabilityData = Record<Friend, string[]>;

// In-memory fallback store for local development without KV credentials
const memoryStore: AvailabilityData = {
  henry: [],
  dave: [],
  stephen: [],
  nick: [],
  dre: [],
};

function hasKVCredentials(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getUserAvailability(user: Friend): Promise<string[]> {
  if (!hasKVCredentials()) {
    return memoryStore[user] || [];
  }

  const data = await kv.get<string[]>(`availability:${user}`);
  return data || [];
}

export async function setUserAvailability(
  user: Friend,
  dates: string[]
): Promise<void> {
  if (!hasKVCredentials()) {
    memoryStore[user] = dates;
    return;
  }

  await kv.set(`availability:${user}`, dates);
}

export async function getAllAvailability(): Promise<AvailabilityData> {
  const result: AvailabilityData = {
    henry: [],
    dave: [],
    stephen: [],
    nick: [],
    dre: [],
  };

  for (const friend of FRIENDS) {
    result[friend] = await getUserAvailability(friend);
  }

  return result;
}

export async function toggleDateForUser(
  user: Friend,
  date: string
): Promise<string[]> {
  const current = await getUserAvailability(user);
  const index = current.indexOf(date);

  let updated: string[];
  if (index === -1) {
    updated = [...current, date].sort();
  } else {
    updated = current.filter((d) => d !== date);
  }

  await setUserAvailability(user, updated);
  return updated;
}
