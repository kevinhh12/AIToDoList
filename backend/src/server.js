import 'dotenv/config';  // This must be the absolute first import
import express from 'express';
import login_router from './routers/login_routes.js'
import toDo_router from './routers/toDo_routes.js'
import passport from './passport.js';
import session from 'express-session'
import cors from 'cors';
import { limiter } from './middleware/limiter.js';
import chat_router from './routers/ai_route.js';
import { db } from './db.js';
// Debug logging to verify environment variables
console.log('Server starting with environment variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'exists' : 'missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'exists' : 'missing');

const app = express();
const port = process.env.PORT;



// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173', // for local dev
        'https://ai-to-do-list-mocha.vercel.app' // your deployed frontend
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(limiter);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'none', // <--- THIS IS CRITICAL
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize()); // initialize passport 
app.use(passport.session()); // configure passport 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', login_router);
app.use('/toDo',toDo_router);
app.use('/ai', chat_router);

app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})

db.query('SELECT NOW()')
  .then(res => console.log('DB connected:', res.rows[0]))
  .catch(err => console.error('DB connection error:', err));




