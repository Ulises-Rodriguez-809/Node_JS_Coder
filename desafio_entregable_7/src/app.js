import express from 'express';
import __dirname from './utils.js';
import { options } from './config/config.js';

import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import passport from 'passport';
import inicializePassport from './config/passport.config.js'

import cookieParser from 'cookie-parser';

import viewsRouter from './routes/views.router.js';

import cartsRouter from './routes/cartRoutes.js';
import cartsRouterDB from './routes/cart.routes.db.js';

import productsRouter from './routes/productsRoutes.js';
import productsRouterDB from './routes/products.routes.db.js';

import messagesRouterDB from './routes/messages.routes.db.js';
import messagesModel from './dao/models/messagesModel.js';

import sessionRouter from './routes/sessions.routes.js';

const PORT = options.PORT;

const MONGO = options.MONGO_URL;

const app = express();

const connection = mongoose.connect(MONGO);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// passport
inicializePassport();
app.use(passport.initialize());
// cookie
app.use(cookieParser("palabraSecreta", {}));

// inicializamos nuestro motor de plantillas e indicamos donde estan las vistas
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// rutas
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

app.use("/api/carts", cartsRouter);
app.use("/api/cartsDB", cartsRouterDB);

app.use("/api/products", productsRouter);
app.use("/api/productsDB", productsRouterDB);

app.use("/api/messages", messagesRouterDB);

// server
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando el puerto 8080, iniciando Express JS en http://localhost:${PORT}`);
});

// inicializamos socket
const io = new Server(httpServer);

// sockets msgs
io.on("connection", async (socket) => {
    console.log("nuevo usuario conectado");

    socket.emit("nuevo-usuario", "Ingreso un nuevo usuario al chat");

    //primer cargado de mensajes
    const messagesDB = await messagesModel.find();
    socket.emit("cargar-mensajes", messagesDB);

    socket.on("message", async (data) => {

        const newMessage = {
            user: data.user,
            message: data.message
        }

        //añadimos el nuevo mensaje
        await messagesModel.create(newMessage);

        //evento con el mensaje nuevo para q lo vean todos
        io.emit("mensajes-actualizados", newMessage);

    })
})