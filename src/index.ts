import 'dotenv/config' //imports and runs a the file
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as authController from './controllers/auth'
import * as postController from './controllers/posts'
import * as commentController from './controllers/comments'
import * as votesController from './controllers/votes'
import validateToken from './middleware/validateToken'

const app = express()

// MIDDELWARE - functions to handle reqs
app.use(cors())
app.use(express.json())

// HANDLERS
app.post('/register', authController.register) // handle user reqistration
app.post('/login', authController.logIn) // handle login
app.post('/token/refresh', validateToken, authController.refreshJWT)
app.get('/profile', validateToken, authController.profile) // handle profile with middleware

app.post('/posts', validateToken, postController.create) // handle create post
app.get('/posts', postController.getAllPosts) // handle read all posts
app.get('/posts/:id', postController.getPost)
app.delete('/posts/:id', validateToken, postController.deletePost)

// it's possible to use put or patch methods here
app.post('/posts/:postId/upvote', validateToken, votesController.upvote)
app.post('/posts/:postId/downvote', validateToken, votesController.downvote)

app.post('/posts/:postId/comments', validateToken, commentController.createComment)
app.delete('/posts/:postId/comments/:commentId', validateToken, commentController.deleteComment)

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
