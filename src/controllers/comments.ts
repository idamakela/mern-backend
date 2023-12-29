import { Request, Response } from 'express'
import Post from '../models/Post'
import { assertDefine } from '../utils/asserts'

export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params
  const { userId } = req
  assertDefine(userId)
  const { commentBody } = req.body

  const post = await Post.findById(postId)

  if (!post) {
    return res.status(404).json({ message: 'No post found with id: ' + postId })
  }

  post.comments.push({
    body: commentBody,
    author: userId,
  })

  const savedPost = await post.save()

  return res.status(201).json(savedPost)
}

export const deleteComment = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  const { userId } = req;
  assertDefine(userId);

  const post = await Post.findById(postId);

  if (!post) {
    return res
      .status(404)
      .json({ message: "Not post found for id: " + postId });
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return res
      .status(404)
      .json({ message: "Not comment found for id: " + commentId });
  }

  if (comment.author.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  comment.deleteOne();

  const updatedPost = await post.save();

  return res.status(200).json(updatedPost);
}
