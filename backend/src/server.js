import express from 'express';
import login_router from './routers/login_routes'
import toDo_router from './routers/toDo_routes'
import passport from './passport';
import session from 'express-session'
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const port = 3000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Vite's default frontend port
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize()); // initialize passport 
app.use(passport.session()); // configure passport 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', login_router);
app.use('/toDo',toDo_router);

app.listen(port,()=>{
    console.log(`app is listening on port: ${port}`)
})




// Goal: 
// 1. Finish up Google auth.
// 2. ToDO routes
