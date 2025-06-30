import express from 'express';
import * as ToDo from '../controllers/toDo_controller.js'
import { authenticate } from '../middleware/auth.js';

const toDo_router = express.Router();

toDo_router.get('/get/:username',authenticate,ToDo.getAllToDos);
toDo_router.post('/create',authenticate,ToDo.createToDo);
toDo_router.put('/update/:id',authenticate,ToDo.updateToDo);
toDo_router.delete('/delete/:id',authenticate,ToDo.deleteToDo);

export default toDo_router;