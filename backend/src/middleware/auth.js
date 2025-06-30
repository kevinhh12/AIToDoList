// Middleware for usr authentication

export function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      // If it's an API request, send JSON instead of redirect
      if (req.originalUrl.startsWith('/toDo')) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      res.redirect('/login');
    }
  }

