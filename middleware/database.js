import mongoose from 'mongoose'
import { dbConnection } from '../utils/dbConnection'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function database(req, res, next) {
  if (cached.conn) {
    return next()
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(dbConnection.url, dbConnection.options)
      .then((mongoose) => {
        // console.log("🟢 The database is connected.")
        return mongoose
      }).catch((error) => {
        // console.log(`🔴 Unable to connect to the database: ${error}.`)
        throw new Error(
          `Unable to connect to the database: ${error}.`
        )
      })
  }
  cached.conn = await cached.promise
  return next()
}

export default database