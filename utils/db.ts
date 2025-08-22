import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
};

let cached = global.mongoose //cached because this variable will keep our connection cached like if there already exists a connection we'll use that connection and if there is no connection it will create a new one

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
};

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) { 
        cached.promise = mongoose
        .connect(MONGODB_URI)
        .then(() => mongoose.connection)
    }
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn
}
