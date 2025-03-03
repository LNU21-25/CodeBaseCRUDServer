// src/controllers/authCont.js
import User from '../models/user.js'

export const getRegister = (req, res) => {
  res.render('register', { title: 'Register' })
}

export const postRegister = async (req, res) => {
  const { username, password, confirmPass } = req.body
  if (password !== confirmPass) {
    req.flash('error_msg', 'Passwords do not match')
    return res.redirect('/auth/register')
  }
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      req.flash('error_msg', 'Username already exists')
      return res.redirect('/auth/register')
    }
    const newUser = new User({ username, password })
    await newUser.save()
    req.flash('success_msg', 'Registration successful. Please log in.')
    res.redirect('/auth/login')
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Something went wrong')
    res.redirect('/auth/register')
  }
}

export const getLogin = (req, res) => {
  res.render('login', { title: 'Login' })
}

export const postLogin = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) {
      req.flash('error_msg', 'Invalid username or password')
      return res.redirect('/auth/login')
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      req.flash('error_msg', 'Invalid username or password')
      return res.redirect('/auth/login')
    }
    // Store user information in session
    req.session.user = {
      id: user._id,
      username: user.username
    }
    req.flash('success_msg', 'Logged in successfully')
    res.redirect('/snippets')
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Something went wrong')
    res.redirect('/auth/login')
  }
}

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err)
      req.flash('error_msg', 'Error logging out')
      return res.redirect('/snippets')
    }
    res.redirect('/auth/login')
  })
}
