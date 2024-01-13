import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import {Server} from 'socket.io';
import {engine} from 'express-handlebars';

// 10- importamos passport y la funcion q inicia el passport
import passport from 'passport';
import inicializePassport from './config/passport.config.js'

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js';

import cartsRouter from './routes/cartRoutes.js';
import cartsRouterDB from './routes/cart.routes.db.js';

import productsRouter from './routes/productsRoutes.js';
import productsRouterDB from './routes/products.routes.db.js';

import messagesRouterDB from './routes/messages.routes.db.js';
import messagesModel from './dao/models/messagesModel.js';

import sessionRouter from './routes/sessions.routes.js';

// agrega el passport, passport local y passport con github (clase 20 y 21 claves)

// Owned by: @Ulises-Rodriguez-809

// App ID: 794414

// Client ID: Iv1.353d92dfec58dbfd

//     8d45985ce161d455cd42631c71b687870634579f --> client secret

//     http://localhost:8080/api/session/githubcallback --> callbakcURL

const app = express();

const PORT = 8080;

const MONGO = "mongodb+srv://usersDB:1234@cluster0.ugjlygz.mongodb.net/ecommerce";

const connection = mongoose.connect(MONGO);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

app.use(session({
    store : new MongoStore({
        mongoUrl : MONGO,
        // collection : "asd",por defecto la colleccion es sessions (por eso te aparece una colleccion sessions en mongo)
        ttl : 3500 //esto capaz q no
    }),
    secret : "Sup3rS3gur0",
    resave : false, // no guarde la sesión si no está modificada
    saveUninitialized : false // no cree la sesión hasta que algo se almacene
}))

// 11- llamamos al middleware de passport y la fun de inicializePassport
inicializePassport();
app.use(passport.initialize());
app.use(passport.session()); //recorda poner el passport session debajo del middleware q ejecuta el session

const httpServer = app.listen(PORT,()=>{
    console.log(`Escuchando el puerto 8080, iniciando Express JS en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

app.engine("handlebars",engine()); 

app.set("view engine","handlebars");
app.set("views",__dirname+"/views");


app.use("/",viewsRouter);
// sessions
app.use("/api/sessions",sessionRouter);

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