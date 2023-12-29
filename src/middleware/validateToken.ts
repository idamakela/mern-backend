import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw Error('Missing JWT_SECRET')
  }

  jwt.verify(token, secret, async (error, decodedPayload) => {
    if (!decodedPayload) {
      return res.status(403).json({ message: 'Not authorized, not exists' })
    }

    if (typeof decodedPayload === 'string') {
      return res.status(403).json({ message: 'Not authorized, type error' })
    }

    if (error) {
      return res.status(403).json({ message: 'Not authorized error' })
    }

    if (!(await User.exists({ _id: decodedPayload.userId }))) {
      return res.status(403).json({ message: 'Not authorized, wrong user' })
    }

    req.userId = decodedPayload.userId
    next()
  })
}

export default validateToken
