// src/controllers/snippetController.js
import Snippet from '../models/snippet.js'

export const getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find()
      .populate('owner', 'username')
      .sort({ createdAt: -1 })
    res.render('snippets', { title: 'All Snippets', snippets })
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Unable to fetch snippets')
    res.redirect('/')
  }
}

export const getNewSnippet = (req, res) => {
  res.render('snippet_form', { title: 'Create Snippet', snippet: {} })
}

export const postNewSnippet = async (req, res) => {
  const { title, code } = req.body
  try {
    const newSnippet = new Snippet({
      title,
      code,
      owner: req.session.user.id
    })
    await newSnippet.save()
    req.flash('success_msg', 'Snippet created successfully')
    res.redirect('/snippets')
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Error creating snippet')
    res.redirect('/snippets/new')
  }
}

export const getEditSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found')
      return res.redirect('/snippets')
    }
    // Verify that the logged-in user owns the snippet.
    if (snippet.owner.toString() !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized')
      return res.status(403).redirect('/snippets')
    }
    res.render('snippet_form', { title: 'Edit Snippet', snippet })
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Error fetching snippet')
    res.redirect('/snippets')
  }
}

export const postEditSnippet = async (req, res) => {
  const { title, code } = req.body
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found')
      return res.redirect('/snippets')
    }
    // Ensure that only the owner can update the snippet.
    if (snippet.owner.toString() !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized')
      return res.status(403).redirect('/snippets')
    }
    snippet.title = title
    snippet.code = code
    await snippet.save()
    req.flash('success_msg', 'Snippet updated successfully')
    res.redirect('/snippets')
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Error updating snippet')
    res.redirect(`/snippets/edit/${req.params.id}`)
  }
}

export const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found')
      return res.redirect('/snippets')
    }
    // Verify ownership before deletion.
    if (snippet.owner.toString() !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized')
      return res.status(403).redirect('/snippets')
    }
    await snippet.remove()
    req.flash('success_msg', 'Snippet deleted successfully')
    res.redirect('/snippets')
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'Error deleting snippet')
    res.redirect('/snippets')
  }
}
