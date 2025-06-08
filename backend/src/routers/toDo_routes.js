import express from 'express';
import * as ToDo from '../controllers/toDo_controller.js'
import { authenticate } from '../middleware/auth.js';

const toDo_router = express.Router();

toDo_router.get('/get',authenticate,ToDo.getAllToDos);
toDo_router.post('/create',authenticate,ToDo.createToDo);
toDo_router.put('/update',authenticate,ToDo.updateToDo);
toDo_router.put('/delete',authenticate,ToDo.deleteToDo);

export default toDo_router;