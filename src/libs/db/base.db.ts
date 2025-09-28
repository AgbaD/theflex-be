import * as fs from 'fs';
import * as path from 'path';

export enum PROFILE_TYPE { SUPERADMIN = "SUPERADMIN", MANAGER = "MANAGER" }
export enum REVIEW_STATUS { HIDDEN = "HIDDEN", PUBLISHED = "PUBLISHED" }

export interface ReviewCategory {
  category: "cleanliness" | "communication" | "respect_house_rules" | string;
  rating: number;
}
export interface Review {
  id: number;
  type: "host-to-guest" | "guest-to-host" | string;
  status: REVIEW_STATUS;
  rating: number | null;
  publicReview: string | null;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingId: number;
}
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isVerified?: boolean;
  type: PROFILE_TYPE;
}

type CollectionMap = { reviews: Review; users: User; };
type CollectionName = keyof CollectionMap;
export type Where<T> = Partial<T> | ((row: T) => boolean);

const DB_FILE = path.resolve(process.cwd(), 'data', 'db.json');

const defaultDb: { [K in CollectionName]: Array<CollectionMap[K]> } = {
  reviews: [
    {
      id: 7453,
      type: "host-to-guest",
      status: REVIEW_STATUS.HIDDEN,
      rating: null,
      publicReview: "Shane and family are wonderful! Would definitely host again :)",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "respect_house_rules", rating: 10 },
      ],
      submittedAt: "2020-08-21 22:45:14",
      guestName: "Shane Finkelstein",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      listingId: 12345,
    },
    {
      id: 7454,
      type: "host-to-guest",
      status: REVIEW_STATUS.HIDDEN,
      rating: 9,
      publicReview: "Great guest, left the apartment tidy.",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 8 },
        { category: "respect_house_rules", rating: 10 },
      ],
      submittedAt: "2020-08-12 10:30:00",
      guestName: "Emily Carter",
      listingName: "Sunny Loft in Brooklyn",
      listingId: 12346,
    },
    {
      id: 7455,
      type: "guest-to-host",
      status: REVIEW_STATUS.HIDDEN,
      rating: 8,
      publicReview: "Nice place but a bit noisy at night.",
      reviewCategory: [
        { category: "cleanliness", rating: 8 },
        { category: "communication", rating: 7 },
        { category: "respect_house_rules", rating: 9 },
      ],
      submittedAt: "2020-08-05 15:45:00",
      guestName: "Michael Johnson",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      listingId: 12345,
    },
    {
      id: 7456,
      type: "host-to-guest",
      status: REVIEW_STATUS.HIDDEN,
      rating: 10,
      publicReview: "Perfect guest! Highly recommended.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "respect_house_rules", rating: 10 },
      ],
      submittedAt: "2020-08-17 20:15:00",
      guestName: "Sophia Martinez",
      listingName: "Beachfront Condo Miami",
      listingId: 12347,
    },
    {
      id: 7457,
      type: "guest-to-host",
      status: REVIEW_STATUS.HIDDEN,
      rating: 7,
      publicReview: "Good location but the WiFi was weak.",
      reviewCategory: [
        { category: "cleanliness", rating: 7 },
        { category: "communication", rating: 9 },
        { category: "respect_house_rules", rating: 8 },
      ],
      submittedAt: "2020-08-10 09:20:00",
      guestName: "Daniel Lee",
      listingName: "Sunny Loft in Brooklyn",
      listingId: 12346,
    },
    {
      id: 7458,
      type: "host-to-guest",
      status: REVIEW_STATUS.HIDDEN,
      rating: 6,
      publicReview: "Guest was okay but left some trash behind.",
      reviewCategory: [
        { category: "cleanliness", rating: 6 },
        { category: "communication", rating: 7 },
        { category: "respect_house_rules", rating: 6 },
      ],
      submittedAt: "2020-08-25 18:40:00",
      guestName: "Olivia Brown",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      listingId: 12345,
    },
    {
      id: 7459,
      type: "guest-to-host",
      status: REVIEW_STATUS.HIDDEN,
      rating: 9,
      publicReview: "Host was very welcoming and responsive.",
      reviewCategory: [
        { category: "cleanliness", rating: 9 },
        { category: "communication", rating: 10 },
        { category: "respect_house_rules", rating: 9 },
      ],
      submittedAt: "2020-08-14 11:10:00",
      guestName: "William Davis",
      listingName: "Sunny Loft in Brooklyn",
      listingId: 12346,
    },
    {
      id: 7460,
      type: "host-to-guest",
      status: REVIEW_STATUS.HIDDEN,
      rating: 10,
      publicReview: "Super polite and clean guest.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "respect_house_rules", rating: 10 },
      ],
      submittedAt: "2020-08-07 14:00:00",
      guestName: "Ava Wilson",
      listingName: "Luxury Villa in Tuscany",
      listingId: 12349,
    },
    {
      id: 7461,
      type: "guest-to-host",
      status: REVIEW_STATUS.HIDDEN,
      rating: 8,
      publicReview: "Nice host, apartment was clean.",
      reviewCategory: [
        { category: "cleanliness", rating: 8 },
        { category: "communication", rating: 9 },
        { category: "respect_house_rules", rating: 8 },
      ],
      submittedAt: "2020-08-19 19:25:00",
      guestName: "James Thompson",
      listingName: "Beachfront Condo Miami",
      listingId: 12347,
    },
    {
      id: 7462,
      type: "host-to-guest",
      status: REVIEW_STATUS.HIDDEN,
      rating: 5,
      publicReview: "Guest caused some minor issues, would not recommend.",
      reviewCategory: [
        { category: "cleanliness", rating: 5 },
        { category: "communication", rating: 6 },
        { category: "respect_house_rules", rating: 4 },
      ],
      submittedAt: "2020-08-02 08:15:00",
      guestName: "Charlotte Miller",
      listingName: "2B N1 A - 29 Shoreditch Heights",
      listingId: 12345,
    },
  ],
  users: [
    {
      id: 33223,
      firstname: "Dami",
      lastname: "Agba",
      email: "damilareagba1@gmail.com",
      password: "hashed_password",
      isVerified: true,
      type: PROFILE_TYPE.SUPERADMIN,
    },
  ],
};


export let db: { [K in CollectionName]: Array<CollectionMap[K]> } = defaultDb;

function ensureDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}


export function loadDbFromDisk() {
  try {
    ensureDir();
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        db = { ...defaultDb, ...parsed };
      }
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Failed to load DB file; using defaults', e);
    db = defaultDb;
  }
}

let persistTimer: NodeJS.Timeout | null = null;
function persistDbDebounced() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      ensureDir();
      const tmp = DB_FILE + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf-8');
      fs.renameSync(tmp, DB_FILE);
    } catch (e) {
      console.error('Failed to write DB file', e);
    }
  }, 100);
}

function matchesWhere<T>(row: T, where?: Where<T>): boolean {
  if (!where) return true;
  if (typeof where === 'function') return where(row);
  for (const [k, v] of Object.entries(where) as [keyof T, any][]) {
    if ((row as any)[k] !== v) return false;
  }
  return true;
}

export function findAll<K extends CollectionName>(
  collection: K,
  where?: Where<CollectionMap[K]>
): Array<CollectionMap[K]> {
  return db[collection].filter((row) => matchesWhere(row, where));
}

export function findOne<K extends CollectionName>(
  collection: K,
  where: Where<CollectionMap[K]>
): CollectionMap[K] | undefined {
  return db[collection].find((row) => matchesWhere(row, where));
}

export function findOneAndUpdate<K extends CollectionName>(
  collection: K,
  where: Where<CollectionMap[K]>,
  data: Partial<CollectionMap[K]>
): CollectionMap[K] | undefined {
  const idx = db[collection].findIndex((row) => matchesWhere(row, where));
  if (idx === -1) return undefined;
  db[collection][idx] = { ...db[collection][idx], ...data };
  persistDbDebounced();
  return db[collection][idx];
}

export function count<K extends CollectionName>(
  collection: K,
  where?: Where<CollectionMap[K]>
): number {
  return findAll(collection, where).length;
}

export function save<K extends CollectionName>(
  collection: K,
  data: CollectionMap[K]
): CollectionMap[K] {
  db[collection].push(data);
  persistDbDebounced();
  return data;
}

export function findMany<K extends CollectionName>(
  collection: K,
  options?: { where?: Where<CollectionMap[K]>; skip?: number; take?: number; }
): Array<CollectionMap[K]> {
  const { where, skip = 0, take } = options ?? {};
  const rows = db[collection].filter((row) => matchesWhere(row, where));
  const start = Math.max(0, skip);
  const end = take != null ? start + Math.max(0, take) : undefined;
  return rows.slice(start, end);
}

process.on('SIGINT', () => { persistDbDebounced(); setTimeout(() => process.exit(0), 50); });
process.on('SIGTERM', () => { persistDbDebounced(); setTimeout(() => process.exit(0), 50); });
