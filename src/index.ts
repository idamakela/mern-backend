import 'dotenv/config' //imports and runs a the file
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as authController from './controllers/auth'
import * as postController from './controllers/posts'
import validateToken from './middleware/validateToken'

const app = express()

// middelware - functions to handle reqs
app.use(cors())
app.use(express.json())

app.post('/register', authController.register) // handle user reqistration
app.post('/login', authController.logIn) // handle login
app.get('/profile', validateToken, authController.profile) // handle profile with middleware

app.post('/posts', validateToken, postController.create) // handle create post
app.get('/posts', postController.readAll) // handle read all posts


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
