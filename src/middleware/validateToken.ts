import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  // search for authorization header
  const authHeader = req.headers['authorization'] // looks like: Bearer dfjifösjeisfsi - aka jwt token
  // read JWT
  const token = authHeader && authHeader.split(' ')[1] // if it exists, split the string on space and grab the second element

  if (!token) return res.status(401).json({ message: 'Not authenticated' })

  const secret = process.env.JWT_SECRET
  if (!secret) throw Error('Missing JWT_SECRET')

  // check if JWT is valid
  jwt.verify(token, secret, async (error, decodedPayload) => {
    // callback function at the end, runs at the end
    if (error || !decodedPayload || typeof decodedPayload === 'string') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (!await User.exists({ _id: decodedPayload.userId })) {
      return res.status(403).json({ message: 'Not authorized' })
    } // check if the user and userId is the same

    // read user id from token
    // add userId to req
    req.userId = decodedPayload.userId
    next()
  })
}

export default validateToken
