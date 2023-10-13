import configs from "configs";
import mongoose from "mongoose";
import logger from "./logger"

/** @type {{ conn: typeof mongoose; promise: Promise<typeof mongoose>}} */
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDb() {
  if (cached.conn) {
    if (cached.conn.readyState === 1){
      return cached.conn;
    }
    cached.conn.close();
  }
  if (!cached.promise) cached.promise = mongoose.connect(configs.mongo_uri, { bufferCommands: true });
  try {
    cached.conn = await cached.promise;
    logger.info('Connected MongoDB');
    cached.conn.connection.on("error", (err) => {
      logger.error('Error on Default MongoDB connection ', err);
    });
  } catch (error) {
    cached.promise = null;
    logger.error(error);
  }
  return cached.conn;
}

function isValidObjectId(id) {
  if (!id) return false;
  if (mongoose.Types.ObjectId.isValid(id)) {
    if ((String)(new mongoose.Types.ObjectId(id)) === id) return true
    return false
  }
  return false
}

/**
 * @template R
 * @param {(session: import("mongoose").ClientSession) => Promise<R>} task 
 */
async function runTransaction(task) {
  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    const result = await task(session);
    await session.commitTransaction()
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export {
  connectDb,
  isValidObjectId,
  runTransaction
};