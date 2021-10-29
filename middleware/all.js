import nextConnect from 'next-connect'
import database from './database'
// import passport from './passport'

const all = nextConnect()

all.use(database)//.use(passport.initialize())

export default all