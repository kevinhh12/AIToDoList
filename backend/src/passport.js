import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2';
import { db } from './db.js';

// Verify Google OAuth credentials are present
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Environment variables not found in passport.js:');
    console.error('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.error('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
    throw new Error('Missing required environment variables: GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET');
}

passport.use("google",new GoogleStrategy({ // login with google 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://aitodolist.onrender.com/login/auth/google/main",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",

},async ( accessToken, refreshToken, profile, cb)=>{

    try {
        console.log(profile);
        const username = profile.email;
        const name = profile.displayName;
        const picture = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        
        if (result.rows.length === 0) {
            // User doesn't exist, create new user
            console.log(`Insert user successful`)
            const newUser = await db.query(
                'INSERT INTO users (username, password_hash, name, picture) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, 'google', name, picture]
            );

            return cb(null,newUser.rows[0])
        }
        // Update existing user's name and picture in case it changed on Google
        const updatedUser = await db.query(
            'UPDATE users SET name = $1, picture = $2 WHERE username = $3 RETURNING *',
            [name, picture, username]
        );
        return cb(null, updatedUser.rows[0]);
    } catch (error) {
        return cb(error)
    }
   
}))

// Serialization: When a user logs in, this function determines what data to store in the session
// We only store the user's ID in the session cookie to keep it small and secure
passport.serializeUser((user, cb) => {
    console.log(user.id)
    cb(null, user.id); // Store username in session
});

// Deserialization: When a request comes in, this function uses the stored ID to fetch the full user data
// This happens on every request where the session cookie is present
passport.deserializeUser(async (id, cb) => {
    console.log("Deserializing user ID:", id); 
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        console.log("Found user in DB:", result.rows);
        if (result.rows.length > 0) {
            cb(null, result.rows[0]);
        } else {
            cb(null, false);
        }
    } catch (error) {
        cb(error);
    }
});


export default passport;