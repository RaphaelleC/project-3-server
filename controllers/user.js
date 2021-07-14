import User from '../models/user.js'
import { NotValid } from '../lib/errors.js'
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'

async function register(req, res, next) {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (e) {
    next(e)
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email })

    // console.log(user)

    if (!user) {
      throw new NotValid('There was a problem logging in')
    }
    const isValidPw = user.validatePassword(req.body.password)
    if (!isValidPw) {
      throw new NotValid('There was a problem logging in')
    }

    const token = jwt.sign(
      { sub: user._id },
      secret,
      { expiresIn: '12h' }
    )

    console.log('Success!')
    res.status(202).json({ message: 'Login successful', token })

  } catch (e) {
    next(e)
  }
}

export default {
  register, 
  login,
}