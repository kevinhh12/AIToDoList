import express from 'express';
import  login_router from './routers/login_routes'
import  toDo_router from './routers/toDo_routes'


const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/login', login_router);
app.use('/toDo',toDo_router);

app.listen(port,()=>{
    console.log(`app is listening on port: ${port}`)
})
