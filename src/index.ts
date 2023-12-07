import 'dotenv/config' //imports and runs a the file
import express from 'express'
import mongoose from 'mongoose'
import * as authController from './controllers/auth'

const app = express()

// middelware - functions to handle reqs
app.use(express.json())

app.post('/register', authController.register) // handle user reqistration
app.post('login', authController.logIn) // handle login

// use env and error handling
const mongoURL = process.env.DB_URL
if (!mongoURL) throw Error('Missing database url')

// if db is started, open the server
// call mongoose.connect(connect to db / my db name).then(start server)
mongoose.connect(mongoURL).then(() => {
  // parseInt makes string to int (aka number), ts requires defualt value
  const port = parseInt(process.env.PORT || '3001')
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
})
