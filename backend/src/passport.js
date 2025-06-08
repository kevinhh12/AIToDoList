
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2';
import { db } from './db';



passport.use("google",new GoogleStrategy({ // login with google 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/main",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",

},async ( accessToken, refreshToken, profile, cb)=>{

    try {
        console.log(profile);
        const username = profile.email;
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        
        if (result.rows.length === 0) {
            // User doesn't exist, create new user
            const newUser = await db.query(
                'INSERT INTO users (username,password_hash) VALUES ($1,$2) RETURNING *',
                [username,'google']
            );

            return cb(null,newUser.rows[0])
        }
        return cb(null, result.rows[0]);
    } catch (error) {
        return cb(error)
    }
   
}))

// Serialization: When a user logs in, this function determines what data to store in the session
// We only store the user's ID in the session cookie to keep it small and secure
passport.serializeUser((user, cb) => {
    cb(null, user.id);  // Store only the user ID in the session
});

// Deserialization: When a request comes in, this function uses the stored ID to fetch the full user data
// This happens on every request where the session cookie is present
passport.deserializeUser(async (id, cb) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        cb(null, result.rows[0]);  // Attach the full user object to req.user
    } catch (error) {
        cb(error);
    }
});


export default passport;