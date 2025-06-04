import express from "express";
import * as login_control from '../controllers/login_controller'

const login_router = express.Router();

login_router.post('/register', login_control.register);
login_router.get('/login', login_control.login);

export default login_router;