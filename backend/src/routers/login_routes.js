import express from "express";
import passport from "../passport.js";


const login_router = express.Router();

// Google OAuth routes
login_router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

login_router.get('/auth/google/main',
    passport.authenticate('google', { 
        failureRedirect: 'https://ai-to-do-list-phi.vercel.app',
        successRedirect: 'https://ai-to-do-list-phi.vercel.app'
    })
);

// Auth status check route
login_router.get('/auth/status', async (req, res) => {
    console.log('Deserialized User (req.user):', req.user);
    if (req.isAuthenticated()) {

        res.status(200).json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.username, // Using username as email since that's what you store
            picture: req.user.picture || null
        });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// Logout route
login_router.post('/auth/logout', (req, res) => {
    console.log('Logout initiated for user:', req.user ? req.user.id : 'N/A');
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed', details: err.message });
        }
        console.log('User logged out successfully. Session destroyed.');
        // Explicitly destroy the session on the server-side
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Failed to destroy session', details: err.message });
            }
            console.log('Session explicitly destroyed.');

            // Clear the session cookie from the client's browser with explicit options
            res.clearCookie('connect.sid', {
                path: '/',
                secure: process.env.NODE_ENV === 'production', // Match server.js setting
                sameSite: 'none' // Match server.js setting
            }); 

            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

// Add this route to handle GET /login
login_router.get('/', (req, res) => {
  res.send('Login page placeholder.');
});

export default login_router;