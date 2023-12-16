import express from 'express';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js';

import cartsRouter from './routes/cartRoutes.js';
import cartsRouterDB from './routes/cart.routes.db.js';

import productsRouter from './routes/productsRoutes.js';
import productsRouterDB from './routes/products.routes.db.js';

import messagesRouterDB from './routes/messages.routes.db.js';


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