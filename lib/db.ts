import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

declare global {
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, mongod: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (MONGODB_URI) {
      console.log("Connecting to standard MongoDB...");
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    } else {
      console.log("No MONGODB_URI found. Initializing MongoDB Memory Server...");
      cached.promise = (async () => {
        if(!cached.mongod) {
           cached.mongod = await MongoMemoryServer.create();
        }
        const uri = cached.mongod.getUri();
        const m = await mongoose.connect(uri, opts);
        return m;
      })();
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
