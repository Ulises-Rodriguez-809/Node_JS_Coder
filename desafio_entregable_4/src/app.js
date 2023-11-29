import express from 'express';
import {engine} from 'express-handlebars';
import viewsRouter from './views/views.router.js';
import productsRouter from './routes/productsRoutes.js';
import cartsRouter from './routes/cartRoutes.js';
import __dirname from './utlis.js';
import {Server} from 'socket.io';

//1-inicializamos nuestro app
const app = express();
//2- creamos el puerto
const PORT = 8080;

//3- usamos los middlewares (para poder trabajar con postman)
//3.1- toma los datos q vienen de una peticion JSON y los convierte en formato req.body
app.use(express.json());
//3.2- para poder extraer data del req.body
app.use(express.urlencoded({extended:true}));

//4-le indicamos al servidor en q puerto tiene q escuchar (osea el puerto q queresmos q levante la app)
const httpServer = app.listen(PORT,()=>{
    console.log(`Escuchando el puerto 8080, iniciando Express JS en http://localhost:${PORT}`)
});

//5-creamos el socket
const io = new Server(httpServer);

//6-instanciamos el motor de plantilla handlebars
app.engine("handlebars",engine());

//7-configuramos el motor de plantilla handlebars
//recorda q con set asignamos un nombre a un valor (esto lo hacemos para configurar el comportamiento de la app)
app.set("view engine","handlebars"); 
app.set("views",__dirname+"/views")

//8-middleware para poder usar el css y js de nuestro directorio public
//express.static() --> es una funcion q toma un path y retorna un middleware q sirve todos los archivos de la ruta indicada en el path
//express.static(__dirname+"/public") --> da como resultado una funcion q express la interpreta como middleware 
app.use(express.static(__dirname+"/public"));

//9-rutas
app.use('/',viewsRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);

//11- socket del servidor (este se comunica con el socket del cliente en index.js)
io.on("connection",socket=>{
    console.log("todo bien")
})