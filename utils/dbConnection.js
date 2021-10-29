const { MONGO_HOST, MONGO_DATABASE } = process.env

if (!MONGO_HOST || !MONGO_DATABASE) {
  throw new Error(
    'Please define MONGO_HOST / MONGO_DATABASE environment variable in .env (or .env.local)'
  )
}

export const dbConnection = {
  url: `${MONGO_HOST}/${MONGO_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useFindAndModify: false,
    useCreateIndex: true,
  },
}