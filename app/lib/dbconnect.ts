
import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI!;   // <-- FIX: Enforced string

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type safely
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Reuse in hot reload
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export default async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn; // Return active connection

  if (!cached.promise) {
    const opts: ConnectOptions = { bufferCommands: false };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}
