import express from "express";
import passport from "../passport.js";

const login_router = express.Router();


login_router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

login_router.get('/auth/google/main',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        successRedirect: '/toDo'
    })
);

export default login_router;