import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { assertDefine } from '../utils/asserts'

export const register = async (req: Request, res: Response) => {
  // read var from req body
  const { username, password } = req.body

  try {
    if (await User.findOne({ userName: username })) {
      return res.status(400).json({ message: 'Username taken' })
    }

    // post to User and wait for save
    const user = new User({ userName: username, password })
    await user.save()

    res.status(201).json({ userName: username, id: user._id })
  } catch (error) {
    console.log(error)
    res.status(500).json('Internal Server Error')
  }
}

export const logIn = async (req: Request, res: Response) => {
  console.log(req.userId)
  try {
    // ta in användarnamn och lösen
    const { username, password } = req.body

    // hitta användare
    const user = await User.findOne({ userName: username }, '+password')

    // safe error handling - user or password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Wrong username or password' })
    }

    assertDefine(process.env.JWT_SECRET)

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) // expiresIn = removes token after one hour

    assertDefine(process.env.REFRESH_JWT_SECRET)

    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_JWT_SECRET, {
      expiresIn: '1d',
    })

    res.status(200).json({ token, refreshToken, username: user.userName })
  } catch (error) {
    console.log('Error in login', error)
    res.status(500).json({
      message: 'Something blew up',
    })
  }
}

export const refreshJWT = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  // refresh token
  const refreshSecret = process.env.REFRESH_JWT_SECRET
  if (!refreshSecret) {
    throw Error('Missing JWT_SECRET')
  }

  try {
    const decodedPayload = jwt.verify(refreshToken, refreshSecret) as {
      userId: string
    }

    const secret = process.env.JWT_SECRET
    assertDefine(secret) // to shorten the code and check if the value exist
    
    // returnera JWT
    const token = jwt.sign({ userId: decodedPayload.userId }, secret, {
      expiresIn: '1h',
    }) // expiresIn = removes token after one hour

    return res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    return res.status(403).json({ message: 'Invalid token refresh' })
  }
}

export const profile = async (req: Request, res: Response) => {
  const { userId } = req

  const user = await User.findById(userId)

  if (!user) {
    console.log('User not found with id: ', userId)
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(200).json({
    userName: user.userName,
  })
}
