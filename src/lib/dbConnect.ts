import mongoose from 'mongoose';

// This helps cache the database connection
// In a serverless environment (like Next.js API routes),
// the connection might be re-established on each function invocation.
// Caching it avoids this performance hit.
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as { mongoose?: CachedConnection }).mongoose;

if (!cached) {
  cached = (global as { mongoose: CachedConnection }).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we already have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is not already in progress, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection promise to resolve and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Return the connection
  return cached.conn;
}

export default dbConnect;