const mongoose = require('mongoose')
const env = require('dotenv')
env.config()
// require('dotenv').config()

// //mongodb connect URL
const mongoURL = process.env.MONGODB_LOCAL_URL
// const mongoURL = process.env.MONGODB_ATLAS_URL

//set up mongodb connection
mongoose.connect(mongoURL)

//get the default connection
//mongoose maintains a default connection object representing the mongoDB connection.
const db = mongoose.connection

//define event listener for database connection
db.on('connected', () => {
  console.log('Connect to mongoDB server')
})

db.on('error', (err) => {
  console.log('MongoDB connection error', err)
})

db.on('disconnected', () => {
  console.log('Disconnect to mongoDB server')
})

module.exports = db
