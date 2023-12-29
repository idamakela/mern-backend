import 'dotenv/config' // imports and runs a the file
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as authController from './controllers/auth'
import * as postController from './controllers/posts'
import * as commentController from './controllers/comments'
import * as votesController from './controllers/votes'
import validateToken from './middleware/validateToken'

const app = express()

// MIDDLEWARE
app.use(cors())
app.use(express.json())

// HANDLERS
app.post('/register', authController.register)
app.post('/login', authController.logIn)
app.post('/token/refresh', validateToken, authController.refreshJWT)
app.get('/profile', validateToken, authController.profile)

app.post('/posts', validateToken, postController.create)
app.get('/posts', postController.getAllPosts)
app.get('/posts/:id', postController.getPost)
app.delete('/posts/:id', validateToken, postController.deletePost)

// it's possible to use put or patch methods here
app.post('/posts/:postId/upvote', validateToken, votesController.upvote)
app.post('/posts/:postId/downvote', validateToken, votesController.downvote)

app.post('/posts/:postId/comments', validateToken, commentController.createComment)
app.delete('/posts/:postId/comments/:commentId', validateToken, commentController.deleteComment)

// RUN ENV
const mongoURL = process.env.DB_URL
if (!mongoURL) throw Error('Missing database url')

// CONNECT TO DB AND RUN SERVER
mongoose.connect(mongoURL).then(() => {
  const port = parseInt(process.env.PORT || '3001')
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
})
