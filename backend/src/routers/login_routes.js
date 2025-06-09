import express from "express";
import passport from "../passport.js";

const login_router = express.Router();

// Google OAuth routes
login_router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

login_router.get('/auth/google/main',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        successRedirect: 'http://localhost:5173'
    })
);

// Auth status check route
login_router.get('/auth/status', (req, res) => {
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
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

export default login_router;