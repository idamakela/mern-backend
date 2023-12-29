import { Document, Schema, model, MongooseError } from 'mongoose'
import bcrypt from 'bcrypt'

// SCHEMA INTERFACE
interface IUser extends Document {
  userName: string
  password: string
  createdAt: Date
  updatedAt: Date
}

// DB SCHEMA
const UserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
  },
  {
    timestamps: true,
  },
)

// MIDDLEWARE
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    // PASSWORD HASHING
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (error) {
    if (error instanceof MongooseError) next(error)
    else throw error
  }
})

// USER MODEL
const User = model<IUser>('User', UserSchema)

export default User
