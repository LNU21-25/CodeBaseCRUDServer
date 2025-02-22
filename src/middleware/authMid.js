// src/middleware/authMiddleware.js
export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next()
  }
  req.flash('error_msg', 'Please log in to view that resource')
  return res.status(403).redirect('/auth/login')
}
