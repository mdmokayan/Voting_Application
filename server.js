const express = require('express')
const app = express()
const db = require('./db')

// require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.json()) //req.body

app.get('/', (req, res) => {
  res.send('Welcome to my voting app')
})

//   const {jwtAuthMiddleware} = require('./jwt')

// Import the router files and use the router
const userRoute = require('./routes/userRoutes')
app.use('/user', userRoute) // use the router

const candidateRoute = require('./routes/candidateRoutes')
app.use('/candidate', candidateRoute) // use the router

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('listening on port 3000')
})
