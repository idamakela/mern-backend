import { Request, Response } from 'express'
import Post from '../models/Post'
import { assertDefine } from '../utils/asserts'

// CRUD controller for Posts
export const create = async (req: Request, res: Response) => {
  assertDefine(req.userId) // to make sure the code only runs when a userId is defined.
  const { title, link, body } = req.body

  const post = new Post({
    title,
    link,
    body,
    author: req.userId,
  })

  try {
    const savedPost = await post.save()
    res.status(201).json({ savedPost })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to create post' })
  }
}

export const readAll = async (req: Request, res: Response) => {
  // get all posts and find author name from userId
  const posts = await Post.find().populate('author', 'userName')

  res.status(200).json(posts)
}
