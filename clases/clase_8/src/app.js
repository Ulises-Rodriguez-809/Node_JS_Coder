import express from 'express';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js.js';
import __dirname from './utlis.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//relativa
// app.use(express.static('./src/public'))

//absolluta
app.use(express.static(`${__dirname}/public`))

const server = app.listen(PORT,()=>{
    console.log(`el servidor funciona en el puerto ${PORT}`)
})

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);

//PARA LA 1 PREENTREGA HACETE UNA CLASS NUEVA PARA EL CART