// src/routes/snippetRoutes.js
import express from 'express'
import {
  getAllSnippets,
  getNewSnippet,
  postNewSnippet,
  getEditSnippet,
  postEditSnippet,
  deleteSnippet
} from '../controllers/snippetController.js'
import { isAuthenticated } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public route: view all snippets
router.get('/', getAllSnippets)

// Routes for creating snippets (only for authenticated users)
router.get('/new', isAuthenticated, getNewSnippet)
router.post('/new', isAuthenticated, postNewSnippet)

// Routes for editing snippets (authenticated + owner check inside controller)
router.get('/edit/:id', isAuthenticated, getEditSnippet)
router.post('/edit/:id', isAuthenticated, postEditSnippet)

// Route for deleting snippets
router.post('/delete/:id', isAuthenticated, deleteSnippet)

export default router
