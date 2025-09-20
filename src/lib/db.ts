import fs from 'fs/promises';
import path from 'path';

// Optional Prisma client. We lazy-load to avoid requiring it in file-DB mode.
let prismaClient: any = null;
async function getPrisma() {
  if (prismaClient) return prismaClient;
  try {
    // dynamic import so users without prisma/client installed can still run file DB
    const pkg = await import('@prisma/client');
    prismaClient = new pkg.PrismaClient();
    return prismaClient;
  } catch (err) {
    return null;
  }
}

type ISODate = string;

export interface UserRecord {
  id: string;
  phone: string;
  name?: string | null;
  email?: string | null;
  gender?: string | null;
  dob?: string | null;
  referralCode: string;
  referredByCode?: string | null;
  referralName?: string | null;
  referralCount?: number;
  referredUsers?: string[];
  addresses: any[];
  dietaryPreference?: string | null;
  sector?: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface OrderRecord {
  id: string;
  userId: string;
  items: any[];
  status: string;
  deliveryDate?: string | null;
  deliverySlot?: any;
  deliveryAddress?: any;
  paymentMethod?: any;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  total?: number;
  specialInstructions?: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

interface DbShape {
  users: UserRecord[];
  orders: OrderRecord[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

async function ensureDb() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch (_) {
      const initial: DbShape = { users: [], orders: [] };
      await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    }
  } catch (err) {
    throw new Error('Failed to ensure DB file: ' + (err as Error).message);
  }
}

async function readDb(): Promise<DbShape> {
  // If DATABASE_URL is set, read via Prisma
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available. Run `npm install` to add @prisma/client');
    // Build a DbShape-like structure from Prisma models for compatibility
    const users = await prisma.user.findMany();
    const orders = await prisma.order.findMany();
    return { users: users as any[], orders: orders as any[] } as DbShape;
  }

  await ensureDb();
  const raw = await fs.readFile(DB_FILE, 'utf8');
  try {
    return JSON.parse(raw) as DbShape;
  } catch (err) {
    // reset file if corrupted
    const initial: DbShape = { users: [], orders: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

async function writeDb(db: DbShape) {
  // If DATABASE_URL is set, write via Prisma
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available. Run `npm install` to add @prisma/client');
    // sync users
    for (const u of db.users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          phone: u.phone,
          name: u.name ?? null,
          email: u.email ?? null,
          gender: u.gender ?? null,
          dob: u.dob ?? null,
          referralCode: u.referralCode,
          referredByCode: u.referredByCode ?? null,
          referralName: u.referralName ?? null,
          referralCount: u.referralCount ?? 0,
          referredUsers: u.referredUsers ?? [],
          addresses: u.addresses ?? [],
          dietaryPref: u.dietaryPreference ?? null,
          sector: u.sector ?? null,
        },
        create: {
          id: u.id,
          phone: u.phone,
          name: u.name ?? null,
          email: u.email ?? null,
          gender: u.gender ?? null,
          dob: u.dob ?? null,
          referralCode: u.referralCode,
          referredByCode: u.referredByCode ?? null,
          referralName: u.referralName ?? null,
          referralCount: u.referralCount ?? 0,
          referredUsers: u.referredUsers ?? [],
          addresses: u.addresses ?? [],
          dietaryPref: u.dietaryPreference ?? null,
          sector: u.sector ?? null,
        }
      });
    }
    // sync orders
    for (const o of db.orders) {
      await prisma.order.upsert({
        where: { id: o.id },
        update: {
          userId: o.userId,
          items: o.items ?? [],
          status: o.status ?? 'pending',
          deliveryDate: o.deliveryDate ?? null,
          deliverySlot: o.deliverySlot ?? null,
          deliveryAddress: o.deliveryAddress ?? null,
          paymentMethod: o.paymentMethod ?? null,
          subtotal: o.subtotal ?? 0,
          deliveryFee: o.deliveryFee ?? 0,
          tax: o.tax ?? 0,
          total: o.total ?? 0,
          specialInstructions: o.specialInstructions ?? null,
        },
        create: {
          id: o.id,
          userId: o.userId,
          items: o.items ?? [],
          status: o.status ?? 'pending',
          deliveryDate: o.deliveryDate ?? null,
          deliverySlot: o.deliverySlot ?? null,
          deliveryAddress: o.deliveryAddress ?? null,
          paymentMethod: o.paymentMethod ?? null,
          subtotal: o.subtotal ?? 0,
          deliveryFee: o.deliveryFee ?? 0,
          tax: o.tax ?? 0,
          total: o.total ?? 0,
          specialInstructions: o.specialInstructions ?? null,
        }
      });
    }
    return;
  }

  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function genId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function genReferralCode() {
  // Pattern: MEAL + 6 numeric digits (e.g. MEAL123456)
  const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return 'MEAL' + num;
}

// Generate a referral code and ensure it's unique within the DB.
async function genUniqueReferralCode(): Promise<string> {
  const db = await readDb();
  let tries = 0;
  while (tries < 10000) {
    const code = genReferralCode();
    const exists = db.users.some((u) => u.referralCode === code);
    if (!exists) return code;
    tries++;
  }
  throw new Error('Unable to generate unique referral code');
}

export async function getUserByPhone(phone: string): Promise<UserRecord | null> {
  const p = phone.replace(/\D/g, '');
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const user = await prisma.user.findUnique({ where: { phone: p } });
    return user as UserRecord | null;
  }
  const db = await readDb();
  const user = db.users.find((u) => u.phone === p) || null;
  return user;
}

export async function createUser(phone: string, profile: Partial<UserRecord> = {}): Promise<UserRecord> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');

    // Try to find existing
    let existing = await prisma.user.findUnique({ where: { phone: cleanPhone } });

    if (existing) {
      // Merge fields
      const addressesFromProfile = (profile as any).addresses ?? (profile as any).address ? [ (profile as any).address ] : undefined;
      const mergedReferralCode = existing.referralCode || profile.referralCode || await genUniqueReferralCode();
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: profile.name ?? existing.name,
          email: profile.email ?? existing.email,
          gender: profile.gender ?? existing.gender,
          dob: profile.dob ?? existing.dob,
          referralCode: mergedReferralCode,
          referredByCode: profile.referredByCode ?? existing.referredByCode,
          referralName: (profile as any).referralName ?? existing.referralName,
          addresses: addressesFromProfile ?? existing.addresses,
          dietaryPref: profile.dietaryPreference ?? existing.dietaryPref,
          sector: profile.sector ?? existing.sector,
        }
      });
      return updated as UserRecord;
    }

    // create new user
    const addressesFromProfile = (profile as any).addresses ?? (profile as any).address ? [ (profile as any).address ] : [];
    const newReferralCode = profile.referralCode || await genUniqueReferralCode();
    const created = await prisma.user.create({
      data: {
        id: genId('u_'),
        phone: cleanPhone,
        name: profile.name ?? null,
        email: profile.email ?? null,
        gender: profile.gender ?? null,
        dob: profile.dob ?? null,
        referralCode: newReferralCode,
        referredByCode: profile.referredByCode ?? null,
        referralName: (profile as any).referralName ?? null,
        addresses: addressesFromProfile,
        dietaryPref: profile.dietaryPreference ?? null,
        sector: profile.sector ?? null,
        referralCount: 0,
        referredUsers: [],
      }
    });

    // Update referrer if present
    try {
      const refCode = (profile as any).referredByCode ?? (profile as any).referredBy;
      if (refCode) {
        const refUser = await prisma.user.findUnique({ where: { referralCode: refCode } });
        if (refUser) {
          const updatedRef = await prisma.user.update({
            where: { id: refUser.id },
            data: {
              referredUsers: { push: created.id },
              referralCount: (refUser.referralCount ?? 0) + 1,
            }
          });
        }
      }
    } catch (err) {
      console.warn('Referral bookkeeping failed:', err);
    }

    return created as UserRecord;
  }

  // file DB fallback
  const db = await readDb();
  let existing = db.users.find((u) => u.phone === cleanPhone);
  const now = new Date().toISOString();
  if (existing) {
    // Merge any provided non-null profile fields into existing user and persist
    // Normalize addresses: accept `address` (string) or `addresses` (array)
    const addressesFromProfile = profile.addresses ?? (profile as any).address ? [ (profile as any).address ] : undefined;

    // determine referral code for merged user, prefer existing or provided, otherwise generate unique
    let mergedReferralCode = existing.referralCode || profile.referralCode;
    if (!mergedReferralCode) mergedReferralCode = await genUniqueReferralCode();

    const merged: UserRecord = {
      ...existing,
      name: profile.name ?? existing.name,
      email: profile.email ?? existing.email,
      gender: profile.gender ?? existing.gender,
      dob: profile.dob ?? existing.dob,
      referralCode: mergedReferralCode,
      referredByCode: profile.referredByCode ?? existing.referredByCode,
      referralName: (profile as any).referralName ?? existing.referralName,
      addresses: addressesFromProfile ?? existing.addresses ?? [],
      dietaryPreference: profile.dietaryPreference ?? existing.dietaryPreference,
      sector: profile.sector ?? existing.sector,
      referralCount: existing.referralCount ?? 0,
      referredUsers: existing.referredUsers ?? [],
      updatedAt: now,
    } as UserRecord;
    const idx = db.users.findIndex((u) => u.id === existing!.id);
    db.users[idx] = merged;
    await writeDb(db);
    return merged;
  }

  // Normalize addresses: accept `address` (string) or `addresses` (array)
  const addressesFromProfile = profile.addresses ?? (profile as any).address ? [ (profile as any).address ] : [];

  // determine referral code for new user, prefer provided or generate unique
  const newReferralCode = profile.referralCode || await genUniqueReferralCode();

  const userObj: any = {
    id: genId('u_'),
    phone: cleanPhone,
    name: profile.name ?? null,
    dob: profile.dob ?? null,
    referralCode: newReferralCode,
    referredByCode: profile.referredByCode ?? null,
    referralName: (profile as any).referralName ?? null,
    addresses: addressesFromProfile,
    dietaryPreference: profile.dietaryPreference ?? null,
    sector: profile.sector ?? null,
    referralCount: 0,
    referredUsers: [],
    createdAt: now,
    updatedAt: now,
  } as UserRecord;

  // Omit email/gender if not provided to keep JSON tidy
  if (profile.email != null) userObj.email = profile.email;
  if (profile.gender != null) userObj.gender = profile.gender;

  const user: UserRecord = userObj as UserRecord;

  db.users.push(user);
  await writeDb(db);

  // If this new user was created with a referredByCode, update the referrer's record
  try {
    const refCode = (profile as any).referredByCode ?? (profile as any).referredBy;
    if (refCode) {
      const refIdx = db.users.findIndex((u) => u.referralCode === refCode);
      if (refIdx !== -1) {
        const refUser = db.users[refIdx];
        const referredUsers = refUser.referredUsers ?? [];
        if (!referredUsers.includes(user.id)) {
          referredUsers.push(user.id);
          refUser.referredUsers = referredUsers;
          refUser.referralCount = (refUser.referralCount ?? 0) + 1;
          refUser.updatedAt = now;
          db.users[refIdx] = refUser;
          await writeDb(db);
        }
      }
    }
  } catch (err) {
    // fail silently on referral bookkeeping to avoid breaking user creation
    console.warn('Referral bookkeeping failed:', err);
  }

  return user;
}

export async function updateUser(userId: string, patch: Partial<UserRecord>): Promise<UserRecord | null> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;
    const updated = await prisma.user.update({ where: { id: userId }, data: { ...patch } });
    return updated as UserRecord;
  }
  const db = await readDb();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  db.users[idx] = { ...db.users[idx], ...patch, updatedAt: now } as UserRecord;
  await writeDb(db);
  return db.users[idx];
}

export async function createOrder(order: Partial<OrderRecord>): Promise<OrderRecord> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const created = await prisma.order.create({
      data: {
        id: genId('o_'),
        userId: order.userId as string,
        items: order.items ?? [],
        status: order.status ?? 'pending',
        deliveryDate: order.deliveryDate ?? null,
        deliverySlot: order.deliverySlot ?? null,
        deliveryAddress: order.deliveryAddress ?? null,
        paymentMethod: order.paymentMethod ?? null,
        subtotal: order.subtotal ?? 0,
        deliveryFee: order.deliveryFee ?? 0,
        tax: order.tax ?? 0,
        total: order.total ?? 0,
        specialInstructions: order.specialInstructions ?? null,
      }
    });
    return created as OrderRecord;
  }
  const db = await readDb();
  const now = new Date().toISOString();
  const o: OrderRecord = {
    id: genId('o_'),
    userId: order.userId as string,
    items: order.items || [],
    status: order.status || 'pending',
    deliveryDate: order.deliveryDate ?? null,
    deliverySlot: order.deliverySlot ?? null,
    deliveryAddress: order.deliveryAddress ?? null,
    paymentMethod: order.paymentMethod ?? null,
    subtotal: order.subtotal ?? 0,
    deliveryFee: order.deliveryFee ?? 0,
    tax: order.tax ?? 0,
    total: order.total ?? 0,
    specialInstructions: order.specialInstructions ?? null,
    createdAt: now,
    updatedAt: now,
  };
  db.orders.push(o);
  await writeDb(db);
  return o;
}

export async function getOrdersByUserId(userId: string): Promise<OrderRecord[]> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const orders = await prisma.order.findMany({ where: { userId } });
    return orders as OrderRecord[];
  }
  const db = await readDb();
  return db.orders.filter((o) => o.userId === userId);
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    return order as OrderRecord | null;
  }
  const db = await readDb();
  return db.orders.find((o) => o.id === orderId) || null;
}

export async function updateOrder(orderId: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) return null;
    const updated = await prisma.order.update({ where: { id: orderId }, data: { ...patch } });
    return updated as OrderRecord;
  }
  const db = await readDb();
  const idx = db.orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  db.orders[idx] = { ...db.orders[idx], ...patch, updatedAt: now } as OrderRecord;
  await writeDb(db);
  return db.orders[idx];
}

export async function listAllUsers(): Promise<UserRecord[]> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const users = await prisma.user.findMany();
    return users as UserRecord[];
  }
  const db = await readDb();
  return db.users;
}

export async function listAllOrders(): Promise<OrderRecord[]> {
  if (process.env.DATABASE_URL) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error('Prisma client not available');
    const orders = await prisma.order.findMany();
    return orders as OrderRecord[];
  }
  const db = await readDb();
  return db.orders;
}
