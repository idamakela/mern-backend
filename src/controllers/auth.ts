import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/Users'

export const register = async (req: Request, res: Response) => {
  // read var from req body
  const { username, password } = req.body

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username taken' })
    }

    // post to User and wait for save
    const user = new User({ userName: username, password })
    await user.save()

    res.status(200).json({ userName: username, id: user._id })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
}

export const logIn = async (req: Request, res: Response) => {
  try {
    // ta in användarnamn och lösen
    const { username, password } = req.body

    // hitta användare
    const user = await User.findOne({ userName: username })

    // safe error handling - user or password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Wrong username or password' })
    }

    // returnera JWT
    const secret = process.env.JWT_SECRET
    if (!secret) throw Error('Missing JWT_SECRET')

    const token = jwt.sign({ userId: user._id }, secret)

    res.status(200).json({ token, username: user.userName })
  } catch (error) {
    res.status(500).json({
      message: 'Something blew up',
    })
  }
}
