import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import authRoutes from './src/routes/authRoutes.js'
import snippetRoutes from './src/routes/snippetRoutes.js'
import { connectDB } from './src/config/db.js'

const app = express()
connectDB() // Connect to MongoDB

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}))

app.use(flash())

app.use('/auth', authRoutes)
app.use('/snippets', snippetRoutes)

app.use((req, res) => res.status(404).send('Not Found'))
app.use((err, req, res, next) => res.status(500).send('Internal Server Error'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
