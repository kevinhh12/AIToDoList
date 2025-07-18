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
import pgSession from 'connect-pg-simple';
// Debug logging to verify environment variables
console.log('Server starting with environment variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'exists' : 'missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'exists' : 'missing');

const app = express();
const port = process.env.PORT;

const PgSession = pgSession(session);

app.set('trust proxy',true)

//CORS configuration
app.use(cors({
    origin: process.env.DIRECT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
}));

app.use(limiter);

app.use(session({
    store: new PgSession({
        pool: db,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
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
    console.log(`app listening on port ${port}`)
})






