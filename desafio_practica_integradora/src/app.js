import express from 'express';
import mongoose from 'mongoose';
import {Server} from 'socket.io'
import {engine} from 'express-handlebars';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js';

import cartsRouter from './routes/cartRoutes.js';
import cartsRouterDB from './routes/cart.routes.db.js';

import productsRouter from './routes/productsRoutes.js';
import productsRouterDB from './routes/products.routes.db.js';

import messagesRouterDB from './routes/messages.routes.db.js';
import messagesModel from './dao/models/messagesModel.js';


const app = express();

const PORT = 8080;

const MONGO = "mongodb+srv://usersDB:1234@cluster0.ugjlygz.mongodb.net/ecommerce";

const connection = mongoose.connect(MONGO);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

const httpServer = app.listen(PORT,()=>{
    console.log(`Escuchando el puerto 8080, iniciando Express JS en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

app.engine("handlebars",engine()); 

app.set("view engine","handlebars");
app.set("views",__dirname+"/views");


app.use("/",viewsRouter);

//carts
app.use("/api/carts",cartsRouter);
app.use("/api/cartsDB",cartsRouterDB);

//productos
app.use("/api/products",productsRouter);
app.use("/api/productsDB",productsRouterDB);

// mensajes
app.use("/api/messages",messagesRouterDB);


io.on("connection", async (socket)=>{
    console.log("nuevo usuario conectado");

    socket.emit("nuevo-usuario","Ingreso un nuevo usuario al chat");
    

    //primer cargado de mensajes
    const messagesDB = await messagesModel.find();
    socket.emit("cargar-mensajes",messagesDB);


    socket.on("message",async (data)=>{
        
        const newMessage = {
            user : data.user,
            message : data.message
        }
        
        //añadimos el nuevo mensaje
        await messagesModel.create(newMessage);

        //evento con el mensaje nuevo para q lo vean todos
        io.emit("mensajes-actualizados",newMessage);
        
    })
})