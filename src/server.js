import express from 'express'
import session from 'express-session'
import flash from 'connect-flash'
import path from 'path'
import dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import snipRoutes from './routes/snipRoutes.js'
import { connectDB } from './config/db.js'

const app = express()
dotenv.config()

// Determine __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to MongoDB
connectDB()

// Set up EJS view engine with layouts
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layout')

// Middleware to parse form data and serve static files
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Set up session storage and flash messages
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { // Add these security settings
    ttpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}))
app.use(flash())

// Custom middleware: expose flash messages and user data to views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.session.user || null
  next()
})

// Routes for authentication and snippets
app.use('/auth', authRoutes)
app.use('/snippets', snipRoutes)

// Redirect root to snippets list
app.get('/', (req, res) => {
  res.redirect('/snippets')
})

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: '404 Not Found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('500', { title: '500 Internal Server Error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
