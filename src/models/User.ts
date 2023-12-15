import { Document, Schema, model, Model, MongooseError } from 'mongoose'
import bcrypt from 'bcrypt'

// define schema interface
interface IUser extends Document {
  userName: string
  password: string
  createdAt: Date
  updatedAt: Date
}

// define db schema
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
      select: false, // can never get password
    },
  },
  {
    // options field
    timestamps: true,
  },
)

// middleware option to run in the schema
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    // passwork hashing for safety
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (error) {
    if (error instanceof MongooseError) next(error)
    else throw error
  }
})

// User model - model<type safety>(model name, what schema)
const User = model<IUser>('User', UserSchema)

export default User
